from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend.models.polymer import Polymer
from backend.schemas.polymer import PolymerCreate, PolymerUpdate, PolymerResponse
from backend.auth.rbac import require_role

router = APIRouter(prefix="/api/polymers", tags=["polymers"])

@router.get("", response_model=List[PolymerResponse])
def get_polymers(
    category_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Polymer)
    if category_type:
        query = query.filter(Polymer.category_type == category_type)
    return query.all()

@router.get("/{id}", response_model=PolymerResponse)
def get_polymer(id: int, db: Session = Depends(get_db)):
    polymer = db.query(Polymer).filter(Polymer.id == id).first()
    if not polymer:
        raise HTTPException(status_code=404, detail="Polymer not found")
    return polymer

@router.post("", response_model=PolymerResponse)
def create_polymer(
    polymer_in: PolymerCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("ADMIN"))
):
    polymer = Polymer(**polymer_in.model_dump())
    db.add(polymer)
    db.commit()
    db.refresh(polymer)
    return polymer

@router.put("/{id}", response_model=PolymerResponse)
def update_polymer(
    id: int,
    polymer_in: PolymerUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("ADMIN"))
):
    polymer = db.query(Polymer).filter(Polymer.id == id).first()
    if not polymer:
        raise HTTPException(status_code=404, detail="Polymer not found")
    
    update_data = polymer_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(polymer, key, value)
    
    db.commit()
    db.refresh(polymer)
    return polymer

@router.delete("/{id}")
def delete_polymer(
    id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("ADMIN"))
):
    polymer = db.query(Polymer).filter(Polymer.id == id).first()
    if not polymer:
        raise HTTPException(status_code=404, detail="Polymer not found")
    
    db.delete(polymer)
    db.commit()
    return {"message": "Polymer deleted successfully"}
