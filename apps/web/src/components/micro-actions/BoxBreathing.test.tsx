import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BoxBreathing } from './BoxBreathing';

describe('BoxBreathing', () => {
  it('renders initial phase correctly', () => {
    render(<BoxBreathing timeLeft={16} totalTime={16} isActive={false} />);
    expect(screen.getByText('Presiona Iniciar para comenzar')).toBeInTheDocument();
  });

  it('renders inhale phase when active', () => {
    render(<BoxBreathing timeLeft={16} totalTime={16} isActive={true} />);
    expect(screen.getByText('Inhala profundamente...')).toBeInTheDocument();
  });
});
