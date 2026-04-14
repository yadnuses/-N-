const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:8080';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('❌ Console error:', msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
    console.log('❌ Page error:', err.message);
  });

  // ===== Test 1: index.html intro flow =====
  console.log('=== Test 1: index.html intro flow ===');
  await page.goto(`${BASE_URL}/index.html`);
  await page.waitForTimeout(1000);

  await page.waitForSelector('#next-btn');
  await page.click('#next-btn');
  await page.waitForTimeout(1000);

  await page.waitForSelector('#item-camera.visible');
  await page.click('#item-camera');
  await page.waitForTimeout(1500);

  await page.waitForSelector('#photo-slot-1.active');
  await page.click('#photo-slot-1');
  await page.waitForTimeout(600);

  await page.click('#modal-close-btn');
  await page.waitForTimeout(1000);

  for (let i = 0; i < 3; i++) {
    await page.waitForSelector('#next-btn');
    await page.click('#next-btn');
    await page.waitForTimeout(1000);
  }

  await page.fill('#search-input', '云处村');
  await page.click('#search-btn');
  await page.waitForTimeout(2500);

  await page.waitForSelector('#next-btn');
  await page.click('#next-btn');
  await page.waitForTimeout(1000);

  await page.waitForSelector('#email-toast.show');
  await page.click('#email-toast-open');
  await page.waitForTimeout(800);

  await page.click('#email-confirm-btn');
  await page.waitForTimeout(1000);

  await page.waitForSelector('#photo-slot-2.active');
  await page.click('#photo-slot-2');
  await page.waitForTimeout(600);

  await page.click('#modal-close-btn');
  await page.waitForTimeout(1000);

  await page.waitForSelector('#next-btn');
  await page.click('#next-btn');
  await page.waitForTimeout(2500);

  const exploreBtn = await page.locator('#explore-btn').count();
  console.log(`Explore button present: ${exploreBtn > 0}`);

  if (exploreBtn > 0) {
    await page.click('#explore-btn');
    await page.waitForURL('**/yunchu-gov.html', { timeout: 8000 });
    console.log('✅ Navigated to yunchu-gov.html');
  }

  console.log(`Test 1 console errors: ${consoleErrors.length}`);

  // ===== Test 2: intranet.html save/load =====
  console.log('\n=== Test 2: intranet.html save/load ===');
  await page.goto(`${BASE_URL}/intranet.html`);
  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    localStorage.setItem('yunchu_save', JSON.stringify({
      chatProgress: 8,
      maxProgress: 8,
      radioStarted: false,
      foerStarted: false,
      shadowStarted: false,
      researchStarted: false,
      revealStarted: false
    }));
    location.reload();
  });

  await page.waitForTimeout(3000);

  const saveData = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('yunchu_save') || '{}');
  });
  console.log('Save data after reload:', saveData);
  console.log(`chatProgress restored: ${saveData.chatProgress === 8}`);

  // ===== Test 3: slider backtrack =====
  console.log('\n=== Test 3: progress slider backtrack ===');
  const sliderTrackExists = await page.locator('#progress-slider-track').count() > 0;
  const sliderThumbExists = await page.locator('#progress-slider-thumb').count() > 0;
  console.log(`Slider track exists: ${sliderTrackExists}`);
  console.log(`Slider thumb exists: ${sliderThumbExists}`);

  let panelBeforeSlider = null;
  let panelAfterSlider = null;

  if (sliderTrackExists && sliderThumbExists) {
    panelBeforeSlider = await page.evaluate(() => {
      const active = document.querySelector('.page-panel.active');
      return active ? active.id : null;
    });
    console.log(`Active panel before slider: ${panelBeforeSlider}`);

    const track = await page.locator('#progress-slider-track').boundingBox();
    if (track) {
      await page.mouse.click(track.x + track.width / 2, track.y + track.height - 20);
      await page.waitForTimeout(1200);
      console.log('Clicked on slider track near bottom');
    }

    panelAfterSlider = await page.evaluate(() => {
      const active = document.querySelector('.page-panel.active');
      return active ? active.id : null;
    });
    console.log(`Active panel after slider: ${panelAfterSlider}`);
  }

  const choiceBtns = await page.locator('.choice-btn').count();
  console.log(`Choice buttons available: ${choiceBtns}`);

  await page.screenshot({ path: '/tmp/test3-intranet-slider.png', fullPage: true });

  // Summary
  const summary = {
    test1_introFlow: {
      navigatedToGov: exploreBtn > 0,
      consoleErrors: consoleErrors.length,
      errorMessages: consoleErrors
    },
    test2_localStorage: {
      chatProgressRestored: saveData.chatProgress === 8,
      saveData
    },
    test3_slider: {
      sliderTrackExists,
      sliderThumbExists,
      panelChanged: panelBeforeSlider !== panelAfterSlider,
      panelBefore: panelBeforeSlider,
      panelAfter: panelAfterSlider,
      choicesAvailable: choiceBtns
    }
  };

  console.log('\n=== Summary ===');
  console.log(JSON.stringify(summary, null, 2));

  // Write result file
  const fs = require('fs');
  fs.writeFileSync('/tmp/test-core-flow-result.json', JSON.stringify(summary, null, 2));
  console.log('\nResult saved to /tmp/test-core-flow-result.json');

  await browser.close();
})();
