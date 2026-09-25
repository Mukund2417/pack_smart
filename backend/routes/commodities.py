from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend.models.commodity import Commodity
from backend.schemas.commodity import CommodityCreate, CommodityUpdate, CommodityResponse
from backend.auth.rbac import require_role

router = APIRouter(prefix="/api/commodities", tags=["commodities"])

@router.get("", response_model=List[CommodityResponse])
def get_commodities(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Commodity)
    if category:
        query = query.filter(Commodity.category == category)
    if search:
        query = query.filter(Commodity.name.ilike(f"%{search}%"))
    return query.all()

@router.get("/{id}", response_model=CommodityResponse)
def get_commodity(id: int, db: Session = Depends(get_db)):
    commodity = db.query(Commodity).filter(Commodity.id == id).first()
    if not commodity:
        raise HTTPException(status_code=404, detail="Commodity not found")
    return commodity

@router.post("", response_model=CommodityResponse)
def create_commodity(
    commodity_in: CommodityCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("ADMIN"))
):
    commodity = Commodity(**commodity_in.model_dump())
    db.add(commodity)
    db.commit()
    db.refresh(commodity)
    return commodity

@router.put("/{id}", response_model=CommodityResponse)
def update_commodity(
    id: int,
    commodity_in: CommodityUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("ADMIN"))
):
    commodity = db.query(Commodity).filter(Commodity.id == id).first()
    if not commodity:
        raise HTTPException(status_code=404, detail="Commodity not found")
    
    update_data = commodity_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(commodity, key, value)
    
    db.commit()
    db.refresh(commodity)
    return commodity

@router.delete("/{id}")
def delete_commodity(
    id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("ADMIN"))
):
    commodity = db.query(Commodity).filter(Commodity.id == id).first()
    if not commodity:
        raise HTTPException(status_code=404, detail="Commodity not found")
    
    db.delete(commodity)
    db.commit()
    return {"message": "Commodity deleted successfully"}
