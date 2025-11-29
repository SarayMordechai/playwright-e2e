import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users } from '../test-data/users';
import { products} from '../test-data/products';

export async function goToCheckoutStepOne(page: Page, productName: string = products.backpack) {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.navigate();
  await loginPage.login(users.standard.username, users.standard.password);

  await productsPage.expectProductsPageVisible();
  await productsPage.addProductToCartByName(productName);

  await cartPage.openFromHeader();
  await cartPage.expectCartPageVisible();

  await cartPage.clickCheckout();
  await checkoutPage.expectCheckoutStepOneVisible();

  return checkoutPage;
}

