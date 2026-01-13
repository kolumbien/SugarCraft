from pydantic import BaseModel, EmailStr
from typing import List, Optional
from .models import FactoryType

# --- Ingredient Schemas ---
class IngredientBase(BaseModel):
    name: str

class IngredientCreate(IngredientBase):
    pass

class Ingredient(IngredientBase):
    id: int
    article_id: int

    class Config:
        from_attributes = True

# --- Article Schemas ---
class ArticleBase(BaseModel):
    name: str

class ArticleCreate(ArticleBase):
    pass

class Article(ArticleBase):
    id: int
    ingredients: List[Ingredient] = []

    class Config:
        from_attributes = True

# --- Supplier Schemas ---
class SupplierBase(BaseModel):
    name: str
    country: str

class SupplierCreate(SupplierBase):
    pass

class Supplier(SupplierBase):
    id: int
    factory_id: int

    class Config:
        from_attributes = True

# --- Factory Schemas ---
class FactoryBase(BaseModel):
    name: str
    type: FactoryType
    email: EmailStr

class FactoryCreate(FactoryBase):
    article_ids: List[int] = [] # To associate articles upon creation/update

class Factory(FactoryBase):
    id: int
    suppliers: List[Supplier] = []
    articles: List[Article] = []

    class Config:
        from_attributes = True

# --- Shop Schemas ---
class ShopBase(BaseModel):
    name: str
    city: str
    factory_id: int

class ShopCreate(ShopBase):
    pass

class Shop(ShopBase):
    id: int
    factory: Optional[Factory] = None

    class Config:
        from_attributes = True
