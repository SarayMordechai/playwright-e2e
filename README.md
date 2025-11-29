# Playwright E2E Tests – Swag Labs Demo Store

Automated end-to-end test project built with **Playwright + TypeScript**  
for the demo e-commerce site [Swag Labs](https://www.saucedemo.com/).

The goal of this project is to demonstrate:
- UI automation best practices
- Page Object Model (POM)
- Reusable flows & fixtures
- Test data separation
- Coverage of a realistic user journey: Login → Products → Cart → Checkout

---

## ✅ Tech Stack

- [Playwright](https://playwright.dev/) + Playwright Test Runner
- TypeScript
- Node.js
- Page Object Model (POM)
- Fixtures & flows for reusable setup
- Test data modules (`test-data/`)

---

## 📁 Project Structure

```text
.
├─ pages/
│   ├─ LoginPage.ts
│   ├─ ProductsPage.ts
│   ├─ CartPage.ts
│   ├─ CheckoutPage.ts
│
├─ tests/
│   ├─ login.spec.ts
│   ├─ products.spec.ts
│   ├─ cart.spec.ts
│   ├─ checkout.spec.ts
│
├─ fixtures/
│   ├─ authFixture.ts          # Logged-in user on Products page
│   ├─ checkoutFixture.ts      # User in Checkout Step 1
│
├─ utils/
│   ├─ flows.ts                # Reusable business flows (goToCheckoutStepOne)
│
├─ test-data/
│   ├─ users.ts                # Login users (standard, locked, etc.)
│   ├─ products.ts             # Product names & sets (defaultCartProducts, etc.)
│   ├─ checkout.ts             # Checkout customer info
│   ├─ messages.ts             # Error messages (login / checkout)
│
├─ playwright.config.ts
├─ package.json
└─ README.md
