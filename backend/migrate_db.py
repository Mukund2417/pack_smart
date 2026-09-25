import sqlite3
from backend.database import engine, Base
from backend.models import (
    User, Commodity, PackagingMaterial, MaterialSustainabilityData,
    Recommendation, RecommendationMaterial, ShelfLifePrediction,
    MapAdvisory, QrCode, TraceabilityLog, Report, Feedback,
    PackagingFormat, PreservativeCategory, ComplianceChecklist, UserChecklistProgress,
    CommodityAlias, ResearchSource, MLModelRegistry
)

def run_migrations():
    """Ensure all tables and columns are present in the database without destroying data."""
    # 1. Create any missing tables (Alembic / SQLAlchemy declarative base)
    Base.metadata.create_all(bind=engine)

    # 2. Add missing columns for existing SQLite databases
    db_url = str(engine.url)
    if "sqlite" in db_url:
        db_path = db_url.replace("sqlite:///", "").replace("sqlite://", "").replace("./", "")
        # Handle Windows paths
        import os
        if not os.path.isabs(db_path):
            db_path = os.path.join(os.path.dirname(__file__), db_path)

        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            c = conn.cursor()

            def add_col(table, col, col_type):
                try:
                    cols = [r[1] for r in c.execute(f"PRAGMA table_info({table})").fetchall()]
                    if cols and col not in cols:
                        c.execute(f"ALTER TABLE {table} ADD COLUMN {col} {col_type}")
                except Exception as e:
                    print(f"Note on migrating {table}.{col}: {e}")

            add_col("users", "username", "VARCHAR(100)")
            add_col("commodities", "initial_moisture_pct", "FLOAT DEFAULT 50.0")
            add_col("commodities", "critical_moisture_pct", "FLOAT DEFAULT 15.0")
            add_col("commodities", "lipid_pct", "FLOAT DEFAULT 5.0")
            add_col("commodities", "water_activity_aw", "FLOAT DEFAULT 0.7")
            add_col("commodities", "respiration_class", "VARCHAR(30) DEFAULT 'None'")
            add_col("commodities", "vm_o2", "FLOAT DEFAULT 0.0")
            add_col("commodities", "km_o2", "FLOAT DEFAULT 0.0")
            add_col("commodities", "optimal_temp_min", "FLOAT DEFAULT 0.0")
            add_col("commodities", "optimal_temp_max", "FLOAT DEFAULT 25.0")
            add_col("commodities", "max_tolerable_o2_uptake", "FLOAT DEFAULT 0.0")
            add_col("commodities", "oxidation_sensitivity", "VARCHAR(20) DEFAULT 'Low'")
            add_col("commodities", "light_sensitivity", "BOOLEAN DEFAULT 0")

            add_col("packaging_materials", "category_type", "VARCHAR(50) DEFAULT 'Monolayer'")
            add_col("packaging_materials", "nominal_thickness_um", "FLOAT DEFAULT 25.0")
            add_col("packaging_materials", "baseline_wvtr", "FLOAT DEFAULT 10.0")
            add_col("packaging_materials", "baseline_otr", "FLOAT DEFAULT 100.0")
            add_col("packaging_materials", "co2_permeability", "FLOAT DEFAULT 0.0")
            add_col("packaging_materials", "activation_energy_wvtr", "FLOAT DEFAULT 40.0")
            add_col("packaging_materials", "activation_energy_otr", "FLOAT DEFAULT 35.0")
            add_col("packaging_materials", "puncture_resistance_N", "FLOAT DEFAULT 5.0")
            add_col("packaging_materials", "seal_initiation_temp_C", "FLOAT DEFAULT 120.0")
            add_col("packaging_materials", "optical_haze_pct", "FLOAT DEFAULT 5.0")
            add_col("packaging_materials", "cost_per_kg_inr", "FLOAT DEFAULT 200.0")
            add_col("packaging_materials", "carbon_footprint_kgCO2", "FLOAT DEFAULT 3.0")
            add_col("packaging_materials", "recyclability_class", "VARCHAR(5) DEFAULT 'C'")
            add_col("packaging_materials", "fssai_certified", "BOOLEAN DEFAULT 1")

            conn.commit()
            conn.close()

if __name__ == "__main__":
    run_migrations()
    print("Migration executed successfully.")
