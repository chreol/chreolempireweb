import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const url = process.env.URL || 'http://localhost:3000/services/transfert';
  const out = process.env.OUT || 'screenshots/transfer-page.png';

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  // wait for the form or modal
  await page.waitForTimeout(1000);
  await page.screenshot({ path: out, fullPage: true });
  console.log('Saved screenshot to', out);
  await browser.close();
})();
