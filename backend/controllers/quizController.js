const Quiz = require('../models/Quiz');

/**
 * @desc   Get all quizzes
 * @route  GET /api/quizzes
 * @access Private
 */
const getAllQuizzes = async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await Quiz.find(filter).select('-questions').sort('-createdAt');
    res.json({ success: true, count: quizzes.length, quizzes });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single quiz (with questions) - admin only
 * @route  GET /api/quizzes/:id
 * @access Private/Admin
 */
const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }
    res.json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a quiz
 * @route  POST /api/quizzes
 * @access Private/Admin
 */
const createQuiz = async (req, res, next) => {
  try {
    const { title, category, difficulty, timePerQuestion, questions } = req.body;

    if (!title || !category || !difficulty || !questions || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const quiz = await Quiz.create({
      title,
      category,
      difficulty,
      timePerQuestion: timePerQuestion || 15,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Quiz created.', quiz });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update a quiz
 * @route  PUT /api/quizzes/:id
 * @access Private/Admin
 */
const updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    res.json({ success: true, message: 'Quiz updated.', quiz });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a quiz
 * @route  DELETE /api/quizzes/:id
 * @access Private/Admin
 */
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }
    res.json({ success: true, message: 'Quiz deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz };
