const Match = require('../models/Match');

/**
 * @desc   Get match history for the logged-in user
 * @route  GET /api/matches/my
 * @access Private
 */
const getMyMatches = async (req, res, next) => {
  try {
    const matches = await Match.find({
      'players.userId': req.user._id,
    })
      .sort('-completedAt')
      .limit(20)
      .populate('quiz', 'title category difficulty');

    res.json({ success: true, matches });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get a single match
 * @route  GET /api/matches/:id
 * @access Private
 */
const getMatchById = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id).populate('quiz', 'title category difficulty');
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found.' });
    }
    res.json({ success: true, match });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get global leaderboard (top users by wins)
 * @route  GET /api/matches/leaderboard
 * @access Public
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const users = await User.find()
      .sort('-gamesWon -gamesPlayed')
      .limit(20)
      .select('username avatar gamesPlayed gamesWon');

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      username: u.username,
      avatar: u.avatar,
      gamesPlayed: u.gamesPlayed,
      gamesWon: u.gamesWon,
      winPercentage: u.gamesPlayed ? Math.round((u.gamesWon / u.gamesPlayed) * 100) : 0,
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyMatches, getMatchById, getLeaderboard };
