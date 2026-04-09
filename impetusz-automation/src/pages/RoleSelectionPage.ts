import { Page } from "playwright";
import { BasePage } from "./BasePage";

export class RoleSelectionPage extends BasePage {
  // Selectors (verified against live DOM)
  private readonly ftfRoleCard = '[data-testid="Impetus-ftf"]';

  constructor(page: Page) {
    super(page);
  }

  async isRoleSelectionVisible(): Promise<boolean> {
    await this.page.waitForLoadState("load");
    return this.page.isVisible(this.ftfRoleCard);
  }

  async selectFTFRole(): Promise<void> {
    await this.page.waitForSelector(this.ftfRoleCard, { timeout: 15000 });
    await this.page.click(this.ftfRoleCard);
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(1500);
  }
}
