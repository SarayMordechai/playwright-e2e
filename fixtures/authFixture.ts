import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { users } from '../test-data/users';

type Fixtures = {
  productsPage: ProductsPage;
};

export const test = base.extend<Fixtures>({
  productsPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);
    await productsPage.expectProductsPageVisible();

    await use(productsPage);
  },
});

export { expect } from '@playwright/test';
