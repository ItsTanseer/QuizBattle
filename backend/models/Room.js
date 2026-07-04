const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  avatar: String,
  socketId: String,
  score: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  totalResponseTime: { type: Number, default: 0 }, // in ms
  isHost: { type: Boolean, default: false },
  isConnected: { type: Boolean, default: true },
});

const roomSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      length: 6,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    players: [playerSchema],
    status: {
      type: String,
      enum: ['waiting', 'in-progress', 'finished'],
      default: 'waiting',
    },
    currentQuestion: {
      type: Number,
      default: 0,
    },
    maxPlayers: {
      type: Number,
      default: 8,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
