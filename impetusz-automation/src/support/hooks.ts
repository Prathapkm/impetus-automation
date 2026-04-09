import { Before, After, AfterStep, Status } from "@cucumber/cucumber";
import { CustomWorld } from "./world";

Before(async function (this: CustomWorld) {
  await this.openBrowser();
});

AfterStep(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, "image/png");
  }
});

After(async function (this: CustomWorld) {
  await this.closeBrowser();
});
