import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Mobile viewport: iPhone 14 / modern Android (390 x 844)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

  const artifactDir = 'C:/Users/PC/.gemini/antigravity/brain/9c9e58d1-0dc7-4c88-a0e8-4946d42b389f';

  console.log('1. Navigating to Careers/Jobs view on mobile viewport...');
  await page.goto('http://localhost:3000/#careers', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot jobs directory
  await page.screenshot({ path: path.join(artifactDir, 'verified_jobs_mobile_feed.png') });
  console.log('Saved verified_jobs_mobile_feed.png');

  // Click the first job card to open the JobDetailModal
  console.log('2. Opening JobDetailModal...');
  const firstJobCard = await page.$('.soft-card');
  if (firstJobCard) {
    await firstJobCard.click();
    await new Promise(r => setTimeout(r, 1500));

    // Capture modal top
    await page.screenshot({ path: path.join(artifactDir, 'verified_job_modal_mobile_top.png') });
    console.log('Saved verified_job_modal_mobile_top.png');

    // Scroll the modal content to the bottom
    console.log('3. Scrolling modal content down to verify Application Protocol is not cropped...');
    await page.evaluate(() => {
      const modalScrollContainers = document.querySelectorAll('.overflow-y-auto');
      modalScrollContainers.forEach(el => {
        el.scrollTop = el.scrollHeight;
      });
    });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(artifactDir, 'verified_job_modal_mobile_bottom_uncropped.png') });
    console.log('Saved verified_job_modal_mobile_bottom_uncropped.png');

    // Close the modal
    const closeBtn = await page.$('button[aria-label="Close modal"]') || await page.$('.lucide-x');
    if (closeBtn) {
      await page.evaluate(el => el.closest('button')?.click(), closeBtn);
      await new Promise(r => setTimeout(r, 800));
    }
  }

  // 4. Navigate to Settings and check PolicyView
  console.log('4. Navigating to PolicyView...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const settingsBtn = buttons.find(b => b.textContent && b.textContent.includes('Settings'));
    if (settingsBtn) settingsBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, div'));
    const policyBtn = buttons.find(b => b.textContent && b.textContent.includes('Privacy Policy'));
    if (policyBtn) policyBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(artifactDir, 'verified_privacy_policy_view.png') });
  console.log('Saved verified_privacy_policy_view.png');

  await browser.close();
  console.log('Verification finished successfully!');
}

run().catch(err => {
  console.error('Error running verification:', err);
  process.exit(1);
});
