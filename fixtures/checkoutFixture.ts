import { test as base, expect } from '@playwright/test';
import { goToCheckoutStepOne } from '../utils/flows';
import { CheckoutPage } from '../pages/CheckoutPage';

type Fixtures = {
  checkoutPage: CheckoutPage;
};

export const test = base.extend<Fixtures>({
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = await goToCheckoutStepOne(page);
    await use(checkoutPage); 
  },
});

export { expect } from '@playwright/test';
