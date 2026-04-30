import { type Locator, type Page, expect } from '@playwright/test';

export class ShopsPage {
    readonly page: Page;
    readonly createNewLink: Locator;
    readonly nameInput: Locator;
    readonly cityInput: Locator;
    readonly factorySelect: Locator;
    readonly saveButton: Locator;
    readonly shopsListItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.createNewLink = page.getByRole('link', { name: 'Create New Shop' });
        // Based on Create.tsx labels
        this.nameInput = page.getByLabel('Shop Name');
        this.cityInput = page.getByLabel('City');
        this.factorySelect = page.getByLabel('Associated Factory');
        this.saveButton = page.getByRole('button', { name: 'Save Shop' });
        this.shopsListItems = page.locator('ul.divide-y li');
    }

    async goto() {
        await this.page.goto('/shops');
    }

    async gotoCreate() {
        await this.page.goto('/shops/new');
    }

    /**
     * Creates a shop.
     * @param name Shop name
     * @param city Shop city
     * @param factoryOptionIndex Index of the factory to select (1-based, 0 is placeholder)
     */
    async createShop(name: string, city: string, factoryOptionIndex: number = 1) {
        await this.nameInput.fill(name);
        await this.cityInput.fill(city);
        // Select the factory by index if possible, or value.
        // Since we don't know IDs, we'll try to select the first available option.
        // The select element has options.
        await this.factorySelect.selectOption({ index: factoryOptionIndex });

        await this.saveButton.click();
    }

    async expectShopVisible(name: string) {
        await expect(this.shopsListItems.filter({ hasText: name }).first()).toBeVisible();
    }
}
