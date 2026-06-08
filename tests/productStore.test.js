import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { serializeProduct } from '../scripts/productStore.mjs';
import { parseProducts, serialize } from '../scripts/productStore.mjs';
import { nextId, findIndexById } from '../scripts/productStore.mjs';
import { add } from '../scripts/productStore.mjs';
import { setField } from '../scripts/productStore.mjs';
import { replaceImage, remove } from '../scripts/productStore.mjs';

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

describe('add', () => {
  const base = () => parseProducts(REAL).products;
  it('appends a new product with auto id p7 and canonical key order', () => {
    const out = add(base(), { name: 'מנדלה שמחה 50 ס״מ', price: 360, image: 'images/50cm-p7.jpg', desc: 'd' });
    expect(out).toHaveLength(7);
    expect(out[6]).toEqual({ id: 'p7', name: 'מנדלה שמחה 50 ס״מ', price: 360, image: 'images/50cm-p7.jpg', desc: 'd' });
    expect(serializeProduct(out[6])).toBe(
      "{ id: 'p7', name: 'מנדלה שמחה 50 ס״מ', price: 360, image: 'images/50cm-p7.jpg', desc: 'd' }"
    );
  });
  it('coerces price to a number and includes given optionals between price and image', () => {
    const out = add(base(), { name: 'x', price: '300', image: 'a.jpg', desc: 'd', salePrice: '250' });
    expect(out[6]).toEqual({ id: 'p7', name: 'x', price: 300, salePrice: 250, image: 'a.jpg', desc: 'd' });
  });
  it('throws when a required field is missing', () => {
    expect(() => add(base(), { name: 'x', image: 'a.jpg', desc: 'd' })).toThrow(/price/);
  });
  it('does not mutate the input array', () => {
    const arr = base();
    add(arr, { name: 'x', price: 1, image: 'a.jpg', desc: 'd' });
    expect(arr).toHaveLength(6);
  });
});

describe('setField', () => {
  const base = () => parseProducts(REAL).products;
  const byId = (arr, id) => arr.find((p) => p.id === id);
  it('updates price (coerced to number) in place', () => {
    expect(byId(setField(base(), 'p1', 'price', '340'), 'p1').price).toBe(340);
  });
  it('rejects a non-numeric price', () => {
    expect(() => setField(base(), 'p1', 'price', 'abc')).toThrow(/number/);
  });
  it('adds salePrice and removes it when set empty', () => {
    expect(byId(setField(base(), 'p1', 'salePrice', 240), 'p1').salePrice).toBe(240);
    expect(byId(setField(base(), 'p2', 'salePrice', ''), 'p2')).not.toHaveProperty('salePrice');
  });
  it('soldOut true adds the key; false removes it', () => {
    expect(byId(setField(base(), 'p1', 'soldOut', 'true'), 'p1').soldOut).toBe(true);
    expect(byId(setField(base(), 'p5', 'soldOut', 'false'), 'p5')).not.toHaveProperty('soldOut');
  });
  it('throws on unknown id', () => {
    expect(() => setField(base(), 'pX', 'price', 1)).toThrow(/pX/);
  });
  it('rejects a non-settable field (id, __proto__)', () => {
    expect(() => setField(base(), 'p1', 'id', 'p9')).toThrow(/settable/);
    expect(() => setField(base(), 'p1', '__proto__', 'x')).toThrow(/settable/);
  });
});

describe('replaceImage / remove', () => {
  const base = () => parseProducts(REAL).products;
  it('replaceImage swaps only the image field', () => {
    const out = replaceImage(base(), 'p4', 'images/25cm-p4-v2.jpg');
    const p4 = out.find((p) => p.id === 'p4');
    expect(p4.image).toBe('images/25cm-p4-v2.jpg');
    expect(p4.name).toBe(base().find((p) => p.id === 'p4').name);
  });
  it('replaceImage throws on unknown id', () => {
    expect(() => replaceImage(base(), 'pX', 'a.jpg')).toThrow(/pX/);
  });
  it('remove deletes by id and preserves order of the rest', () => {
    const out = remove(base(), 'p3');
    expect(out).toHaveLength(5);
    expect(out.map((p) => p.id)).toEqual(['p1', 'p2', 'p4', 'p5', 'p6']);
  });
  it('remove throws on unknown id', () => {
    expect(() => remove(base(), 'pX')).toThrow(/pX/);
  });
});
