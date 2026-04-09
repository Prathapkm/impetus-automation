import { Page } from "playwright";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  // Selectors (verified against live DOM)
  private readonly usernameInput = 'input[data-testid="email"]';
  private readonly passwordInput = 'input[type="password"]';
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.navigateTo("https://platform.uat.impetusz0.de/");
    await this.page.waitForLoadState("load");
    // SPA renders async — wait for the email input to appear
    await this.page.waitForSelector(this.usernameInput, { timeout: 20000 });
  }

  async enterUsername(username: string): Promise<void> {
    await this.page.waitForSelector(this.usernameInput, { timeout: 15000 });
    await this.page.fill(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.page.waitForSelector(this.passwordInput, { timeout: 15000 });
    await this.page.fill(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.page.locator("button").filter({ hasText: /^login$/i }).first().click();
    await this.page.waitForLoadState("load");
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async isLoginPageVisible(): Promise<boolean> {
    return this.page.isVisible(this.usernameInput);
  }
}
