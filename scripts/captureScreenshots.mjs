import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotsDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

console.log('Capturing screenshots of working functionalities...');

async function run() {
  // Try launching system Edge or Chrome, or fallback to bundled chromium
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e1) {
    try {
      browser = await chromium.launch({ channel: 'chrome', headless: true });
    } catch (e2) {
      browser = await chromium.launch({ headless: true });
    }
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });

  const page = await context.newPage();

  // 1. Overview Dashboard
  console.log('1. Capturing Overview Dashboard...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(screenshotsDir, '01_overview_dashboard.png'),
    fullPage: true,
  });

  // 2. Conversation Inbox
  console.log('2. Capturing Conversation Inbox...');
  await page.click('button:has-text("Conversation Inbox")');
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(screenshotsDir, '02_conversation_inbox.png'),
    fullPage: false,
  });

  // 3. Conversation Drawer - M07 Overview & Transcript
  console.log('3. Capturing M07 Conversation Drawer (Transcript)...');
  // Type M07 in filter table
  await page.fill('input[placeholder="Filter table..."]', 'M07');
  await page.waitForTimeout(500);
  // Click on the M07 row
  await page.click('tr:has-text("M07")');
  await page.waitForTimeout(600);

  // Click on Full Transcript tab
  await page.click('button:has-text("Full Transcript")');
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(screenshotsDir, '03_conversation_drawer_m07_transcript.png'),
  });

  // 4. Conversation Drawer - M07 Differentiated Breakdown
  console.log('4. Capturing M07 Conversation Drawer (Differentiated Analysis)...');
  await page.click('button:has-text("Differentiated Breakdown")');
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(screenshotsDir, '04_conversation_drawer_m07_analysis.png'),
  });

  // Close drawer
  await page.click('button[aria-label="Close drawer"]');
  await page.waitForTimeout(800);

  // Clear search
  await page.fill('input[placeholder="Filter table..."]', '');
  await page.waitForTimeout(400);

  // 5. Manager Brief
  console.log('5. Capturing Manager Brief (21 August 2026)...');
  await page.click('button:has-text("Manager Brief")');
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(screenshotsDir, '05_manager_brief_2026_08_21.png'),
    fullPage: true,
  });

  // 6. Routing & Review Workspace
  console.log('6. Capturing Routing & Review Workspace...');
  await page.click('button:has-text("Routing & Review")');
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(screenshotsDir, '06_routing_review_workspace.png'),
    fullPage: false,
  });

  // 7. Exports Engine
  console.log('7. Capturing Exports Engine & Manifest Preview...');
  await page.click('button:has-text("Exports")');
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(screenshotsDir, '07_exports_engine.png'),
    fullPage: true,
  });

  // 8. Import History & Replay Guide
  console.log('8. Capturing Import History & M07 Acceptance Replay Guide...');
  await page.click('button:has-text("Import History")');
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(screenshotsDir, '08_import_history_replay.png'),
    fullPage: true,
  });

  // 9. Settings & Definitions
  console.log('9. Capturing Settings, Metric Definitions & Data Contract...');
  await page.click('button:has-text("Settings & Definitions")');
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(screenshotsDir, '09_settings_definitions_glossary.png'),
    fullPage: true,
  });

  await browser.close();
  console.log('All screenshots captured successfully in /screenshots directory!');
}

run().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
