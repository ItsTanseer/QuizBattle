const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  options: {
    type: [String],
    validate: {
      validator: (arr) => arr.length === 4,
      message: 'Each question must have exactly 4 options',
    },
    required: true,
  },
  correctAnswer: {
    type: Number, // index of the correct option (0-3)
    required: [true, 'Correct answer index is required'],
    min: 0,
    max: 3,
  },
  points: {
    type: Number,
    default: 100,
    min: 10,
    max: 500,
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Programming', 'General Knowledge', 'Movies', 'Sports', 'Science'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['Easy', 'Medium', 'Hard'],
    },
    timePerQuestion: {
      type: Number,
      required: [true, 'Time per question is required'],
      min: 5,
      max: 60,
      default: 15,
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'Quiz must have at least 1 question',
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
