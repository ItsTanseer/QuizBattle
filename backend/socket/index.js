const jwt = require('jsonwebtoken');
const Room = require('../models/Room');
const Quiz = require('../models/Quiz');
const Match = require('../models/Match');
const User = require('../models/User');
const { calculateScore } = require('../utils/helpers');

const gameSessions = {};

const initSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication token missing.'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found.'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token.'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.user.username} (${socket.id})`);

    // ─── JOIN ROOM ────────────────────────────────────────────────────────
    socket.on('join-room', async ({ roomCode }, callback) => {
      try {
        const room = await Room.findOne({ code: roomCode });

        if (!room) return callback?.({ error: 'Room not found.' });
        if (room.status === 'finished') return callback?.({ error: 'Room has already ended.' });
        if (room.status === 'in-progress') return callback?.({ error: 'Game already in progress.' });

        const existingPlayer = room.players.find(
          (p) => p.userId.toString() === socket.user._id.toString()
        );

        let updatedRoom;

        if (existingPlayer) {
          // Player already in room (host or reconnect) — just update socketId
          updatedRoom = await Room.findOneAndUpdate(
            { code: roomCode, 'players.userId': socket.user._id },
            {
              $set: {
                'players.$.socketId': socket.id,
                'players.$.isConnected': true,
              },
            },
            { new: true }
          ).populate('quiz');
        } else {
          // New player joining
          if (room.players.length >= room.maxPlayers) {
            return callback?.({ error: 'Room is full.' });
          }

          updatedRoom = await Room.findOneAndUpdate(
            { code: roomCode, status: 'waiting' },
            {
              $push: {
                players: {
                  userId: socket.user._id,
                  username: socket.user.username,
                  avatar: socket.user.avatar || '',
                  socketId: socket.id,
                  isHost: false,
                  isConnected: true,
                  score: 0,
                  correctAnswers: 0,
                  totalResponseTime: 0,
                },
              },
            },
            { new: true }
          ).populate('quiz');
        }

        if (!updatedRoom) return callback?.({ error: 'Failed to join room.' });

        socket.join(roomCode);

        io.to(roomCode).emit('player-joined', {
          players: updatedRoom.players,
          message: `${socket.user.username} joined the room`,
        });

        callback?.({ success: true, room: updatedRoom });
      } catch (err) {
        console.error('join-room error:', err);
        callback?.({ error: 'Failed to join room.' });
      }
    });

    // ─── LEAVE ROOM ───────────────────────────────────────────────────────
    socket.on('leave-room', async ({ roomCode }) => {
      await handlePlayerLeave(socket, roomCode, io, false);
    });

    // ─── SELECT QUIZ ──────────────────────────────────────────────────────
    socket.on('select-quiz', async ({ roomCode, quizId }, callback) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return callback?.({ error: 'Room not found.' });
        if (room.host.toString() !== socket.user._id.toString()) {
          return callback?.({ error: 'Only the host can select a quiz.' });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return callback?.({ error: 'Quiz not found.' });

        await Room.findOneAndUpdate(
          { code: roomCode },
          { $set: { quiz: quizId } }
        );

        io.to(roomCode).emit('quiz-selected', {
          quiz: {
            _id: quiz._id,
            title: quiz.title,
            category: quiz.category,
            difficulty: quiz.difficulty,
            questionCount: quiz.questions.length,
            timePerQuestion: quiz.timePerQuestion,
          },
        });

        callback?.({ success: true });
      } catch (err) {
        console.error('select-quiz error:', err);
        callback?.({ error: 'Failed to select quiz.' });
      }
    });

    // ─── START GAME ───────────────────────────────────────────────────────
    socket.on('start-game', async ({ roomCode }, callback) => {
      try {
        const room = await Room.findOne({ code: roomCode }).populate('quiz');

        if (!room) return callback?.({ error: 'Room not found.' });
        if (room.host.toString() !== socket.user._id.toString()) {
          return callback?.({ error: 'Only the host can start the game.' });
        }
        if (!room.quiz) return callback?.({ error: 'Please select a quiz first.' });
        if (room.players.length < 2) return callback?.({ error: 'Need at least 2 players to start.' });

        await Room.findOneAndUpdate(
          { code: roomCode },
          {
            $set: {
              status: 'in-progress',
              currentQuestion: 0,
              'players.$[].score': 0,
              'players.$[].correctAnswers': 0,
              'players.$[].totalResponseTime': 0,
            },
          }
        );

        gameSessions[roomCode] = {
          answers: {},
          questionStartTime: null,
          timer: null,
        };

        io.to(roomCode).emit('game-started', { message: 'Game is starting!' });
        setTimeout(() => sendQuestion(io, roomCode, 0), 4000);
        callback?.({ success: true });
      } catch (err) {
        console.error('start-game error:', err);
        callback?.({ error: 'Failed to start game.' });
      }
    });

    // ─── SUBMIT ANSWER ────────────────────────────────────────────────────
    socket.on('submit-answer', async ({ roomCode, answerIndex }, callback) => {
      try {
        const session = gameSessions[roomCode];
        if (!session) return callback?.({ error: 'No active game session.' });

        const userId = socket.user._id.toString();
        if (session.answers[userId]) return callback?.({ error: 'Already answered.' });

        const responseTime = Date.now() - session.questionStartTime;
        session.answers[userId] = { answerIndex, responseTime };

        callback?.({ success: true, received: true });

        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        const connectedPlayers = room.players.filter((p) => p.isConnected);
        if (Object.keys(session.answers).length >= connectedPlayers.length) {
          clearTimeout(session.timer);
          await processAnswers(io, roomCode);
        }
      } catch (err) {
        console.error('submit-answer error:', err);
        callback?.({ error: 'Failed to submit answer.' });
      }
    });

    // ─── DISCONNECT ───────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`🔴 Socket disconnected: ${socket.user.username}`);
      const rooms = await Room.find({
        'players.socketId': socket.id,
        status: { $ne: 'finished' },
      });
      for (const room of rooms) {
        await handlePlayerLeave(socket, room.code, io, true);
      }
    });
  });
};

// ─── Send question ────────────────────────────────────────────────────────────
const sendQuestion = async (io, roomCode, questionIndex) => {
  try {
    const room = await Room.findOne({ code: roomCode }).populate('quiz');
    if (!room || room.status !== 'in-progress') return;

    const quiz = room.quiz;
    if (questionIndex >= quiz.questions.length) {
      await endGame(io, roomCode);
      return;
    }

    const question = quiz.questions[questionIndex];
    const session = gameSessions[roomCode];
    if (!session) return;

    session.answers = {};
    session.questionStartTime = Date.now();

    io.to(roomCode).emit('question', {
      questionIndex,
      totalQuestions: quiz.questions.length,
      question: question.question,
      options: question.options,
      points: question.points,
      timeLimit: quiz.timePerQuestion,
    });

    session.timer = setTimeout(async () => {
      await processAnswers(io, roomCode);
    }, quiz.timePerQuestion * 1000);
  } catch (err) {
    console.error('sendQuestion error:', err);
  }
};

// ─── Process answers ──────────────────────────────────────────────────────────
const processAnswers = async (io, roomCode) => {
  try {
    const room = await Room.findOne({ code: roomCode }).populate('quiz');
    if (!room || room.status !== 'in-progress') return;

    const session = gameSessions[roomCode];
    if (!session) return;

    const quiz = room.quiz;
    const questionIndex = room.currentQuestion;
    const question = quiz.questions[questionIndex];
    const correctIndex = question.correctAnswer;

    // Build score updates
    const bulkOps = [];
    for (const player of room.players) {
      const userId = player.userId.toString();
      const playerAnswer = session.answers[userId];
      if (playerAnswer && playerAnswer.answerIndex === correctIndex) {
        const earned = calculateScore(playerAnswer.responseTime, quiz.timePerQuestion, question.points);
        bulkOps.push({
          updateOne: {
            filter: { code: roomCode, 'players.userId': player.userId },
            update: {
              $inc: {
                'players.$.score': earned,
                'players.$.correctAnswers': 1,
                'players.$.totalResponseTime': playerAnswer.responseTime,
              },
            },
          },
        });
      }
    }

    if (bulkOps.length > 0) {
      await Room.bulkWrite(bulkOps);
    }

    // Advance question index
    const nextIndex = questionIndex + 1;
    await Room.findOneAndUpdate(
      { code: roomCode },
      { $set: { currentQuestion: nextIndex } }
    );

    // Fetch updated room for leaderboard
    const updatedRoom = await Room.findOne({ code: roomCode });

    const leaderboard = [...updatedRoom.players]
      .sort((a, b) => b.score - a.score)
      .map((p, i) => ({
        rank: i + 1,
        username: p.username,
        score: p.score,
        correctAnswers: p.correctAnswers,
        averageResponseTime:
          p.correctAnswers > 0 ? Math.round(p.totalResponseTime / p.correctAnswers) : 0,
        answeredCorrectly: session.answers[p.userId.toString()]?.answerIndex === correctIndex,
      }));

    io.to(roomCode).emit('score-update', {
      correctAnswer: correctIndex,
      correctAnswerText: question.options[correctIndex],
      leaderboard,
      playerAnswers: Object.fromEntries(
        Object.entries(session.answers).map(([uid, data]) => [uid, data.answerIndex])
      ),
    });

    if (nextIndex < quiz.questions.length) {
      setTimeout(() => sendQuestion(io, roomCode, nextIndex), 4000);
    } else {
      setTimeout(() => endGame(io, roomCode), 4000);
    }
  } catch (err) {
    console.error('processAnswers error:', err);
  }
};

// ─── End game ─────────────────────────────────────────────────────────────────
const endGame = async (io, roomCode) => {
  try {
    const room = await Room.findOne({ code: roomCode }).populate('quiz');
    if (!room) return;

    await Room.findOneAndUpdate({ code: roomCode }, { $set: { status: 'finished' } });

    const sorted = [...room.players].sort((a, b) => b.score - a.score);
    const winner = sorted[0];

    const match = await Match.create({
      roomCode,
      quiz: room.quiz._id,
      quizTitle: room.quiz.title,
      totalQuestions: room.quiz.questions.length,
      winner: winner.userId,
      winnerUsername: winner.username,
      players: sorted.map((p, i) => ({
        userId: p.userId,
        username: p.username,
        score: p.score,
        correctAnswers: p.correctAnswers,
        totalQuestions: room.quiz.questions.length,
        averageResponseTime:
          p.correctAnswers > 0 ? Math.round(p.totalResponseTime / p.correctAnswers) : 0,
        rank: i + 1,
        isWinner: i === 0,
      })),
    });

    for (const player of room.players) {
      await User.findByIdAndUpdate(player.userId, {
        $inc: {
          gamesPlayed: 1,
          gamesWon: player.userId.toString() === winner.userId.toString() ? 1 : 0,
        },
      });
    }

    const finalLeaderboard = sorted.map((p, i) => ({
      rank: i + 1,
      username: p.username,
      score: p.score,
      correctAnswers: p.correctAnswers,
      totalQuestions: room.quiz.questions.length,
      averageResponseTime:
        p.correctAnswers > 0 ? Math.round(p.totalResponseTime / p.correctAnswers) : 0,
      isWinner: i === 0,
    }));

    io.to(roomCode).emit('game-over', {
      winner: { username: winner.username, score: winner.score },
      leaderboard: finalLeaderboard,
      matchId: match._id,
    });

    delete gameSessions[roomCode];
  } catch (err) {
    console.error('endGame error:', err);
  }
};

// ─── Handle player leave ──────────────────────────────────────────────────────
const handlePlayerLeave = async (socket, roomCode, io, isDisconnect) => {
  try {
    const room = await Room.findOne({ code: roomCode });
    if (!room) return;

    const leavingPlayer = room.players.find(
      (p) => p.userId.toString() === socket.user._id.toString()
    );
    if (!leavingPlayer) return;

    const isHost = leavingPlayer.isHost;

    if (room.status === 'waiting') {
      // CRITICAL: Never remove the host from their own room on a disconnect
      // because StrictMode causes a spurious disconnect/reconnect cycle.
      // Only remove if it's an explicit leave-room event (not a disconnect).
      if (isHost && isDisconnect) {
        // Just mark as disconnected, don't remove or finish the room
        await Room.findOneAndUpdate(
          { code: roomCode, 'players.userId': socket.user._id },
          { $set: { 'players.$.isConnected': false } }
        );
        return;
      }

      // Remove non-host player or explicit leave by host
      const updatedRoom = await Room.findOneAndUpdate(
        { code: roomCode },
        { $pull: { players: { userId: socket.user._id } } },
        { new: true }
      );

      if (!updatedRoom) return;

      if (updatedRoom.players.length === 0) {
        await Room.findOneAndUpdate(
          { code: roomCode },
          { $set: { status: 'finished' } }
        );
        return;
      }

      // Promote new host if needed
      if (isHost && updatedRoom.players.length > 0) {
        await Room.findOneAndUpdate(
          { code: roomCode },
          {
            $set: {
              'players.0.isHost': true,
              host: updatedRoom.players[0].userId,
            },
          }
        );
      }

      socket.leave(roomCode);
      io.to(roomCode).emit('player-left', {
        username: socket.user.username,
        players: updatedRoom.players,
        message: `${socket.user.username} left the room`,
      });

    } else {
      // Mid-game disconnect
      const updatedRoom = await Room.findOneAndUpdate(
        { code: roomCode, 'players.userId': socket.user._id },
        { $set: { 'players.$.isConnected': false } },
        { new: true }
      );

      socket.leave(roomCode);
      io.to(roomCode).emit('player-left', {
        username: socket.user.username,
        players: updatedRoom?.players || [],
        message: `${socket.user.username} left the room`,
      });
    }
  } catch (err) {
    console.error('handlePlayerLeave error:', err);
  }
};

module.exports = initSocket;