import { describe, it, expect } from 'vitest';
import { addedToCartMessage } from '../js/toast.js';

describe('addedToCartMessage', () => {
  it('includes the product name', () => {
    expect(addedToCartMessage({ name: 'מנדלה סרוגה 20 ס״מ' })).toBe('נוסף לסל: מנדלה סרוגה 20 ס״מ ✓');
  });
  it('falls back to a generic message when name is missing', () => {
    expect(addedToCartMessage({})).toBe('נוסף לסל ✓');
  });
  it('falls back when name is empty/whitespace (no dangling colon)', () => {
    expect(addedToCartMessage({ name: '   ' })).toBe('נוסף לסל ✓');
  });
  it('handles a null product', () => {
    expect(addedToCartMessage(null)).toBe('נוסף לסל ✓');
  });
});
