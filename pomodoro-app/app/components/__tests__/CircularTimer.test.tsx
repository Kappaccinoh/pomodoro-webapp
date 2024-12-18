import { render, screen } from '@testing-library/react';
import CircularTimer from '../CircularTimer';

describe('CircularTimer', () => {
  const defaultProps = {
    timeLeft: 1500, // 25 minutes
    totalTime: 1800, // 30 minutes
    breakTime: 300, // 5 minutes
  };

  test('renders timer with correct time format', () => {
    render(<CircularTimer {...defaultProps} />);
    expect(screen.getByText(/25:/)).toBeInTheDocument();
  });
}); 