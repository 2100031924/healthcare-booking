import { describe, it, expect } from 'vitest';
import { 
  formatTime, 
  isValidEmail, 
  isValidPhone, 
  formatPhoneNumber,
  isPastDate,
  isToday,
  isSameDay,
  generateBookingId
} from './helpers';

describe('Helpers Utility Functions', () => {
  describe('formatTime', () => {
    it('formats morning times correctly', () => {
      expect(formatTime('09:30')).toBe('9:30 AM');
    });

    it('formats noon correctly', () => {
      expect(formatTime('12:00')).toBe('12:00 PM');
    });

    it('formats afternoon times correctly', () => {
      expect(formatTime('14:45')).toBe('2:45 PM');
    });

    it('formats midnight correctly', () => {
      expect(formatTime('00:00')).toBe('12:00 AM');
    });
  });

  describe('Validation Functions', () => {
    it('validates correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('invalidates incorrect email', () => {
      expect(isValidEmail('testexample.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });

    it('validates phone number with 10 or more digits', () => {
      expect(isValidPhone('1234567890')).toBe(true);
      expect(isValidPhone('+1 (555) 123-4567')).toBe(true);
    });

    it('invalidates phone number with less than 10 digits', () => {
      expect(isValidPhone('12345')).toBe(false);
      expect(isValidPhone('abc')).toBe(false);
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats 10 digit number to (XXX) XXX-XXXX', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
    });

    it('returns original if not 10 digits', () => {
      expect(formatPhoneNumber('12345')).toBe('12345');
      expect(formatPhoneNumber('12345678901')).toBe('12345678901');
    });
  });

  describe('Date Functions', () => {
    it('isSameDay identifies same days', () => {
      const d1 = new Date('2023-01-01T10:00:00');
      const d2 = new Date('2023-01-01T15:00:00');
      expect(isSameDay(d1, d2)).toBe(true);
    });

    it('isSameDay identifies different days', () => {
      const d1 = new Date('2023-01-01T10:00:00');
      const d2 = new Date('2023-01-02T10:00:00');
      expect(isSameDay(d1, d2)).toBe(false);
    });

    it('isPastDate identifies past dates', () => {
      const past = new Date('2000-01-01');
      expect(isPastDate(past)).toBe(true);
    });

    it('isPastDate returns false for future dates', () => {
      const future = new Date();
      future.setDate(future.getDate() + 10);
      expect(isPastDate(future)).toBe(false);
    });
  });

  describe('generateBookingId', () => {
    it('generates a string starting with HC', () => {
      const id = generateBookingId();
      expect(id.startsWith('HC')).toBe(true);
      expect(id.length).toBeGreaterThan(5);
    });
  });
});
