import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectCheckoutStepOneVisible() {
    await expect(this.page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(this.page.locator('.title')).toHaveText('Checkout: Your Information');
  }

async fillYourInformation(firstName: string, lastName: string, postalCode: string) {
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').fill(postalCode);
  }

  async clickContinue() {
    await this.page.locator('[data-test="continue"]').click();
  }


  async expectCheckoutStepTwoVisible() {
    await expect(this.page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(this.page.locator('.title')).toHaveText('Checkout: Overview');
  }

  async clickFinish() {
    await this.page.locator('[data-test="finish"]').click();
  }

  async expectCheckoutCompleteVisible() {
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
    await expect(this.page.locator('.title')).toHaveText('Checkout: Complete!');
    await expect(this.page.locator('.complete-header')).toBeVisible(); // "THANK YOU FOR YOUR ORDER"
  }

  async clickBackToHome() {
    await this.page.locator('[data-test="back-to-products"]').click();
  }

  async expectErrorMessage(expectedText: string) {
    const error = this.page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toHaveText(expectedText);
  }

  private parsePrice(text: string | null): number {
    if (!text) return 0;
    const numeric = text.replace(/[^0-9.]/g, '');
    return Number(numeric);
  }

  async getProductPrices(): Promise<number[]> {
    const priceLocators = this.page.locator('.inventory_item_price');
    const count = await priceLocators.count();
    const prices: number[] = [];
  
    for (let i = 0; i < count; i++) {
      const text = await priceLocators.nth(i).textContent();
      prices.push(this.parsePrice(text));
    }
  
    return prices;
  }
  
  async getItemTotal(): Promise<number> {
    const text = await this.page.locator('.summary_subtotal_label').textContent();
    return this.parsePrice(text);
  }
  
  async getTax(): Promise<number> {
    const text = await this.page.locator('.summary_tax_label').textContent();
    return this.parsePrice(text);
  }
  
  async getTotal(): Promise<number> {
    const text = await this.page.locator('.summary_total_label').textContent();
    return this.parsePrice(text);
  }

  async expectSummaryPricesCorrect(expectedTaxRate = 0.08) {
    const productPrices = await this.getProductPrices();
    const uiItemTotal = await this.getItemTotal();
    const uiTax = await this.getTax();
    const uiTotal = await this.getTotal();
  
    const calcItemTotal = Number(productPrices.reduce((sum, p) => sum + p, 0).toFixed(2));
    const calcTax = Number((calcItemTotal * expectedTaxRate).toFixed(2));
    const calcTotal = Number((calcItemTotal + calcTax).toFixed(2));
    
    expect(uiItemTotal).toBe(calcItemTotal);
    expect(uiTax).toBe(calcTax);
    expect(uiTotal).toBe(calcTotal);
  }
  
  
}