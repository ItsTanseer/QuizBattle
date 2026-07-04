import { rankEmoji } from '../../utils/helpers';

/**
 * Leaderboard table used on the score-update and game-over screens.
 * @param {Array} players - sorted leaderboard entries
 * @param {string} currentUsername - highlight the current user's row
 */
const ScoreBoard = ({ players = [], currentUsername }) => {
  return (
    <div className="space-y-2">
      {players.map((p) => (
        <div
          key={p.username}
          className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-colors ${
            p.username === currentUsername
              ? 'bg-indigo-900/40 border border-indigo-600'
              : 'bg-slate-700/50'
          }`}
        >
          {/* Rank */}
          <span className="text-xl w-8 text-center flex-shrink-0">{rankEmoji(p.rank)}</span>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">
              {p.username}
              {p.username === currentUsername && (
                <span className="text-indigo-400 text-xs ml-1">(You)</span>
              )}
            </p>
            {p.correctAnswers !== undefined && (
              <p className="text-slate-400 text-xs">
                {p.correctAnswers} correct
                {p.averageResponseTime > 0 && ` · ${p.averageResponseTime}ms avg`}
              </p>
            )}
          </div>

          {/* Answered correctly indicator */}
          {p.answeredCorrectly !== undefined && (
            <span className={`text-sm ${p.answeredCorrectly ? 'text-green-400' : 'text-red-400'}`}>
              {p.answeredCorrectly ? '✓' : '✗'}
            </span>
          )}

          {/* Score */}
          <span className="text-xl font-bold text-indigo-300 flex-shrink-0">
            {p.score}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ScoreBoard;
