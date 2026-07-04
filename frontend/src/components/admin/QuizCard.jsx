import { difficultyBadgeClass, categoryEmoji } from '../../utils/helpers';

/**
 * Card that displays summary info about a quiz.
 * @param {object} quiz
 * @param {Function} onClick - optional click handler
 * @param {boolean} selected - highlight if selected
 */
const QuizCard = ({ quiz, onClick, selected = false }) => {
  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all duration-200 hover:border-indigo-500 ${
        selected ? 'border-indigo-500 bg-indigo-900/20' : ''
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg leading-tight truncate">{quiz.title}</p>
          <p className="text-slate-400 text-sm mt-1">
            {categoryEmoji(quiz.category)} {quiz.category}
          </p>
        </div>
        <span className={`badge flex-shrink-0 ${difficultyBadgeClass(quiz.difficulty)}`}>
          {quiz.difficulty}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-3 text-slate-500 text-xs">
        <span>⏱ {quiz.timePerQuestion}s/question</span>
        {quiz.questionCount && <span>❓ {quiz.questionCount} questions</span>}
      </div>

      {selected && (
        <p className="text-indigo-400 text-xs mt-2 font-medium">✓ Selected</p>
      )}
    </div>
  );
};

export default QuizCard;
