/**
 * Animated timer bar that shrinks from full width to zero.
 * @param {number} timeLeft - remaining seconds
 * @param {number} totalTime - total seconds for this question
 */
const TimerBar = ({ timeLeft, totalTime }) => {
  const percent = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  const color =
    percent > 50
      ? 'bg-green-500'
      : percent > 25
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-2.5 rounded-full transition-all duration-1000 ease-linear ${color}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default TimerBar;
