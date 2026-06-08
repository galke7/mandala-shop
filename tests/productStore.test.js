import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { serializeProduct } from '../scripts/productStore.mjs';
import { parseProducts, serialize } from '../scripts/productStore.mjs';
import { nextId, findIndexById } from '../scripts/productStore.mjs';

const REAL = readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../js/products.js'), 'utf8'
);

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

describe('parseProducts / serialize', () => {
  it('parses all 6 products from the real file', () => {
    const { products } = parseProducts(REAL);
    expect(products).toHaveLength(6);
    expect(products[0]).toMatchObject({ id: 'p1', price: 320 });
    expect(products[0].name).toContain('מנדלה פרח');
  });
  it('keeps the findProduct export in the footer', () => {
    expect(parseProducts(REAL).footer).toContain('export function findProduct');
  });
  it('KEYSTONE: serialize(parseProducts(file)) round-trips byte-exact', () => {
    expect(serialize(parseProducts(REAL))).toBe(REAL);
  });
});

describe('nextId / findIndexById', () => {
  it('returns p7 for the current 6 products', () => {
    expect(nextId(parseProducts(REAL).products)).toBe('p7');
  });
  it('returns p1 for an empty catalog', () => {
    expect(nextId([])).toBe('p1');
  });
  it('uses max+1, not gap-fill', () => {
    expect(nextId([{ id: 'p1' }, { id: 'p3' }])).toBe('p4');
  });
  it('findIndexById finds and reports -1 for missing', () => {
    const { products } = parseProducts(REAL);
    expect(findIndexById(products, 'p3')).toBe(2);
    expect(findIndexById(products, 'pX')).toBe(-1);
  });
});
