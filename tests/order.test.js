import { describe, it, expect } from 'vitest';
import { formatOrderSummary, buildOrderPayload } from '../js/order.js';

const cart = [
  { id: 'p1', name: 'מנדלה כחולה', price: 120, qty: 2 },
  { id: 'p2', name: 'מנדלה אדומה', price: 80, qty: 1 },
];
const customer = { name: 'גל', email: 'gal@example.com', phone: '0501234567', address: 'הרצל 1', note: 'בצבעים חמים' };

describe('formatOrderSummary', () => {
  const text = formatOrderSummary(cart, customer);
  it('lists each product with qty and line total', () => {
    expect(text).toContain('מנדלה כחולה');
    expect(text).toContain('x2');
    expect(text).toContain('240');
  });
  it('includes the grand total', () => expect(text).toContain('320'));
  it('includes the customer name, phone and address', () => {
    expect(text).toContain('גל');
    expect(text).toContain('0501234567');
    expect(text).toContain('הרצל 1');
  });
});

describe('buildOrderPayload', () => {
  const payload = buildOrderPayload(cart, customer, 'KEY-123');
  it('includes the Web3Forms access key', () => expect(payload.access_key).toBe('KEY-123'));
  it('puts the formatted summary in the message field', () => expect(payload.message).toContain('מנדלה כחולה'));
  it('uses the customer email as reply-to', () => expect(payload.replyto).toBe('gal@example.com'));
});
