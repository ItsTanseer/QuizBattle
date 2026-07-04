const mongoose = require('mongoose');

const matchPlayerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  score: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  totalQuestions: Number,
  averageResponseTime: { type: Number, default: 0 }, // in ms
  rank: Number,
  isWinner: { type: Boolean, default: false },
});

const matchSchema = new mongoose.Schema(
  {
    roomCode: String,
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    quizTitle: String,
    players: [matchPlayerSchema],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    winnerUsername: String,
    totalQuestions: Number,
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);
