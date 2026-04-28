import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://www.gakits.com/';
const OUTPUT_FILE = path.join(process.cwd(), 'scraper', 'products.json');
const META_FILE = path.join(process.cwd(), 'scraper', 'meta.json');

const BASE_CATEGORY = '/New-Arrivals-c68135/list---7-2-----r';
const START_PAGE = parseInt(process.argv.find(a => a.startsWith('--start='))?.split('=')[1]) || 1;

const OPTS = {
  full: process.argv.includes('--full'),
  new: process.argv.includes('--new'),
  preview: process.argv.includes('--preview'),
  pages: (() => {
    const arg = process.argv.find(a => a.startsWith('--pages='));
    return arg ? parseInt(arg.split('=')[1]) : 5;
  })()
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
    'USA', 'Mexico', 'Peru', 'Chile', 'Ecuador', 'Uruguay', 'Paraguay',
    'Ghana', 'Nigeria', 'Cameroon', 'Senegal', 'Morocco', 'Egypt',
    'Belgium', 'Croatia', 'Denmark', 'Sweden', 'Poland', 'Switzerland',
    'Croatia', 'Czech', 'Norway', 'Austria', 'Scotland', 'Ireland', 'Wales'
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

function categorizeProduct(name) {
  const lower = name.toLowerCase();
  if (lower.includes('player version') || lower.includes('player version')) return 'Player Version';
  if (lower.includes('retro')) return 'Retro';
  if (lower.includes('training') || lower.includes('tracksuit') || lower.includes('sweater')) return 'Training';
  if (lower.includes('windbreaker') || lower.includes('jacket')) return 'Outerwear';
  if (lower.includes('kids') || lower.includes('童')) return 'Kids';
  if (lower.includes('women') || lower.includes('女')) return 'Women';
  return 'Jersey';
}

async function scrapePage(page, pageNum, existingSkus = [], isIncremental = false) {
  const cacheBuster = Date.now();
  const pageUrl = `${BASE_URL}${BASE_CATEGORY}${pageNum}.html?t=${cacheBuster}`;
  console.log(`  Page ${pageNum}...`);
  
  try {
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await delay(200);
    
    const items = await page.evaluate(({ existingSkuArray, incremental }) => {
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
        
        if (img && productUrl.includes('-p') && sku) {
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
            if (isNew || !incremental) {
              results.push({ name, price, image: imgUrl, link: productUrl, sku });
            }
          }
        }
      });
      
      return results;
    }, { existingSkuArray: existingSkus, incremental: isIncremental });
    
    console.log(`    ${items.length} products`);
    
    return items;
    
  } catch (e) {
    console.error(`    Error: ${e.message}`);
    return [];
  }
}

async function loadExistingProducts() {
  try {
    const data = await fs.readFile(OUTPUT_FILE, 'utf-8');
    const products = JSON.parse(data);
    const skus = products.map(p => p.sku).filter(Boolean);
    const latestDate = products[0]?.createdAt || null;
    console.log(`Loaded: ${products.length} products, latest date: ${latestDate || 'none'}`);
    return { products, skus, latestDate };
  } catch {
    console.log('No existing products.json, full scrape needed');
    return { products: [], skus: [], latestDate: null };
  }
}

async function saveMeta(stats) {
  const meta = {
    lastScrape: new Date().toISOString(),
    ...stats
  };
  await fs.writeFile(META_FILE, JSON.stringify(meta, null, 2), 'utf-8');
}

async function scrapeAll() {
  const mode = OPTS.full ? 'FULL SCRAPE' : OPTS.new ? 'INCREMENTAL' : 'PREVIEW';
  const limitPages = OPTS.preview ? 2 : (OPTS.new ? 3 : (OPTS.full ? 300 : (parseInt(OPTS.pages) || 5)));
  
  console.log(`\n=== Gakits Scraper [${mode}] ===`);
  console.log(`Pages: ${limitPages}\n`);
  
  const { products: existingProducts, skus: existingSkus, latestDate } = await loadExistingProducts();
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  let allItems = [];
  
  for (let p = START_PAGE; p <= START_PAGE + limitPages - 1; p++) {
    const items = await scrapePage(page, p, OPTS.new ? existingSkus : [], OPTS.new);
    allItems.push(...items);
    
    if (OPTS.new && items.length === 0) {
      console.log('  No new products, stopping...');
      break;
    }
    
    await delay(300);
  }
  
  await browser.close();
  
  const validItems = allItems.filter(i => i.name && i.name.length > 5);
  const deduped = validItems.reduce((acc, p) => {
    if (!acc.find(e => e.sku === p.sku)) acc.push(p);
    return acc;
  }, []);
  
  const newItems = deduped.filter(p => !existingProducts.find(e => e.sku === p.sku));
  
  const finalProducts = (existingProducts.length > 0 ? existingProducts : []).concat(newItems).map((p, i) => ({
    id: i + 1,
    sku: p.sku,
    name: p.name,
    team: extractTeam(p.name),
    league: 'New Arrivals',
    season: extractSeason(p.name),
    price: p.price?.replace(/[^0-9.]/g, '') || '14.50',
    image: p.image,
    category: categorizeProduct(p.name),
    type: p.name.toLowerCase().includes('player') ? 'Player Version' : 'Fan Version',
    description: p.name,
    link: p.link?.startsWith('http') ? p.link : `${BASE_URL}${p.link}`,
    scrapedAt: new Date().toISOString()
  }));
  
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(finalProducts, null, 2), 'utf-8');
  
  const newCount = finalProducts.length - existingProducts.length;
  await saveMeta({
    mode,
    totalProducts: finalProducts.length,
    newAdded: newCount,
    pagesScraped: limitPages
  });
  
  console.log(`\n=== Done ===`);
  console.log(`Total: ${finalProducts.length} products`);
  console.log(`New: ${newCount}`);
  
  if (finalProducts.length > 0) {
    console.log('\nLatest products:');
    finalProducts.slice(0, 3).forEach(p => console.log(`  - ${p.name} [SKU: ${p.sku}]`));
  }
  
  return finalProducts;
}

scrapeAll().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});