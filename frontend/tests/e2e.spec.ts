import { test, expect } from "@playwright/test";

test.describe("LUCID Flagship User Journey", () => {
  test("1. Opening Constellation to TODAY Transition", async ({ page }) => {
    await page.goto("/");
    // Expect Brand Heading
    await expect(page.locator("h1")).toContainText("LUCID");
    await expect(page.locator("text=See the market clearly.")).toBeVisible();

    // Click Begin Observing
    const beginBtn = page.locator("button:has-text('Begin observing')");
    await expect(beginBtn).toBeVisible({ timeout: 5000 });
    await beginBtn.click();

    // Should transition to TODAY
    await expect(page.locator("text=The market is unsettled.")).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Today's Atmosphere")).toBeVisible();
  });

  test("2. Atmosphere & 'Why?' Evidence Fold", async ({ page }) => {
    await page.goto("/room");
    await expect(page.locator("h1")).toContainText("Market Atmosphere");
    await expect(page.locator("text=COMPOSITE READING")).toBeVisible();

    // Toggle Why calculation drawer
    const whyBtn = page.locator("button:has-text('Why?')");
    await expect(whyBtn).toBeVisible();
    await whyBtn.click();

    await expect(page.locator("text=How We Know")).toBeVisible();
    await expect(page.locator("text=The Non-Guessing Principle")).toBeVisible();
  });

  test("3. Concept Library (SEE) - Compounding & Risk/Return", async ({ page }) => {
    await page.goto("/see");
    await expect(page.locator("h1")).toContainText("See the Mechanism");

    // Compounding Studio
    await expect(page.locator("text=STARTING WITH")).toBeVisible();
    await expect(page.locator("text=TIME HORIZON")).toBeVisible();

    // Switch to Risk & Return
    await page.click("button:has-text('02 · RISK / RETURN')");
    await expect(page.locator("text=EXPECTED RETURN TARGET")).toBeVisible();
    await expect(page.locator("text=You moved the expected return")).toBeVisible();
  });

  test("4. Claim Investigation, Thesis Logging & Simulation", async ({ page }) => {
    await page.goto("/practice");
    await expect(page.locator("h1")).toContainText("I Saw Something.");

    // Submit claim
    await page.click("button:has-text('Investigate')");

    // Check Syntactic Deconstruction
    await expect(page.locator("text=01 · SYNTACTIC DECONSTRUCTION")).toBeVisible({ timeout: 8000 });
    await expect(page.locator("text=02 · EVIDENCE STACK")).toBeVisible();

    // Select WAIT action
    await page.click("button:has-text('WAIT')");

    // Fill Thesis
    await page.fill("textarea[placeholder*='Valuation multiples']", "High valuation risk and uncertain credit conditions warrant waiting.");
    await page.fill("input[placeholder*='If revenue expands']", "Clear multiple expansion without credit spread widening.");

    // Submit Simulation
    await page.click("button:has-text('Simulate & Advance Time')");
    await expect(page.locator("text=✓ THESIS LOGGED IMMUTABLY")).toBeVisible();
  });

  test("5. Behavioral Mirror (TRACE)", async ({ page }) => {
    await page.goto("/trace");
    await expect(page.locator("h1")).toContainText("Your Decision Thread");
    await expect(page.locator("text=DECISION TIMING VS. MARKET ATMOSPHERE")).toBeVisible();
    await expect(page.locator("text=Pattern Observations")).toBeVisible();
  });
});
