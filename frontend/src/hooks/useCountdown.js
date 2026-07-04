import { useState, useEffect, useRef } from 'react';

/**
 * Countdown timer hook.
 * @param {number} initialSeconds - starting value
 * @param {Function} onComplete - called when timer reaches 0
 * @returns {{ timeLeft, start, stop, reset }}
 */
const useCountdown = (initialSeconds, onComplete) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const intervalRef = useRef(null);

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = (seconds = initialSeconds) => {
    stop();
    setTimeLeft(seconds);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stop();
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const reset = (seconds = initialSeconds) => {
    stop();
    setTimeLeft(seconds);
  };

  useEffect(() => () => stop(), []);

  return { timeLeft, start, stop, reset };
};

export default useCountdown;
