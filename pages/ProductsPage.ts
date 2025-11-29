import { Page, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectProductsPageVisible() {
    await expect(this.page.locator('.app_logo')).toHaveText('Swag Labs');
  }

  async expectProductsLoaded() {
    const products = this.page.locator('.inventory_item');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
    return products;
}

async validateSingleProduct(product) {
    await expect(product.locator('.inventory_item_name')).toBeVisible();
    await expect(product.locator('.inventory_item_price')).toBeVisible();
    await expect(product.locator('button')).toBeVisible();
  }

async validateProductCards() {
    const products = await this.expectProductsLoaded();
    const count = await products.count();
  
    for (let i = 0; i < count; i++) {
      await this.validateSingleProduct(products.nth(i));
    }
  }

  private getProductByName(productName: string) {
    const products = this.page.locator('.inventory_item');

    return products.filter({
      has: this.page.locator('.inventory_item_name'),
      hasText: productName,
    });
  }

  async removeProduct(productName: string) {
    const product = this.getProductByName(productName);
    await expect(product).toHaveCount(1);
    const button = product.locator('button');
    await expect(button).toHaveText('Remove');
    await button.click();
    await expect(button).toHaveText('Add to cart');
  }
  


  async addProductToCartByName(productName: string) {
    const product = this.getProductByName(productName);
    await expect(product).toHaveCount(1); 
    await product.locator('button').click();
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.page.locator('.shopping_cart_badge');

    if (await badge.isVisible()) {
      const text = await badge.textContent();
      return Number(text);
    }

    return 0;
  }

  async expectCartBadgeCount(expected: number) {
    const actual = await this.getCartBadgeCount();
    expect(actual).toBe(expected);
  }

  async expectProductInCart(productName: string) {
    const products = this.page.locator('.inventory_item');
    const product = products.filter({
      has: this.page.locator('.inventory_item_name'),
      hasText: productName,
    });

    await expect(product.locator('button')).toHaveText('Remove');
  }

  async selectSort(optionValue: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.page.selectOption('[data-test="product-sort-container"]', optionValue);
  }

  async getProductNames(): Promise<string[]> {
    const productNameLocators = this.page.locator('.inventory_item_name');
    const count = await productNameLocators.count();
  
    const names: string[] = [];
  
    for (let i = 0; i < count; i++) {
      names.push((await productNameLocators.nth(i).textContent())?.trim() ?? '');
    }
  
    return names;
  }
  
  
  async expectSortedByNameAscending() {
    const names = await this.getProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  }
  
  async expectSortedByNameDescending() {
    const names = await this.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  }

  async getProductPrices(): Promise<number[]> {
    const priceLocators = this.page.locator('.inventory_item_price');
    const count = await priceLocators.count();
  
    const prices: number[] = [];
  
    for (let i = 0; i < count; i++) {
      const text = await priceLocators.nth(i).textContent();
      // text נראה כמו: "$29.99"
      const cleaned = (text ?? '').replace('$', '').trim();
      const value = Number(cleaned);
      prices.push(value);
    }
  
    return prices;
  }

  async expectSortedByPriceLowToHigh() {
    const prices = await this.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
  
    console.log('Price low→high actual:', prices);
    console.log('Price low→high expected:', sorted);
  
    expect(prices).toEqual(sorted);
  }
  
  async expectSortedByPriceHighToLow() {
    const prices = await this.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
  
    console.log('Price high→low actual:', prices);
    console.log('Price high→low expected:', sorted);
  
    expect(prices).toEqual(sorted);
  }
  
  async getProductDetails(productName: string): Promise<{ name: string; price: number }> {
    const product = this.getProductByName(productName);
    await expect(product).toHaveCount(1);
  
    const name = (await product.locator('.inventory_item_name').textContent())?.trim() ?? '';
    const priceText = (await product.locator('.inventory_item_price').textContent())?.trim() ?? '';
  
    const price = Number(priceText.replace('$', ''));
  
    return { name, price };
  }
  
  
}
