import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccountCard } from './AccountCard';

const mockOpenUserProfile = vi.fn();
const mockSignOut = vi.fn();

vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      fullName: 'John',
      primaryEmailAddress: { emailAddress: 'john@example.com' },
      imageUrl: '/avatar.jpg'
    },
    isLoaded: true,
  }),
  useClerk: () => ({
    openUserProfile: mockOpenUserProfile,
    signOut: mockSignOut
  }),
}));

describe('AccountCard', () => {
  it('renders user information', () => {
    render(<AccountCard />);
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls openUserProfile when Manage Account is clicked', () => {
    render(<AccountCard />);
    const manageBtn = screen.getByText('Gestionar Cuenta');
    fireEvent.click(manageBtn);
    expect(mockOpenUserProfile).toHaveBeenCalled();
  });

  it('calls signOut when Log Out is clicked', () => {
    render(<AccountCard />);
    const logOutBtn = screen.getByText('Cerrar Sesión');
    fireEvent.click(logOutBtn);
    expect(mockSignOut).toHaveBeenCalled();
  });
});
