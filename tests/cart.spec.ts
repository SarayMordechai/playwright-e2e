import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { test, expect } from '../fixtures/authFixture';
import { products} from '../test-data/products';


test.describe('Cart Page', () => {

  test('navigate to cart shows Your Cart page', async ({ productsPage , page }) => {
    const cartPage = new CartPage(page);
    await cartPage.openFromHeader();
    await cartPage.expectCartPageVisible();
    await cartPage.expectCartActionsVisible();
  });

  test('product added from Products appears in cart with qty = 1', async ({ productsPage , page }) => {

    const cartPage = new CartPage(page);

    const productName = products.backpack;

    await productsPage.addProductToCartByName(productName);
    await cartPage.openFromHeader();
    await cartPage.expectCartPageVisible();
    await cartPage.expectItemInCart(productName);          
    await cartPage.expectItemQuantity(productName, 1);    
    await productsPage.expectCartBadgeCount(1);
    await cartPage.expectItemPriceVisible(productName); 
  });

  test('Empty Cart when no products were added', async ({ productsPage , page }) => {

    const cartPage = new CartPage(page);
    await productsPage.expectCartBadgeCount(0);
    await cartPage.openFromHeader();
    await cartPage.expectCartPageVisible();
    await cartPage.expectEmptyCart();
    await cartPage.expectCartActionsVisible();
  });

  test('multiple products in cart have correct rows and structure', async ({ productsPage , page }) => {

    const cartPage = new CartPage(page);
  
    const productsToAdd = [
      products.backpack,
      products.bikeLight,
      products.boltShirt,
    ];
  
    for (const name of productsToAdd) {
      await productsPage.addProductToCartByName(name);
    }
      await cartPage.openFromHeader();
    await cartPage.expectCartPageVisible();
  

    await cartPage.expectCartItemsCount(productsToAdd.length);
    for (const name of productsToAdd) {
      await cartPage.expectItemInCart(name);        
      await cartPage.expectItemPriceVisible(name);  
    }
  });

  test('removing item from cart updates list and badge', async ({ productsPage , page }) => {
    const cartPage = new CartPage(page);
  
    const firstProduct = products.backpack;
    const secondProduct = products.bikeLight;
  
    await productsPage.addProductToCartByName(firstProduct);
    await productsPage.addProductToCartByName(secondProduct);
    await productsPage.expectCartBadgeCount(2);
    await cartPage.openFromHeader();
    await cartPage.expectCartPageVisible();
  
    await cartPage.expectCartItemsCount(2);
    await cartPage.expectItemInCart(firstProduct);
    await cartPage.expectItemInCart(secondProduct);
    await cartPage.removeItem(firstProduct);
    await cartPage.expectItemNotInCart(firstProduct);
    await cartPage.expectItemInCart(secondProduct);
    await cartPage.expectCartItemsCount(1);
    await productsPage.expectCartBadgeCount(1);
  });
  
  test('Continue Shopping returns to Products and keeps cart state', async ({ productsPage , page }) => {
    const cartPage = new CartPage(page);
  
    const productName = products.bikeLight;
  
    await productsPage.addProductToCartByName(productName);
    await productsPage.expectCartBadgeCount(1);
  
    await cartPage.openFromHeader();
    await cartPage.expectCartPageVisible();
    await cartPage.expectItemInCart(productName);

    await cartPage.clickContinueShopping();
    await productsPage.expectProductsPageVisible(); 
    await productsPage.expectCartBadgeCount(1);
    await productsPage.expectProductInCart(productName);
  });
  

  test('proceeding to checkout opens Checkout Step One', async ({ productsPage , page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
  
    const productName = products.bikeLight;
  
    await productsPage.addProductToCartByName(productName);
    await productsPage.expectCartBadgeCount(1);
  
    await cartPage.openFromHeader();
    await cartPage.expectCartPageVisible();
  
    await cartPage.clickCheckout();
    await checkoutPage.expectCheckoutStepOneVisible();
  });

  test('product name & price match between Products and Cart', async ({ productsPage , page }) => {
    const cartPage = new CartPage(page);
  
    const productName = products.bikeLight;  
    const productDetailsBefore = await productsPage.getProductDetails(productName);
  
    await productsPage.addProductToCartByName(productName);
    await productsPage.expectCartBadgeCount(1);
    await cartPage.openFromHeader();
    await cartPage.expectCartPageVisible();
    const cartDetails = await cartPage.getCartItemDetails(productName);
    expect(cartDetails.name).toBe(productDetailsBefore.name);
    expect(cartDetails.price).toBe(productDetailsBefore.price);
  });
  
});








