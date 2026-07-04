/**
 * Generate a random 6-character alphanumeric room code.
 * Only uppercase letters and numbers for readability.
 */
const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like 0,O,1,I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

/**
 * Calculate score for a correct answer based on response time.
 * Faster answers earn more points (up to maxPoints, minimum 10% of maxPoints).
 */
const calculateScore = (responseTimeMs, timeLimitSecs, basePoints = 100) => {
  const timeLimitMs = timeLimitSecs * 1000;
  const ratio = Math.max(0, 1 - responseTimeMs / timeLimitMs);
  // Score ranges from basePoints * 0.1 to basePoints
  return Math.round(basePoints * 0.1 + basePoints * 0.9 * ratio);
};

module.exports = { generateRoomCode, calculateScore };
