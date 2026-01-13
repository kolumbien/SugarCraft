from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/factories",
    tags=["factories"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Factory)
def create_factory(factory: schemas.FactoryCreate, db: Session = Depends(get_db)):
    return crud.create_factory(db=db, factory=factory)

@router.get("/", response_model=List[schemas.Factory])
def read_factories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_factories(db, skip=skip, limit=limit)

@router.get("/{factory_id}", response_model=schemas.Factory)
def read_factory(factory_id: int, db: Session = Depends(get_db)):
    db_factory = crud.get_factory(db, factory_id=factory_id)
    if db_factory is None:
        raise HTTPException(status_code=404, detail="Factory not found")
    return db_factory

@router.post("/{factory_id}/suppliers/", response_model=schemas.Supplier)
def create_supplier_for_factory(
    factory_id: int, supplier: schemas.SupplierCreate, db: Session = Depends(get_db)
):
    db_factory = crud.get_factory(db, factory_id=factory_id)
    if not db_factory:
        raise HTTPException(status_code=404, detail="Factory not found")
    return crud.create_factory_supplier(db=db, supplier=supplier, factory_id=factory_id)

@router.get("/{factory_id}/suppliers/{supplier_id}", response_model=schemas.Supplier)
def read_supplier(factory_id: int, supplier_id: int, db: Session = Depends(get_db)):
    db_supplier = crud.get_supplier(db, supplier_id=supplier_id)
    if db_supplier is None or db_supplier.factory_id != factory_id:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return db_supplier
