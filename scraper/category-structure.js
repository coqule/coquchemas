import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://www.gakits.com/';
const OUTPUT_FILE = path.join(process.cwd(), 'scraper', 'categories.json');

const MAIN_CATEGORIES = [
  { url: '/New-Arrivals-c68135.html', name: 'New Arrivals' },
  { url: '/National-Teams-c67964.html', name: 'National Teams' },
  { url: '/Spain-La-Liga-c67995.html', name: 'Spain - La Liga' },
  { url: '/Premier-League-c68002.html', name: 'Premier League' },
  { url: '/France-Ligue-1-c68035.html', name: 'France - Ligue 1' },
  { url: '/Bundesliga-c68007.html', name: 'Bundesliga' },
  { url: '/Italy-Serie-A-c67980.html', name: 'Italy - Serie A' },
  { url: '/Brazil-c67965.html', name: 'Brazil' },
  { url: '/Mexico-Liga-MLS-c68042.html', name: 'Mexico / MLS' },
  { url: '/NBA-c68056.html', name: 'NBA' },
  { url: '/Retro-Jersey-c67969.html', name: 'Retro Jersey' },
  { url: '/F1-Rugby-NFL-c68082.html', name: 'F1 / Rugby / NFL' },
  { url: '/Training-Tracksuit-c68099.html', name: 'Training Tracksuit' },
  { url: '/Player-Version-c68075.html', name: 'Player Version' },
  { url: '/Star-Player-c68027.html', name: 'Star Player' },
  { url: '/Kids-Jersey-c68093.html', name: 'Kids Jersey' },
  { url: '/Women-Jersey-c68094.html', name: 'Women Jersey' },
  { url: '/Windbreaker-c68109.html', name: 'Windbreaker' },
  { url: '/Classic-Fashion-c88678.html', name: 'Classic / Fashion' },
  { url: '/Polo-c68120.html', name: 'Polo' },
  { url: '/Sock-c68100.html', name: 'Sock' },
  { url: '/Trousers-c68131.html', name: 'Trousers' },
  { url: '/Shorts-Pants-c68074.html', name: 'Shorts / Pants' },
  { url: '/Long-Sleeve-Jersey-c67992.html', name: 'Long Sleeve Jersey' },
  { url: '/Jacket-Tracksuit-c68088.html', name: 'Jacket Tracksuit' },
  { url: '/IRAN-c91443.html', name: 'IRAN' },
  { url: '/RM-c68034.html', name: 'Real Madrid' },
  { url: '/BA-c67996.html', name: 'Barcelona' },
  { url: '/PSG-c68036.html', name: 'PSG' },
  { url: '/LIV-c68052.html', name: 'Liverpool' },
  { url: '/CFC-c68050.html', name: 'Chelsea' },
  { url: '/Man-City-c68033.html', name: 'Man City' },
  { url: '/M-Utd-c68049.html', name: 'Man Utd' },
  { url: '/ARS-c68037.html', name: 'Arsenal' },
  { url: '/AC-c67983.html', name: 'AC Milan' },
  { url: '/In-Milan-c68048.html', name: 'Inter Milan' },
  { url: '/Napoli-c68047.html', name: 'Napoli' },
  { url: '/Roma-c68006.html', name: 'Roma' },
  { url: '/BFC-c68011.html', name: 'Bayern' },
  { url: '/BVB-c68008.html', name: 'Dortmund' },
  { url: '/Flamengo-c67966.html', name: 'Flamengo' },
  { url: '/Palmeiras-c68045.html', name: 'Palmeiras' },
  { url: '/MLS-c68064.html', name: 'MLS' },
  { url: '/MLB-c68128.html', name: 'MLB' },
  { url: '/NFL-c68103.html', name: 'NFL' },
  { url: '/F1-c68083.html', name: 'F1' },
  { url: '/Rugby-c68084.html', name: 'Rugby' },
  { url: '/Argentina-c67986.html', name: 'Argentina' },
  { url: '/Portugal-c68044.html', name: 'Portugal' },
  { url: '/Chile-c68086.html', name: 'Chile' },
  { url: '/Netherlands-c80265.html', name: 'Netherlands' },
];

async function getCategories() {
  console.log('=== Gakits Categories (Parent-Child) ===\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const results = [];
  
  for (const cat of MAIN_CATEGORIES) {
    console.log(`Processing: ${cat.name}...`);
    
    try {
      await page.goto(`${BASE_URL}${cat.url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      const subcategories = await page.evaluate(() => {
        const subs = [];
        const allLinks = document.querySelectorAll('a[href*="-c"]');
        
        allLinks.forEach(link => {
          const href = link.getAttribute('href') || '';
          const text = link.textContent?.trim() || '';
          
          if (href && href.includes('-c') && text && 
              text.length > 2 && text.length < 40 &&
              !href.match(/^\/[^-]+-c\d{5,6}\.html$/) &&
              !href.includes('/h-') &&
              !href.includes('/module-') &&
              !text.includes('$') &&
              !text.includes('USD') &&
              !text.includes('GBP') &&
              !text.includes('EUR')) {
            subs.push({
              name: text,
              url: href
            });
          }
        });
        
        const unique = subs.reduce((acc, s) => {
          if (!acc.find(x => x.name === s.name)) acc.push(s);
          return acc;
        }, []);
        
        return unique.slice(0, 15);
      });
      
      results.push({
        name: cat.name,
        url: cat.url,
        productCount: 0,
        subcategories
      });
      
      console.log(`  Found ${subcategories.length} subcategories`);
      
    } catch (e) {
      console.log(`  Error: ${e.message}`);
      results.push({
        name: cat.name,
        url: cat.url,
        productCount: 0,
        subcategories: []
      });
    }
  }
  
  await browser.close();
  
  const data = {
    lastUpdated: new Date().toISOString(),
    total: results.length,
    categories: results
  };
  
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');
  
  console.log(`\n=== Results ===`);
  console.log(`Total main categories: ${results.length}`);
  
  results.forEach(cat => {
    console.log(`\n📁 ${cat.name}`);
    if (cat.subcategories.length > 0) {
      cat.subcategories.forEach(sub => {
        console.log(`   └─ ${sub.name}`);
      });
    } else {
      console.log(`   └─ (no subcategories)`);
    }
  });
  
  console.log(`\nSaved to: ${OUTPUT_FILE}`);
  
  return data;
}

getCategories().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});