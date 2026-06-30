import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { DailyFlowManager } from './DailyFlowManager';
import { renderWithQuery } from '../../../test/utils/renderWithQuery';
import { server } from '../../../test/msw/server';
import { http, HttpResponse } from 'msw';

vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    getToken: vi.fn().mockResolvedValue('fake-token'),
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock TaskCard so we don't need to worry about its complex logic in this test
vi.mock('../tasks/TaskCard', () => ({
  TaskCard: ({ task }: any) => (
    <div data-testid={`mock-task-${task.id}`}>{task.title}</div>
  )
}));

describe('DailyFlowManager', () => {
  it('renders loading state initially', () => {
    renderWithQuery(<DailyFlowManager />);
    expect(screen.getByText('Cargando tu día...')).toBeInTheDocument();
  });

  it('renders tasks with dueDate assigned', async () => {
    const mockTasks = [
      { id: '1', title: 'Task with date', dueDate: '2026-06-30', orderIndex: 0 },
      { id: '2', title: 'Task without date', dueDate: null, orderIndex: 1 }
    ];

    server.use(
      http.get('*/tasks', () => {
        return HttpResponse.json(mockTasks);
      })
    );

    renderWithQuery(<DailyFlowManager />);
    
    // Should render only task 1
    await waitFor(() => {
      expect(screen.getByText('Task with date')).toBeInTheDocument();
    });
    expect(screen.queryByText('Task without date')).not.toBeInTheDocument();
  });
});
