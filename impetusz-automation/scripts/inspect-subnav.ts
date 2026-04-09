import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: false, args: ["--start-maximized"] });
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: null });
  const page = await context.newPage();

  // Login + select FTF
  await page.goto("https://platform.uat.impetusz0.de/auth/login", { waitUntil: "load" });
  await page.waitForSelector('input[data-testid="email"]', { timeout: 15000 });
  await page.fill('input[data-testid="email"]', "prathapa.k@ril.com");
  await page.fill('input[type="password"]', "John.wick@RIL7");
  await page.locator("button").filter({ hasText: /login/i }).first().click();
  await page.waitForLoadState("load");
  await page.waitForTimeout(2000);
  await page.waitForSelector('[data-testid="Impetus-ftf"]', { timeout: 15000 });
  await page.click('[data-testid="Impetus-ftf"]');
  await page.waitForLoadState("load");
  await page.waitForTimeout(3000);

  // Click each nav section one at a time and capture its sub-items
  const navSections = [
    "Social Media Trends",
    "Fashion Expert Research",
    "Competitive Trends",
    "Fashion Eye",
    "RIL F&L Trends",
    "Analytics",
    "Settings",
  ];

  for (const section of navSections) {
    // Click the section
    const sectionEl = page.locator(`.side-navigation-panel-select-option-text`).filter({ hasText: section }).first();
    const visible = await sectionEl.isVisible().catch(() => false);
    if (!visible) { console.log(`${section}: not visible`); continue; }

    await sectionEl.click().catch(() => {});
    await page.waitForTimeout(700);

    // Get expanded sub-items
    const subItems = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".side-navigation-panel-select-inner-wrap a, .side-navigation-panel-select-inner-wrap [href]"))
        .map((el) => ({
          text: el.textContent?.trim()?.substring(0, 80),
          href: (el as HTMLAnchorElement).href,
          tabid: el.closest("[data-tabid]")?.getAttribute("data-tabid"),
        }))
    );
    console.log(`\n=== ${section} sub-items ===`);
    console.log(JSON.stringify(subItems, null, 2));

    await page.screenshot({ path: `/tmp/nav-${section.replace(/\s+/g, "-")}.png` });
  }

  // Also check Trends Corner for "Edited" tabs
  await page.goto("https://platform.uat.impetusz0.de/ftf/social-media-trends/trend-analysis", { waitUntil: "load" });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "/tmp/trends-corner.png", fullPage: true });

  const tabsOnTrends = await page.evaluate(() =>
    Array.from(document.querySelectorAll("[role='tab'], .tab, [class*='tab' i]"))
      .map((el) => ({ text: el.textContent?.trim()?.substring(0, 60), role: el.getAttribute("role"), testid: el.getAttribute("data-testid") }))
      .filter((el) => el.text)
  );
  console.log("\nTabs on Trends Corner:", JSON.stringify(tabsOnTrends, null, 2));

  const editedOnTrends = await page.evaluate(() =>
    Array.from(document.querySelectorAll("*"))
      .filter((el) => el.childElementCount === 0 && /edited/i.test(el.textContent || ""))
      .map((el) => ({ tag: el.tagName, text: el.textContent?.trim()?.substring(0, 80), className: el.className?.substring(0, 60) }))
  );
  console.log("Edited elements on Trends Corner:", JSON.stringify(editedOnTrends, null, 2));

  await page.waitForTimeout(2000);
  await browser.close();
})();
