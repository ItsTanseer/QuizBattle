import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { matchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Results = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    matchAPI.getById(id)
      .then((r) => setMatch(r.data.match))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="text-center py-20 text-slate-400">Loading results...</div>;
  if (!match) return null;

  const me = match.players.find((p) => p.username === user?.username);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-4xl font-extrabold mb-2">Match Results</h1>
        <p className="text-slate-400">{match.quizTitle}</p>
        <p className="text-yellow-400 font-bold text-xl mt-2">
          Winner: 🥇 {match.winnerUsername}
        </p>
      </div>

      {me && (
        <div className="card mb-6 text-center">
          <p className="text-slate-400 mb-1">Your Performance</p>
          <p className="text-4xl font-bold text-indigo-400 mb-1">{me.score} pts</p>
          <p className="text-slate-400">
            Rank #{me.rank} · {me.correctAnswers}/{me.totalQuestions} correct ·{' '}
            {me.averageResponseTime}ms avg response
          </p>
          {me.isWinner && <p className="text-yellow-400 mt-2 font-semibold">🎉 You won!</p>}
        </div>
      )}

      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">Final Leaderboard</h2>
        <div className="space-y-3">
          {match.players.map((p) => (
            <div
              key={p.username}
              className={`flex items-center gap-4 rounded-lg p-4 ${
                p.username === user?.username
                  ? 'bg-indigo-900/30 border border-indigo-600'
                  : 'bg-slate-700/50'
              }`}
            >
              <span className="text-2xl w-10 text-center">
                {p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : `#${p.rank}`}
              </span>
              <div className="flex-1">
                <p className="font-semibold">
                  {p.username}
                  {p.username === user?.username && (
                    <span className="text-indigo-400 text-xs ml-2">(You)</span>
                  )}
                </p>
                <p className="text-slate-400 text-sm">
                  {p.correctAnswers}/{p.totalQuestions} correct · {p.averageResponseTime}ms avg
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-indigo-400">{p.score}</p>
                <p className="text-slate-500 text-xs">points</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Link to="/rooms/create" className="btn-primary flex-1 text-center py-3">
          🚀 Play Again
        </Link>
        <Link to="/dashboard" className="btn-secondary flex-1 text-center py-3">
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Results;
