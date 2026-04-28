import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const checks = [1, 2, 3, 10, 20, 30, 50];
  for (const i of checks) {
    await page.goto(`https://www.gakits.com/New-Arrivals-c68135/list---7-2-----r${i}.html?t=${Date.now()}`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 300));
    const skus = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href*="-p"]')).map(l => l.href.match(/-p(\d+)\.html/)?.[1]).filter(Boolean).slice(0,5);
    });
    console.log(`Page ${i}:`, skus.join(', '));
  }
  
  await browser.close();
})();