/**
 * Format a number of milliseconds into a human-readable string.
 * e.g. 1234 -> "1.2s"
 */
export const formatResponseTime = (ms) => {
  if (!ms || ms === 0) return '—';
  return `${(ms / 1000).toFixed(1)}s`;
};

/**
 * Return a Tailwind color class based on difficulty string.
 */
export const difficultyBadgeClass = (difficulty) => {
  const map = {
    Easy: 'bg-green-900 text-green-300',
    Medium: 'bg-yellow-900 text-yellow-300',
    Hard: 'bg-red-900 text-red-300',
  };
  return map[difficulty] || 'bg-slate-700 text-slate-300';
};

/**
 * Return an emoji for a given quiz category.
 */
export const categoryEmoji = (category) => {
  const map = {
    Programming: '💻',
    'General Knowledge': '🌍',
    Movies: '🎬',
    Sports: '⚽',
    Science: '🔬',
  };
  return map[category] || '📚';
};

/**
 * Return a trophy emoji for a leaderboard rank.
 */
export const rankEmoji = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

/**
 * Truncate a string to a max length, appending "…" if needed.
 */
export const truncate = (str, max = 50) => {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
};
