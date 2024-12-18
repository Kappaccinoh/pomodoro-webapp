import { render, screen, waitFor } from '@testing-library/react';
import TaskList from '../TaskList';
import { taskApi } from '../../services/api';

// Mock the API
jest.mock('../../services/api', () => ({
  taskApi: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    deleteTask: jest.fn(),
    updateTaskStatus: jest.fn(),
    updateTaskTime: jest.fn(),
    searchTasks: jest.fn(),
  },
}));

// Mock HeroIcons
jest.mock('@heroicons/react/24/outline', () => ({
  PlusIcon: () => <span data-testid="plus-icon">Plus</span>,
  ClockIcon: () => <span data-testid="clock-icon">Clock</span>,
  PlayCircleIcon: () => <span data-testid="play-icon">Play</span>,
  TrashIcon: () => <span data-testid="trash-icon">Trash</span>,
}));

describe('TaskList', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Test Task',
      status: 'todo',
      allocated_hours: 2,
      time_spent: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (taskApi.getTasks as jest.Mock).mockResolvedValue(mockTasks);
  });

  test('renders task list and loads tasks', async () => {
    render(<TaskList activeTaskId={null} setActiveTaskId={() => {}} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
  });
}); 