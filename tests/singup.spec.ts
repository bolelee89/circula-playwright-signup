import { test, expect } from "@playwright/test";
import { generateUniqueEmail } from "../utils/emailGenerator";

test.describe("Test Suite Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/users/sign_up");
    //shadow dom
    await page.getByText("Accept All").click();

    // First page of signup
    await page.locator('input[type="email"]').fill(generateUniqueEmail());
    await page.locator('input[type="password"]').fill("Test1234!");
    await page.locator('input[name="acceptTos"]').click({ force: true });
    await page.locator('input[name="sendNewsletter"]').click({ force: true });
    await page.locator('button[type="submit"]').click();

    // Second page of signup
    await page.locator('input[name="firstname"]').fill("Test");
    await page.locator('input[name="lastname"]').fill("Test");
    await page.locator('input[name="phoneNumber"]').fill("12345678");
    await page.locator('button[type="submit"]').click();
  });

  test("Country dropdown visibility and structure", async ({ page }) => {
    const dropdown = page.locator('select[name="user[company_country]"]');

    // Visibility checks
    await expect(dropdown).toBeVisible();
    await expect(dropdown).toBeEnabled();

    // Label association
    const label = page.locator(
      'label:has-text("Where\'s your company registered?")'
    );
    await expect(label).toBeVisible();
    expect(await label.getAttribute("for")).toBe(
      await dropdown.getAttribute("id")
    );

    // Dropdown interaction
    await dropdown.click();
    await expect(page.locator('option:has-text("Sweden")')).toBeVisible();
  });

  test("Test2", async ({ page }) => {});
  test("Test3", async ({ page }) => {});
});
