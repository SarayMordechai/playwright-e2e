import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { test, expect } from '../fixtures/authFixture';
import { products } from '../test-data/products';


test.describe('Products Page', () => {
  test('should display products page after successful login', async ({productsPage , page }) => {
    await productsPage.expectProductsLoaded();
  });

  test('each product should have name, price and add-to-cart button', async ({productsPage , page }) => {
    await productsPage.validateProductCards();
  });
  
  test('should set cart badge to 1 when adding a product from products page', async ({productsPage , page }) => {
    await productsPage.addProductToCartByName(products.backpack);
    await productsPage.expectProductInCart(products.backpack);
    await productsPage.expectCartBadgeCount(1);
  });

  test('should update badge to 2 when adding two products', async ({productsPage , page }) => {
    await productsPage.addProductToCartByName(products.backpack);
    await productsPage.addProductToCartByName(products.bikeLight);
    await productsPage.expectCartBadgeCount(2);
  });

  test('Remove from Products updates the badge', async ({productsPage , page }) => {
    await productsPage.addProductToCartByName(products.backpack);
    await productsPage.addProductToCartByName(products.bikeLight);
    await productsPage.expectCartBadgeCount(2);
    await productsPage.removeProduct(products.backpack);
    await productsPage.expectCartBadgeCount(1);
  });
  
  test('Sorting by name A→Z and Z→A works correctly', async ({ productsPage ,page }) => {

    console.log('Before sorting:', await productsPage.getProductNames());
    await productsPage.selectSort('az');
    console.log('After sorting A→Z:', await productsPage.getProductNames());
    await productsPage.expectSortedByNameAscending();
    await productsPage.selectSort('za');
    console.log('After sorting Z→A:', await productsPage.getProductNames());
    await productsPage.expectSortedByNameDescending();
  });
  
  test('Sorting by Price (low → high) and (high → low) works correctly', async ({ productsPage ,page }) => {

      // Price (low → high)
  await productsPage.selectSort('lohi');
  await productsPage.expectSortedByPriceLowToHigh();

  //Price (high → low)
  await productsPage.selectSort('hilo');
  await productsPage.expectSortedByPriceHighToLow();
  
  });
  
    test('user can logout successfully and return to login page', async ({productsPage , page }) => {
      await productsPage.expectProductsLoaded();
      await productsPage.openMenu();
      await productsPage.logout();
      const loginPage = new LoginPage(page);

      await loginPage.expectLoginPageVisible();
    });
    
    test('Reset App State', async ({ page, productsPage }) => {
    
      await productsPage.addProductToCartByName(products.backpack);
      await productsPage.addProductToCartByName(products.bikeLight);
      await productsPage.expectCartBadgeCount(2);
      await productsPage.resetAppState();
      await productsPage.expectCartBadgeCount(0);
        });
});

