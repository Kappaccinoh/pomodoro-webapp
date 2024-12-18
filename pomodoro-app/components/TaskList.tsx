'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Task {
  id: number
  text: string
  status: 'pending' | 'in-progress' | 'completed'
}

interface TaskListProps {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export default function TaskList({ tasks, setTasks }: TaskListProps) {
  const [newTask, setNewTask] = useState('')

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, status: 'pending' }])
      setNewTask('')
    }
  }

  const updateTaskStatus = (id: number, status: 'pending' | 'in-progress' | 'completed') => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status } : task
    ))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <div className="mt-8 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Task List</h2>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="flex-grow"
        />
        <Button onClick={addTask}>Add</Button>
      </div>
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center space-x-2">
            <Select
              value={task.status}
              onValueChange={(value: 'pending' | 'in-progress' | 'completed') => updateTaskStatus(task.id, value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <span className={`flex-grow ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {task.text}
            </span>
            <Button variant="destructive" size="sm" onClick={() => deleteTask(task.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

