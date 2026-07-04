import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../services/api';
import toast from 'react-hot-toast';

const diffColors = { Easy: 'bg-green-900 text-green-300', Medium: 'bg-yellow-900 text-yellow-300', Hard: 'bg-red-900 text-red-300' };
const catEmoji = { Programming: '💻', 'General Knowledge': '🌍', Movies: '🎬', Sports: '⚽', Science: '🔬' };

const Lobby = () => {
  const { code } = useParams();
  const { socket, connected } = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [status, setStatus] = useState('loading');
  const [showQuizPicker, setShowQuizPicker] = useState(false);

  const hasJoined = useRef(false); // prevent double join in StrictMode
  const leaveTimerRef = useRef(null); // debounce leave to survive StrictMode remount

  // Join room — only fires once socket is connected
  useEffect(() => {
    if (!socket || !connected) return;

    // If a leave was pending (StrictMode unmount-remount), cancel it
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    if (hasJoined.current) return;

    hasJoined.current = true;

    socket.emit('join-room', { roomCode: code }, (res) => {
      if (res?.error) {
        hasJoined.current = false;
        toast.error(res.error);
        navigate('/rooms/join');
        return;
      }
      if (res?.success) {
        const room = res.room;
        setPlayers(room.players || []);
        setStatus('waiting');
        const me = room.players?.find(
          (p) => p.userId?.toString() === user?._id?.toString()
        );
        setIsHost(me?.isHost || false);
        if (room.quiz) setSelectedQuiz(room.quiz);
      }
    });

    return () => {
      // Delay leave-room so StrictMode's immediate remount can cancel it
      if (hasJoined.current) {
        leaveTimerRef.current = setTimeout(() => {
          socket.emit('leave-room', { roomCode: code });
          hasJoined.current = false;
          leaveTimerRef.current = null;
        }, 100);
      }
    };
  }, [socket, connected]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load quizzes for host
  useEffect(() => {
    if (isHost) {
      quizAPI.getAll().then((r) => setQuizzes(r.data.quizzes)).catch(() => {});
    }
  }, [isHost]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const onPlayerJoined = ({ players: p, message }) => {
      setPlayers(p);
      toast.success(message);
    };
    const onPlayerLeft = ({ players: p, message }) => {
      setPlayers(p);
      toast(message, { icon: '👋' });
    };
    const onQuizSelected = ({ quiz }) => {
      setSelectedQuiz(quiz);
      toast.success(`Quiz selected: ${quiz.title}`);
    };
    const onGameStarted = () => {
      setStatus('starting');
      hasJoined.current = false; // CRITICAL: Prevent emitting 'leave-room' when unmounting to navigate
      toast.success('Game starting! 🚀');
      setTimeout(() => navigate(`/rooms/${code}/quiz`), 500);
    };

    socket.on('player-joined', onPlayerJoined);
    socket.on('player-left', onPlayerLeft);
    socket.on('quiz-selected', onQuizSelected);
    socket.on('game-started', onGameStarted);

    return () => {
      socket.off('player-joined', onPlayerJoined);
      socket.off('player-left', onPlayerLeft);
      socket.off('quiz-selected', onQuizSelected);
      socket.off('game-started', onGameStarted);
    };
  }, [socket, code, navigate]);

  const selectQuiz = useCallback((quiz) => {
    socket?.emit('select-quiz', { roomCode: code, quizId: quiz._id }, (res) => {
      if (res?.error) toast.error(res.error);
      else setShowQuizPicker(false);
    });
  }, [socket, code]);

  const startGame = useCallback(() => {
    socket?.emit('start-game', { roomCode: code }, (res) => {
      if (res?.error) toast.error(res.error);
    });
  }, [socket, code]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Room code copied!');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="flex gap-2 justify-center mb-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <p className="text-slate-400">
            {connected ? 'Joining room...' : 'Connecting to server...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Room Code */}
      <div className="text-center mb-8">
        <p className="text-slate-400 mb-2">Room Code</p>
        <button onClick={copyCode} className="group inline-flex items-center gap-3">
          <span className="text-5xl font-mono font-extrabold tracking-widest text-indigo-400 group-hover:text-indigo-300 transition-colors">
            {code}
          </span>
          <span className="text-slate-500 text-sm group-hover:text-slate-300">📋</span>
        </button>
        <p className="text-slate-500 text-sm mt-2">Share this code with friends • Click to copy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Players list */}
        <div className="card">
          <h2 className="font-bold text-lg mb-4">Players ({players.length}/8)</h2>
          <div className="space-y-3">
            {players.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-700/50 rounded-lg p-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {p.avatar ? (
                    <img src={p.avatar} alt={p.username} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    p.username[0].toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{p.username}</p>
                  {p.isHost && <p className="text-xs text-indigo-400">👑 Host</p>}
                </div>
                {!p.isConnected && <span className="text-xs text-slate-500">Disconnected</span>}
              </div>
            ))}
            {players.length === 1 && (
              <p className="text-slate-500 text-sm text-center py-2">
                Waiting for more players to join...
              </p>
            )}
          </div>
        </div>

        {/* Quiz selection + actions */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-bold text-lg mb-4">Quiz</h2>
            {selectedQuiz ? (
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-lg">{selectedQuiz.title}</p>
                    <p className="text-slate-400 text-sm">{catEmoji[selectedQuiz.category]} {selectedQuiz.category}</p>
                  </div>
                  <span className={`badge ${diffColors[selectedQuiz.difficulty]}`}>
                    {selectedQuiz.difficulty}
                  </span>
                </div>
                {selectedQuiz.questionCount && (
                  <p className="text-slate-500 text-xs mt-2">{selectedQuiz.questionCount} questions</p>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500">
                <div className="text-3xl mb-2">📋</div>
                <p className="text-sm">No quiz selected yet</p>
              </div>
            )}
            {isHost && (
              <button onClick={() => setShowQuizPicker(true)} className="btn-secondary w-full mt-4">
                {selectedQuiz ? '🔄 Change Quiz' : '📋 Select Quiz'}
              </button>
            )}
          </div>

          {isHost ? (
            <div className="card">
              <h2 className="font-bold text-lg mb-4">Host Controls</h2>
              <button
                onClick={startGame}
                disabled={!selectedQuiz || players.length < 2 || status === 'starting'}
                className="btn-primary w-full py-3 text-lg"
              >
                {status === 'starting' ? '🚀 Starting...' : '▶️ Start Game'}
              </button>
              {!selectedQuiz && <p className="text-yellow-400 text-xs text-center mt-2">Select a quiz first</p>}
              {players.length < 2 && <p className="text-yellow-400 text-xs text-center mt-1">Need at least 2 players</p>}
            </div>
          ) : (
            <div className="card text-center py-6">
              <div className="text-3xl mb-3 animate-bounce">⏳</div>
              <p className="text-slate-400">Waiting for the host to start the game...</p>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Picker Modal */}
      {showQuizPicker && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">Select Quiz</h2>
              <button onClick={() => setShowQuizPicker(false)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="overflow-y-auto p-6 space-y-3">
              {quizzes.map((q) => (
                <button
                  key={q._id}
                  onClick={() => selectQuiz(q)}
                  className="w-full text-left bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-indigo-500 rounded-xl p-4 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{q.title}</p>
                      <p className="text-slate-400 text-sm">{catEmoji[q.category]} {q.category}</p>
                    </div>
                    <span className={`badge ${diffColors[q.difficulty]}`}>{q.difficulty}</span>
                  </div>
                </button>
              ))}
              {quizzes.length === 0 && (
                <p className="text-slate-400 text-center py-8">No quizzes available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lobby;