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
