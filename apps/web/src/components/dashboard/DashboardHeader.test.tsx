import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardHeader } from './DashboardHeader';

vi.mock('@clerk/nextjs', () => ({
  UserButton: () => <div data-testid="user-button" />,
  useUser: () => ({
    user: {
      firstName: 'John',
    },
    isLoaded: true,
  }),
}));

describe('DashboardHeader', () => {
  const mockUser = { name: 'John', email: 'john@example.com' };

  it('renders greeting with user name', () => {
    render(<DashboardHeader user={mockUser} />);
    expect(screen.getByText(/John/)).toBeInTheDocument();
  });

  it('renders UserButton', () => {
    render(<DashboardHeader user={mockUser} />);
    expect(screen.getByTestId('user-button')).toBeInTheDocument();
  });
});
