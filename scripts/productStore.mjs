// mandala-shop/scripts/productStore.mjs
// Pure, dependency-free CRUD over the products.js source file.
// Splits the file into header / products / footer so the header comment and the findProduct
// export round-trip byte-exact; parses the array literal with node:vm (plain data, exact).
import vm from 'node:vm';

function serializeValue(v) {
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'string') return "'" + v.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  throw new Error('productStore: unsupported value type ' + typeof v);
}

export function serializeProduct(p) {
  const pairs = Object.keys(p).map((k) => `${k}: ${serializeValue(p[k])}`);
  return `{ ${pairs.join(', ')} }`;
}

const FILE_RE = /^([\s\S]*?export const products = \[\n)([\s\S]*?)(\n\];[\s\S]*)$/;

export function parseProducts(text) {
  const m = text.match(FILE_RE);
  if (!m) throw new Error('productStore: unrecognized products.js structure');
  const [, header, body, footer] = m;
  const products = vm.runInNewContext('[' + body + ']');
  return { header, products, footer };
}

export function serialize({ header, products, footer }) {
  const body = products.map((p) => '  ' + serializeProduct(p) + ',').join('\n');
  return header + body + footer;
}

export function findIndexById(products, id) {
  return products.findIndex((p) => p.id === id);
}

export function nextId(products) {
  const max = products.reduce((acc, p) => {
    const m = /^p(\d+)$/.exec(p.id);
    return m ? Math.max(acc, Number(m[1])) : acc;
  }, 0);
  return 'p' + (max + 1);
}

const REQUIRED = ['name', 'price', 'image', 'desc'];

export function add(products, fields) {
  for (const k of REQUIRED) {
    if (fields[k] === undefined || fields[k] === '') throw new Error(`add: missing required field "${k}"`);
  }
  const price = Number(fields.price);
  if (Number.isNaN(price)) throw new Error('add: price must be a number');
  const product = { id: nextId(products), name: String(fields.name), price };
  if (fields.salePrice !== undefined && fields.salePrice !== '') product.salePrice = Number(fields.salePrice);
  if (fields.badge) product.badge = String(fields.badge);
  if (fields.soldOut === true || fields.soldOut === 'true') product.soldOut = true;
  product.image = String(fields.image);
  product.desc = String(fields.desc);
  return [...products, product];
}

const SETTABLE = ['name', 'price', 'desc', 'salePrice', 'badge', 'soldOut'];

export function setField(products, id, field, value) {
  if (!SETTABLE.includes(field)) throw new Error(`setField: field "${field}" is not settable`);
  const i = findIndexById(products, id);
  if (i === -1) throw new Error(`setField: no product "${id}"`);
  const updated = { ...products[i] };
  const empty = value === '' || value === null || value === undefined;
  if (field === 'price' || field === 'salePrice') {
    if (empty) {
      if (field === 'price') throw new Error('setField: price is required');
      delete updated.salePrice;
    } else {
      const n = Number(value);
      if (Number.isNaN(n)) throw new Error(`setField: ${field} must be a number`);
      updated[field] = n;
    }
  } else if (field === 'soldOut') {
    if (value === true || value === 'true') updated.soldOut = true;
    else delete updated.soldOut;
  } else { // name, desc, badge
    if (empty) {
      if (field === 'badge') delete updated.badge;
      else throw new Error(`setField: ${field} cannot be empty`);
    } else {
      updated[field] = String(value);
    }
  }
  const copy = [...products];
  copy[i] = updated;
  return copy;
}
