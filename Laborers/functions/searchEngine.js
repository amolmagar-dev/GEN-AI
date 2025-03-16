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
};

// Function to perform the search
export async function performGoogleSearch(query, maxResults = 10) {
    const browser = await puppeteer.launch({
        headless: false, // Set to true for automation
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

    // Open Google search with region settings
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en&gl=us`, { waitUntil: 'domcontentloaded' });

    // Check for CAPTCHA
    const isBlocked = await page.evaluate(() => document.querySelector('div#recaptcha') !== null);
    if (isBlocked) {
        console.log("🚨 Google CAPTCHA detected! Solve it manually.");
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 sec
    }

    // Wait for results
    await page.waitForSelector('h3', { timeout: 20000 });

    // Extract search results
    const results = await page.evaluate((maxResults) => {
        return Array.from(document.querySelectorAll('h3'))
            .map(el => ({
                title: el.innerText,
                link: el.parentElement?.href || el.closest('a')?.href || null
            }))
            .filter(item => item.link)
            .slice(0, maxResults); // Limit results
    }, maxResults);

    await browser.close();
    return results;
}

// Function mapping
export const functions = {
    googleSearch: ({ query, maxResults }) => {
        return performGoogleSearch(query, maxResults);
    }
};