import { Page } from "playwright";

export class BasePage {
  constructor(protected page: Page) {}

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  async waitForElement(selector: string, timeout = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async clickElement(selector: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.click(selector);
  }

  async fillInput(selector: string, value: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.fill(selector, value);
  }

  async getText(selector: string): Promise<string> {
    await this.waitForElement(selector);
    return (await this.page.textContent(selector)) ?? "";
  }

  async isVisible(selector: string): Promise<boolean> {
    return this.page.isVisible(selector);
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
  }
}
