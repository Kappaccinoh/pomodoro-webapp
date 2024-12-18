'use client';

import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, ClockIcon, PlayCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { taskApi, TaskData } from '../services/api';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorMessage } from './ui/ErrorMessage';
import { playSound } from '../utils/sound';
import { formatHoursToHM } from '../utils/time';

interface TaskListProps {
  activeTaskId: number | null;
  setActiveTaskId: (id: number | null) => void;
}

// Add this new component for the active task display
const ActiveTaskCard = ({ task }: { task: TaskData | null }) => {
  if (!task) return null;

  return (
    <div className="mb-8 p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-500">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold mb-2">Currently Working On:</h2>
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400">{task.title}</h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Time Allocated: {formatHoursToHM(task.allocated_hours)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Time Spent: {formatHoursToHM(task.time_spent)}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
          <div
            className="bg-red-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((task.time_spent / task.allocated_hours) * 100, 100)}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {((task.time_spent / task.allocated_hours) * 100).toFixed(1)}% Complete
        </div>
      </div>
    </div>
  );
};

export default function TaskList({ activeTaskId, setActiveTaskId }: TaskListProps) {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskHours, setNewTaskHours] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Define addTask with useCallback
  const addTask = useCallback(async () => {
    if (newTask.trim()) {
      try {
        const newTaskData = await taskApi.createTask({
          title: newTask,
          allocated_hours: newTaskHours,
        });
        setTasks(prevTasks => [newTaskData, ...prevTasks]);
        setNewTask('');
        setNewTaskHours(1);
      } catch (err) {
        setError('Failed to create task');
      }
    }
  }, [newTask, newTaskHours]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        addTask();
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [addTask]);

  // Add search functionality
  useEffect(() => {
    const searchTasks = async () => {
      if (!searchTerm) {
        fetchTasks();
        return;
      }
      try {
        const searchResults = await taskApi.searchTasks(searchTerm);
        setTasks(searchResults);
      } catch (err) {
        setError('Failed to search tasks');
      }
    };

    const debounce = setTimeout(searchTasks, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const fetchTasks = async () => {
    try {
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (taskId: number, newStatus: string) => {
    try {
      const updatedTask = await taskApi.updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const handleSelectTask = (taskId: number) => {
    setActiveTaskId(activeTaskId === taskId ? null : taskId);
  };

  const formatTimeRemaining = (task: TaskData) => {
    const remainingHours = task.allocated_hours - task.time_spent;
    return `${formatHoursToHM(Math.max(0, remainingHours))} remaining`;
  };

  const getProgressPercentage = (task: TaskData) => {
    const allocatedSeconds = task.allocated_hours * 3600;
    return Math.min((task.time_spent / allocatedSeconds) * 100, 100);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(taskId);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        if (activeTaskId === taskId) {
          setActiveTaskId(null);
        }
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  // Add this function to get the active task
  const activeTask = tasks.find(task => task.id === activeTaskId);

  return (
    <div className="w-full max-w-md">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      
      {/* Active task display */}
      <ActiveTaskCard task={activeTask} />
      
      {/* Task creation section */}
      <div className="flex flex-col gap-4 mb-8 p-6 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold">Add New Task</h3>
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

      {/* Tasks list section with search */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          <div className="sticky top-0 bg-gradient-to-b from-white to-white/95 dark:from-gray-900 dark:to-gray-900/95 pt-2 pb-4 -mx-2 px-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {['todo', 'in-progress', 'completed'].map((status) => {
            const filteredTasks = tasks.filter((task) => task.status === status);
            if (filteredTasks.length === 0) return null;

            return (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold capitalize">{status}</h3>
                  <span className="text-sm text-gray-500">
                    {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex flex-col gap-2 p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm 
                      ${activeTaskId === task.id ? 
                        'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20' : 
                        'hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <select
                          value={task.status}
                          onChange={(e) => updateStatus(task.id, e.target.value)}
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
                          <span>{formatHoursToHM(task.allocated_hours)}</span>
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
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete task"
                        >
                          <TrashIcon className="w-5 h-5" />
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
            );
          })}
        </div>
      )}
    </div>
  );
} 