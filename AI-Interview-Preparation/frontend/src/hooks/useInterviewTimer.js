import { useState, useEffect, useCallback } from 'react';

const useInterviewTimer = (initialTime) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsRunning(false);
      setIsTimeUp(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeRemaining(initialTime);
    setIsRunning(false);
    setIsTimeUp(false);
  }, [initialTime]);

  return {
    timeRemaining,
    isRunning,
    isTimeUp,
    startTimer,
    pauseTimer,
    resetTimer
  };
};

export default useInterviewTimer;