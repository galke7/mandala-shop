import { describe, it, expect } from 'vitest';
import { toCardView } from '../js/catalog.js';

describe('toCardView', () => {
  it('marks a sold-out product with the grey out-of-stock badge', () => {
    const v = toCardView({ id: 'p1', name: 'x', price: 100, soldOut: true });
    expect(v.soldOut).toBe(true);
    expect(v.badgeText).toBe('אזל המלאי');
    expect(v.badgeClass).toBe('bg-secondary');
  });
  it('shows a red sale badge for an in-stock product with a badge', () => {
    const v = toCardView({ id: 'p2', name: 'y', price: 100, badge: 'מבצע', salePrice: 80 });
    expect(v.soldOut).toBe(false);
    expect(v.badgeText).toBe('מבצע');
    expect(v.badgeClass).toBe('bg-danger');
  });
  it('shows no badge for a plain product', () => {
    const v = toCardView({ id: 'p3', name: 'z', price: 100 });
    expect(v.soldOut).toBe(false);
    expect(v.badgeText).toBe('');
  });
  it('lets out-of-stock take precedence over a sale badge', () => {
    const v = toCardView({ id: 'p4', name: 'w', price: 100, badge: 'מבצע', salePrice: 80, soldOut: true });
    expect(v.badgeText).toBe('אזל המלאי');
    expect(v.badgeClass).toBe('bg-secondary');
  });
  it('passes through the display fields', () => {
    const p = { id: 'p5', name: 'n', price: 100, salePrice: 80, image: 'a.jpg', desc: 'd' };
    expect(toCardView(p)).toMatchObject(p);
  });
});
