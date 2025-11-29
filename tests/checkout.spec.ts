import { test, expect } from '../fixtures/checkoutFixture';
import { ProductsPage } from '../pages/ProductsPage';
import { checkoutCustomer } from '../test-data/checkout';
import { checkoutErrors } from '../test-data/messages';

test('basic checkout flow from product to order complete', async ({page, checkoutPage}) => {
  const productsPage = new ProductsPage(page);

  await checkoutPage.fillYourInformation(checkoutCustomer.firstName,checkoutCustomer.lastName,checkoutCustomer.postalCode);
  await checkoutPage.clickContinue();
  await checkoutPage.expectCheckoutStepTwoVisible();
  await checkoutPage.clickFinish();
  await checkoutPage.expectCheckoutCompleteVisible();
  await checkoutPage.clickBackToHome();
  await productsPage.expectProductsPageVisible();
  await productsPage.expectCartBadgeCount(0);
});

test('first name is required', async ({ page, checkoutPage }) => {
    await checkoutPage.clickContinue();
    await checkoutPage.expectErrorMessage(checkoutErrors.firstNameRequired);
    await checkoutPage.expectCheckoutStepOneVisible();
  });

  test('last name is required', async ({ page,checkoutPage }) => {
    await checkoutPage.fillYourInformation(checkoutCustomer.firstName, '', checkoutCustomer.postalCode);
    await checkoutPage.clickContinue();
    await checkoutPage.expectErrorMessage(checkoutErrors.lastNameRequired);
    await checkoutPage.expectCheckoutStepOneVisible();
  });
  
  test('postal code is required', async ({page, checkoutPage }) => {
    await checkoutPage.fillYourInformation(checkoutCustomer.firstName, checkoutCustomer.lastName, '');
    await checkoutPage.clickContinue();
    await checkoutPage.expectErrorMessage(checkoutErrors.postalCodeRequired);
    await checkoutPage.expectCheckoutStepOneVisible();
  });


test('checkout summary totals are calculated correctly', async ({ checkoutPage }) => {
  await checkoutPage.fillYourInformation(checkoutCustomer.firstName,checkoutCustomer.lastName,checkoutCustomer.postalCode);
  await checkoutPage.clickContinue();
  await checkoutPage.expectCheckoutStepTwoVisible();
  await checkoutPage.expectSummaryPricesCorrect();
});
