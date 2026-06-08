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
