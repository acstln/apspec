import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CompareView from '../../src/components/CompareView';

describe('CompareView', () => {
  it('renders empty state when no machines are selected', () => {
    render(
      <BrowserRouter>
        <CompareView machines={[]} onRemove={() => {}} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/no aps selected/i)).toBeInTheDocument();
  });
});
