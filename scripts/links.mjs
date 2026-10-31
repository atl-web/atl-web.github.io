import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';

function collect(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collect(path, acc);
    else if (entry.name.endsWith('.html')) acc.push(path);
  }
  return acc;
}

const urls = new Set();
for (const file of collect('dist')) {
  const html = readFileSync(file, 'utf-8');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (target.startsWith('/') && !target.includes('googleapis')) urls.add(target);
  }
}

const failures = [];
for (const url of [...urls].sort()) {
  const response = await fetch(`${BASE}${url}`, { redirect: 'manual' });
  const status = response.status;
  if (status >= 400) failures.push(`${url} -> ${status}`);
}

console.log(`local targets checked: ${urls.size}`);
console.log(failures.length ? failures.join('\n') : 'all local links and assets resolve');
