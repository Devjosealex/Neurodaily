import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { DashboardSidebar } from './DashboardSidebar';
import { renderWithQuery } from '../../../test/utils/renderWithQuery';
import { server } from '../../../test/msw/server';
import { http, HttpResponse } from 'msw';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    getToken: vi.fn().mockResolvedValue('fake-token'),
  }),
}));

describe('DashboardSidebar', () => {
  it('renders standard navigation links', () => {
    renderWithQuery(<DashboardSidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tareas')).toBeInTheDocument();
  });

  it('hides Admin link for non-admin users', async () => {
    server.use(
      http.get('*/users/me', () => {
        return HttpResponse.json({ role: 'user' });
      })
    );
    renderWithQuery(<DashboardSidebar />);
    
    // Check that standard nav is there, but Admin is not
    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Sistema')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('shows Admin link for admin users', async () => {
    server.use(
      http.get('*/users/me', () => {
        return HttpResponse.json({ role: 'admin' });
      })
    );
    renderWithQuery(<DashboardSidebar />);
    
    // Check that Admin section appears
    expect(await screen.findByText('Sistema')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
