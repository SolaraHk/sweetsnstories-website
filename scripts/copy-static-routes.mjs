import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const routes = ['shop', 'products', 'shop/mikan-mango-chiffon', 'custom-cake', 'our-story'];
if (existsSync(join(dist, 'index.html'))) {
  for (const route of routes) {
    const dir = join(dist, route);
    mkdirSync(dir, { recursive: true });
    copyFileSync(join(dist, 'index.html'), join(dir, 'index.html'));
  }
  console.log(`copied SPA aliases: ${routes.join(', ')}`);
}
