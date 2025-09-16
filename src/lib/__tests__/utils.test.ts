import { cn } from '../utils';

describe('Utils', () => {
  describe('cn function', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
    });

    it('handles undefined and null values', () => {
      expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
    });

    it('handles empty string', () => {
      expect(cn('class1', '', 'class2')).toBe('class1 class2');
    });

    it('handles no arguments', () => {
      expect(cn()).toBe('');
    });

    it('merges tailwind classes correctly', () => {
      // Test that conflicting classes are resolved
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });
  });
});