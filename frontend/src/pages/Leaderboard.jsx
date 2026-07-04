import { useEffect, useState } from 'react';
import { matchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    matchAPI.getLeaderboard()
      .then((r) => setLeaderboard(r.data.leaderboard))
      .finally(() => setLoading(false));
  }, []);

  const rankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-4xl font-extrabold">Global Leaderboard</h1>
        <p className="text-slate-400 mt-2">Top players ranked by wins</p>
      </div>

      {loading ? (
        <div className="text-center text-slate-400">Loading...</div>
      ) : leaderboard.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">😴</div>
          <p className="text-slate-400">No players yet. Be the first to compete!</p>
        </div>
      ) : (
        <div className="card">
          {/* Header */}
          <div className="grid grid-cols-12 text-slate-500 text-xs font-medium uppercase tracking-wider pb-3 border-b border-slate-700 mb-3">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-2 text-center">Played</div>
            <div className="col-span-2 text-center">Wins</div>
            <div className="col-span-2 text-center">Win %</div>
          </div>

          <div className="space-y-2">
            {leaderboard.map((p) => (
              <div
                key={p.username}
                className={`grid grid-cols-12 items-center py-3 px-2 rounded-lg transition-colors ${p.username === user?.username
                  ? 'bg-indigo-900/30 border border-amber-700'
                  : 'hover:bg-slate-700/40'
                  }`}
              >
                <div className="col-span-1 text-xl">{rankIcon(p.rank)}</div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-black flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.username} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      p.username[0].toUpperCase()
                    )}
                  </div>
                  <span className="font-semibold truncate">
                    {p.username}
                    {p.username === user?.username && (
                      <span className="text-indigo-400 text-xs ml-1">(You)</span>
                    )}
                  </span>
                </div>
                <div className="col-span-2 text-center text-slate-300">{p.gamesPlayed}</div>
                <div className="col-span-2 text-center text-yellow-400 font-bold">{p.gamesWon}</div>
                <div className="col-span-2 text-center">
                  <span className={`badge ${p.winPercentage >= 50 ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-slate-300'}`}>
                    {p.winPercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
