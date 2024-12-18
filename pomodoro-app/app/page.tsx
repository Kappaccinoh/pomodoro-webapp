'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from './components/ThemeToggle';
import CircularTimer from './components/CircularTimer';
import TaskList from './components/TaskList';
import { Task, DEMO_TASKS } from './types/task';
import { taskApi } from './services/api';
import { playSound } from './utils/sound';

export default function Home() {
  const WORK_TIME = 25 * 60; // 25 minutes
  const BREAK_TIME = 5 * 60; // 5 minutes
  const TOTAL_TIME = WORK_TIME + BREAK_TIME;

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const updateTaskTime = (taskId: number, secondsToAdd: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, timeSpent: task.timeSpent + secondsToAdd }
          : task
      )
    );
  };

  useEffect(() => {
    if (activeTaskId === null) {
      setIsRunning(false);
      setIsPaused(false);
      setTimeLeft(TOTAL_TIME);
    } else {
      if (isRunning) {
        setIsRunning(false);
        setIsPaused(false);
        setTimeLeft(TOTAL_TIME);
      }
    }
  }, [activeTaskId, TOTAL_TIME]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isRunning && !isPaused && timeLeft > 0) {
      if (timeLeft === TOTAL_TIME) {
        playSound('start');
      }
      
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            playSound('complete');
            return 0;
          }
          if (activeTaskId) {
            taskApi.updateTaskTime(activeTaskId, 1).catch(console.error);
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, isPaused, timeLeft, activeTaskId, TOTAL_TIME]);

  const handleStartPause = () => {
    if (timeLeft === 0) {
      setTimeLeft(TOTAL_TIME);
    }
    setIsRunning(!isRunning);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setTimeLeft(TOTAL_TIME);
    setIsRunning(false);
    setIsPaused(false);
  };

  const taskListProps = {
    tasks,
    setTasks,
    activeTaskId,
    setActiveTaskId
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ThemeToggle />
      
      <main className="flex flex-col items-center gap-8 p-8 w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Pomodoro Timer
        </h1>
        
        <CircularTimer 
          timeLeft={timeLeft} 
          totalTime={TOTAL_TIME} 
          breakTime={BREAK_TIME}
        />

        <div className="flex gap-4">
          <button
            className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            onClick={handleStartPause}
          >
            {isRunning ? 'Stop' : timeLeft === 0 ? 'Restart' : 'Start'}
          </button>
          {isRunning && (
            <button
              className="px-6 py-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
              onClick={handlePause}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
          <button
            className="px-6 py-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        <TaskList {...taskListProps} />
      </main>
    </div>
  );
}
