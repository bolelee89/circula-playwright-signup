// tests/signup.spec.ts
import { test, expect } from "@playwright/test";
import {
  generateUniqueEmail,
  generateUniqueCompanyName,
} from "../utils/emailAndCompanyGenerator";
import { signupLocators, getCountryOption } from "./locators/signupLocators";

test.describe("Signup", () => {
  let email: string;
  let organizationName: string;

  test.beforeEach(async ({ page }) => {
    await page.goto(signupLocators.signupPage);

    // Accept cookies
    await page.locator(signupLocators.acceptCookiesButton).click();

    // Generate test data
    email = generateUniqueEmail();
    organizationName = generateUniqueCompanyName();

    // Fill first signup form
    await page.locator(signupLocators.emailInput).fill(email);
    await page.locator(signupLocators.passwordInput).fill("Test1234!");
    await page.locator(signupLocators.acceptTosCheckbox).check({ force: true });
    await page
      .locator(signupLocators.newsletterCheckbox)
      .check({ force: true });
    await page.locator(signupLocators.firstSubmitButton).click();

    // Fill second signup form
    await page.locator(signupLocators.firstNameInput).fill("Test");
    await page.locator(signupLocators.lastNameInput).fill("Test");
    await page.locator(signupLocators.phoneNumberInput).fill("12345678");
    await page.locator(signupLocators.secondSubmitButton).click();

    // Fill organization
    await page
      .locator(signupLocators.organizationNameInput)
      .fill(organizationName);
  });

  test("Verify country dropdown content and alphabetical order", async ({
    page,
  }) => {
    const countryDropdown = page.locator(signupLocators.countryDropdown);
    await countryDropdown.click();

    const countryOptions = page.locator(signupLocators.countryOptions);

    await expect(countryOptions).toHaveCount(16);

    const countryList = (await countryOptions.allTextContents()).map((c) =>
      c.trim()
    );
    const requiredCountries = ["Sweden", "Spain", "Switzerland"];

    for (const country of requiredCountries) {
      expect(countryList).toContain(country);
    }

    const swedenIndex = countryList.indexOf("Sweden");
    const spainIndex = countryList.indexOf("Spain");
    const switzerlandIndex = countryList.indexOf("Switzerland");

    expect(swedenIndex).toBeGreaterThan(spainIndex);
    expect(swedenIndex).toBeLessThan(switzerlandIndex);

    const swedenOption = page.locator(getCountryOption("Sweden"));
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
    const countryDropdown = page.locator(signupLocators.countryDropdown);
    await countryDropdown.click();

    const swedenOption = page.locator(getCountryOption("Sweden"));
    await swedenOption.scrollIntoViewIfNeeded();
    await swedenOption.hover();
    await swedenOption.click({ force: true });

    await page.locator(signupLocators.channelDropdown).click();
    await page
      .locator(signupLocators.searchEngineOption)
      .click({ force: true });

    const [request] = await Promise.all([
      page.waitForRequest(
        (req) =>
          req.url().includes("/registration/register") &&
          req.method() === "POST"
      ),
      page.locator(signupLocators.finalSubmitButton).click(),
    ]);

    const postData = request.postDataJSON();
    expect(postData).toMatchObject({
      country: "SE",
      email,
      organizationName,
    });

    console.log("Registration payload:", postData);

    const response = await request.response();
    if (!response) {
      throw new Error("No response received for the registration request.");
    }

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("registrationId");
    expect(responseBody.errorCode).toBe(0);
  });
});
