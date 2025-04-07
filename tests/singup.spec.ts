import { test, expect } from "@playwright/test";
import {
  generateUniqueEmail,
  generateUniqueCompanyName,
} from "../utils/emailAndCompanyGenerator";

test.describe("Signup", () => {
  let email;
  let organizationName;

  test.beforeEach(async ({ page }) => {
    await page.goto("/users/sign_up");

    // Accept cookies
    await page.getByText("Accept All").click();

    // Generate test data
    email = generateUniqueEmail();
    organizationName = generateUniqueCompanyName();

    // Fill first signup form
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill("Test1234!");
    await page.locator('input[name="acceptTos"]').check({ force: true });
    await page.locator('input[name="sendNewsletter"]').check({ force: true });
    await page.locator('button[type="submit"]').click();

    // Fill second signup form
    await page.locator('input[name="firstname"]').fill("Test");
    await page.locator('input[name="lastname"]').fill("Test");
    await page.locator('input[name="phoneNumber"]').fill("12345678");
    await page.locator('button[type="submit"]').click();

    // Fill organization
    await page.locator('input[name="organizationName"]').fill(organizationName);
  });

  test("Verify country dropdown content and alphabetical order", async ({
    page,
  }) => {
    const countryDropdown = page.locator('[role="combobox"][name="country"]');
    await countryDropdown.click();

    const countryOptions = page.locator(
      '[data-testid="autocomplete-menu-portal"] [role="option"]'
    );

    await expect(countryOptions).toHaveCount(16);

    const countryList = (await countryOptions.allTextContents()).map((c) =>
      c.trim()
    );
    const required = ["Sweden", "Spain", "Switzerland"];

    for (const country of required) {
      expect(countryList).toContain(country);
    }

    const swedenIndex = countryList.indexOf("Sweden");
    const spainIndex = countryList.indexOf("Spain");
    const switzerlandIndex = countryList.indexOf("Switzerland");

    expect(swedenIndex).toBeGreaterThan(spainIndex);
    expect(swedenIndex).toBeLessThan(switzerlandIndex);

    const swedenOption = countryOptions.locator('div:has-text("Sweden")');
    await swedenOption.scrollIntoViewIfNeeded();
    await swedenOption.hover();
    await swedenOption.click({ force: true });

    await expect(countryDropdown).toHaveValue("Sweden");

    console.log("Dropdown options:", countryList);
    console.log("Sweden position:", swedenIndex);
  });

  test("Verify registration payload includes correct country code", async ({
    page,
  }) => {
    const countryDropdown = page.locator('[role="combobox"][name="country"]');
    await countryDropdown.click();

    const countryOptions = page.locator(
      '[data-testid="autocomplete-menu-portal"] [role="option"]'
    );
    const swedenOption = countryOptions.locator('div:has-text("Sweden")');
    await swedenOption.scrollIntoViewIfNeeded();
    await swedenOption.hover();
    await swedenOption.click({ force: true });

    await page.getByRole("button", { name: "Choose channel" }).click();
    await page.getByText("Search Engine (Google, Bing,").click({ force: true });

    const [request] = await Promise.all([
      page.waitForRequest(
        (req) =>
          req.url().includes("/registration/register") &&
          req.method() === "POST"
      ),
      page.click('button[type="submit"]'),
    ]);

    const postData = request.postDataJSON();
    expect(postData).toMatchObject({
      country: "SE",
      email,
      organizationName,
    });
    console.log(postData);
    const response = await request.response();
    if (!response) {
      throw new Error("No response received for the registration request.");
    }

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty("registrationId");
    expect(responseBody.errorCode).toBe(0);
  });
});
