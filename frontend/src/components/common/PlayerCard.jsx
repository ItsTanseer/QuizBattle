/**
 * Displays a single player's avatar, name, and optional host badge.
 */
const PlayerCard = ({ player, isCurrentUser = false }) => {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
        isCurrentUser ? 'bg-indigo-900/40 border border-indigo-700' : 'bg-slate-700/50'
      }`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden">
        {player.avatar ? (
          <img src={player.avatar} alt={player.username} className="w-full h-full object-cover" />
        ) : (
          <span>{player.username?.[0]?.toUpperCase()}</span>
        )}
      </div>

      {/* Name + badges */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {player.username}
          {isCurrentUser && <span className="text-indigo-400 text-xs ml-1">(You)</span>}
        </p>
        {player.isHost && <p className="text-xs text-yellow-400">👑 Host</p>}
      </div>

      {/* Connection status */}
      {!player.isConnected && (
        <span className="text-xs text-slate-500 italic">disconnected</span>
      )}
    </div>
  );
};

export default PlayerCard;
