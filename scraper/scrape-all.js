import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://www.gakits.com/';
const OUTPUT_FILE = path.join(process.cwd(), 'scraper', 'products.json');
const META_FILE = path.join(process.cwd(), 'scraper', 'meta.json');

const CATEGORIES = [
  { url: '/New-Arrivals-c68135.html', name: 'New Arrivals', limit: 300 },
  { url: '/National-Teams-c67964.html', name: 'National Teams', limit: 50 },
  { url: '/Spain-La-Liga-c67995.html', name: 'Spain - La Liga', limit: 50 },
  { url: '/Premier-League-c68002.html', name: 'Premier League', limit: 50 },
  { url: '/France-Ligue-1-c68035.html', name: 'France - Ligue 1', limit: 50 },
  { url: '/Bundesliga-c68007.html', name: 'Bundesliga', limit: 50 },
  { url: '/Italy-Serie-A-c67980.html', name: 'Italy - Serie A', limit: 50 },
  { url: '/Brazil-c67965.html', name: 'Brazil', limit: 50 },
  { url: '/Mexico-Liga-MLS-c68042.html', name: 'Mexico / MLS', limit: 50 },
  { url: '/Retro-Jersey-c67969.html', name: 'Retro Jersey', limit: 50 },
  { url: '/Player-Version-c68075.html', name: 'Player Version', limit: 30 },
  { url: '/F1-Rugby-NFL-c68082.html', name: 'F1 / Rugby / NFL', limit: 30 },
  { url: '/Training-Tracksuit-c68099.html', name: 'Training Tracksuit', limit: 30 },
];

const OPTS = {
  full: process.argv.includes('--full'),
  new: process.argv.includes('--new'),
  preview: process.argv.includes('--preview')
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function extractTeam(name) {
  const teams = [
    'Spain', 'Germany', 'France', 'Argentina', 'Colombia', 'Brazil', 'Italy',
    'Liverpool', 'Chelsea', 'Arsenal', 'Real Madrid', 'Barcelona', 'Atletico Madrid',
    'Bayern', 'PSG', 'Juventus', 'AC Milan', 'Inter Milan', 'Napoli', 'Roma',
    'Portugal', 'Netherlands', 'England', 'Manchester', 'Man City', 'Man Utd',
    'Tottenham', 'West Ham', 'Newcastle', 'Ajax', 'Benfica', 'Porto',
    'Flamengo', 'Sao Paulo', 'Palmeiras', 'Corinthians', 'Botafogo',
    'USA', 'Mexico', 'Colombia', 'Peru', 'Chile', 'Ecuador', 'Uruguay', 'Paraguay'
  ];
  const lower = name.toLowerCase();
  for (const team of teams) {
    if (lower.includes(team.toLowerCase())) return team;
  }
  return '';
}

function extractSeason(name) {
  const match = name.match(/(\d{4}[\/]\d{2,4}|\d{4})/);
  return match ? match[1] : '2024/25';
}

function extractSku(link) {
  const match = link.match(/-p(\d+)\.html/);
  return match ? match[1] : '';
}

async function scrapeCategory(page, category, existingSkus = []) {
  const { url, name: categoryName, limit } = category;
  console.log(`\nScraping: ${categoryName}`);
  
  const products = [];
  const baseUrl = `${BASE_URL}${url}`;
  const skuSet = new Set(existingSkus);
  
  const effectiveLimit = OPTS.preview ? 2 : limit;
  
  for (let pageNum = 1; pageNum <= effectiveLimit; pageNum++) {
    const pageUrl = pageNum === 1 ? baseUrl : baseUrl.replace('.html', `-${pageNum}.html`);
    
    try {
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await delay(1500);
      
      const items = await page.evaluate((existingSkuArray) => {
        const skuSet = new Set(existingSkuArray);
        const results = [];
        const productLinks = document.querySelectorAll('a[href*="-p"]');
        
        productLinks.forEach((link) => {
          const img = link.querySelector('img');
          const parent = link.parentElement;
          const grandparent = parent?.parentElement;
          
          let name = '';
          let price = '';
          let imgUrl = '';
          let productUrl = link.href || '';
          const sku = productUrl.match(/-p(\d+)\.html/)?.[1] || '';
          
          if (img && productUrl.includes('-p')) {
            imgUrl = img.src || img.dataset?.src || '';
            name = link.title || img.alt || link.textContent?.trim() || '';
            
            const priceEl = parent?.querySelector?.('.price') || grandparent?.querySelector?.('.price');
            if (priceEl) price = priceEl.textContent?.trim() || '';
            
            if (!price) {
              const nextText = parent?.nextSibling?.textContent || grandparent?.nextSibling?.textContent;
              if (nextText?.includes('$')) price = nextText.trim();
            }
            
            if (name && name.length > 5) {
              const isNew = !skuSet.has(sku);
              results.push({ name, price, image: imgUrl, link: productUrl, sku, isNew });
            }
          }
        });
        
        return results;
      }, Array.from(skuSet));
      
      const newItems = items.filter(i => i.isNew);
      products.push(...newItems);
      console.log(`  Page ${pageNum}: ${newItems.length} new / ${items.length} total`);
      
      if (items.length === 0) {
        console.log('  No more products, stopping...');
        break;
      }
      
    } catch (e) {
      console.error(`  Error page ${pageNum}: ${e.message}`);
    }
    
    await delay(800);
  }
  
  return products.map(p => ({
    id: '',
    sku: p.sku,
    name: p.name,
    team: extractTeam(p.name),
    league: categoryName,
    season: extractSeason(p.name),
    price: p.price?.replace(/[^0-9.]/g, '') || '14.50',
    image: p.image,
    category: 'Jersey',
    type: p.name.toLowerCase().includes('player') ? 'Player Version' : 'Fan Version',
    description: p.name,
    link: p.link?.startsWith('http') ? p.link : `${BASE_URL}${p.link}`
  }));
}

async function loadExistingProducts() {
  try {
    const data = await fs.readFile(OUTPUT_FILE, 'utf-8');
    const products = JSON.parse(data);
    const skus = products.map(p => p.sku).filter(Boolean);
    console.log(`Loaded existing products: ${products.length}, SKUs: ${skus.size}`);
    return { products, skus };
  } catch {
    console.log('No existing products.json found, will do full scrape');
    return { products: [], skus: [] };
  }
}

async function saveMeta(totalProducts) {
  const meta = {
    lastScrape: new Date().toISOString(),
    totalProducts,
    mode: OPTS.full ? 'full' : OPTS.new ? 'incremental' : 'preview'
  };
  await fs.writeFile(META_FILE, JSON.stringify(meta, null, 2), 'utf-8');
  console.log('\nMeta saved:', meta);
}

async function scrapeAll() {
  const mode = OPTS.full ? 'FULL SCRAPE' : OPTS.new ? 'INCREMENTAL (new only)' : 'PREVIEW';
  console.log(`\n=== Gakits Scraper [${mode}] ===\n`);
  
  const { products: existingProducts, skus: existingSkus } = await loadExistingProducts();
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  let newProducts = [];
  
  for (const cat of CATEGORIES) {
    const prods = await scrapeCategory(page, cat, Array.from(existingSkus));
    newProducts.push(...prods);
    
    if (OPTS.preview) break;
  }
  
  await browser.close();
  
  const allProducts = OPTS.new 
    ? [...existingProducts, ...newProducts]
    : newProducts;
  
  const deduped = allProducts.reduce((acc, p) => {
    if (!acc.find(e => e.sku === p.sku)) acc.push(p);
    return acc;
  }, []);
  
  const finalProducts = deduped.map((p, i) => ({ ...p, id: i + 1 }));
  
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(finalProducts, null, 2), 'utf-8');
  await saveMeta(finalProducts.length);
  
  console.log(`\n=== Total: ${finalProducts.length} products saved ===`);
  console.log(`  New added: ${newProducts.length}`);
  console.log(`  Mode: ${mode}`);
  
  if (finalProducts.length > 0) {
    console.log('\nSample products:');
    finalProducts.slice(0, 3).forEach(p => console.log(`  - ${p.name} [SKU: ${p.sku}]`));
  }
  
  return finalProducts;
}

scrapeAll().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});