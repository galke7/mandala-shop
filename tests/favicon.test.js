import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const manifest = JSON.parse(
  readFileSync(new URL('../images/favicon_io/site.webmanifest', import.meta.url), 'utf8')
);

describe('favicon wiring', () => {
  it('links the 32x32 png favicon with a relative path', () => {
    expect(html).toContain('href="images/favicon_io/favicon-32x32.png"');
  });
  it('links an apple-touch-icon', () => {
    expect(html).toContain('rel="apple-touch-icon"');
  });
  it('links the web manifest', () => {
    expect(html).toContain('href="images/favicon_io/site.webmanifest"');
  });
  it('uses no root-absolute favicon paths (subpath-safe)', () => {
    expect(html).not.toContain('href="/favicon');
  });
  it('manifest has a non-empty name and only relative icon src', () => {
    expect(manifest.name).toBeTruthy();
    expect(manifest.icons.every((i) => !i.src.startsWith('/'))).toBe(true);
  });
});
