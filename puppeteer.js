import puppeteer from 'puppeteer';
import randomUseragent from 'random-useragent';

export async function searchGoogle(query) {
    const browser = await puppeteer.launch({
        headless: false, // Change to true after debugging
        slowMo: 50,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    });

    const page = await browser.newPage();

    // Set User-Agent to avoid detection
    const userAgent = randomUseragent.getRandom() || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36';
    await page.setUserAgent(userAgent);

    // Hide Puppeteer detection
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    // Open Google search with language & region settings
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en&gl=us`, { waitUntil: 'domcontentloaded' });

    // Check for CAPTCHA
    const isBlocked = await page.evaluate(() => document.querySelector('div#recaptcha') !== null);
    if (isBlocked) {
        console.log("🚨 Google CAPTCHA detected! Solve it manually.");
        await new Promise(resolve => setTimeout(resolve, 30000));  // Wait 30 sec
    }

    // Debug: Print HTML content to check structure
    const htmlContent = await page.content();
    console.log(htmlContent);

    // Wait for search results
    await page.waitForSelector('h3', { timeout: 20000 });

    // Extract results
    const results = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('h3')).map(el => ({
            title: el.innerText,
            link: el.parentElement?.href || el.closest('a')?.href || null
        })).filter(item => item.link);
    });

    await browser.close();
    return results;
}
const query = "naukari";

(async () => {
    try {
        const results = await searchGoogle(query);
        console.log("🔍 Search Results:", results);
    } catch (error) {
        console.error("❌ Error:", error);
    }
})();