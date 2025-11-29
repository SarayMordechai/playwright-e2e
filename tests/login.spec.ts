import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';
import { loginErrors } from '../test-data/messages';

test.describe('Login', () => {
  test('login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);

    await loginPage.expectLoginSuccess();
  });

  test('failed login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
  
    await loginPage.navigate();
    await loginPage.login(users.wrong.username, users.wrong.password);
    await loginPage.expectErrorMessage(loginErrors.invalidCredentials);
  });

  test('password is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
  
    await loginPage.navigate();
    await loginPage.login(users.standard.username, '');
    await loginPage.expectErrorMessage(loginErrors.passwordRequired);
  });

  test('username is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
  
    await loginPage.navigate();
    await loginPage.login('', users.standard.password);
    await loginPage.expectErrorMessage(loginErrors.usernameRequired);
  });

});
