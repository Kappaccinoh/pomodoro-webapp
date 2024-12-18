import { formatHoursToHM } from '../time';

describe('formatHoursToHM', () => {
  test('formats whole hours correctly', () => {
    expect(formatHoursToHM(2)).toBe('2h');
    expect(formatHoursToHM(1)).toBe('1h');
  });

  test('formats minutes only correctly', () => {
    expect(formatHoursToHM(0.5)).toBe('30m');
    expect(formatHoursToHM(0.25)).toBe('15m');
  });

  test('formats hours and minutes correctly', () => {
    expect(formatHoursToHM(1.5)).toBe('1h 30m');
    expect(formatHoursToHM(2.75)).toBe('2h 45m');
  });

  test('handles zero correctly', () => {
    expect(formatHoursToHM(0)).toBe('0m');
  });
}); 