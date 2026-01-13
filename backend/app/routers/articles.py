from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/articles",
    tags=["articles"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Article)
def create_article(article: schemas.ArticleCreate, db: Session = Depends(get_db)):
    return crud.create_article(db=db, article=article)

@router.get("/", response_model=List[schemas.Article])
def read_articles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_articles(db, skip=skip, limit=limit)

@router.get("/{article_id}", response_model=schemas.Article)
def read_article(article_id: int, db: Session = Depends(get_db)):
    db_article = crud.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

@router.post("/{article_id}/ingredients/", response_model=schemas.Ingredient)
def create_ingredient_for_article(
    article_id: int, ingredient: schemas.IngredientCreate, db: Session = Depends(get_db)
):
    # Verify article exists
    db_article = crud.get_article(db, article_id=article_id)
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
        
    return crud.create_article_ingredient(db=db, ingredient=ingredient, article_id=article_id)

@router.get("/{article_id}/ingredients/{ingredient_id}", response_model=schemas.Ingredient)
def read_ingredient(article_id: int, ingredient_id: int, db: Session = Depends(get_db)):
    # Simple check for now
    db_ingredient = crud.get_ingredient(db, ingredient_id=ingredient_id)
    if db_ingredient is None or db_ingredient.article_id != article_id:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return db_ingredient
