import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ["--start-maximized"],
  });
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: null });
  const page = await context.newPage();

  await page.goto("https://platform.uat.impetusz0.de/auth/login", { waitUntil: "load" });
  await page.waitForSelector('input[data-testid="email"]', { timeout: 15000 });
  await page.waitForTimeout(1000);

  // Snapshot buttons BEFORE filling
  const btnsBefore = await page.evaluate(() =>
    Array.from(document.querySelectorAll("button")).map((el) => ({
      type: el.type, text: el.textContent?.trim(),
      disabled: el.disabled, className: el.className.substring(0, 60),
    }))
  );
  console.log("Buttons BEFORE fill:", JSON.stringify(btnsBefore, null, 2));
  await page.screenshot({ path: "/tmp/step1-before-fill.png" });

  // Fill email only
  await page.fill('input[data-testid="email"]', "prathapa.k@ril.com");
  await page.waitForTimeout(1000);

  const btnsAfterEmail = await page.evaluate(() =>
    Array.from(document.querySelectorAll("button")).map((el) => ({
      type: el.type, text: el.textContent?.trim(),
      disabled: el.disabled, className: el.className.substring(0, 60),
    }))
  );
  console.log("Buttons AFTER email fill:", JSON.stringify(btnsAfterEmail, null, 2));
  await page.screenshot({ path: "/tmp/step2-after-email.png" });

  // Fill password
  const pwdInput = page.locator('input[type="password"]');
  const pwdVisible = await pwdInput.isVisible();
  console.log("Password input visible:", pwdVisible);

  if (pwdVisible) {
    await pwdInput.fill("John.wick@RIL7");
    await page.waitForTimeout(1000);
  }

  const btnsAfterPwd = await page.evaluate(() =>
    Array.from(document.querySelectorAll("button")).map((el) => ({
      type: el.type, text: el.textContent?.trim(),
      disabled: el.disabled, className: el.className.substring(0, 60),
    }))
  );
  console.log("Buttons AFTER password fill:", JSON.stringify(btnsAfterPwd, null, 2));
  await page.screenshot({ path: "/tmp/step3-after-password.png" });

  // Try all ways to submit
  const submitBtn = page.locator("button").filter({ hasText: /login/i }).first();
  const submitVisible = await submitBtn.isVisible().catch(() => false);
  console.log("Submit btn by text visible:", submitVisible);

  if (submitVisible) {
    await submitBtn.click();
    await page.waitForLoadState("load");
    await page.waitForTimeout(4000);
    console.log("Post-login URL:", page.url());
    await page.screenshot({ path: "/tmp/step4-post-login.png", fullPage: true });

    // Look for FTF
    const ftf = await page.evaluate(() =>
      Array.from(document.querySelectorAll("*"))
        .filter((el) => el.childElementCount === 0 && el.textContent?.includes("FTF"))
        .map((el) => ({ tag: el.tagName, text: el.textContent?.trim()?.substring(0, 100), className: el.className?.substring(0, 80), testid: el.getAttribute("data-testid") }))
    );
    console.log("FTF elements:", JSON.stringify(ftf, null, 2));

    const allBtns = await page.evaluate(() =>
      Array.from(document.querySelectorAll("button")).map((el) => ({
        text: el.textContent?.trim()?.substring(0, 80),
        testid: el.getAttribute("data-testid"),
        className: el.className?.substring(0, 80),
      }))
    );
    console.log("All buttons post-login:", JSON.stringify(allBtns, null, 2));

    const bodySnippet = await page.evaluate(() => document.body?.innerHTML?.substring(0, 4000) || "EMPTY");
    console.log("Body snippet:\n", bodySnippet);
  }

  await page.waitForTimeout(2000);
  await browser.close();
})();
