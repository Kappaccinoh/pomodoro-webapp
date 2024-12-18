const API_BASE_URL = 'http://localhost:8000/api';

// Add Basic Auth headers with your superuser credentials
const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('admin:password')  // Replace 'admin:admin' with your actual username:password
};

export interface TaskData {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  allocated_hours: number;
  time_spent: number;
  created_at: string;
  updated_at: string;
}

export const taskApi = {
  // Get all tasks
  getTasks: async (): Promise<TaskData[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks/`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  // Create new task
  createTask: async (task: { title: string; allocated_hours: number }): Promise<TaskData> => {
    const response = await fetch(`${API_BASE_URL}/tasks/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...task, status: 'todo' }),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  // Update task time
  updateTaskTime: async (taskId: number, seconds: number): Promise<TaskData> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/update_time/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ seconds }),
    });
    if (!response.ok) throw new Error('Failed to update task time');
    return response.json();
  },

  // Update task status
  updateTaskStatus: async (taskId: number, status: string): Promise<TaskData> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/change_status/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update task status');
    return response.json();
  },

  // Get task statistics
  getStatistics: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks/statistics/`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  },

  deleteTask: async (taskId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },

  searchTasks: async (query: string): Promise<TaskData[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks/search/?q=${encodeURIComponent(query)}`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to search tasks');
    return response.json();
  }
}; 