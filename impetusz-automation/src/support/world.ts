import { setWorldConstructor, World, setDefaultTimeout } from "@cucumber/cucumber";

setDefaultTimeout(60 * 1000); // 60 seconds per step
import { Browser, BrowserContext, Page, chromium } from "playwright";

export interface ICustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
}

export class CustomWorld extends World implements ICustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  async openBrowser(): Promise<void> {
    this.browser = await chromium.launch({
      headless: false,
      args: ["--start-maximized", "--disable-blink-features=AutomationControlled"],
    });
    this.context = await this.browser.newContext({
      viewport: null,
      ignoreHTTPSErrors: true,
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });
    this.page = await this.context.newPage();
  }

  async closeBrowser(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);
