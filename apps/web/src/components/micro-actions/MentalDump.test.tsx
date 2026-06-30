import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MentalDump } from './MentalDump';

describe('MentalDump', () => {
  it('renders initial state', () => {
    render(<MentalDump timeLeft={120} totalTime={120} isActive={false} />);
    expect(screen.getByText('Presiona Iniciar para comenzar')).toBeInTheDocument();
  });

  it('renders step 1 when active', () => {
    render(<MentalDump timeLeft={120} totalTime={120} isActive={true} />);
    expect(screen.getByText('Prepárate')).toBeInTheDocument();
    expect(screen.getByText('Busca papel y lápiz (o abre una nota vacía en tu teléfono).')).toBeInTheDocument();
  });
});
