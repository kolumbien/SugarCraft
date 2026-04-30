import { test, expect } from '../fixtures/fixtures';

test.describe('Articles', () => {
    test.beforeEach(async ({ articlesPage }) => {
        await articlesPage.goto();
    });

    test('should create a new article', async ({ articlesPage, page }) => {
        const articleName = `Test Article ${Date.now()}`;

        await articlesPage.createArticle(articleName);

        // After creation, we should see the details page or be redirected back to list?
        // Based on Create.tsx: navigate(/articles/${article.id})
        // So we verify we are on a details page (url contains /articles/ and not /new)
        await expect(page).toHaveURL(/\/articles\/\d+/);

        // Let's go back to list and verify it's there
        await articlesPage.goto();
        await articlesPage.expectArticleVisible(articleName);
    });
});
