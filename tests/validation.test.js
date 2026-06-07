import { describe, it, expect } from 'vitest';
import { isValidEmail, validateOrderForm } from '../js/validation.js';

describe('isValidEmail', () => {
  it('accepts a normal address', () => expect(isValidEmail('a@b.com')).toBe(true));
  it('rejects a missing @', () => expect(isValidEmail('ab.com')).toBe(false));
  it('rejects a missing domain', () => expect(isValidEmail('a@')).toBe(false));
  it('rejects an empty string', () => expect(isValidEmail('')).toBe(false));
});

describe('validateOrderForm', () => {
  const ok = { name: 'גל', email: 'gal@example.com', phone: '0501234567', address: 'הרצל 1, תל אביב' };
  it('passes a fully valid form', () => {
    expect(validateOrderForm(ok)).toEqual({ valid: true, errors: {} });
  });
  it('flags a missing name with a Hebrew message', () => {
    const r = validateOrderForm({ ...ok, name: '' });
    expect(r.valid).toBe(false);
    expect(r.errors.name).toBe('נא למלא שם');
  });
  it('flags an invalid email', () => {
    expect(validateOrderForm({ ...ok, email: 'nope' }).errors.email).toBe('כתובת אימייל לא תקינה');
  });
  it('flags a missing phone', () => {
    expect(validateOrderForm({ ...ok, phone: '' }).errors.phone).toBe('נא למלא מספר טלפון');
  });
  it('flags a missing address', () => {
    expect(validateOrderForm({ ...ok, address: '' }).errors.address).toBe('נא למלא כתובת למשלוח');
  });
});
