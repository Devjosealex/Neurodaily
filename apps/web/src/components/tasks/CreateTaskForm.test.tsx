import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { CreateTaskForm } from './CreateTaskForm';
import { renderWithQuery } from '../../../test/utils/renderWithQuery';
import { server } from '../../../test/msw/server';
import { http, HttpResponse } from 'msw';

vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    getToken: vi.fn().mockResolvedValue('fake-token'),
  }),
}));

describe('CreateTaskForm', () => {
  it('renders form fields correctly', () => {
    renderWithQuery(<CreateTaskForm onSuccess={vi.fn()} />);
    expect(screen.getByPlaceholderText('Ej. Redactar reporte mensual')).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    const onSuccessMock = vi.fn();
    server.use(
      http.post('*/tasks', () => {
        return HttpResponse.json({ id: 't1', title: 'Test Task' });
      })
    );

    renderWithQuery(<CreateTaskForm onSuccess={onSuccessMock} />);
    
    const input = screen.getByPlaceholderText('Ej. Redactar reporte mensual');
    fireEvent.change(input, { target: { value: 'Test Task' } });

    // Click middle cognitive load button
    const loadButtons = screen.getAllByRole('button');
    fireEvent.click(loadButtons[1]); // Carga 2
    
    // Submit
    const submitBtn = screen.getByText('Crear Tarea');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });
});
