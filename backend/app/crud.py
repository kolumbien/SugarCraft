from sqlalchemy.orm import Session
from . import models, schemas
from fastapi import HTTPException

# --- Article ---
def get_article(db: Session, article_id: int):
    return db.query(models.Article).filter(models.Article.id == article_id).first()

def get_articles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Article).offset(skip).limit(limit).all()

def create_article(db: Session, article: schemas.ArticleCreate):
    db_article = models.Article(name=article.name)
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

# --- Ingredient ---
def get_ingredient(db: Session, ingredient_id: int):
    return db.query(models.Ingredient).filter(models.Ingredient.id == ingredient_id).first()

def create_article_ingredient(db: Session, ingredient: schemas.IngredientCreate, article_id: int):
    db_ingredient = models.Ingredient(**ingredient.dict(), article_id=article_id)
    db.add(db_ingredient)
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient

# --- Factory ---
def get_factory(db: Session, factory_id: int):
    return db.query(models.Factory).filter(models.Factory.id == factory_id).first()

def get_factories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Factory).offset(skip).limit(limit).all()

def create_factory(db: Session, factory: schemas.FactoryCreate):
    # Validation: Max 2 articles
    if len(factory.article_ids) > 2:
        raise HTTPException(status_code=400, detail="Factory cannot produce more than 2 articles")
    
    db_factory = models.Factory(
        name=factory.name, 
        type=factory.type, 
        email=factory.email
    )
    
    # Associate articles
    if factory.article_ids:
        articles = db.query(models.Article).filter(models.Article.id.in_(factory.article_ids)).all()
        if len(articles) != len(factory.article_ids):
             raise HTTPException(status_code=404, detail="One or more articles not found")
        db_factory.articles = articles

    db.add(db_factory)
    db.commit()
    db.refresh(db_factory)
    return db_factory

# --- Supplier ---
def get_supplier(db: Session, supplier_id: int):
    return db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()

def create_factory_supplier(db: Session, supplier: schemas.SupplierCreate, factory_id: int):
    db_supplier = models.Supplier(name=supplier.name, country=supplier.country, factory_id=factory_id)
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

# --- Shop ---
def get_shop(db: Session, shop_id: int):
    return db.query(models.Shop).filter(models.Shop.id == shop_id).first()

def get_shops(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Shop).offset(skip).limit(limit).all()

def create_shop(db: Session, shop: schemas.ShopCreate):
    # Validation: Factory must have at least 1 supplier
    factory = get_factory(db, factory_id=shop.factory_id)
    if not factory:
        raise HTTPException(status_code=404, detail="Factory not found")
    
    if not factory.suppliers or len(factory.suppliers) == 0:
        raise HTTPException(status_code=400, detail="Cannot create Shop. The selected Factory has no suppliers.")

    db_shop = models.Shop(name=shop.name, city=shop.city, factory_id=shop.factory_id)
    db.add(db_shop)
    db.commit()
    db.refresh(db_shop)
    return db_shop

def delete_shop(db: Session, shop_id: int):
    db_shop = get_shop(db, shop_id)
    if not db_shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    db.delete(db_shop)
    db.commit()
    return db_shop
