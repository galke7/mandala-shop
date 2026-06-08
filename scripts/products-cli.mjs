#!/usr/bin/env node
// scripts/products-cli.mjs — thin argv wrapper over productStore. Resolves js/products.js
// relative to this file, so it works from any cwd. Used by the content-manager skill.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseProducts, serialize, add, setField, replaceImage, remove, nextId } from './productStore.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'js/products.js');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token || !token.startsWith('--')) throw new Error(`expected --flag, got "${token}"`);
    const eqIdx = token.indexOf('=');
    if (eqIdx !== -1) {
      // --flag=value form
      out[token.slice(2, eqIdx)] = token.slice(eqIdx + 1);
    } else {
      // --flag value form
      const key = token.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        out[key] = undefined;
      } else {
        out[key] = next;
        i++;
      }
    }
  }
  return out;
}
const load = () => parseProducts(readFileSync(FILE, 'utf8'));
const save = (parsed, products) => writeFileSync(FILE, serialize({ ...parsed, products }), 'utf8');
const assertImage = (rel) => {
  const abs = path.resolve(ROOT, rel ?? '');
  const imagesDir = path.join(ROOT, 'images');
  if (abs !== imagesDir && !abs.startsWith(imagesDir + path.sep)) throw new Error(`image must be under images/: ${rel}`);
  if (!existsSync(abs)) throw new Error(`image not found: ${rel}`);
};

const [cmd, ...rest] = process.argv.slice(2);
try {
  if (cmd === 'list') {
    const rows = load().products.map((p, idx) => ({
      n: idx + 1, id: p.id, name: p.name, price: p.price, salePrice: p.salePrice, soldOut: p.soldOut === true, image: p.image,
    }));
    if (rest.includes('--json')) console.log(JSON.stringify(rows, null, 2));
    else rows.forEach((r) => console.log(`${r.n}. [${r.id}] ${r.name} — ${r.salePrice ?? r.price} ₪${r.soldOut ? ' (אזל המלאי)' : ''}`));
  } else if (cmd === 'next-id') {
    console.log(nextId(load().products));
  } else if (cmd === 'add') {
    const a = parseArgs(rest); assertImage(a.image);
    const parsed = load();
    const updated = add(parsed.products, a);
    save(parsed, updated);
    console.log(updated[updated.length - 1].id);
  } else if (cmd === 'set') {
    const a = parseArgs(rest);
    if (a.value === undefined) throw new Error("set requires --value (use --value '' to clear an optional field)");
    const parsed = load();
    save(parsed, setField(parsed.products, a.id, a.field, a.value));
  } else if (cmd === 'replace-image') {
    const a = parseArgs(rest); assertImage(a.image); const parsed = load();
    save(parsed, replaceImage(parsed.products, a.id, a.image));
  } else if (cmd === 'remove') {
    const a = parseArgs(rest); const parsed = load();
    save(parsed, remove(parsed.products, a.id));
  } else {
    throw new Error(`unknown command "${cmd}". Use: list | next-id | add | set | replace-image | remove`);
  }
} catch (e) {
  console.error('ERROR: ' + e.message);
  process.exit(1);
}
