import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const OPTION_COLORS = [
  'bg-blue-900/60 border-blue-600 hover:bg-blue-800/80',
  'bg-purple-900/60 border-purple-600 hover:bg-purple-800/80',
  'bg-orange-900/60 border-orange-600 hover:bg-orange-800/80',
  'bg-pink-900/60 border-pink-600 hover:bg-pink-800/80',
];

const QuizScreen = () => {
  const { code } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [phase, setPhase] = useState('waiting'); // waiting | question | results | game-over
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [scoreUpdate, setScoreUpdate] = useState(null);
  const [gameOver, setGameOver] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const timerRef = useRef(null);
  const questionStartRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const onQuestion = (data) => {
      clearInterval(timerRef.current);
      setQuestion(data);
      setPhase('question');
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
      setScoreUpdate(null);
      setTimeLeft(data.timeLimit);
      questionStartRef.current = Date.now();

      // Countdown timer (UI only)
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const onScoreUpdate = (data) => {
      clearInterval(timerRef.current);
      setScoreUpdate(data);
      setPhase('results');
    };

    const onGameOver = (data) => {
      setGameOver(data);
      setPhase('game-over');
      // Navigate to results after 8 seconds or let user click
      setTimeout(() => navigate(`/matches/${data.matchId}/results`), 8000);
    };

    socket.on('question', onQuestion);
    socket.on('score-update', onScoreUpdate);
    socket.on('game-over', onGameOver);

    return () => {
      socket.off('question', onQuestion);
      socket.off('score-update', onScoreUpdate);
      socket.off('game-over', onGameOver);
    };
  }, [socket, navigate]);

  const submitAnswer = useCallback((idx) => {
    if (answerSubmitted || !socket) return;
    setSelectedAnswer(idx);
    setAnswerSubmitted(true);
    clearInterval(timerRef.current);

    socket.emit('submit-answer', { roomCode: code, answerIndex: idx }, (res) => {
      if (res?.error) toast.error(res.error);
    });
  }, [answerSubmitted, socket, code]);

  // ─── WAITING ──────────────────────────────────────────────────────────────
  if (phase === 'waiting') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <h2 className="text-2xl font-bold mb-2">Get Ready!</h2>
          <p className="text-slate-400">The quiz is about to start...</p>
        </div>
      </div>
    );
  }

  // ─── GAME OVER ─────────────────────────────────────────────────────────────
  if (phase === 'game-over' && gameOver) {
    const me = gameOver.leaderboard.find((p) => p.username === user?.username);
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-extrabold mb-2">Game Over!</h1>
          <p className="text-2xl text-yellow-400 font-bold">
            🥇 {gameOver.winner.username} wins with {gameOver.winner.score} pts!
          </p>
        </div>

        <div className="card">
          <h2 className="font-bold text-lg mb-4">Final Leaderboard</h2>
          <div className="space-y-3">
            {gameOver.leaderboard.map((p) => (
              <div
                key={p.username}
                className={`flex items-center gap-4 rounded-lg p-3 ${
                  p.username === user?.username ? 'bg-indigo-900/40 border border-indigo-600' : 'bg-slate-700/50'
                }`}
              >
                <span className="text-2xl w-8 text-center">
                  {p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : `#${p.rank}`}
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{p.username} {p.username === user?.username && '(You)'}</p>
                  <p className="text-slate-400 text-sm">
                    {p.correctAnswers}/{p.totalQuestions} correct · Avg {p.averageResponseTime}ms
                  </p>
                </div>
                <p className="text-xl font-bold text-indigo-400">{p.score} pts</p>
              </div>
            ))}
          </div>
        </div>

        {me && (
          <div className="card mt-4 text-center">
            <p className="text-slate-400 mb-1">Your result</p>
            <p className="text-3xl font-bold text-indigo-400">{me.score} points</p>
            <p className="text-slate-400">Rank #{me.rank} • {me.correctAnswers}/{me.totalQuestions} correct</p>
          </div>
        )}

        <button
          onClick={() => navigate(`/matches/${gameOver.matchId}/results`)}
          className="btn-primary w-full mt-6 py-3"
        >
          View Full Results
        </button>
      </div>
    );
  }

  // ─── SCORE UPDATE (between questions) ─────────────────────────────────────
  if (phase === 'results' && scoreUpdate) {
    const myAnswer = selectedAnswer;
    const isCorrect = myAnswer === scoreUpdate.correctAnswer;

    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className={`text-center mb-8 p-6 rounded-2xl ${isCorrect ? 'bg-green-900/30 border border-green-600' : 'bg-red-900/30 border border-red-600'}`}>
          <div className="text-5xl mb-3">{myAnswer === null ? '⏰' : isCorrect ? '✅' : '❌'}</div>
          <h2 className="text-2xl font-bold mb-2">
            {myAnswer === null ? 'Time Up!' : isCorrect ? 'Correct!' : 'Wrong!'}
          </h2>
          <p className="text-slate-300">
            Correct answer: <span className="font-bold text-green-400">{OPTION_LETTERS[scoreUpdate.correctAnswer]}. {scoreUpdate.correctAnswerText}</span>
          </p>
        </div>

        <div className="card">
          <h3 className="font-bold mb-3">Current Rankings</h3>
          <div className="space-y-2">
            {scoreUpdate.leaderboard.map((p) => (
              <div
                key={p.username}
                className={`flex items-center gap-3 rounded-lg p-3 ${
                  p.username === user?.username ? 'bg-indigo-900/40 border border-indigo-600' : 'bg-slate-700/40'
                }`}
              >
                <span className="font-mono text-slate-400 w-6 text-center">#{p.rank}</span>
                <span className="flex-1 font-medium">{p.username}</span>
                {p.answeredCorrectly && <span className="text-green-400 text-sm">✓</span>}
                <span className="font-bold text-indigo-400">{p.score}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6 animate-pulse">Next question coming up...</p>
      </div>
    );
  }

  // ─── QUESTION ─────────────────────────────────────────────────────────────
  if (phase === 'question' && question) {
    const timerPercent = (timeLeft / question.timeLimit) * 100;
    const timerColor = timerPercent > 50 ? 'bg-green-500' : timerPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header: question number + timer */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-400 text-sm">
            Question {question.questionIndex + 1} / {question.totalQuestions}
          </span>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono font-bold text-lg ${
            timeLeft <= 5 ? 'bg-red-900/60 text-red-400 animate-pulse' : 'bg-slate-700 text-white'
          }`}>
            ⏱ {timeLeft}s
          </div>
          <span className="text-indigo-400 font-medium text-sm">{question.points} pts</span>
        </div>

        {/* Timer bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 mb-8 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all ${timerColor}`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>

        {/* Question text */}
        <div className="card mb-6 text-center">
          <p className="text-xl sm:text-2xl font-bold leading-relaxed">{question.question}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((opt, i) => {
            let extraClass = '';
            if (selectedAnswer !== null) {
              if (i === selectedAnswer) extraClass = 'ring-2 ring-indigo-400 opacity-100';
              else extraClass = 'opacity-50';
            }

            return (
              <button
                key={i}
                onClick={() => submitAnswer(i)}
                disabled={answerSubmitted}
                className={`option-btn flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200 ${OPTION_COLORS[i]} ${extraClass} ${
                  !answerSubmitted ? 'cursor-pointer active:scale-95' : 'cursor-default'
                }`}
              >
                <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {OPTION_LETTERS[i]}
                </span>
                <span className="font-medium text-sm sm:text-base">{opt}</span>
              </button>
            );
          })}
        </div>

        {answerSubmitted && (
          <p className="text-center text-green-400 mt-6 font-medium animate-pulse">
            ✅ Answer submitted! Waiting for others...
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default QuizScreen;
