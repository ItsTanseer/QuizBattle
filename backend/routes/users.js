const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile, getDashboard } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboard);
router.put('/profile', protect, updateProfile);
router.get('/:id', protect, getUserProfile);

module.exports = router;
