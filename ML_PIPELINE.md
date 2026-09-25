# PackSmart: Machine Learning Architecture & Integrity Protocol

This document details the Machine Learning pipeline design, data ingestion standards, and strict policy against fabricated metrics.

---

## 1. Zero-Fabrication Metric Policy (Section 19 & 20)

**Mandate**: Under no circumstance does the PackSmart backend fabricate training metrics, display synthetic accuracy percentages (e.g. fake "96.4% accuracy"), or return static simulated weights pretending to be neural models.

When an empirical trained weights file is absent:
- System Status endpoint (`/api/system/status`) returns `ml_model_status: "UNAVAILABLE"`.
- Admin panel reports: `"Rule-based scientific evaluation (no trained ML model active)"`.
- The recommendation engine continues to execute with 100% reliability using the **Deterministic Scientific Requirement Engine** and **TOPSIS Multi-Criteria Ranking Algorithm**.

---

## 2. ML Architecture & Pipeline Design

```
 Raw Industry Packaging Trials & Shelf-Life Logs
               │
               ▼
      [ Data Ingestion ] ─────────► [ Schema Validation (Pydantic) ]
                                                │
                                                ▼
                                    [ Feature Preprocessing ]
                                    - One-hot / target encoding for category
                                    - Log transform for wide-range OTR/WVTR
                                    - MinMax normalization
                                                │
                                                ▼
                                    [ Model Training & CV ]
                                    - Random Forest Regressor (Shelf-life)
                                    - Gradient Boosting / XGBoost (Ranker)
                                                │
                                                ▼
                                    [ Model Registry & Audit ]
                                    - Scikit-learn joblib serialization
                                    - Record in ml_model_registry table
                                                │
                                                ▼
                                    [ Inference Service ]
```

---

## 3. Training & Evaluation Pipeline Structure

The pipeline components are organized under `backend/ml/`:
- `data_pipeline/`: Ingestion scripts for empirical stability test records.
- `preprocessing/`: Scalers and feature transformers.
- `training/`: Scikit-learn pipelines with 5-fold cross-validation.
- `evaluation/`: Root Mean Squared Error (RMSE) and Spearman ranking correlation metrics.
- `registry/`: Versioned weights persistence with metadata logging.

---

## 4. Current Operational Engine

In the current production build:
- **Requirement Derivation**: Biochemical rules based on commodity respiration class, water activity, lipid concentration, and pH.
- **Polymer Ranking**: TOPSIS multi-criteria vector normalization against real database candidates.
- **Kinetic Simulation**: Arrhenius quality decay curves ($Q_{10}$ model).
