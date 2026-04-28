import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'scraper', 'products.json');

async function getProductCounts() {
  console.log('=== Pre-Scraper: Getting Product Counts ===\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const NEW_ARRIVALS_URL = 'https://www.gakits.com/New-Arrivals-c68135/list---7-2-----r1.html';
  
  try {
    await page.goto(NEW_ARRIVALS_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    const total = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      if (h1) {
        const text = h1.textContent || '';
        const match = text.match(/\((\d+)\)/);
        if (match) return parseInt(match[1]);
      }
      return 0;
    });
    
    await browser.close();
    return total;
  } catch (e) {
    await browser.close();
    return 0;
  }
}

async function loadExistingProducts() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data);
    return {
      count: products.length,
      skus: new Set(products.map(p => p.sku).filter(Boolean)),
      firstProduct: products[0] || null,
      lastProduct: products[products.length - 1] || null
    };
  } catch {
    return { count: 0, skus: new Set(), firstProduct: null, lastProduct: null };
  }
}

async function preScrape() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║            PRE-SCRAPER: Resumen de Productos               ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  const total = await getProductCounts();
  const existing = await loadExistingProducts();
  
  console.log('┌──────────────────────────────────────────────────────────────┐');
  console.log('│ PRODUCTOS EN NEW ARRIVALS (gakits.com)                    │');
  console.log('├──────────────────────────────────────────────────────────────┤');
  console.log(`│ ${'Total New Arrivals'.padEnd(25)} ${total.toString().padStart(10)} productos │`);
  console.log('└──────────────────────────────────────────────────────────────┘');
  
  console.log('\n┌──────────────────────────────────────────────────────────────┐');
  console.log('│ PRODUCTOS ACTUALES (products.json)                          │');
  console.log('├──────────────────────────────────────────────────────────────┤');
  console.log(`│ ${'Productos guardados'.padEnd(25)} ${existing.count.toString().padStart(10)}       │`);
  
  if (existing.firstProduct) {
    console.log(`│ ${'Último agregado'.padEnd(25)} ${existing.firstProduct.name.substring(0, 20).padStart(10)} │`);
    console.log(`│ ${'SKU'.padEnd(25)} ${(existing.firstProduct.sku || 'N/A').padStart(10)}       │`);
  }
  console.log('└──────────────────────────────────────────────────────────────┘');
  
  const newProducts = total - existing.count;
  
  console.log('\n┌──────────────────────────────────────────────────────────────┐');
  console.log('│ RESUMEN DE SCRAPER                                          │');
  console.log('├──────────────────────────────────────────────────────────────┤');
  console.log(`│ ${'Productos nuevos'.padEnd(25)} ${newProducts.toString().padStart(10)}       │`);
  console.log(`│ ${'Productos existentes'.padEnd(25)} ${existing.count.toString().padStart(10)}       │`);
  console.log(`│ ${'Total después scrape'.padEnd(25)} ${total.toString().padStart(10)}       │`);
  console.log('└──────────────────────────────────────────────────────────────┘');
  
  return { total, existing: existing.count, newProducts };
}

preScrape().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});