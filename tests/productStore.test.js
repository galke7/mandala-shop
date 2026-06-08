import { describe, it, expect } from 'vitest';
import { serializeProduct } from '../scripts/productStore.mjs';

describe('serializeProduct', () => {
  it('emits a minimal product in byte-exact house format', () => {
    const p = { id: 'p7', name: 'מנדלה שמחה 50 ס״מ', price: 360, image: 'images/50cm-p7.jpg', desc: 'תיאור.' };
    expect(serializeProduct(p)).toBe(
      "{ id: 'p7', name: 'מנדלה שמחה 50 ס״מ', price: 360, image: 'images/50cm-p7.jpg', desc: 'תיאור.' }"
    );
  });
  it("emits keys in the object's own order, including optionals", () => {
    const p = { id: 'p2', name: 'x', price: 270, badge: 'מבצע', salePrice: 240, image: 'a.jpg', desc: 'd' };
    expect(serializeProduct(p)).toBe(
      "{ id: 'p2', name: 'x', price: 270, badge: 'מבצע', salePrice: 240, image: 'a.jpg', desc: 'd' }"
    );
  });
  it('emits soldOut as a bare boolean', () => {
    const p = { id: 'p5', name: 'x', price: 320, soldOut: true, image: 'a.jpg', desc: 'd' };
    expect(serializeProduct(p)).toContain('soldOut: true');
  });
  it('keeps Hebrew and the gershayim ״ raw (no unicode escaping)', () => {
    const out = serializeProduct({ id: 'p1', name: 'מנדלה 20 ס״מ', price: 1, image: 'a.jpg', desc: 'd' });
    expect(out).toContain('ס״מ');
    expect(out).not.toContain('\\u');
  });
  it('escapes an embedded single quote', () => {
    const out = serializeProduct({ id: 'p1', name: "מנדלה 'מיוחדת'", price: 1, image: 'a.jpg', desc: 'd' });
    expect(out).toContain("\\'מיוחדת\\'");
  });
});
