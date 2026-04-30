import { test as base } from '@playwright/test';
import { ArticlesPage } from '../pages/ArticlesPage';
import { ShopsPage } from '../pages/ShopsPage';

type AppFixtures = {
    articlesPage: ArticlesPage;
    shopsPage: ShopsPage;
};

export const test = base.extend<AppFixtures>({
    articlesPage: async ({ page }, use) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('isAuthenticated', 'true'));
        const articlesPage = new ArticlesPage(page);
        await use(articlesPage);
    },
    shopsPage: async ({ page }, use) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('isAuthenticated', 'true'));
        const shopsPage = new ShopsPage(page);
        await use(shopsPage);
    },
});

export { expect } from '@playwright/test';
