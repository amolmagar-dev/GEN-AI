import puppeteer from 'puppeteer';

class BrowserAdapter {
    constructor() {
        if (!BrowserAdapter.instance) {
            this.browser = null;
            this.page = null;
            BrowserAdapter.instance = this;
        }
        return BrowserAdapter.instance;
    }

    async init() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: false,
                slowMo: 100,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-blink-features=AutomationControlled',
                    '--start-maximized' // Opens the browser maximized
                ]
            });

            this.page = await this.browser.newPage();

            // Get the available screen width and height dynamically
            const { width, height } = await this.page.evaluate(() => ({
                width: window.screen.availWidth,
                height: window.screen.availHeight
            }));

            // Set the viewport dynamically to match the full available screen size
            await this.page.setViewport({
                width,
                height,
                deviceScaleFactor: 1
            });
        }
        return this.page;
    }

    async navigate({ url }) {
        if (!this.page) await this.init();
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }

    async takeScreenshot({ filepath = 'screenshot.png' }) {
        if (!this.page) await this.init();
        await this.page.screenshot({ path: filepath });
    }

    async getText({ selector }) {
        if (!this.page) await this.init();
        return this.page.$eval(selector, el => el.innerText);
    }

    async getAttribute({ selector, attribute }) {
        if (!this.page) await this.init();
        return this.page.$eval(selector, (el, attr) => el.getAttribute(attr), attribute);
    }

    async click({ selector }) {
        if (!this.page) await this.init();
        await this.page.click(selector);
    }

    async type({ selector, text }, delay = 100) {
        if (!this.page) await this.init();
        await this.page.type(selector, text, { delay });
    }

    async waitForSelector({ selector, timeout = 5000 }) {
        if (!this.page) await this.init();
        await this.page.waitForSelector(selector, { timeout });
    }

    async evaluate({ callback, ...args }) {
        if (!this.page) await this.init();
        return this.page.evaluate(callback, ...args);
    }

    async getLinks() {
        if (!this.page) await this.init();
        return this.page.$$eval('a', anchors => anchors.map(a => a.href));
    }

    async getAllText({ selector }) {
        if (!this.page) await this.init();
        return this.page.$$eval(selector, elements => elements.map(el => el.innerText));
    }

    async extractInteractiveElements({ filterText = '', timeout = 5000 }) {
        if (!this.page) await this.init();

        // Wait for at least one interactive element to be present
        await this.page.waitForSelector('button, a, input, select, textarea', { timeout });

        return await this.page.evaluate((filterText) => {
            const allElements = Array.from(document.querySelectorAll('button, a, input, select, textarea'))
                .map(el => ({
                    tag: el.tagName.toLowerCase(),
                    id: el.id || null,
                    class: el.className || null,
                    name: el.getAttribute('name') || null,
                    ariaLabel: el.getAttribute('aria-label') || null,
                    text: el.innerText.trim().slice(0, 100), // Limit text length
                    type: el.getAttribute('type') || null,
                    href: el.tagName === 'A' ? el.getAttribute('href') : null,
                    placeholder: el.getAttribute('placeholder') || null,
                }));

            // Apply filter
            const filteredElements = allElements.filter(el =>
                el.text.toLowerCase().includes(filterText.toLowerCase()) ||
                (el.ariaLabel && el.ariaLabel.toLowerCase().includes(filterText.toLowerCase())) ||
                (el.placeholder && el.placeholder.toLowerCase().includes(filterText.toLowerCase()))
            );

            // If no elements match, return all elements
            // return filteredElements.length > 0 ? filteredElements : allElements;
            return filteredElements
        }, filterText);
    }

    async findURL({ query }) {
        if (!this.page) await this.init();

        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

        // Wait for search results to load
        await this.page.waitForSelector('a h3');

        // Extract the first organic result URL
        const firstResult = await this.page.evaluate(() => {
            const result = document.querySelector('a h3');
            return result ? result.closest('a').href : null;
        });

        return firstResult;
    }

    async getHtmlSnap({ type = 'full' }) {
        if (!this.page) await this.init();

        return await this.page.evaluate((type) => {
            if (type === 'screen') {
                return document.body.innerHTML; // Only visible content
            }
            return document.documentElement.outerHTML; // Full page HTML
        }, type);
    }
}

export default new BrowserAdapter();
