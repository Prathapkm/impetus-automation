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

  // Get ALL href links on the page
  const allLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a[href]")).map((el) => ({
      text: el.textContent?.trim()?.substring(0, 80),
      href: (el as HTMLAnchorElement).href,
      testid: el.getAttribute("data-testid"),
    }))
  );
  console.log("ALL LINKS:", JSON.stringify(allLinks, null, 2));

  // Get all data-tabid attributes
  const tabIds = await page.evaluate(() =>
    Array.from(document.querySelectorAll("[data-tabid]")).map((el) => ({
      tabid: el.getAttribute("data-tabid"),
      text: el.textContent?.trim()?.substring(0, 80),
    }))
  );
  console.log("TAB IDs:", JSON.stringify(tabIds, null, 2));

  // Expand ALL nav items by clicking each parent
  const navParents = await page.$$(".side-navigation-panel-select-option");
  console.log(`Found ${navParents.length} nav parent items`);
  for (let i = 0; i < navParents.length; i++) {
    await navParents[i].click().catch(() => {});
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: "/tmp/nav-expanded.png", fullPage: true });

  // Re-check all links after expanding
  const allLinksExpanded = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a[href]")).map((el) => ({
      text: el.textContent?.trim()?.substring(0, 80),
      href: (el as HTMLAnchorElement).href,
    }))
  );
  console.log("ALL LINKS EXPANDED:", JSON.stringify(allLinksExpanded, null, 2));

  // All spans in nav
  const navSpans = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".side-navigation-panel-select-inner-option-text, .side-navigation-panel-select-option-text")).map((el) => ({
      text: el.textContent?.trim(),
      href: el.closest("a")?.getAttribute("href"),
    }))
  );
  console.log("NAV SPANS:", JSON.stringify(navSpans, null, 2));

  await page.waitForTimeout(2000);
  await browser.close();
})();
