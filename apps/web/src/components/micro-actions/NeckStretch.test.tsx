import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NeckStretch } from './NeckStretch';

describe('NeckStretch', () => {
  it('renders initial phase correctly', () => {
    render(<NeckStretch timeLeft={180} totalTime={180} isActive={false} />);
    // After mount, it shows this text when inactive
    expect(screen.getByText(/Presiona Iniciar para comenzar/i)).toBeInTheDocument();
  });
});
