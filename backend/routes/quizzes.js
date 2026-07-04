const express = require('express');
const router = express.Router();
const { getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz } = require('../controllers/quizController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getAllQuizzes);
router.get('/:id', protect, adminOnly, getQuizById);
router.post('/', protect, adminOnly, createQuiz);
router.put('/:id', protect, adminOnly, updateQuiz);
router.delete('/:id', protect, adminOnly, deleteQuiz);

module.exports = router;
