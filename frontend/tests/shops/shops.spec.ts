import { test, expect } from '../fixtures/fixtures';
import { request } from '@playwright/test';

const API_URL = 'http://localhost:8000';

test.describe('Shops', () => {
    test.beforeAll(async () => {
        const apiContext = await request.newContext({ baseURL: API_URL });

        const factoryRes = await apiContext.post('/factories/', {
            data: { name: 'Test Factory', type: 'local', email: 'testfactory@test.com', article_ids: [] },
        });
        const factory = await factoryRes.json();

        await apiContext.post(`/factories/${factory.id}/suppliers/`, {
            data: { name: 'Test Supplier', country: 'US' },
        });

        await apiContext.dispose();
    });

    test.beforeEach(async ({ shopsPage }) => {
        await shopsPage.goto();
    });

    test('should create a new shop', async ({ shopsPage, page }) => {
        const shopName = `Test Shop ${Date.now()}`;
        const city = 'Test City';

        await shopsPage.gotoCreate();
        await shopsPage.createShop(shopName, city, 1);

        await expect(page).toHaveURL(/\/shops\/\d+/);

        await shopsPage.goto();
        await shopsPage.expectShopVisible(shopName);
    });
});
