const express = require('express');
const router = express.Router();
const { createRoom, getRoomByCode, getAllRooms } = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, createRoom);
router.get('/all', protect, adminOnly, getAllRooms);
router.get('/:code', protect, getRoomByCode);

module.exports = router;
