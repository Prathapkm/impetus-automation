import { Page } from "playwright";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  // Selectors (verified against live DOM)
  // "Edited" is under Competitive Trends in the sidebar
  private readonly competitiveTrendsNav = '.side-navigation-panel-select-option-text';
  private readonly editedModuleLink = 'a[href="/ftf/edited"]';

  constructor(page: Page) {
    super(page);
  }

  async isDashboardLoaded(): Promise<boolean> {
    // Wait for redirect away from login page
    await this.page.waitForURL((url) => !url.pathname.includes("/auth/login"), { timeout: 15000 });
    return true;
  }

  async clickEditedModule(): Promise<void> {
    await this.page.waitForLoadState("load");

    // Expand "Competitive Trends" to reveal the Edited sub-item
    const competitiveTrends = this.page
      .locator(this.competitiveTrendsNav)
      .filter({ hasText: "Competitive Trends" })
      .first();
    await competitiveTrends.waitFor({ timeout: 15000 });
    await competitiveTrends.click();
    await this.page.waitForTimeout(500);

    // Click the Edited link
    const editedLink = this.page.locator(this.editedModuleLink).first();
    await editedLink.waitFor({ timeout: 10000 });
    await editedLink.click();
    await this.page.waitForLoadState("load");
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}
