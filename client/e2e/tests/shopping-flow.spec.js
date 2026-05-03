import { test, expect } from '@playwright/test';

test.describe('ShopSmart E2E — Full Shopping Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API so E2E tests are self-contained
    await page.route('**/api/health', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'ok', message: 'Running', timestamp: new Date().toISOString() }),
      })
    );

    await page.route('**/api/products', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          products: [
            { id: 1, name: 'Wireless Headphones', price: 79.99, category: 'Electronics', stock: 50 },
            { id: 2, name: 'Running Shoes', price: 129.99, category: 'Sports', stock: 30 },
            { id: 3, name: 'Coffee Maker', price: 49.99, category: 'Kitchen', stock: 0 },
          ],
          total: 3,
        }),
      })
    );

    await page.goto('/');
  });

  test('homepage shows ShopSmart branding', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'ShopSmart' })).toBeVisible();
  });

  test('product listing loads and shows products', async ({ page }) => {
    await expect(page.locator('#products-grid')).toBeVisible();
    await expect(page.locator('[id^="product-"]')).toHaveCount(3);
  });

  test('out-of-stock product has disabled Add to Cart button', async ({ page }) => {
    await page.waitForSelector('#products-grid');
    const outOfStockBtn = page.locator('#add-to-cart-3');
    await expect(outOfStockBtn).toBeDisabled();
    await expect(outOfStockBtn).toHaveText('Out of Stock');
  });

  test('user can add a product to cart and cart badge updates', async ({ page }) => {
    await page.waitForSelector('#products-grid');
    await page.click('#add-to-cart-1');
    await expect(page.locator('.cart-badge')).toBeVisible();
    await expect(page.locator('.cart-badge')).toHaveText('1');
  });

  test('user can view cart after adding items', async ({ page }) => {
    await page.waitForSelector('#products-grid');
    await page.click('#add-to-cart-1');
    await page.click('#cart-toggle-btn');
    await expect(page.locator('#cart-section')).toBeVisible();
    await expect(page.locator('#cart-item-1')).toBeVisible();
  });

  test('cart shows correct total price', async ({ page }) => {
    await page.waitForSelector('#products-grid');
    await page.click('#add-to-cart-1'); // $79.99
    await page.click('#add-to-cart-2'); // $129.99
    await page.click('#cart-toggle-btn');
    await expect(page.locator('#cart-total-price')).toHaveText('$209.98');
  });

  test('user can remove item from cart', async ({ page }) => {
    await page.waitForSelector('#products-grid');
    await page.click('#add-to-cart-1');
    await page.click('#cart-toggle-btn');
    await expect(page.locator('#cart-item-1')).toBeVisible();
    await page.click('#remove-cart-1');
    await expect(page.locator('#cart-item-1')).not.toBeVisible();
    await expect(page.locator('.empty-cart')).toBeVisible();
  });

  test('continue shopping returns user to products view', async ({ page }) => {
    await page.waitForSelector('#products-grid');
    await page.click('#cart-toggle-btn');
    await page.click('#continue-shopping-btn');
    await expect(page.locator('#products-section')).toBeVisible();
  });
});
