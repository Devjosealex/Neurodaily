import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminSidebar } from './AdminSidebar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin/users',
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('AdminSidebar', () => {
  it('renders admin links correctly', () => {
    render(<AdminSidebar />);
    expect(screen.getByText('Resumen')).toBeInTheDocument();
    expect(screen.getByText('Microacciones')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
  });
});
