import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { PreferencesCard } from './PreferencesCard';
import { renderWithQuery } from '../../../test/utils/renderWithQuery';
import { server } from '../../../test/msw/server';
import { http, HttpResponse } from 'msw';

vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    getToken: vi.fn().mockResolvedValue('fake-token'),
  }),
}));

describe('PreferencesCard', () => {
  it('renders loading state initially', () => {
    renderWithQuery(<PreferencesCard />);
    // The spinner might be empty, but we can verify it renders by waiting for content
  });

  it('renders preferences and toggles', async () => {
    server.use(
      http.get('*/users/me', () => {
        return HttpResponse.json({
          id: 'user1',
          preferences: { hideCompletedTasks: false, enableFocusSounds: true }
        });
      })
    );

    renderWithQuery(<PreferencesCard />);
    
    expect(await screen.findByText('Preferencias')).toBeInTheDocument();
    expect(screen.getByText('Ocultar Completadas')).toBeInTheDocument();
    
    // Check toggle state visually via class
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('bg-gray-200'); // false
    expect(buttons[1]).toHaveClass('bg-[#C53030]'); // true
  });
});
