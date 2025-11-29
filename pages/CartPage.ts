import { Page, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }


  async openFromHeader() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async expectCartPageVisible() {
    await expect(this.page.locator('.title')).toHaveText('Your Cart');
    await expect(this.page).toHaveURL(/.*cart\.html/);
  }


  get cartItems() {
    return this.page.locator('.cart_item');
  }


  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }


  async expectEmptyCart() {
    const badge = this.page.locator('.shopping_cart_badge');
    await expect(this.cartItems).toHaveCount(0);
  }


  async getCartItemByName(productName: string) {
    return this.cartItems.filter({
      has: this.page.locator('.inventory_item_name'),
      hasText: productName,
    });
  }

  async expectItemInCart(productName: string) {
    const item = await this.getCartItemByName(productName);
    await expect(item).toHaveCount(1);
  }

  async expectItemQuantity(productName: string, expectedQty: number) {
    const item = await this.getCartItemByName(productName);
    await expect(item).toHaveCount(1);

    const qtyText = await item.locator('.cart_quantity').textContent();
    const qty = Number((qtyText ?? '').trim());

    expect(qty).toBe(expectedQty);
  }

  async expectItemPriceVisible(productName: string) {
    const item = await this.getCartItemByName(productName);
    await expect(item.locator('.inventory_item_price')).toBeVisible();
  }

  async expectCartActionsVisible() {
    await expect(this.page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(this.page.locator('[data-test="checkout"]')).toBeVisible();
  }
  async expectCartItemsCount(expectedCount: number) {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

   
    async removeItem(productName: string) {
        const item = await this.getCartItemByName(productName);
        await expect(item).toHaveCount(1);
    
        const removeButton = item.locator('button');
        await expect(removeButton).toHaveText('Remove');
    
        await removeButton.click();
      }
    
    
      async expectItemNotInCart(productName: string) {
        const item = await this.getCartItemByName(productName);
        await expect(item).toHaveCount(0);
      }

      async clickContinueShopping() {
        await this.page.locator('[data-test="continue-shopping"]').click();
      }
      async clickCheckout() {
        await this.page.locator('[data-test="checkout"]').click();
      }

      async getCartItemDetails(productName: string): Promise<{ name: string; price: number }> {
        const item = await this.getCartItemByName(productName);
        await expect(item).toHaveCount(1);
      
        const name = (await item.locator('.inventory_item_name').textContent())?.trim() ?? '';
        const priceText = (await item.locator('.inventory_item_price').textContent())?.trim() ?? '';
      
        const price = Number(priceText.replace('$', ''));
      
        return { name, price };
      }
      
}
