import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Pixel-art stat card: full bg image with a glassy dark overlay
const StatCard = ({ label, value, bgImage }) => (
  <div
    className="relative rounded-xl overflow-hidden border-2 border-white/20 shadow-lg"
    style={{ minHeight: '140px' }}
  >
    {/* Background image */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
    {/* Glassmorphism overlay */}
    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
      <p
        className="text-xs font-bold uppercase tracking-widest mb-2"
        style={{
          color: '#ffd700',
          textShadow: '1px 1px 0 #000, 2px 2px 0 #000',
          fontFamily: '"Press Start 2P", "Courier New", monospace',
        }}
      >
        {label}
      </p>
      <p
        className="text-4xl font-black"
        style={{
          color: '#ffffff',
          textShadow: '2px 2px 0 #000, 3px 3px 0 #333',
          fontFamily: '"Press Start 2P", "Courier New", monospace',
        }}
      >
        {value}
      </p>
    </div>
  </div>
);

// Action card: full bg image with hover effects
const ActionCard = ({ to, label, subtitle, bgImage }) => (
  <Link
    to={to}
    className="relative block rounded-xl overflow-hidden border-2 border-white/20 shadow-lg group cursor-pointer transition-transform duration-200 hover:scale-[1.03] hover:border-yellow-400/60"
    style={{ minHeight: '150px' }}
  >
    {/* Background image */}
    <div
      className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
    {/* Glassmorphism overlay — slightly lighter on hover */}
    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/35 backdrop-blur-[2px] transition-colors duration-200" />
    {/* Content */}
    <div className="relative z-10 flex flex-col justify-end h-full p-5">
      <h3
        className="text-lg font-black mb-1"
        style={{
          color: '#ffd700',
          textShadow: '1px 1px 0 #000, 2px 2px 0 #000',
          fontFamily: '"Press Start 2P", "Courier New", monospace',
        }}
      >
        {label}
      </h3>
      <p
        className="text-xs"
        style={{
          color: '#e2e8f0',
          textShadow: '1px 1px 0 #000',
        }}
      >
        {subtitle}
      </p>
    </div>
  </Link>
);

const difficultyColor = { Easy: 'text-green-400', Medium: 'text-yellow-400', Hard: 'text-red-400' };

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await userAPI.getDashboard();
        setData(res.data);
      } catch {
        /* handled silently */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <div
          className="text-yellow-300 text-sm"
          style={{ textShadow: '1px 1px 0 #000', fontFamily: '"Press Start 2P", monospace' }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-xl overflow-hidden border-2 border-yellow-400/60 flex-shrink-0"
          style={{ boxShadow: '0 0 12px rgba(250,204,21,0.4)' }}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} className="w-16 h-16 object-cover" />
          ) : (
            <div className="w-full h-full bg-indigo-700 flex items-center justify-center text-2xl font-black">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1
            className="text-2xl font-black"
            style={{
              color: '#ffd700',
              textShadow: '2px 2px 0 #000, 3px 3px 0 #7c3aed',
              fontFamily: '"Press Start 2P", "Courier New", monospace',
            }}
          >
            Hey, {user?.username}!
          </h1>
          <p
            className="text-xs mt-1"
            style={{ color: '#94a3b8', textShadow: '1px 1px 0 #000' }}
          >
            {user?.email}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard
          label="Games Played"
          value={data?.stats?.gamesPlayed ?? 0}
          bgImage="/gamesplayed.png"
        />
        <StatCard
          label="Wins"
          value={data?.stats?.gamesWon ?? 0}
          bgImage="/wins.png"
        />
        <StatCard
          label="Win Rate"
          value={`${data?.stats?.winPercentage ?? 0}%`}
          bgImage="/winrate.png"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <ActionCard
          to="/rooms/create"
          label="Create Room"
          subtitle="Host your own quiz battle"
          bgImage="/createroom.png"
        />
        <ActionCard
          to="/rooms/join"
          label="Join Room"
          subtitle="Enter a room code to join"
          bgImage="/joinroom.png"
        />
      </div>

      {/* Recent Matches */}
      <div>
        <h2
          className="text-base font-black mb-4"
          style={{
            color: '#ffd700',
            textShadow: '1px 1px 0 #000, 2px 2px 0 #333',
            fontFamily: '"Press Start 2P", "Courier New", monospace',
          }}
        >
          Recent Matches
        </h2>
        {data?.recentMatches?.length ? (
          <div className="space-y-3">
            {data.recentMatches.map((match) => {
              const me = match.players.find((p) => p.username === user?.username);
              return (
                <Link
                  to={`/matches/${match._id}/results`}
                  key={match._id}
                  className="block rounded-xl border border-white/15 p-4 transition-all duration-200 hover:border-yellow-400/50 hover:scale-[1.01]"
                  style={{
                    background: 'rgba(15,15,30,0.75)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="font-bold text-sm"
                        style={{ color: '#f1f5f9', textShadow: '1px 1px 0 #000' }}
                      >
                        {match.quizTitle}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {match.quiz?.category} •{' '}
                        <span className={difficultyColor[match.quiz?.difficulty]}>
                          {match.quiz?.difficulty}
                        </span>
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        {new Date(match.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {me && (
                        <>
                          <p
                            className="text-xl font-black"
                            style={{ color: '#a5b4fc', textShadow: '1px 1px 0 #000' }}
                          >
                            {me.score} pts
                          </p>
                          <p className="text-slate-400 text-xs">Rank #{me.rank}</p>
                          {me.isWinner && (
                            <p
                              className="text-xs font-bold mt-0.5"
                              style={{ color: '#fbbf24', textShadow: '1px 1px 0 #000' }}
                            >
                              🏆 Winner!
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            className="rounded-xl border border-white/15 text-center py-12"
            style={{
              background: 'rgba(15,15,30,0.75)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-slate-400 text-sm">No matches yet. Start playing to see your history!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
