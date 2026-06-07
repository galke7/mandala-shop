import { describe, it, expect } from 'vitest';
import { addItem, removeItem, setQty, lineTotal, cartTotal, cartCount } from '../js/cart.js';

const product = { id: 'p1', name: 'מנדלה כחולה', price: 120 };
const onSale = { id: 'p2', name: 'מנדלה אדומה', price: 100, salePrice: 80 };

describe('addItem', () => {
  it('adds a new line with qty 1 by default', () => {
    expect(addItem([], product)).toEqual([{ id: 'p1', name: 'מנדלה כחולה', price: 120, qty: 1 }]);
  });
  it('stores salePrice as the effective price when present', () => {
    expect(addItem([], onSale)[0].price).toBe(80);
  });
  it('increments qty when the item is already in the cart', () => {
    const cart = addItem(addItem([], product), product, 2);
    expect(cart).toHaveLength(1);
    expect(cart[0].qty).toBe(3);
  });
  it('does not mutate the input cart', () => {
    const original = [];
    addItem(original, product);
    expect(original).toEqual([]);
  });
});

describe('removeItem', () => {
  it('removes the line with the given id', () => {
    const cart = [{ id: 'p1', name: 'x', price: 1, qty: 1 }, { id: 'p2', name: 'y', price: 2, qty: 1 }];
    expect(removeItem(cart, 'p1')).toEqual([{ id: 'p2', name: 'y', price: 2, qty: 1 }]);
  });
});

describe('setQty', () => {
  it('sets the quantity of a line', () => {
    expect(setQty([{ id: 'p1', name: 'x', price: 10, qty: 1 }], 'p1', 4)[0].qty).toBe(4);
  });
  it('removes the line when qty is 0 or less', () => {
    expect(setQty([{ id: 'p1', name: 'x', price: 10, qty: 1 }], 'p1', 0)).toEqual([]);
  });
});

describe('totals', () => {
  const cart = [{ id: 'p1', name: 'x', price: 120, qty: 2 }, { id: 'p2', name: 'y', price: 80, qty: 1 }];
  it('lineTotal multiplies price by qty', () => expect(lineTotal(cart[0])).toBe(240));
  it('cartTotal sums all line totals', () => expect(cartTotal(cart)).toBe(320));
  it('cartCount sums all quantities', () => expect(cartCount(cart)).toBe(3));
  it('cartTotal of empty cart is 0', () => expect(cartTotal([])).toBe(0));
});
