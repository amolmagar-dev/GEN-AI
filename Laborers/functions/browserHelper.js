import puppeteer from 'puppeteer';

let page; // Puppeteer page instance
let browser; // Puppeteer browser instance

async function initializeBrowser() {
    browser = await puppeteer.launch({
        headless: false, // Set to true if debugging is not needed
        slowMo: 50,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    });
    page = await browser.newPage();
}

initializeBrowser();

export const functionDeclarations = [
    {
        name: "browserAction",
        parameters: {
            type: "OBJECT",
            properties: {
                action: {
                    type: "STRING",
                    description: "The browser action to perform (e.g., 'navigate', 'click', 'type', 'getCurrentPage').",
                    enum: ["navigate", "click", "type" , "getCurrentPage"]
                },
                params: {
                    type: "OBJECT",
                    description: "Parameters for the specified action (e.g., URL, selector, text, code).",
                    properties: {
                        url: { type: "STRING", description: "URL to navigate to." },
                        selector: { type: "STRING", description: "CSS selector for element." },
                        text: { type: "STRING", description: "Text to type into element." },
                        code: { type: "STRING", description: "JavaScript code to evaluate." }
                    }
                },
            },
            required: ["action"], // 'params' is now optional
        },
        description: "Performs a generic browser action based on the specified action and parameters."
    }
];

export async function browserAction(call) {
    const { action, params } = call;

    try {
        switch (action) {
            case "navigate":
                await page.goto(params.url, { waitUntil: 'domcontentloaded' });
                return { result: `Navigated to ${params.url}` };

            case "click":
                await page.click(params.selector);
                return { result: `Clicked element: ${params.selector}` };

            case "type":
                await page.type(params.selector, params.text);
                return { result: `Typed text into: ${params.selector}` };

            case "evaluate":
                const evalResult = await page.evaluate((code) => eval(code), params.code);
                return { result: `Evaluated code: ${JSON.stringify(evalResult)}` };

            case "getSelectors":
                const selectors = await page.evaluate(() => {
                    let elements = document.querySelectorAll('*');
                    return Array.from(elements).map(el => {
                        try {
                            let selector = el.tagName.toLowerCase();
                            if (el.id) selector += `#${el.id}`;
                            if (el.className) selector += `.${el.className.split(' ').join('.')}`;
                            return selector;
                        } catch (e) {
                            return null;
                        }
                    }).filter(Boolean);
                });
                return { currentPage: await page.url(), selectors };

            case "getCurrentPage":
                const pageContent = await page.content(); 
                return { currentPage: await page.url(), html: pageContent };

            default:
                return { error: `Unknown action: ${action}` };
        }
    } catch (error) {
        return { error: `Browser action failed: ${error.message}` };
    }
}