import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ["--start-maximized", "--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: null,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  await page.goto("https://platform.uat.impetusz0.de/", { waitUntil: "load" });

  // Wait for any visible content
  try {
    await page.waitForSelector("input, button, [class], h1, h2", { timeout: 15000 });
  } catch {
    console.log("No standard elements found within 15s");
  }

  await page.waitForTimeout(3000);
  console.log("Current URL:", page.url());

  await page.screenshot({ path: "/tmp/login-page.png", fullPage: true });

  // Check iframes
  const frames = page.frames();
  console.log("Frame count:", frames.length);
  frames.forEach((f, i) => console.log(`  Frame[${i}] url:`, f.url()));

  // Check all elements in main frame
  const allTags = await page.evaluate(() => {
    const tags: Record<string, number> = {};
    document.querySelectorAll("*").forEach((el) => {
      tags[el.tagName] = (tags[el.tagName] || 0) + 1;
    });
    return tags;
  });
  console.log("DOM tags:", JSON.stringify(allTags, null, 2));

  const inputs = await page.evaluate(() =>
    Array.from(document.querySelectorAll("input")).map((el) => ({
      type: el.type, name: el.name, id: el.id,
      placeholder: el.placeholder, className: el.className,
    }))
  );
  console.log("INPUTS:", JSON.stringify(inputs, null, 2));

  const buttons = await page.evaluate(() =>
    Array.from(document.querySelectorAll("button")).map((el) => ({
      type: el.type, text: el.textContent?.trim()?.substring(0, 80),
      id: el.id, className: el.className,
    }))
  );
  console.log("BUTTONS:", JSON.stringify(buttons, null, 2));

  // Check shadow roots
  const hasShadowRoots = await page.evaluate(() =>
    Array.from(document.querySelectorAll("*")).some((el) => (el as Element & { shadowRoot: ShadowRoot | null }).shadowRoot !== null)
  );
  console.log("Has shadow roots:", hasShadowRoots);

  // Get body innerHTML snippet
  const bodySnippet = await page.evaluate(() =>
    document.body?.innerHTML?.substring(0, 2000) || "EMPTY"
  );
  console.log("Body snippet:\n", bodySnippet);

  await page.waitForTimeout(2000);
  await browser.close();
})();
