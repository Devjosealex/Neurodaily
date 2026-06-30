import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MicroActionForm } from './MicroActionForm';
import { server } from '../../../test/msw/server';
import { http, HttpResponse } from 'msw';

vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    getToken: vi.fn().mockResolvedValue('fake-token'),
  }),
}));

describe('MicroActionForm', () => {
  it('renders all form fields', () => {
    render(<MicroActionForm onSuccess={vi.fn()} onCancel={vi.fn()} />);
    
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Descripción')).toBeInTheDocument();
  });

  it('calls onSuccess when submitted successfully', async () => {
    server.use(
      http.post('*/admin/micro-actions', () => {
        return HttpResponse.json({ success: true });
      })
    );

    const onSuccessMock = vi.fn();
    const { container } = render(<MicroActionForm onSuccess={onSuccessMock} onCancel={vi.fn()} />);
    
    const titleInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'Nueva acción' } });

    const descInput = container.querySelectorAll('textarea')[0] as HTMLTextAreaElement;
    fireEvent.change(descInput, { target: { value: 'Una descripción' } });

    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });
});
