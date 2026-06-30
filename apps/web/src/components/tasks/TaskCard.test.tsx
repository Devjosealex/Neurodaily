import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { TaskCard } from './TaskCard';
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

const mockTask = {
  id: 't1',
  title: 'Completar reporte',
  description: 'Reporte trimestral',
  cognitiveLoad: 3,
  status: 'pending',
  orderIndex: 0,
};

describe('TaskCard', () => {
  it('renders task details correctly', () => {
    renderWithQuery(<TaskCard task={mockTask as any} onUpdate={vi.fn()} />);
    expect(screen.getByText('Completar reporte')).toBeInTheDocument();
  });

  it('calls onUpdate when Add to Daily Flow is clicked', async () => {
    const onUpdateMock = vi.fn();
    server.use(
      http.patch('*/tasks/t1', () => {
        return HttpResponse.json({ ...mockTask, dueDate: '2026-06-30' });
      })
    );

    renderWithQuery(<TaskCard task={mockTask as any} onUpdate={onUpdateMock} />);
    const addBtn = screen.getByText('Añadir a Tu Día');
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(onUpdateMock).toHaveBeenCalled();
    });
  });

  it('shows first step when requested', async () => {
    server.use(
      http.post('*/first-step/generate', () => {
        return HttpResponse.json({ step: 'Abre el documento de Word', method: 'ai' });
      })
    );

    renderWithQuery(<TaskCard task={mockTask as any} onUpdate={vi.fn()} />);
    const firstStepBtn = screen.getByText('Pedir Primer Paso');
    fireEvent.click(firstStepBtn);

    expect(await screen.findByText('Abre el documento de Word')).toBeInTheDocument();
  });
});
