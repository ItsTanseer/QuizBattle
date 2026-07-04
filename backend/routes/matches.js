const express = require('express');
const router = express.Router();
const { getMyMatches, getMatchById, getLeaderboard } = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);
router.get('/my', protect, getMyMatches);
router.get('/:id', protect, getMatchById);

module.exports = router;
