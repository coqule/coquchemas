import { chromium } from 'playwright';

const BASE_URL = 'https://www.gakits.com/';

const CATEGORIES = [
  // Principales
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
  // Subcategorías principales
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
  // Equipos adicionales
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

async function getCounts() {
  console.log('=== Gakits Product Counts ===\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  let total = 0;
  const results = [];
  
  for (const cat of CATEGORIES) {
    try {
      await page.goto(`${BASE_URL}${cat.url}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      
      const count = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        if (h1) {
          const text = h1.textContent || '';
          const match = text.match(/\((\d+)\)/);
          if (match) return parseInt(match[1]);
        }
        const countEl = document.querySelector('[class*="count"], [id*="count"], .total');
        if (countEl) {
          const text = countEl.textContent || '';
          const match = text.match(/\d+/);
          if (match) return parseInt(match[0]);
        }
        const products = document.querySelectorAll('a[href*="-p"]').length;
        return products;
      });
      
      results.push({ category: cat.name, count });
      total += count;
      console.log(`${cat.name}: ${count}`);
      
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.log(`${cat.name}: ERROR - ${e.message}`);
    }
  }
  
  await browser.close();
  
  console.log(`\n=== TOTAL PRODUCTS: ${total} ===`);
  
  return { categories: results, total };
}

getCounts().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});