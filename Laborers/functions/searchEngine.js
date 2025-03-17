import puppeteer from 'puppeteer';
import randomUseragent from 'random-useragent';

export const googleSearchFunctionDeclaration = {
    name: "googleSearch",
    parameters: {
        type: "OBJECT",
        description: "Perform a Google search and retrieve search results.",
        properties: {
            query: {
                type: "STRING",
                description: "The search term to query on Google.",
            },
            maxResults: {
                type: "NUMBER",
                description: "The maximum number of search results to return.",
            }
        },
        required: ["query"],
    },
    description: "Returns an array of search results, containing the title and link of each result."
};

// Function to perform the search
export async function performGoogleSearch(query, maxResults = 10) {
    const browser = await puppeteer.launch({
        headless: true, // Set to true if debugging is not needed
        slowMo: 50,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    });

    const page = await browser.newPage();

    // Set a **desktop User-Agent** to prevent mobile redirects
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Hide Puppeteer detection
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    // Open Google search with language & region settings, forcing the desktop view
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en&gl=us&ie=UTF-8`, {
        waitUntil: 'domcontentloaded',
    });

    // Verify that we are on the desktop version
    const url = page.url();
    if (!url.includes("www.google.com/search")) {
        console.warn("🚨 Redirect detected! Google sent a mobile version or another domain.");
    }

    // Check for CAPTCHA (If Google blocks us)
    const isBlocked = await page.evaluate(() => document.querySelector('div#recaptcha') !== null);
    if (isBlocked) {
        console.log("🚨 Google CAPTCHA detected! Solve it manually.");
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for manual solving
    }

    // Debug: Log the HTML to verify the structure
    const htmlContent = await page.content();
    console.log("🔍 Page Loaded. Verifying structure...");

    // Wait for search results (Try multiple selectors in case one fails)
    await page.waitForSelector('a h3, .tF2Cxc h3', { timeout: 20000 });

    // Extract search results
    const results = await page.evaluate((maxResults) => {
        return Array.from(document.querySelectorAll('a h3, .tF2Cxc h3'))
            .map(el => ({
                title: el.innerText,
                link: el.closest('a') ? el.closest('a').href : null
            }))
            .filter(item => item.link)
            .slice(0, maxResults); // Limit results
    }, maxResults);

    await browser.close();
    return results;
}