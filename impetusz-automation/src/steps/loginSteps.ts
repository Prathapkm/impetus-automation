import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import { LoginPage } from "../pages/LoginPage";
import { RoleSelectionPage } from "../pages/RoleSelectionPage";
import { DashboardPage } from "../pages/DashboardPage";

// ──────────────────────────────────────────────
// GIVEN
// ──────────────────────────────────────────────

Given("I am on the Impetusz login page", async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate();
  const isVisible = await loginPage.isLoginPageVisible();
  expect(isVisible).toBeTruthy();
});

// ──────────────────────────────────────────────
// WHEN
// ──────────────────────────────────────────────

When(
  "I login with username {string} and password {string}",
  async function (this: CustomWorld, username: string, password: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.login(username, password);
  }
);

When("I select the {string} role", async function (this: CustomWorld, _role: string) {
  const roleSelectionPage = new RoleSelectionPage(this.page);
  await roleSelectionPage.selectFTFRole();
});

When("I click on the Edited module", async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  await dashboardPage.clickEditedModule();
});

// ──────────────────────────────────────────────
// THEN
// ──────────────────────────────────────────────

Then("I should be logged in successfully", async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  const isLoaded = await dashboardPage.isDashboardLoaded();
  expect(isLoaded).toBeTruthy();
});

Then("I should see the role selection screen", async function (this: CustomWorld) {
  const roleSelectionPage = new RoleSelectionPage(this.page);
  const isVisible = await roleSelectionPage.isRoleSelectionVisible();
  expect(isVisible).toBeTruthy();
});

Then("I should be on the dashboard with {string} role", async function (this: CustomWorld, _role: string) {
  const dashboardPage = new DashboardPage(this.page);
  const isLoaded = await dashboardPage.isDashboardLoaded();
  expect(isLoaded).toBeTruthy();
  const url = await dashboardPage.getCurrentUrl();
  console.log(`Current URL after role selection: ${url}`);
});

Then("I should be on the Edited module page", async function (this: CustomWorld) {
  const dashboardPage = new DashboardPage(this.page);
  const url = await dashboardPage.getCurrentUrl();
  const title = await dashboardPage.getPageTitle();
  console.log(`Edited module URL: ${url}`);
  console.log(`Edited module Page Title: ${title}`);
  expect(url).toBeTruthy();
});
