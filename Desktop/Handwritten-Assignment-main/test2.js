const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

    await page.goto(`file://${__dirname}/index.html`, { waitUntil: 'networkidle0' });

    // Test inserting table
    await page.click('#insert-table-btn');

    // Test dictation
    await page.click('#dictate-btn');

    // Test text file
    // file inputs are trickier, skip for now.

    // Type in editor
    await page.type('#rich-editor', 'Hello World!');

    // Test zoom
    await page.click('#zoom-in');
    await page.click('#zoom-out');

    // Test clear
    // We mock prompt/confirm to avoid hanging
    await page.evaluate(() => window.confirm = () => true);
    await page.click('#clear-btn');

    await browser.close();
    console.log('Interactions finished successfully.');
})();
