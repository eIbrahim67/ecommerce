import { describe, it, expect } from 'vitest';
import { formatDate, formatNumber, formatCurrency } from '../formatters';

describe('Formatters', () => {
  describe('formatDate', () => {
    it('should format date for English locale', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'en');
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should format date for Arabic locale', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'ar');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle invalid date gracefully', () => {
      const result = formatDate('invalid-date', 'en');
      expect(result).toBe('invalid-date');
    });

    it('should accept custom options', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'en', { month: 'short', day: 'numeric' });
      expect(result).toContain('Jan');
    });
  });

  describe('formatNumber', () => {
    it('should format number for English locale', () => {
      const result = formatNumber(1234567.89, 'en');
      expect(result).toBe('1,234,567.89');
    });

    it('should format number for Arabic locale', () => {
      const result = formatNumber(1234567.89, 'ar');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle invalid number gracefully', () => {
      const result = formatNumber(NaN, 'en');
      expect(result).toBe('NaN');
    });

    it('should accept custom options', () => {
      const result = formatNumber(0.5, 'en', { style: 'percent' });
      expect(result).toBe('50%');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency for English locale', () => {
      const result = formatCurrency(1234.56, 'en', 'USD');
      expect(result).toContain('1,234.56');
      expect(result).toContain('$');
    });

    it('should format currency for Arabic locale', () => {
      const result = formatCurrency(1234.56, 'ar', 'USD');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle invalid number gracefully', () => {
      const result = formatCurrency(NaN, 'en', 'USD');
      expect(result).toBe('USD NaN');
    });

    it('should use default currency USD', () => {
      const result = formatCurrency(100, 'en');
      expect(result).toContain('$');
      expect(result).toContain('100');
    });

    it('should accept custom options', () => {
      const result = formatCurrency(1234.56, 'en', 'EUR', { minimumFractionDigits: 0 });
      expect(result).toBeTruthy();
    });
  });
});
