'use client';

import { useState } from 'react';
import { PlusIcon, ClockIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { Task, TaskStatus } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  activeTaskId: number | null;
  setActiveTaskId: (id: number | null) => void;
}

export default function TaskList({ tasks, setTasks, activeTaskId, setActiveTaskId }: TaskListProps) {
  const [newTask, setNewTask] = useState('');
  const [newTaskHours, setNewTaskHours] = useState(1);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        title: newTask,
        status: 'todo',
        allocatedHours: newTaskHours,
        timeSpent: 0
      }]);
      setNewTask('');
      setNewTaskHours(1);
    }
  };

  const updateStatus = (taskId: number, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleSelectTask = (taskId: number) => {
    setActiveTaskId(activeTaskId === taskId ? null : taskId);
  };

  const formatTimeRemaining = (task: Task) => {
    const allocatedSeconds = task.allocatedHours * 3600;
    const remainingSeconds = allocatedSeconds - task.timeSpent;
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    
    return `${hours}h ${minutes}m remaining`;
  };

  const getProgressPercentage = (task: Task) => {
    const allocatedSeconds = task.allocatedHours * 3600;
    return Math.min((task.timeSpent / allocatedSeconds) * 100, 100);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          placeholder="What do you need to work on?"
        />
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="number"
              value={newTaskHours}
              onChange={(e) => setNewTaskHours(Math.max(0.5, Number(e.target.value)))}
              min="0.5"
              step="0.5"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 pr-16"
              placeholder="Time needed"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              hours
            </span>
          </div>
          <button
            onClick={addTask}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tip: Each task should be broken down into chunks of 0.5 - 8 hours
        </p>
      </div>

      <div className="space-y-4">
        {['todo', 'in-progress', 'completed'].map((status) => (
          <div key={status} className="space-y-2">
            <h3 className="text-lg font-semibold capitalize">{status}</h3>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div
                  key={task.id}
                  className={`flex flex-col gap-2 p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm ${
                    activeTaskId === task.id ? 'ring-2 ring-red-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value as TaskStatus)}
                        className="text-sm bg-transparent dark:bg-gray-700 dark:text-white text-gray-900 
                          rounded px-2 py-1 dark:border-gray-600 focus:ring-2 focus:ring-red-500"
                      >
                        <option value="todo" className="dark:bg-gray-700 dark:text-white">Todo</option>
                        <option value="in-progress" className="dark:bg-gray-700 dark:text-white">In Progress</option>
                        <option value="completed" className="dark:bg-gray-700 dark:text-white">Completed</option>
                      </select>
                      <span className={task.status === 'completed' ? 'line-through' : ''}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        <span>{task.allocatedHours}h</span>
                      </div>
                      <button
                        onClick={() => handleSelectTask(task.id)}
                        className={`p-1 rounded-full transition-colors ${
                          activeTaskId === task.id
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-gray-400 hover:text-gray-500'
                        }`}
                      >
                        <PlayCircleIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(task)}%` }}
                    />
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTimeRemaining(task)}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
} 