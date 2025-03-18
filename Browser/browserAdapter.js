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
                slowMo: 50,
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
}

export default new BrowserAdapter();
