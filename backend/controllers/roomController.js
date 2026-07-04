const Room = require('../models/Room');
const Quiz = require('../models/Quiz');
const { generateRoomCode } = require('../utils/helpers');

/**
 * @desc   Create a new room
 * @route  POST /api/rooms
 * @access Private
 */
const createRoom = async (req, res, next) => {
  try {
    let code;
    let attempts = 0;

    // Generate a unique 6-character room code
    do {
      code = generateRoomCode();
      attempts++;
      if (attempts > 10) {
        return res.status(500).json({ success: false, message: 'Could not generate room code. Try again.' });
      }
    } while (await Room.findOne({ code, status: { $ne: 'finished' } }));

    const room = await Room.create({
      code,
      host: req.user._id,
      players: [
        {
          userId: req.user._id,
          username: req.user.username,
          avatar: req.user.avatar,
          isHost: true,
        },
      ],
    });

    res.status(201).json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get a room by code
 * @route  GET /api/rooms/:code
 * @access Private
 */
const getRoomByCode = async (req, res, next) => {
  try {
    const room = await Room.findOne({ code: req.params.code.toUpperCase() })
      .populate('quiz', 'title category difficulty timePerQuestion')
      .populate('host', 'username');

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    if (room.status === 'finished') {
      return res.status(400).json({ success: false, message: 'Room has already ended.' });
    }

    if (room.status === 'in-progress') {
      return res.status(400).json({ success: false, message: 'Game already in progress.' });
    }

    res.json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all active rooms (for admin/debug)
 * @route  GET /api/rooms
 * @access Private/Admin
 */
const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ status: { $ne: 'finished' } })
      .populate('host', 'username')
      .populate('quiz', 'title');
    res.json({ success: true, rooms });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRoom, getRoomByCode, getAllRooms };
