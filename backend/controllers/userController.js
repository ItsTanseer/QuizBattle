const User = require('../models/User');

/**
 * @desc   Get user profile
 * @route  GET /api/users/:id
 * @access Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update logged-in user's profile (username, avatar)
 * @route  PUT /api/users/profile
 * @access Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { username, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (username) user.username = username;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated.',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        gamesPlayed: user.gamesPlayed,
        gamesWon: user.gamesWon,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get dashboard stats for logged-in user
 * @route  GET /api/users/dashboard
 * @access Private
 */
const getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const Match = require('../models/Match');

    const recentMatches = await Match.find({ 'players.userId': req.user._id })
      .sort('-completedAt')
      .limit(5)
      .populate('quiz', 'title category difficulty');

    res.json({
      success: true,
      stats: {
        gamesPlayed: user.gamesPlayed,
        gamesWon: user.gamesWon,
        winPercentage: user.gamesPlayed ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0,
      },
      recentMatches,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateProfile, getDashboard };
