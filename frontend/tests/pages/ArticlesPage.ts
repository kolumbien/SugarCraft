import { type Locator, type Page, expect } from '@playwright/test';

export class ArticlesPage {
    readonly page: Page;
    readonly createNewLink: Locator;
    readonly nameInput: Locator;
    readonly saveButton: Locator;
    readonly articlesList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.createNewLink = page.getByRole('link', { name: 'Create New Article' });
        this.nameInput = page.locator('#name');
        this.saveButton = page.getByRole('button', { name: 'Save Article' });
        this.articlesList = page.locator('ul.divide-y li');
    }

    async goto() {
        await this.page.goto('/articles');
    }

    async gotoCreate() {
        await this.page.goto('/articles/new');
    }

    async createArticle(name: string) {
        await this.createNewLink.click();
        await this.nameInput.fill(name);
        await this.saveButton.click();
    }

    async expectArticleVisible(name: string) {
        // Wait for the articles list to be populated
        await expect(this.articlesList.filter({ hasText: name }).first()).toBeVisible();
    }
}
