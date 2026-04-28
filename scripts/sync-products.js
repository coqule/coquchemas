import fs from 'fs/promises';
import path from 'path';

const SOURCE = path.join(process.cwd(), 'scraper', 'products.json');
const DEST = path.join(process.cwd(), 'web', 'src', 'data', 'products.json');

try {
  await fs.copyFile(SOURCE, DEST);
  console.log('✅ products.json synced to web/src/data/');
} catch (err) {
  console.error('❌ Error syncing products.json:', err.message);
  process.exit(1);
}
