import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: false, args: ["--start-maximized"] });
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: null });
  const page = await context.newPage();

  // Login
  await page.goto("https://platform.uat.impetusz0.de/auth/login", { waitUntil: "load" });
  await page.waitForSelector('input[data-testid="email"]', { timeout: 15000 });
  await page.fill('input[data-testid="email"]', "prathapa.k@ril.com");
  await page.fill('input[type="password"]', "John.wick@RIL7");
  await page.locator("button").filter({ hasText: /login/i }).first().click();
  await page.waitForLoadState("load");
  await page.waitForTimeout(2000);
  console.log("Post-login URL:", page.url());

  // Select FTF role
  await page.waitForSelector('[data-testid="Impetus-ftf"]', { timeout: 15000 });
  await page.click('[data-testid="Impetus-ftf"]');
  await page.waitForLoadState("load");
  await page.waitForTimeout(3000);
  console.log("Post-FTF URL:", page.url());
  await page.screenshot({ path: "/tmp/post-ftf.png", fullPage: true });

  // Inspect nav / sidebar for "Edited" module
  const bodySnippet = await page.evaluate(() => document.body?.innerHTML?.substring(0, 6000) || "EMPTY");
  console.log("Body snippet:\n", bodySnippet);

  // Find any element containing "Edited" text
  const editedEls = await page.evaluate(() =>
    Array.from(document.querySelectorAll("*"))
      .filter((el) => el.childElementCount === 0 && /edited/i.test(el.textContent || ""))
      .map((el) => ({
        tag: el.tagName,
        text: el.textContent?.trim()?.substring(0, 100),
        className: el.className?.substring(0, 80),
        testid: el.getAttribute("data-testid"),
        href: (el as HTMLAnchorElement).href || null,
      }))
  );
  console.log("Edited elements:", JSON.stringify(editedEls, null, 2));

  // All nav links
  const navLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a, [role='menuitem'], [role='tab'], nav *, .sidebar *"))
      .filter((el) => el.childElementCount === 0 && el.textContent?.trim())
      .map((el) => ({
        tag: el.tagName,
        text: el.textContent?.trim()?.substring(0, 60),
        testid: el.getAttribute("data-testid"),
        href: (el as HTMLAnchorElement).href || null,
      }))
      .filter((el) => el.text)
  );
  console.log("Nav links:", JSON.stringify(navLinks, null, 2));

  await page.waitForTimeout(2000);
  await browser.close();
})();
