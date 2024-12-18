'use client';

interface CircularTimerProps {
  timeLeft: number;
  totalTime: number;
  breakTime: number;
}

export default function CircularTimer({ timeLeft, totalTime, breakTime }: CircularTimerProps) {
  const percentage = (timeLeft / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isInBreak = timeLeft <= breakTime;

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  
  const workDashoffset = circumference - ((timeLeft - breakTime) / (totalTime - breakTime)) * circumference;
  const breakDashoffset = circumference - (timeLeft / breakTime) * circumference;

  return (
    <div className="relative w-64 h-64">
      <svg 
        className="w-full h-full transform -rotate-90"
        viewBox="0 0 200 200"
      >
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="stroke-gray-200 dark:stroke-gray-700"
          strokeWidth="8"
          fill="none"
        />
        {/* Work period circle */}
        {!isInBreak && (
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="stroke-red-500"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: workDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        )}
        {/* Break period circle */}
        {isInBreak && (
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="stroke-green-500"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: breakDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        )}
      </svg>
      <div className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-6xl font-mono font-bold text-gray-800 dark:text-white">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className={`text-sm font-medium mt-2 ${isInBreak ? 'text-green-500' : 'text-red-500'}`}>
          {isInBreak ? 'Break Time' : 'Work Time'}
        </div>
      </div>
    </div>
  );
} 