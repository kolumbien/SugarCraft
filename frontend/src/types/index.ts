export interface Ingredient {
    id: number;
    name: string;
    article_id: number;
}

export interface Article {
    id: number;
    name: string;
    ingredients?: Ingredient[];
}

export interface Supplier {
    id: number;
    name: string;
    country: string;
    factory_id: number;
}

export interface Factory {
    id: number;
    name: string;
    type: 'local' | 'international';
    email: string;
    suppliers?: Supplier[];
    articles?: Article[];
}

export interface Shop {
    id: number;
    name: string;
    city: string;
    factory_id: number;
    factory?: Factory;
}

// Create Types
export interface CreateArticleDTO {
    name: string;
}

export interface CreateIngredientDTO {
    name: string;
}

export interface CreateFactoryDTO {
    name: string;
    type: 'local' | 'international';
    email: string;
    article_ids: number[];
}

export interface CreateSupplierDTO {
    name: string;
    country: string;
}

export interface CreateShopDTO {
    name: string;
    city: string;
    factory_id: number;
}
