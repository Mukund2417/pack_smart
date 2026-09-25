import os
from .config import settings
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from .database import engine, get_db, Base
from .models import (
    User, Commodity, PackagingMaterial, MaterialSustainabilityData,
    Recommendation, RecommendationMaterial, ShelfLifePrediction,
    MapAdvisory, QrCode, TraceabilityLog, Report, Feedback,
    PackagingFormat, PreservativeCategory, ComplianceChecklist, UserChecklistProgress,
    CommodityAlias, ResearchSource, MLModelRegistry
)
from .schemas import (
    UserSignup, UserLogin, TokenResponse, UserResponse,
    CommodityCreate, CommodityResponse,
    MaterialResponse,
    RecommendationInput, RecommendationResponse,
    ShelfLifePredictInput, ShelfLifeResponse,
    MapAdvisorInput, MapAdvisorResponse,
    SustainabilityInput, SustainabilityResponse,
    QrGenerateInput, QrResponse, ScanLogCreate, ScanLogResponse,
    AdminAnalyticsResponse, FeedbackCreate, FeedbackResponse,
    PackagingFormatResponse, PreservativeCategoryResponse,
    ComplianceChecklistResponse, UserProgressUpdate, UserProgressResponse,
    SystemStatusResponse
)
from .services.auth import hash_password, verify_password, create_access_token, decode_access_token
from .services.recommendation import run_recommendation_engine
from .services.shelflife import calculate_shelf_life
from .services.map import calculate_map_advisory
from .services.sustainability import analyze_sustainability_cost
from .services.qr import generate_qr_code_svg
from .services.ml_surrogate import ml_surrogate_engine
from .auth.rbac import get_current_user, get_current_user_optional
from .seed import seed_database

app = FastAPI(
    title="PackSmart API",
    description="AI-Based Intelligent Food Packaging Material Recommendation System for Food Commodities",
    version="2.0.0"
)

# CORS Configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:5174,https://pack-smart-eight.vercel.app").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_database()

# ==========================================
# HEALTH & SYSTEM STATUS
# ==========================================
@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(func.now())
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "api": "online",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/api/system/status", response_model=SystemStatusResponse)
def system_status(db: Session = Depends(get_db)):
    try:
        db.execute(func.now())
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    counts = {
        "commodities": db.query(Commodity).count(),
        "packaging_materials": db.query(PackagingMaterial).count(),
        "recommendations": db.query(Recommendation).count(),
        "users": db.query(User).count()
    }

    return {
        "status": "online",
        "database": db_status,
        "ml_model_status": "ACTIVE",
        "ml_engine": "Hybrid Neuro-Symbolic (Scikit-Learn Random Forest + TOPSIS Kinetic Solver)",
        "ml_accuracy": f"{ml_surrogate_engine.r2_score * 100:.1f}% R² cross-validated against physical trials",
        "dataset_records": counts,
        "timestamp": datetime.now(timezone.utc)
    }

@app.get("/")
def root():
    return {
        "name": "PackSmart AI Packaging Engine",
        "status": "active",
        "docs": "/docs",
        "version": "2.0.0"
    }

# ==========================================
# 1. AUTHENTICATION SERVICE
# ==========================================
@app.post("/api/auth/signup", response_model=TokenResponse)
def signup(payload: UserSignup, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    user_name = payload.name or payload.full_name or payload.email.split('@')[0]
    new_user = User(
        name=user_name,
        email=payload.email,
        username=user_name,
        password_hash=hash_password(payload.password),
        role=payload.role or "user",
        organization_name=payload.organization_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.user_id, "email": new_user.email, "role": new_user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "user_id": new_user.user_id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role,
            "organization": new_user.organization_name
        }
    }

@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    token = create_access_token({"sub": user.user_id, "email": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "organization": user.organization_name
        }
    }

@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/api/auth/logout")
def logout():
    return {"status": "success", "message": "Successfully signed out."}

@app.post("/api/auth/refresh")
@app.post("/api/auth/refresh-token")
def refresh_token(current_user: User = Depends(get_current_user)):
    new_token = create_access_token({"sub": current_user.user_id, "email": current_user.email, "role": current_user.role})
    return {"access_token": new_token, "token_type": "bearer"}

class GoogleLoginRequest(BaseModel):
    token: str

@app.post("/api/auth/google", response_model=TokenResponse)
def google_auth(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests
        client_id = settings.GOOGLE_CLIENT_ID
        idinfo = id_token.verify_oauth2_token(payload.token, requests.Request(), client_id)
        email = idinfo.get("email")
        name = idinfo.get("name", "Google User")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                name=name,
                email=email,
                username=name,
                auth_provider="google",
                role="user"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        token = create_access_token({"sub": user.user_id, "email": user.email, "role": user.role})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "user_id": user.user_id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "organization": user.organization_name
            }
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Invalid Google authentication token: {str(e)}")

# ==========================================
# 2. COMMODITY SERVICE & AUTOCOMPLETE
# ==========================================
@app.get("/api/commodities/search", response_model=List[CommodityResponse])
def search_commodities(q: str = Query("", min_length=0), db: Session = Depends(get_db)):
    query_str = q.strip()
    if not query_str:
        return db.query(Commodity).limit(20).all()
    
    # 1. Match commodity name or category
    direct_matches = db.query(Commodity).filter(
        (Commodity.name.ilike(f"%{query_str}%")) |
        (Commodity.category.ilike(f"%{query_str}%"))
    ).all()

    # 2. Match aliases
    alias_matches = (
        db.query(Commodity)
        .join(CommodityAlias, CommodityAlias.commodity_id == Commodity.commodity_id)
        .filter(CommodityAlias.alias_name.ilike(f"%{query_str}%"))
        .all()
    )

    # Combine unique results
    seen_ids = set()
    results = []
    for c in direct_matches + alias_matches:
        if c.commodity_id not in seen_ids:
            seen_ids.add(c.commodity_id)
            results.append(c)

    return results

@app.get("/api/commodities", response_model=List[CommodityResponse])
def get_commodities(db: Session = Depends(get_db)):
    return db.query(Commodity).all()

@app.get("/api/commodities/{commodity_id}", response_model=CommodityResponse)
def get_commodity(commodity_id: str, db: Session = Depends(get_db)):
    comm = db.query(Commodity).filter(Commodity.commodity_id == commodity_id).first()
    if not comm:
        raise HTTPException(status_code=404, detail="Commodity record not found.")
    return comm

@app.post("/api/commodities", response_model=CommodityResponse)
def create_commodity(payload: CommodityCreate, db: Session = Depends(get_db)):
    comm = Commodity(
        name=payload.name,
        category=payload.category,
        default_moisture_content=payload.default_moisture_content,
        initial_moisture_pct=payload.default_moisture_content,
        default_oil_fat_content=payload.default_oil_fat_content,
        lipid_pct=payload.default_oil_fat_content,
        default_ph=payload.default_ph,
        default_respiration_rate=payload.default_respiration_rate,
        product_form=payload.product_form or "solid",
        is_custom=True
    )
    db.add(comm)
    db.commit()
    db.refresh(comm)
    return comm

# ==========================================
# 3. PACKAGING MATERIAL SERVICE
# ==========================================
def get_commonly_used_commodities(db: Session, material_id: str, mat_name: str = "", mat_type: str = "") -> List[str]:
    query = (
        db.query(Recommendation.commodity_name)
        .join(RecommendationMaterial, RecommendationMaterial.recommendation_id == Recommendation.recommendation_id)
        .filter(RecommendationMaterial.material_id == material_id)
        .filter(Recommendation.commodity_name.isnot(None))
        .distinct()
        .limit(4)
        .all()
    )
    names = [row[0] for row in query if row[0]]
    if not names:
        t = mat_type.lower()
        n = mat_name.lower()
        if "breathable" in t or "bopp" in n:
            names = ["Fresh Apples", "Spinach / Greens", "Vine Tomatoes"]
        elif "laminate" in t or "evoh" in n:
            names = ["Fresh Poultry", "Cheddar Cheese", "Ground Spices"]
        elif "biodegradable" in t or "pla" in n:
            names = ["Organic Greens", "Sourdough Bread", "Berries"]
        elif "foil" in t or "retort" in n:
            names = ["Ready-to-Eat Curry", "Wet Pet Food", "Coffee Beans"]
        else:
            names = ["Snacks", "Dry Goods", "Produce"]
    return names

@app.get("/api/materials", response_model=List[MaterialResponse])
def get_materials(db: Session = Depends(get_db)):
    materials = db.query(PackagingMaterial).all()
    out = []
    for m in materials:
        sust_score = m.sustainability_data.sustainability_score if m.sustainability_data else 60.0
        c_index = m.sustainability_data.carbon_footprint_index if m.sustainability_data else 2.5
        notes = m.sustainability_data.recyclability_notes if m.sustainability_data else ""
        comm_used = get_commonly_used_commodities(db, m.material_id, m.name, m.material_type)
        res = MaterialResponse.model_validate(m)
        res.sustainability_score = sust_score
        res.carbon_footprint_index = c_index
        res.recyclability_notes = notes
        res.commonly_used_for = comm_used
        out.append(res)
    return out

@app.get("/api/materials/filter", response_model=List[MaterialResponse])
def filter_materials(
    category: Optional[str] = None,
    map_compatible: Optional[bool] = None,
    recyclable: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(PackagingMaterial)
    if category:
        query = query.filter(PackagingMaterial.material_type.ilike(f"%{category}%"))
    if map_compatible is not None:
        query = query.filter(PackagingMaterial.map_compatible == map_compatible)
    if recyclable is not None:
        query = query.filter(PackagingMaterial.is_recyclable == recyclable)
    materials = query.all()
    out = []
    for m in materials:
        res = MaterialResponse.model_validate(m)
        if m.sustainability_data:
            res.sustainability_score = m.sustainability_data.sustainability_score
            res.carbon_footprint_index = m.sustainability_data.carbon_footprint_index
            res.recyclability_notes = m.sustainability_data.recyclability_notes
        res.commonly_used_for = get_commonly_used_commodities(db, m.material_id)
        out.append(res)
    return out

@app.get("/api/materials/{material_id}", response_model=MaterialResponse)
def get_material_detail(material_id: str, db: Session = Depends(get_db)):
    mat = db.query(PackagingMaterial).filter(PackagingMaterial.material_id == material_id).first()
    if not mat:
        raise HTTPException(status_code=404, detail="Material not found.")
    res = MaterialResponse.model_validate(mat)
    if mat.sustainability_data:
        res.sustainability_score = mat.sustainability_data.sustainability_score
        res.carbon_footprint_index = mat.sustainability_data.carbon_footprint_index
        res.recyclability_notes = mat.sustainability_data.recyclability_notes
    res.commonly_used_for = get_commonly_used_commodities(db, mat.material_id)
    return res

# ==========================================
# 4. RECOMMENDATION ENGINE SERVICE
# ==========================================
@app.post("/api/recommendation/generate", response_model=RecommendationResponse)
def generate_recommendation(
    payload: RecommendationInput,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_id = current_user.user_id if current_user else None
    return run_recommendation_engine(db, payload, user_id=user_id)

@app.get("/api/recommendation/history")
@app.get("/api/history")
def get_recommendation_history(
    limit: int = 20,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    # USER ISOLATION (Section 9): If user is authenticated, only return their records.
    query = db.query(Recommendation)
    if current_user:
        query = query.filter(Recommendation.user_id == current_user.user_id)
    else:
        # Guests without account see empty history or unassigned session analyses
        query = query.filter(Recommendation.user_id == None)

    records = query.order_by(Recommendation.created_at.desc()).limit(limit).all()
    history = []
    for r in records:
        top_mat = db.query(RecommendationMaterial).filter(RecommendationMaterial.recommendation_id == r.recommendation_id).first()
        mat_name = top_mat.material.name if top_mat and top_mat.material else "High Barrier Film"
        history.append({
            "recommendation_id": r.recommendation_id,
            "commodity": r.commodity_name or "Custom Produce",
            "primary_material": mat_name,
            "storage_type": r.storage_type,
            "desired_shelf_life": r.desired_shelf_life_days,
            "created_at": r.created_at
        })
    return history

@app.get("/api/recommendation/{rec_id}")
@app.get("/api/history/{rec_id}")
def get_single_recommendation(
    rec_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    rec = db.query(Recommendation).filter(Recommendation.recommendation_id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation record not found.")
    
    # User isolation check
    if rec.user_id and current_user and rec.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="You do not have permission to view this analysis.")

    # Reconstruct enriched recommendation with layers, reasons, specs, and alternatives
    payload = RecommendationInput(
        commodity_id=rec.commodity_id,
        commodity_name=rec.commodity_name,
        moisture_content=rec.input_moisture_content,
        oil_fat_content=rec.input_oil_fat_content,
        ph_level=rec.input_ph,
        respiration_rate=rec.input_respiration_rate,
        desired_shelf_life=rec.desired_shelf_life_days,
        storage_type=rec.storage_type,
        storage_temp=rec.storage_temperature,
        relative_humidity=rec.relative_humidity,
        transport_conditions=rec.transport_mode
    )
    full_data = run_recommendation_engine(db, payload, user_id=rec.user_id)
    full_data["recommendation_id"] = rec.recommendation_id
    full_data["dossier_id"] = f"DOS-REC-{rec.recommendation_id[:8].upper()}"
    full_data["created_at"] = rec.created_at
    return full_data

# ==========================================
# 5. SHELF-LIFE PREDICTOR SERVICE
# ==========================================
@app.post("/api/shelf-life/predict", response_model=ShelfLifeResponse)
def predict_shelf_life(payload: ShelfLifePredictInput):
    return calculate_shelf_life(payload)

# ==========================================
# 6. MAP ADVISOR SERVICE
# ==========================================
@app.post("/api/map/advise", response_model=MapAdvisorResponse)
def advise_map(payload: MapAdvisorInput):
    return calculate_map_advisory(payload)

# ==========================================
# 7. SUSTAINABILITY & LCA COST ANALYZER
# ==========================================
@app.post("/api/sustainability/analyze", response_model=SustainabilityResponse)
def analyze_sustainability(payload: SustainabilityInput):
    return analyze_sustainability_cost(payload)

# ==========================================
# 8. QR / TRACEABILITY SERVICE
# ==========================================
@app.post("/api/qr/generate", response_model=QrResponse)
def generate_qr(payload: QrGenerateInput, db: Session = Depends(get_db)):
    tracking_url = f"https://packsmart.vercel.app/qr-traceability?batch={payload.batch_label}"
    qr_data = generate_qr_code_svg(tracking_url, payload.batch_label)
    
    qr_obj = QrCode(
        recommendation_id=payload.recommendation_id,
        qr_image_url=qr_data["qr_data_url"],
        batch_label=payload.batch_label
    )
    db.add(qr_obj)
    db.commit()
    qr_data["qr_id"] = qr_obj.qr_id
    return qr_data

@app.get("/api/qr/{qr_id}/scan-log", response_model=List[ScanLogResponse])
def get_scan_logs(qr_id: str, db: Session = Depends(get_db)):
    return db.query(TraceabilityLog).filter(TraceabilityLog.qr_id == qr_id).all()

@app.post("/api/qr/{qr_id}/scan")
def record_scan(qr_id: str, payload: ScanLogCreate, db: Session = Depends(get_db)):
    log = TraceabilityLog(
        qr_id=qr_id,
        scanned_location=payload.scanned_location,
        scanned_by=payload.scanned_by
    )
    db.add(log)
    db.commit()
    return {"status": "recorded", "location": payload.scanned_location}

# ==========================================
# 9. REPORTS SERVICE
# ==========================================
@app.get("/api/reports/export/{rec_id}")
def export_report(
    rec_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    rec = db.query(Recommendation).filter(Recommendation.recommendation_id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found for report generation.")
    
    if rec.user_id and current_user and rec.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Unauthorized access to this report.")

    return {
        "report_id": f"REP-{rec_id[:8].upper()}",
        "title": f"Technical Packaging Dossier: {rec.commodity_name}",
        "generated_at": rec.created_at,
        "summary": f"Optimal packaging specification report for {rec.commodity_name} under {rec.storage_type} conditions.",
        "download_formats": ["PDF", "JSON", "CSV"]
    }

@app.get("/api/dossier/{dossier_id}/verify")
@app.get("/api/dossier/{dossier_id}")
def verify_dossier(dossier_id: str, db: Session = Depends(get_db)):
    clean_id = dossier_id.upper().replace("DOS-REC-", "").replace("DOS-", "").replace("REP-", "").lower()

    rec = db.query(Recommendation).filter(
        (Recommendation.recommendation_id == dossier_id) |
        (Recommendation.recommendation_id.startswith(clean_id))
    ).first()

    if not rec:
        raise HTTPException(status_code=404, detail="Dossier record not found or expired.")

    top_mat = rec.ranked_materials[0] if rec.ranked_materials else None
    mat_name = top_mat.material.name if top_mat and top_mat.material else "High-Barrier Multi-Layer Laminate"

    import hashlib
    hash_digest = hashlib.sha256(f"{rec.recommendation_id}:{rec.commodity_name}:{rec.created_at}".encode()).hexdigest()[:16].upper()

    return {
        "status": "VERIFIED_AUTHENTIC",
        "dossier_id": f"DOS-REC-{rec.recommendation_id[:8].upper()}",
        "recommendation_id": rec.recommendation_id,
        "commodity_name": rec.commodity_name or "Standard Food Matrix",
        "primary_material": mat_name,
        "recommended_thickness": f"{top_mat.recommended_thickness_microns if top_mat else 50.0} µm",
        "recommended_otr": f"{top_mat.recommended_otr if top_mat else 50.0} cc/m²/day",
        "recommended_wvtr": f"{top_mat.recommended_wvtr if top_mat else 5.0} g/m²/day",
        "storage_type": rec.storage_type or "ambient",
        "storage_temperature_c": rec.storage_temperature or 20.0,
        "relative_humidity_pct": rec.relative_humidity or 65.0,
        "transport_mode": rec.transport_mode or "road",
        "desired_shelf_life_days": rec.desired_shelf_life_days or 14,
        "created_at": rec.created_at,
        "verification_timestamp": datetime.now(timezone.utc),
        "cryptographic_hash": f"SHA256-{hash_digest}",
        "issuing_authority": "PackSmart Scientific Food Packaging Decision-Support Engine v2.0.0",
        "regulatory_reference": "FSSAI (Packaging) Regulations 2018 / IS 9845 reference checklist"
    }

# ==========================================
# 10. ADMIN & LIVE ANALYTICS (NO FAKE DATA)
# ==========================================
@app.get("/api/admin/analytics", response_model=AdminAnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    # REAL DATABASE AGGREGATES (Section 29: No hardcoded counts or accuracy)
    total_recs = db.query(Recommendation).count()
    total_comms = db.query(Commodity).count()
    total_mats = db.query(PackagingMaterial).count()
    total_users = db.query(User).count()

    # Query real top requested commodities
    comm_query = (
        db.query(Recommendation.commodity_name, func.count(Recommendation.recommendation_id).label("cnt"))
        .filter(Recommendation.commodity_name.isnot(None))
        .group_by(Recommendation.commodity_name)
        .order_by(func.count(Recommendation.recommendation_id).desc())
        .limit(5)
        .all()
    )
    popular_commodities = [{"name": c[0], "count": c[1]} for c in comm_query]

    # Query real top recommended packaging materials
    mat_query = (
        db.query(PackagingMaterial.name, func.count(RecommendationMaterial.id).label("cnt"))
        .join(RecommendationMaterial, RecommendationMaterial.material_id == PackagingMaterial.material_id)
        .group_by(PackagingMaterial.name)
        .order_by(func.count(RecommendationMaterial.id).desc())
        .limit(5)
        .all()
    )
    total_mat_links = sum(m[1] for m in mat_query) or 1
    popular_materials = [
        {"name": m[0], "share": f"{round((m[1] / total_mat_links) * 100)}%"}
        for m in mat_query
    ]

    return {
        "total_recommendations": total_recs,
        "total_commodities": total_comms,
        "total_materials": total_mats,
        "total_users": total_users,
        "popular_commodities": popular_commodities,
        "popular_materials": popular_materials,
        "model_status": {
            "version": ml_surrogate_engine.version,
            "status": "Active & Calibrated",
            "accuracy": f"{ml_surrogate_engine.r2_score * 100:.1f}% R² (Random Forest + Gradient Boosting Surrogate)",
            "last_trained": ml_surrogate_engine.last_trained or "Continuous Hybrid Inference",
            "engine_type": "Hybrid Neuro-Symbolic (PIML)"
        }
    }

@app.post("/api/admin/model/update")
def update_model():
    return ml_surrogate_engine.retrain()

# ==========================================
# 11. FEEDBACK SERVICE
# ==========================================
@app.post("/api/feedback", response_model=FeedbackResponse)
def submit_feedback(
    payload: FeedbackCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_id = current_user.user_id if current_user else None
    feedback_entry = Feedback(
        recommendation_id=payload.recommendation_id,
        user_id=user_id,
        rating=payload.rating,
        comments=payload.comments
    )
    db.add(feedback_entry)
    db.commit()
    db.refresh(feedback_entry)
    return {
        "status": "success",
        "message": "Thank you for submitting feedback.",
        "feedback_id": feedback_entry.feedback_id
    }

# ==========================================
# 12. GRAPHICAL PACKAGING FORMATS SERVICE
# ==========================================
@app.get("/api/packaging-formats", response_model=List[PackagingFormatResponse])
def get_packaging_formats(db: Session = Depends(get_db)):
    return db.query(PackagingFormat).all()

@app.get("/api/packaging-formats/{format_id}", response_model=PackagingFormatResponse)
def get_packaging_format(format_id: str, db: Session = Depends(get_db)):
    fmt = db.query(PackagingFormat).filter(PackagingFormat.format_id == format_id).first()
    if not fmt:
        raise HTTPException(status_code=404, detail=f"Packaging format '{format_id}' not found.")
    return fmt

# ==========================================
# 13. PRESERVATIVES & ADDITIVES SERVICE
# ==========================================
@app.get("/api/preservatives", response_model=List[PreservativeCategoryResponse])
def get_preservatives(db: Session = Depends(get_db)):
    return db.query(PreservativeCategory).all()

# ==========================================
# 14. COMPLIANCE & LAUNCH CHECKLIST SERVICE
# ==========================================
@app.get("/api/compliance-checklist", response_model=List[ComplianceChecklistResponse])
def get_compliance_checklist(
    jurisdiction: Optional[str] = "India — FSSAI",
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(ComplianceChecklist)
    if jurisdiction:
        q = q.filter(ComplianceChecklist.jurisdiction.ilike(f"%{jurisdiction}%"))
    if category:
        q = q.filter(ComplianceChecklist.product_category.ilike(f"%{category}%"))
    return q.all()

@app.get("/api/compliance-checklist/progress", response_model=UserProgressResponse)
def get_checklist_progress(
    user_id: Optional[str] = None,
    jurisdiction: str = "India — FSSAI",
    db: Session = Depends(get_db)
):
    checklists = db.query(ComplianceChecklist).filter(ComplianceChecklist.jurisdiction.ilike(f"%{jurisdiction}%")).all()
    all_items = []
    for c in checklists:
        all_items.extend(c.checklist_items or [])

    total_items = len(all_items)
    mandatory_items = [item for item in all_items if item.get("is_mandatory")]
    mandatory_total = len(mandatory_items)

    completed_ids = []
    updated_at = None
    if user_id:
        record = db.query(UserChecklistProgress).filter(
            UserChecklistProgress.user_id == user_id,
            UserChecklistProgress.jurisdiction == jurisdiction
        ).first()
        if record and record.completed_item_ids:
            completed_ids = record.completed_item_ids
            updated_at = record.updated_at

    completed_set = set(completed_ids)
    mandatory_completed = len([item for item in mandatory_items if item.get("item_id") in completed_set])
    progress_percentage = round((len(completed_set) / max(1, total_items)) * 100.0, 1)
    mandatory_progress_percentage = round((mandatory_completed / max(1, mandatory_total)) * 100.0, 1)

    return {
        "jurisdiction": jurisdiction,
        "completed_item_ids": completed_ids,
        "total_items": total_items,
        "mandatory_total": mandatory_total,
        "mandatory_completed": mandatory_completed,
        "progress_percentage": min(100.0, progress_percentage),
        "mandatory_progress_percentage": min(100.0, mandatory_progress_percentage),
        "updated_at": updated_at
    }

@app.post("/api/compliance-checklist/progress", response_model=UserProgressResponse)
def save_checklist_progress(
    payload: UserProgressUpdate,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    checklists = db.query(ComplianceChecklist).filter(ComplianceChecklist.jurisdiction.ilike(f"%{payload.jurisdiction}%")).all()
    all_items = []
    for c in checklists:
        all_items.extend(c.checklist_items or [])

    total_items = len(all_items)
    mandatory_items = [item for item in all_items if item.get("is_mandatory")]
    mandatory_total = len(mandatory_items)

    completed_set = set(payload.completed_item_ids)
    mandatory_completed = len([item for item in mandatory_items if item.get("item_id") in completed_set])
    progress_percentage = round((len(completed_set) / max(1, total_items)) * 100.0, 1)
    mandatory_progress_percentage = round((mandatory_completed / max(1, mandatory_total)) * 100.0, 1)

    updated_at = None
    if user_id:
        record = db.query(UserChecklistProgress).filter(
            UserChecklistProgress.user_id == user_id,
            UserChecklistProgress.jurisdiction == payload.jurisdiction
        ).first()
        if not record:
            record = UserChecklistProgress(
                user_id=user_id,
                jurisdiction=payload.jurisdiction,
                completed_item_ids=payload.completed_item_ids
            )
            db.add(record)
        else:
            record.completed_item_ids = payload.completed_item_ids
        db.commit()
        db.refresh(record)
        updated_at = record.updated_at

    return {
        "jurisdiction": payload.jurisdiction,
        "completed_item_ids": payload.completed_item_ids,
        "total_items": total_items,
        "mandatory_total": mandatory_total,
        "mandatory_completed": mandatory_completed,
        "progress_percentage": min(100.0, progress_percentage),
        "mandatory_progress_percentage": min(100.0, mandatory_progress_percentage),
        "updated_at": updated_at
    }
