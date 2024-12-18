'use client';

import { useState } from 'react';
import { PlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type TaskStatus = 'todo' | 'in-progress' | 'completed';

interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTask, status: 'todo' }]);
      setNewTask('');
    }
  };

  const updateStatus = (taskId: number, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          className="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          placeholder="Add a new task..."
        />
        <button
          onClick={addTask}
          className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
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
                  className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm"
                >
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value as TaskStatus)}
                    className="text-sm bg-transparent"
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <span className={task.status === 'completed' ? 'line-through' : ''}>
                    {task.title}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
} 