import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { AdminGuard } from './AdminGuard';
import { renderWithQuery } from '../../../test/utils/renderWithQuery';
import { server } from '../../../test/msw/server';
import { http, HttpResponse } from 'msw';

vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    getToken: vi.fn().mockResolvedValue('fake-token'),
    isLoaded: true,
    userId: 'user1',
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('AdminGuard', () => {
  it('blocks access for non-admin users', async () => {
    server.use(
      http.get('*/users/me', () => {
        return HttpResponse.json({ role: 'user' });
      })
    );

    renderWithQuery(
      <AdminGuard>
        <div data-testid="protected-content">Secret Content</div>
      </AdminGuard>
    );

    expect(await screen.findByText('Acceso Denegado')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('allows access for admin users', async () => {
    server.use(
      http.get('*/users/me', () => {
        return HttpResponse.json({ role: 'admin' });
      })
    );

    renderWithQuery(
      <AdminGuard>
        <div data-testid="protected-content">Secret Content</div>
      </AdminGuard>
    );

    expect(await screen.findByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByText('Acceso Denegado')).not.toBeInTheDocument();
  });
});
