# PackSmart: Database Schema Documentation

This document describes the canonical PostgreSQL/SQLite relational schema for the PackSmart packaging recommendation platform.

---

## Entity Relationship Overview

```
 [User] (user_id PK)
   │ 1
   ├──────────< [Recommendation] (recommendation_id PK)
   │               │ 1
   │               ├───< [RecommendationMaterial] (rec_id FK, mat_id FK) >───┐
   │               ├───1 [ShelfLifePrediction] (rec_id FK)                   │
   │               ├───1 [MapAdvisory] (rec_id FK)                          │
   │               ├───< [QrCode] (rec_id FK) ───< [TraceabilityLog]         │
   │               └───< [Report] (rec_id FK)                               │
   ├──────────< [Report] (user_id FK)                                       │
   ├──────────< [Feedback] (user_id FK)                                     │
   └──────────1 [UserChecklistProgress] (user_id FK)                        │
                                                                            │
 [Commodity] (commodity_id PK)                                             │
   ├───< [CommodityAlias] (commodity_id FK)                                 │
   ├───< [Recommendation] (commodity_id FK)                                 │
   └───< [ResearchSource] (commodity_id FK)                                 │
                                                                            │
 [PackagingMaterial] (material_id PK) <────────────────────────────────────┘
   ├───1 [MaterialSustainabilityData] (material_id FK)
   └───< [ResearchSource] (material_id FK)

 [PackagingFormat] (format_id PK)
 [PreservativeCategory] (id PK)
 [ComplianceChecklist] (id PK)
 [MLModelRegistry] (model_id PK)
```

---

## 1. Core Tables

### `users`
Represents registered food manufacturers, researchers, agro-enterprises, and administrators.
- `user_id` (VARCHAR(36), PK): UUID identifier.
- `name` (VARCHAR(100), NOT NULL): Full name.
- `username` (VARCHAR(100), NULL): Display username.
- `email` (VARCHAR(150), UNIQUE, INDEX, NOT NULL): Normalized email address.
- `phone` (VARCHAR(30), NULL): Contact telephone.
- `password_hash` (VARCHAR(255), NULL): Bcrypt salted password hash.
- `auth_provider` (VARCHAR(50), DEFAULT 'email'): 'email', 'google', 'oauth'.
- `role` (VARCHAR(50), DEFAULT 'user'): 'guest', 'user', 'researcher', 'admin'.
- `organization_name` (VARCHAR(150), NULL): Registered farm/enterprise name.
- `created_at` (TIMESTAMP): UTC creation timestamp.
- `updated_at` (TIMESTAMP): UTC last modification timestamp.

---

### `commodities`
Food commodities with their biological and physiological properties.
- `commodity_id` (VARCHAR(36), PK): UUID identifier.
- `name` (VARCHAR(100), INDEX, NOT NULL): Common commercial name.
- `category` (VARCHAR(100), NOT NULL): e.g. fresh produce, bakery, snacks, dairy, meat & seafood.
- `default_moisture_content` / `initial_moisture_pct` (FLOAT): Wet-basis moisture percentage.
- `critical_moisture_pct` (FLOAT): Spoilage threshold moisture percentage.
- `default_oil_fat_content` / `lipid_pct` (FLOAT): Lipid content percentage.
- `default_ph` (FLOAT): Acidity index.
- `water_activity_aw` (FLOAT): Water activity aw (0.0 to 1.0).
- `default_respiration_rate` (FLOAT): Respiration rate in mL CO2/kg·hr.
- `respiration_class` (VARCHAR(30)): 'None', 'Low', 'Moderate', 'High', 'Very High'.
- `vm_o2` (FLOAT): Michaelis-Menten maximum O2 consumption rate.
- `km_o2` (FLOAT): Michaelis-Menten affinity constant (% O2).
- `optimal_temp_min` / `optimal_temp_max` (FLOAT): Optimal storage temperature window (°C).
- `max_tolerable_o2_uptake` (FLOAT): Maximum tolerable O2 uptake before rancidity/spoilage.
- `oxidation_sensitivity` (VARCHAR(20)): 'Low', 'Medium', 'High'.
- `light_sensitivity` (BOOLEAN): True if susceptible to photo-oxidation.
- `product_form` (VARCHAR(50)): 'solid', 'liquid', 'powder', 'semi-solid'.
- `is_custom` (BOOLEAN): True if created by an end-user.
- `created_by` (VARCHAR(36), FK users.user_id): Creator user ID.
- `created_at` (TIMESTAMP): UTC timestamp.

---

### `commodity_aliases`
Multi-lingual and regional naming variants for search autocomplete.
- `id` (INTEGER, PK, AUTOINCREMENT)
- `commodity_id` (VARCHAR(36), FK commodities.commodity_id, INDEX)
- `alias_name` (VARCHAR(100), INDEX, NOT NULL): e.g. "Hapus", "Aam", "Tamatar", "Cottage Cheese".
- `locale` (VARCHAR(10)): Language code ('en', 'hi', 'mr', etc.).

---

### `packaging_materials`
Technical specifications and physical barrier metrics for films and laminates.
- `material_id` (VARCHAR(36), PK): UUID identifier.
- `name` (VARCHAR(100), INDEX, NOT NULL): Polymer/laminate trade or generic name.
- `material_type` (VARCHAR(50), NOT NULL): 'plastic', 'laminate', 'biodegradable', 'foil', 'breathable film'.
- `category_type` (VARCHAR(50)): 'Monolayer', 'Substrate/Print Layer', 'Barrier Core Layer', 'Heat Sealant Layer'.
- `nominal_thickness_um` (FLOAT): Baseline film gauge in microns.
- `baseline_wvtr` (FLOAT): Standard water vapor transmission rate (g/m²·day).
- `baseline_otr` (FLOAT): Standard oxygen transmission rate (cc/m²·day·atm).
- `co2_permeability` (FLOAT): Carbon dioxide transmission rate (cc/m²·day·atm).
- `activation_energy_wvtr` / `activation_energy_otr` (FLOAT): Arrhenius activation energy (kJ/mol).
- `puncture_resistance_N` (FLOAT): Puncture strength in Newtons.
- `seal_initiation_temp_C` (FLOAT): Heat-sealing threshold temperature in °C.
- `optical_haze_pct` (FLOAT): Optical haze percentage.
- `cost_per_kg_inr` (FLOAT): Raw polymer cost in INR/kg.
- `carbon_footprint_kgCO2` (FLOAT): Cradle-to-gate carbon footprint (kg CO2e / kg material).
- `recyclability_class` (VARCHAR(5)): 'A', 'B', 'C', 'D'.
- `fssai_certified` (BOOLEAN): Complies with Indian Food Contact Regulations.
- `otr_range` / `wvtr_range` (VARCHAR(100)): Readable range display for converters.
- `thickness_range_microns` (VARCHAR(100)): Recommended conversion thickness.
- `mechanical_strength_index` (FLOAT, 1-10 scale).
- `sealability_rating` (VARCHAR(20)): 'low', 'medium', 'high'.
- `map_compatible` (BOOLEAN): Suitable for gas-flushing or micro-perforation.
- `cost_index` (FLOAT, 1-10 scale).
- `cost_estimate_local` (FLOAT): Estimated packaging conversion cost per m².
- `supplier_channel_note` (TEXT): Converter availability notes.
- `confidence_level` (FLOAT, 0-1): Experimental verification index.
- `source_reference` (TEXT): Literature citation or ASTM standard.
- `is_recyclable` (BOOLEAN): Mechanical circularity compatibility.
- `is_biodegradable` (BOOLEAN): Industrial/home compostable clearance.

---

### `material_sustainability_data`
LCA sustainability metrics for packaging polymers.
- `id` (INTEGER, PK, AUTOINCREMENT)
- `material_id` (VARCHAR(36), FK packaging_materials.material_id, UNIQUE)
- `sustainability_score` (FLOAT, 0-100 scale).
- `carbon_footprint_index` (FLOAT, kg CO2e / kg).
- `recyclability_notes` (TEXT): Sorting and mechanical processing constraints.

---

### `research_sources`
Traceable scientific citations, DOIs, ASTM standards, and peer-reviewed journals.
- `source_id` (VARCHAR(36), PK): UUID.
- `title` (VARCHAR(255), NOT NULL): Paper/standard title.
- `authors` (VARCHAR(255)): Authors or issuing body.
- `year` (INTEGER): Publication year.
- `doi` (VARCHAR(100)): Digital Object Identifier or standard code.
- `url` (VARCHAR(255)): Verification URL.
- `source_type` (VARCHAR(50)): 'standard', 'journal', 'book', 'database'.
- `property_measured` (VARCHAR(100)): e.g. OTR, WVTR, Respiration, Migration.
- `material_id` (VARCHAR(36), FK packaging_materials.material_id, NULL).
- `commodity_id` (VARCHAR(36), FK commodities.commodity_id, NULL).
- `test_conditions` (VARCHAR(150)): Temperature, RH, standard test method.
- `notes` (TEXT): Scientific remarks.

---

### `recommendations` & `recommendation_materials`
User analyses, input parameters, and ranked candidate materials.
- `recommendations`:
  - `recommendation_id` (VARCHAR(36), PK)
  - `user_id` (VARCHAR(36), FK users.user_id, INDEX, NULL for guests)
  - `commodity_id` (VARCHAR(36), FK commodities.commodity_id)
  - `commodity_name` (VARCHAR(100))
  - `input_moisture_content`, `input_oil_fat_content`, `input_ph`, `input_respiration_rate` (FLOAT)
  - `desired_shelf_life_days` (INTEGER)
  - `storage_type` (VARCHAR(50)): 'ambient', 'chilled', 'frozen'.
  - `storage_temperature`, `relative_humidity` (FLOAT)
  - `transport_mode` (VARCHAR(100))
  - `created_at` (TIMESTAMP, INDEX)
- `recommendation_materials`:
  - `id` (INTEGER, PK, AUTOINCREMENT)
  - `recommendation_id` (VARCHAR(36), FK recommendations.recommendation_id)
  - `material_id` (VARCHAR(36), FK packaging_materials.material_id)
  - `rank` (INTEGER)
  - `confidence_score` (FLOAT)
  - `recommended_thickness_microns`, `recommended_otr`, `recommended_wvtr` (FLOAT)
  - `explanation_text`, `source_reference` (TEXT)

---

### `ml_model_registry`
Auditable registry of machine learning models and deterministic ranking solvers.
- `model_id` (VARCHAR(36), PK)
- `model_name` (VARCHAR(100))
- `version` (VARCHAR(50))
- `status` (VARCHAR(50)): 'ACTIVE', 'UNAVAILABLE', 'CALIBRATING'.
- `accuracy_metric` (VARCHAR(50))
- `training_timestamp` (TIMESTAMP, NULL)
- `description` (TEXT)
