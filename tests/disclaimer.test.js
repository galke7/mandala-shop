import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

describe('order-form disclaimer', () => {
  it('shows the handmade / illustration-only disclaimer', () => {
    expect(html).toContain('התמונות להמחשה בלבד');
  });
  it('places the disclaimer before the submit button', () => {
    const disclaimer = html.indexOf('order-disclaimer');
    const submit = html.indexOf('שליחת הזמנה');
    expect(disclaimer).toBeGreaterThan(-1);
    expect(disclaimer).toBeLessThan(submit);
  });
});
