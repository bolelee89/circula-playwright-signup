// locators/signupLocators.ts
export const signupLocators = {
  // Page navigation
  signupPage: "/users/sign_up",

  // Cookie acceptance
  acceptCookiesButton: 'text="Accept All"',

  // First signup form
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  acceptTosCheckbox: 'input[name="acceptTos"]',
  newsletterCheckbox: 'input[name="sendNewsletter"]',
  firstSubmitButton: 'button[type="submit"]',

  // Second signup form
  firstNameInput: 'input[name="firstname"]',
  lastNameInput: 'input[name="lastname"]',
  phoneNumberInput: 'input[name="phoneNumber"]',
  secondSubmitButton: 'button[type="submit"]',

  // Organization form
  organizationNameInput: 'input[name="organizationName"]',
  countryDropdown: '[role="combobox"][name="country"]',
  countryOptions: '[data-testid="autocomplete-menu-portal"] [role="option"]',
  countryOption: (countryName: string) => `div:has-text("${countryName}")`,

  // Channel selection
  channelDropdown: 'input:has-text("Choose channel")',
  searchEngineOption: 'text="Search Engine (Google, Bing, etc.)"',

  // Final submit
  finalSubmitButton: 'button[type="submit"]',
};

// Helper function to get specific country option locator
export function getCountryOption(countryName: string) {
  return `${signupLocators.countryOptions} ${signupLocators.countryOption(
    countryName
  )}`;
}
