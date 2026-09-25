from .database import SessionLocal, engine, Base
from .models import (
    User, Commodity, PackagingMaterial, MaterialSustainabilityData,
    PackagingFormat, PreservativeCategory, ComplianceChecklist, UserChecklistProgress,
    CommodityAlias, ResearchSource, MLModelRegistry
)
from .services.auth import hash_password

def seed_database():
    from .migrate_db import run_migrations
    run_migrations()
    db = SessionLocal()

    # 1. Seed Users
    if not db.query(User).filter(User.email == "admin@packsmart.io").first():
        db.add_all([
            User(
                name="Chief Packaging Engineer",
                email="admin@packsmart.io",
                password_hash=hash_password("admin123"),
                role="admin",
                organization_name="PackSmart Food Institute"
            ),
            User(
                name="Dr. Elena Vance (Food Scientist)",
                email="researcher@packsmart.io",
                password_hash=hash_password("research123"),
                role="researcher",
                organization_name="Agricultural Research Center"
            )
        ])

    # 2. Seed Commodities
    if db.query(Commodity).count() == 0:
        commodities = [
            # Indian Market & Global Staples
            Commodity(name="Fresh Mangoes (Alphonso)", category="fresh produce", default_moisture_content=83.0, default_oil_fat_content=0.4, default_ph=4.5, default_respiration_rate=35.0, product_form="solid"),
            Commodity(name="Cavendish Bananas", category="fresh produce", default_moisture_content=74.0, default_oil_fat_content=0.3, default_ph=5.0, default_respiration_rate=45.0, product_form="solid"),
            Commodity(name="Vine Tomatoes", category="fresh produce", default_moisture_content=94.0, default_oil_fat_content=0.2, default_ph=4.4, default_respiration_rate=18.0, product_form="solid"),
            Commodity(name="Spinach / Leafy Greens", category="fresh produce", default_moisture_content=92.0, default_oil_fat_content=0.4, default_ph=6.5, default_respiration_rate=55.0, product_form="solid"),
            Commodity(name="Pasteurized Milk", category="dairy", default_moisture_content=88.0, default_oil_fat_content=3.5, default_ph=6.7, default_respiration_rate=0.0, product_form="liquid"),
            Commodity(name="Fresh Paneer (Cottage Cheese)", category="dairy", default_moisture_content=54.0, default_oil_fat_content=25.0, default_ph=5.8, default_respiration_rate=0.0, product_form="solid"),
            Commodity(name="Sliced Wheat Bread", category="bakery", default_moisture_content=38.0, default_oil_fat_content=4.0, default_ph=5.5, default_respiration_rate=0.0, product_form="solid"),
            Commodity(name="Ground Spices (Turmeric/Chili)", category="dry goods", default_moisture_content=9.0, default_oil_fat_content=10.0, default_ph=6.0, default_respiration_rate=0.0, product_form="powder"),
            Commodity(name="Raw Pulses (Lentils/Dal)", category="dry goods", default_moisture_content=10.0, default_oil_fat_content=1.5, default_ph=6.2, default_respiration_rate=0.0, product_form="solid"),
            Commodity(name="Ready-to-Eat Curry", category="prepared foods", default_moisture_content=70.0, default_oil_fat_content=15.0, default_ph=5.2, default_respiration_rate=0.0, product_form="semi-solid"),
            Commodity(name="Fresh Poultry (Chicken Breast)", category="meat & seafood", default_moisture_content=74.0, default_oil_fat_content=3.6, default_ph=6.0, default_respiration_rate=0.0, product_form="solid"),
            Commodity(name="Fresh Seafood (Shrimp/Prawns)", category="meat & seafood", default_moisture_content=78.0, default_oil_fat_content=1.0, default_ph=6.8, default_respiration_rate=0.0, product_form="solid"),
            Commodity(name="Fresh Apples (Royal Gala)", category="fresh produce", default_moisture_content=85.0, default_oil_fat_content=0.2, default_ph=3.8, default_respiration_rate=8.5, product_form="solid"),
            Commodity(name="Crisp Potato Chips", category="snacks", default_moisture_content=2.0, default_oil_fat_content=35.0, default_ph=6.2, default_respiration_rate=0.0, product_form="solid"),
            Commodity(name="Roasted Whole Coffee Beans", category="dry goods", default_moisture_content=3.5, default_oil_fat_content=14.0, default_ph=5.0, default_respiration_rate=0.0, product_form="solid"),
            Commodity(name="Aged Cheddar Cheese", category="dairy", default_moisture_content=37.0, default_oil_fat_content=33.0, default_ph=5.2, default_respiration_rate=0.0, product_form="solid"),
            Commodity(name="Basmati Rice (Raw)", category="dry goods", default_moisture_content=12.0, default_oil_fat_content=0.5, default_ph=6.0, default_respiration_rate=0.0, product_form="solid"),
            Commodity(name="Onions (Dry Bulb)", category="fresh produce", default_moisture_content=89.0, default_oil_fat_content=0.1, default_ph=5.5, default_respiration_rate=6.0, product_form="solid"),
            Commodity(name="Fresh Green Chilies", category="fresh produce", default_moisture_content=87.0, default_oil_fat_content=0.4, default_ph=5.0, default_respiration_rate=25.0, product_form="solid"),
            Commodity(name="Yogurt / Dahi", category="dairy", default_moisture_content=85.0, default_oil_fat_content=3.5, default_ph=4.2, default_respiration_rate=0.0, product_form="semi-solid"),
            Commodity(name="Fresh Strawberries", category="fresh produce", default_moisture_content=91.0, default_oil_fat_content=0.3, default_ph=3.5, default_respiration_rate=45.0, product_form="solid"),
            Commodity(name="Frozen Green Peas", category="frozen produce", default_moisture_content=78.0, default_oil_fat_content=0.4, default_ph=6.5, default_respiration_rate=0.0, product_form="solid")
        ]
        db.add_all(commodities)

    # 3. Seed Packaging Materials & Sustainability Data
    if db.query(PackagingMaterial).count() == 0:
        materials_data = [
            {
                "mat": PackagingMaterial(
                    name="Micro-Perforated BOPP Film",
                    material_type="breathable film",
                    otr_range="10,000 - 15,000",
                    wvtr_range="15 - 25",
                    thickness_range_microns="25 - 35",
                    mechanical_strength_index=7.5,
                    sealability_rating="high",
                    gas_permeability_notes="Equilibrium modified atmosphere micro-laser apertures tailored for respiring fruits and vegetables.",
                    map_compatible=True,
                    cost_index=4.2,
                    cost_estimate_local=35.0, # INR per kg approx
                    supplier_channel_note="Widely available from local flexible packaging converters (e.g., Uflex, Cosmo Films).",
                    confidence_level=0.95,
                    source_reference="Typical values for micro-perforated produce films (Industry Datasheets)",
                    is_recyclable=True,
                    is_biodegradable=False
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=72.0, 
                    carbon_footprint_index=2.2, 
                    recyclability_notes="Mono-material Polypropylene stream (SPI Code 5). Readily curbside recyclable."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="EVOH Multilayer Barrier Laminate (PA/EVOH/PE)",
                    material_type="laminate",
                    otr_range="0.5 - 2.5",
                    wvtr_range="1.5 - 3.0",
                    thickness_range_microns="65 - 100",
                    mechanical_strength_index=9.5,
                    sealability_rating="high",
                    gas_permeability_notes="Ultra-high gas barrier core preventing oxygen ingress for fresh meat, poultry, and paneer.",
                    map_compatible=True,
                    cost_index=7.8,
                    cost_estimate_local=280.0, # INR per kg approx
                    supplier_channel_note="Requires specialized multilayer extrusion suppliers (e.g., Amcor, Sealed Air).",
                    confidence_level=0.98,
                    source_reference="Industry standard for EVOH high barrier laminates",
                    is_recyclable=False,
                    is_biodegradable=False
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=48.0,
                    carbon_footprint_index=3.8, 
                    recyclability_notes="Complex multilayer structure; requires specialized compatibilizer recycling facilities."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="Metallized BOPP / LLDPE Laminate",
                    material_type="laminate",
                    otr_range="0.5 - 1.2",
                    wvtr_range="0.3 - 0.8",
                    thickness_range_microns="55 - 75",
                    mechanical_strength_index=8.0,
                    sealability_rating="high",
                    gas_permeability_notes="High optical opacity and moisture barrier; ideal for snacks, chips, and ground spices.",
                    map_compatible=True,
                    cost_index=5.5,
                    cost_estimate_local=180.0,
                    supplier_channel_note="Standard commodity laminate, readily sourced from regional packaging printers.",
                    confidence_level=0.95,
                    source_reference="Typical metallized BOPP film data",
                    is_recyclable=False,
                    is_biodegradable=False
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=52.0,
                    carbon_footprint_index=3.1, 
                    recyclability_notes="Vapor-deposited aluminum layer limits conventional mechanical recycling."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="Polylactic Acid (PLA) Bio-Film",
                    material_type="biodegradable",
                    otr_range="400 - 800",
                    wvtr_range="18 - 30",
                    thickness_range_microns="30 - 50",
                    mechanical_strength_index=6.2,
                    sealability_rating="medium",
                    gas_permeability_notes="Derived from renewable plant starch; composts in industrial facilities.",
                    map_compatible=True,
                    cost_index=6.9,
                    cost_estimate_local=350.0,
                    supplier_channel_note="Specialty bio-plastics suppliers (e.g., NatureWorks distributors). Can be imported.",
                    confidence_level=0.92,
                    source_reference="NatureWorks Ingeo PLA Technical Datasheet",
                    is_recyclable=False,
                    is_biodegradable=True
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=94.0, 
                    carbon_footprint_index=0.85, 
                    recyclability_notes="Certified EN 13432 & ASTM D6400 industrial compostable."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="Linear Low-Density Polyethylene (LLDPE)",
                    material_type="plastic",
                    otr_range="3000 - 5000",
                    wvtr_range="10 - 15",
                    thickness_range_microns="40 - 80",
                    mechanical_strength_index=8.8,
                    sealability_rating="high",
                    gas_permeability_notes="Superior puncture resistance; workhorse for frozen food like peas.",
                    map_compatible=False,
                    cost_index=3.2,
                    cost_estimate_local=120.0,
                    supplier_channel_note="Commodity resin, extremely widespread local availability.",
                    confidence_level=0.95,
                    source_reference="Typical PE film physical properties",
                    is_recyclable=True,
                    is_biodegradable=False
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=68.0,
                    carbon_footprint_index=1.9, 
                    recyclability_notes="Category 4 LDPE stream. Widely reprocessed into post-consumer resin."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="Aluminum Foil Co-Laminate (PET/ALU/PE)",
                    material_type="foil",
                    otr_range="0.01 - 0.05",
                    wvtr_range="0.01 - 0.05",
                    thickness_range_microns="75 - 120",
                    mechanical_strength_index=9.8,
                    sealability_rating="high",
                    gas_permeability_notes="Hermetic barrier to all gases, light, UV, and moisture. Ideal for coffee and sensitive spices.",
                    map_compatible=True,
                    cost_index=8.5,
                    cost_estimate_local=420.0,
                    supplier_channel_note="Premium laminators; requires specialized adhesive lamination.",
                    confidence_level=0.99,
                    source_reference="Industry absolute barrier standard (e.g. flexible pouch specs)",
                    is_recyclable=False,
                    is_biodegradable=False
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=36.0,
                    carbon_footprint_index=6.4, 
                    recyclability_notes="Energy-intensive virgin bauxite smelting. Difficult to separate layers."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="Retort Pouch Laminate (PET/ALOX/CPP)",
                    material_type="laminate",
                    otr_range="0.1 - 0.5",
                    wvtr_range="0.1 - 0.5",
                    thickness_range_microns="90 - 130",
                    mechanical_strength_index=9.5,
                    sealability_rating="high",
                    gas_permeability_notes="High temperature resistance (121°C). Ideal for Ready-to-Eat curries.",
                    map_compatible=True,
                    cost_index=8.0,
                    cost_estimate_local=380.0,
                    supplier_channel_note="Specialized retort packaging suppliers with high-temp adhesive systems.",
                    confidence_level=0.90,
                    source_reference="Estimated - clear retort pouch specs (ALOx barrier)",
                    is_recyclable=False,
                    is_biodegradable=False
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=45.0,
                    carbon_footprint_index=4.1, 
                    recyclability_notes="Complex multilayer, difficult to mechanically recycle."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="Cast Polypropylene (CPP) Film",
                    material_type="plastic",
                    otr_range="1000 - 2500",
                    wvtr_range="5 - 10",
                    thickness_range_microns="30 - 60",
                    mechanical_strength_index=7.0,
                    sealability_rating="high",
                    gas_permeability_notes="Good clarity and heat sealability. Common for bread and bakery items.",
                    map_compatible=False,
                    cost_index=3.8,
                    cost_estimate_local=140.0,
                    supplier_channel_note="Widely available from local film extruders.",
                    confidence_level=0.95,
                    source_reference="Standard CPP film properties",
                    is_recyclable=True,
                    is_biodegradable=False
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=70.0,
                    carbon_footprint_index=2.0, 
                    recyclability_notes="Recyclable in PP streams (SPI Code 5)."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="Recycled PET (rPET) Clamshells",
                    material_type="rigid plastic",
                    otr_range="20 - 50",
                    wvtr_range="2 - 5",
                    thickness_range_microns="200 - 400",
                    mechanical_strength_index=8.5,
                    sealability_rating="low",
                    gas_permeability_notes="Rigid protection for delicate fruits (strawberries, tomatoes). Highly ventilated.",
                    map_compatible=False,
                    cost_index=4.5,
                    cost_estimate_local=220.0,
                    supplier_channel_note="Thermoforming suppliers. Widely available.",
                    confidence_level=0.90,
                    source_reference="Estimated - typical rigid PET sheet properties",
                    is_recyclable=True,
                    is_biodegradable=False
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=85.0,
                    carbon_footprint_index=1.2, 
                    recyclability_notes="High circularity. Readily recycled in bottle/clamshell streams (SPI Code 1)."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="High-Density Polyethylene (HDPE) Bottles",
                    material_type="rigid plastic",
                    otr_range="100 - 200",
                    wvtr_range="1 - 2",
                    thickness_range_microns="500 - 800",
                    mechanical_strength_index=9.0,
                    sealability_rating="medium",
                    gas_permeability_notes="Excellent moisture barrier, widely used for liquid milk packaging.",
                    map_compatible=False,
                    cost_index=4.0,
                    cost_estimate_local=160.0,
                    supplier_channel_note="Blow molding suppliers. Extremely common.",
                    confidence_level=0.98,
                    source_reference="Typical HDPE bottle specs",
                    is_recyclable=True,
                    is_biodegradable=False
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=80.0,
                    carbon_footprint_index=1.8, 
                    recyclability_notes="Highly recyclable globally (SPI Code 2)."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="Vacuum Skin Packaging (VSP) Film",
                    material_type="laminate",
                    otr_range="2 - 10",
                    wvtr_range="2 - 5",
                    thickness_range_microns="75 - 150",
                    mechanical_strength_index=9.2,
                    sealability_rating="high",
                    gas_permeability_notes="Drapes perfectly over products. Ideal for premium seafood and fresh meat cuts.",
                    map_compatible=False,
                    cost_index=8.2,
                    cost_estimate_local=400.0,
                    supplier_channel_note="Specialized VSP film suppliers (e.g., Cryovac/Sealed Air).",
                    confidence_level=0.90,
                    source_reference="Estimated - VSP high barrier specs",
                    is_recyclable=False,
                    is_biodegradable=False
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=40.0,
                    carbon_footprint_index=4.5, 
                    recyclability_notes="Multilayer ionomer/barrier structures; challenging to recycle."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="Oriented Polyamide (OPA/Nylon) Film",
                    material_type="plastic",
                    otr_range="30 - 50",
                    wvtr_range="150 - 200",
                    thickness_range_microns="15 - 25",
                    mechanical_strength_index=9.0,
                    sealability_rating="medium",
                    gas_permeability_notes="High toughness and pinhole resistance. Often laminated with PE for cheese packaging.",
                    map_compatible=True,
                    cost_index=5.8,
                    cost_estimate_local=280.0,
                    supplier_channel_note="Imported or supplied by major regional film distributors.",
                    confidence_level=0.92,
                    source_reference="Typical OPA/Nylon film properties",
                    is_recyclable=False,
                    is_biodegradable=False
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=55.0,
                    carbon_footprint_index=3.5, 
                    recyclability_notes="Difficult to recycle mechanically."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="Cellulose-based Compostable Film",
                    material_type="biodegradable",
                    otr_range="10 - 20",
                    wvtr_range="200 - 300",
                    thickness_range_microns="20 - 45",
                    mechanical_strength_index=6.5,
                    sealability_rating="medium",
                    gas_permeability_notes="Excellent dead-fold properties. High moisture permeability.",
                    map_compatible=False,
                    cost_index=7.5,
                    cost_estimate_local=450.0,
                    supplier_channel_note="Niche bio-materials suppliers (e.g., Futamura NatureFlex).",
                    confidence_level=0.95,
                    source_reference="NatureFlex typical specs",
                    is_recyclable=False,
                    is_biodegradable=True
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=90.0,
                    carbon_footprint_index=1.0, 
                    recyclability_notes="Home and industrial compostable."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="Molded Pulp Trays",
                    material_type="paper/board",
                    otr_range="N/A",
                    wvtr_range="N/A",
                    thickness_range_microns="1000 - 2000",
                    mechanical_strength_index=6.0,
                    sealability_rating="low",
                    gas_permeability_notes="Provides cushioning. Completely breathable. Used for apples, eggs.",
                    map_compatible=False,
                    cost_index=2.5,
                    cost_estimate_local=80.0,
                    supplier_channel_note="Local paper molding facilities. Very common.",
                    confidence_level=0.98,
                    source_reference="General knowledge - Molded Pulp properties",
                    is_recyclable=True,
                    is_biodegradable=True
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=98.0,
                    carbon_footprint_index=0.5, 
                    recyclability_notes="Made from recycled paper. Highly recyclable and compostable."
                )
            },
            {
                "mat": PackagingMaterial(
                    name="Polyethylene Terephthalate (PET) Bottles",
                    material_type="rigid plastic",
                    otr_range="50 - 100",
                    wvtr_range="2 - 4",
                    thickness_range_microns="300 - 500",
                    mechanical_strength_index=8.5,
                    sealability_rating="high",
                    gas_permeability_notes="Clear, strong barrier for juices and premium milk products.",
                    map_compatible=False,
                    cost_index=4.2,
                    cost_estimate_local=190.0,
                    supplier_channel_note="Stretch blow molding suppliers. Widely accessible.",
                    confidence_level=0.96,
                    source_reference="Typical PET bottle barrier properties",
                    is_recyclable=True,
                    is_biodegradable=False
                ),
                "sust": MaterialSustainabilityData(
                    sustainability_score=82.0,
                    carbon_footprint_index=1.6, 
                    recyclability_notes="Widely recycled in local curbside streams (SPI Code 1)."
                )
            }
        ]

        for item in materials_data:
            mat = item["mat"]
            sust = item["sust"]
            mat.sustainability_data = sust
            db.add(mat)

    # 4. Seed Graphical Packaging Formats
    if db.query(PackagingFormat).count() == 0:
        formats = [
            PackagingFormat(
                format_id="stand-up-pouch",
                name="Stand-up Pouch (Doypack)",
                diagram_svg="""<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><defs><linearGradient id="supGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#10b981" stop-opacity="0.25"/><stop offset="100%" stop-color="#059669" stop-opacity="0.45"/></linearGradient></defs><path d="M45 40 L155 40 L170 195 C170 215, 30 215, 30 195 Z" fill="url(#supGrad)" stroke="#10b981" stroke-width="2.5" stroke-linejoin="round"/><rect x="42" y="25" width="116" height="15" rx="3" fill="#047857" stroke="#10b981" stroke-width="1.5"/><line x1="42" y1="32" x2="52" y2="32" stroke="#f59e0b" stroke-width="2"/><line x1="148" y1="32" x2="158" y2="32" stroke="#f59e0b" stroke-width="2"/><line x1="48" y1="52" x2="152" y2="52" stroke="#6ee7b7" stroke-width="1.5" stroke-dasharray="4 2"/><path d="M30 195 C70 180, 130 180, 170 195" fill="none" stroke="#059669" stroke-width="2"/><ellipse cx="100" cy="198" rx="65" ry="14" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1.5"/><text x="100" y="20" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">HERMETIC HEAT SEAL</text><text x="100" y="66" fill="#34d399" font-size="9" font-family="sans-serif" text-anchor="middle">RECLOSABLE ZIPPER</text><text x="100" y="130" fill="#f8fafc" font-size="12" font-family="sans-serif" text-anchor="middle" font-weight="bold">STAND-UP DOYPACK</text><text x="100" y="228" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">OVAL BOTTOM GUSSET</text></svg>""",
                typical_use_cases=["Spices & Seasonings", "Granola & Breakfast Cereals", "Roasted Coffee Beans", "Pet Kibble", "Dry Fruit & Nuts"],
                pros="Excellent retail shelf presence; 70% lighter and less bulky than glass jars; optional resealable zipper maintains freshness after opening.",
                cons="Higher filling machine complexity than simple pillow pouches; bottom gusset may occasionally trap fine powder residues.",
                related_material_ids=["m2", "m6", "m9"]
            ),
            PackagingFormat(
                format_id="retort-pouch",
                name="Retort Pouch",
                diagram_svg="""<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><defs><linearGradient id="retortGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#cbd5e1" stop-opacity="0.35"/><stop offset="100%" stop-color="#64748b" stop-opacity="0.65"/></linearGradient></defs><rect x="35" y="30" width="130" height="175" rx="4" fill="url(#retortGrad)" stroke="#94a3b8" stroke-width="2.5"/><rect x="42" y="37" width="116" height="161" rx="2" fill="#0f172a" fill-opacity="0.4" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2 2"/><polygon points="35,55 45,60 35,65" fill="#f59e0b"/><polygon points="165,55 155,60 165,65" fill="#f59e0b"/><circle cx="100" cy="115" r="28" fill="#dc2626" fill-opacity="0.15" stroke="#ef4444" stroke-width="1.5"/><text x="100" y="112" fill="#ef4444" font-size="9" font-family="sans-serif" text-anchor="middle" font-weight="bold">121°C RETORT</text><text x="100" y="124" fill="#cbd5e1" font-size="8" font-family="sans-serif" text-anchor="middle">AUTOCLAVE</text><text x="100" y="20" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">HIGH-BARRIER FOIL LAMINATE</text><text x="100" y="222" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">4-SIDE HERMETIC FIN SEAL</text></svg>""",
                typical_use_cases=["Ready-to-Eat Indian Curries (Paneer Makhani, Dal)", "Wet Pet Food", "Pre-cooked Rice & Grains", "Military Rations (MRE)"],
                pros="Replaces heavy metal cans; withstands high-pressure autoclave sterilization (121°C); shelf-stable for 12-24 months at ambient room temperature without cold chain.",
                cons="Non-resealable once opened; multi-layer foil laminates have historically presented mechanical recycling challenges.",
                related_material_ids=["m2", "m6"]
            ),
            PackagingFormat(
                format_id="flow-wrap",
                name="Flow Wrap / Pillow Pouch",
                diagram_svg="""<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><defs><linearGradient id="fwGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25"/><stop offset="100%" stop-color="#d97706" stop-opacity="0.45"/></linearGradient></defs><rect x="30" y="55" width="140" height="120" rx="14" fill="url(#fwGrad)" stroke="#f59e0b" stroke-width="2.5"/><path d="M30 55 L15 65 L22 80 L15 95 L22 110 L15 125 L22 140 L15 155 L22 165 L30 175 Z" fill="#b45309" stroke="#f59e0b" stroke-width="1.5"/><path d="M170 55 L185 65 L178 80 L185 95 L178 110 L185 125 L178 140 L185 155 L178 165 L170 175 Z" fill="#b45309" stroke="#f59e0b" stroke-width="1.5"/><line x1="30" y1="115" x2="170" y2="115" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 3"/><text x="100" y="42" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">HORIZONTAL FLOW WRAP</text><text x="100" y="105" fill="#fef3c7" font-size="11" font-family="sans-serif" text-anchor="middle" font-weight="bold">PILLOW POUCH</text><text x="100" y="132" fill="#fbbf24" font-size="8" font-family="sans-serif" text-anchor="middle">LONGITUDINAL BACK SEAL</text><text x="100" y="205" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">SERRATED END-CRIMPS</text></svg>""",
                typical_use_cases=["Biscuits & Cookies", "Potato Chips & Extruded Snacks", "Chocolate Confectionery", "Bread Loaves", "Energy Bars"],
                pros="Fastest packaging line throughput (up to 400 packs/min on HFFS equipment); lowest cost-per-unit packaging format.",
                cons="Cannot stand upright on store shelves without secondary shelf-ready trays; prone to crush damage during transit without nitrogen gas cushion.",
                related_material_ids=["m4", "m7"]
            ),
            PackagingFormat(
                format_id="tray-lidding",
                name="Barrier Tray + Lidding Film",
                diagram_svg="""<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><defs><linearGradient id="trayGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25"/><stop offset="100%" stop-color="#0284c7" stop-opacity="0.45"/></linearGradient></defs><polygon points="30,80 170,80 155,185 45,185" fill="url(#trayGrad)" stroke="#0284c7" stroke-width="2.5"/><rect x="22" y="70" width="156" height="15" rx="3" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5"/><path d="M25 72 L165 72 L160 83 L28 83 Z" fill="#e0f2fe" fill-opacity="0.6"/><path d="M165 72 L178 60 L168 83 Z" fill="#38bdf8" stroke="#7dd3fc" stroke-width="1.5"/><circle cx="100" cy="135" r="22" fill="#0ea5e9" fill-opacity="0.15" stroke="#38bdf8" stroke-width="1.5"/><text x="100" y="132" fill="#38bdf8" font-size="9" font-family="sans-serif" text-anchor="middle" font-weight="bold">MAP GAS</text><text x="100" y="144" fill="#bae6fd" font-size="8" font-family="sans-serif" text-anchor="middle">HEADSPACE</text><text x="100" y="35" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">PEELABLE LIDDING FILM</text><text x="100" y="210" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">THERMOFORMED RIGID TRAY</text></svg>""",
                typical_use_cases=["Fresh Poultry & Red Meat", "Seafood Fillets", "Prepared Chilled Salads", "Fresh Berries & Grapes", "Gourmet Cheeses"],
                pros="Provides physical crush protection; perfect for high-barrier Modified Atmosphere Packaging (MAP); crystal-clear consumer inspection window.",
                cons="Bulkier storage footprint prior to packing than rollstock films; higher material weight than flexible pouches.",
                related_material_ids=["m2", "m8"]
            ),
            PackagingFormat(
                format_id="vacuum-pack",
                name="Vacuum Pack / Skin Pack",
                diagram_svg="""<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><defs><linearGradient id="vacGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a855f7" stop-opacity="0.25"/><stop offset="100%" stop-color="#7e22ce" stop-opacity="0.45"/></linearGradient></defs><rect x="30" y="35" width="140" height="170" rx="6" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="4 2"/><path d="M50 75 C60 55, 140 55, 150 75 C165 95, 160 160, 145 175 C130 185, 70 185, 55 175 C40 160, 35 95, 50 75 Z" fill="url(#vacGrad)" stroke="#c084fc" stroke-width="2.5"/><line x1="20" y1="120" x2="38" y2="120" stroke="#c084fc" stroke-width="2"/><polygon points="38,116 44,120 38,124" fill="#c084fc"/><line x1="180" y1="120" x2="162" y2="120" stroke="#c084fc" stroke-width="2"/><polygon points="162,116 156,120 162,124" fill="#c084fc"/><text x="100" y="25" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">ZERO-HEADSPACE HERMETIC</text><text x="100" y="115" fill="#f3e8ff" font-size="11" font-family="sans-serif" text-anchor="middle" font-weight="bold">VACUUM SKIN PACK</text><text x="100" y="130" fill="#d8b4fe" font-size="8" font-family="sans-serif" text-anchor="middle">TIGHT BARRIER MEMBRANE</text><text x="100" y="225" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">ANAEROBIC SPOILAGE PREVENTION</text></svg>""",
                typical_use_cases=["Cured Meats & Sausages", "Fresh Paneer Blocks", "Marinated Fish", "Hard Aged Cheeses", "Smoked Salmon"],
                pros="Completely eliminates atmospheric oxygen, virtually halting aerobic bacterial proliferation; immobilizes product to prevent in-package transit abrasion.",
                cons="In fresh red meat, deoxygenation turns meat temporarily purplish/brown (blooms back to red upon opening); not suitable for crushing-sensitive foods.",
                related_material_ids=["m2", "m5"]
            ),
            PackagingFormat(
                format_id="blister-pack",
                name="Blister Pack / Push-Through Pack",
                diagram_svg="""<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><defs><linearGradient id="blistGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#06b6d4" stop-opacity="0.25"/><stop offset="100%" stop-color="#0891b2" stop-opacity="0.45"/></linearGradient></defs><rect x="30" y="35" width="140" height="170" rx="8" fill="url(#blistGrad)" stroke="#06b6d4" stroke-width="2"/><rect x="48" y="55" width="42" height="32" rx="10" fill="#0891b2" fill-opacity="0.3" stroke="#22d3ee" stroke-width="1.5"/><rect x="110" y="55" width="42" height="32" rx="10" fill="#0891b2" fill-opacity="0.3" stroke="#22d3ee" stroke-width="1.5"/><rect x="48" y="100" width="42" height="32" rx="10" fill="#0891b2" fill-opacity="0.3" stroke="#22d3ee" stroke-width="1.5"/><rect x="110" y="100" width="42" height="32" rx="10" fill="#0891b2" fill-opacity="0.3" stroke="#22d3ee" stroke-width="1.5"/><rect x="48" y="145" width="42" height="32" rx="10" fill="#0891b2" fill-opacity="0.3" stroke="#22d3ee" stroke-width="1.5"/><rect x="110" y="145" width="42" height="32" rx="10" fill="#0891b2" fill-opacity="0.3" stroke="#22d3ee" stroke-width="1.5"/><text x="100" y="25" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">PUSH-THROUGH FOIL BACKING</text><text x="100" y="225" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">INDIVIDUAL DOSE CAVITIES</text></svg>""",
                typical_use_cases=["Lozenges & Hard Candies", "Dietary Supplements & Nutra-gummies", "Chewing Gum", "Single-portion Spice Pods"],
                pros="Each individual piece remains hermetically sealed until exact consumption moment; tamper-evident and easy to count/audit.",
                cons="Relatively high ratio of packaging material per gram of product; requires specialized thermoform-fill-seal blister machinery.",
                related_material_ids=["m6", "m8"]
            ),
            PackagingFormat(
                format_id="sachet-stick",
                name="Sachet & Stick Pack",
                diagram_svg="""<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><defs><linearGradient id="stickGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#eab308" stop-opacity="0.35"/><stop offset="100%" stop-color="#ca8a04" stop-opacity="0.55"/></linearGradient></defs><rect x="75" y="30" width="50" height="175" rx="4" fill="url(#stickGrad)" stroke="#eab308" stroke-width="2.5"/><rect x="73" y="30" width="54" height="18" fill="#a16207" stroke="#eab308" stroke-width="1.5"/><rect x="73" y="187" width="54" height="18" fill="#a16207" stroke="#eab308" stroke-width="1.5"/><polygon points="73,42 81,45 73,48" fill="#facc15"/><text x="100" y="20" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">SINGLE-SERVE STICK PACK</text><text x="100" y="115" fill="#fef08a" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold" transform="rotate(-90 100 115)">POWDER / LIQUID</text><text x="100" y="225" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">ACCURATE PORTION CONTROL</text></svg>""",
                typical_use_cases=["Instant Coffee & Drink Mixes", "Single-serve Sugar & Salt", "Condiment Pastes (Ketchup/Mayo)", "Protein Powder Samples", "Honey"],
                pros="Uses 30-40% less flexible film than a traditional 4-side square sachet; highly portable and convenient for on-the-go consumers.",
                cons="Small print area limits labeling information; difficult to mechanically recycle through standard post-consumer curbside sorting.",
                related_material_ids=["m4", "m6"]
            ),
            PackagingFormat(
                format_id="micro-perf-bag",
                name="Micro-Perforated Produce & Bakery Bag",
                diagram_svg="""<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><defs><linearGradient id="perfGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#10b981" stop-opacity="0.2"/><stop offset="100%" stop-color="#059669" stop-opacity="0.35"/></linearGradient></defs><rect x="35" y="40" width="130" height="160" rx="10" fill="url(#perfGrad)" stroke="#10b981" stroke-width="2"/><circle cx="65" cy="80" r="2.5" fill="#34d399"/><circle cx="100" cy="80" r="2.5" fill="#34d399"/><circle cx="135" cy="80" r="2.5" fill="#34d399"/><circle cx="82" cy="105" r="2.5" fill="#34d399"/><circle cx="118" cy="105" r="2.5" fill="#34d399"/><circle cx="65" cy="130" r="2.5" fill="#34d399"/><circle cx="100" cy="130" r="2.5" fill="#34d399"/><circle cx="135" cy="130" r="2.5" fill="#34d399"/><circle cx="82" cy="155" r="2.5" fill="#34d399"/><circle cx="118" cy="155" r="2.5" fill="#34d399"/><path d="M100 70 L100 55 M95 60 L100 55 L105 60" stroke="#6ee7b7" stroke-width="1.5"/><text x="100" y="50" fill="#6ee7b7" font-size="8" font-family="sans-serif" text-anchor="middle">CO₂ RELEASE</text><path d="M100 170 L100 185 M95 180 L100 185 L105 180" stroke="#34d399" stroke-width="1.5"/><text x="100" y="196" fill="#34d399" font-size="8" font-family="sans-serif" text-anchor="middle">O₂ INTAKE</text><text x="100" y="25" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">LASER MICRO-PERFORATIONS</text><text x="100" y="225" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">BREATHABLE / EQUILIBRIUM MAP</text></svg>""",
                typical_use_cases=["Sourdough Bread & Baguettes", "Fresh Apples & Pears", "Fresh Mushrooms", "Cherry Tomatoes", "Fresh Cilantro / Leafy Greens"],
                pros="Allows controlled gas exchange to prevent condensation, mold, and anaerobic fermentation in living produce or moisture-rich fresh bakery.",
                cons="Not gas-tight; cannot hold a positive vacuum or preserve oxygen-free nitrogen flush.",
                related_material_ids=["m1", "m3"]
            )
        ]
        db.add_all(formats)

    # 5. Seed Preservatives & Additives Guide
    if db.query(PreservativeCategory).count() == 0:
        preservatives = [
            PreservativeCategory(
                category="Antimicrobials & Mold Inhibitors",
                common_examples=["Potassium Sorbate", "Sodium Benzoate", "Rosemary Extract", "Cultured Dextrose / Fermented Whey", "Nisin"],
                typical_food_use_cases=["Bakery items (bread, cakes)", "Fruit jams & jellies", "Beverages & squashes", "Pickles & sauces", "Cheese surfaces"],
                natural_vs_synthetic="Both Available (e.g. Rosemary Extract & Nisin are natural; Potassium Sorbate is synthetic)",
                regulatory_disclaimer="Usage limits (in mg/kg or ppm) are legally defined by food category and jurisdiction. Always verify the current permitted maximum residue limit in the official statutory portal before formulation.",
                official_source_link="https://www.fssai.gov.in"
            ),
            PreservativeCategory(
                category="Antioxidants & Anti-Rancidity Agents",
                common_examples=["Tocopherols (Mixed Vitamin E)", "Ascorbic Acid (Vitamin C)", "Rosemary Extract", "BHA (Butylated Hydroxyanisole)", "BHT", "TBHQ"],
                typical_food_use_cases=["Edible oils & fats", "Potato chips & extruded snacks", "Processed meat & poultry", "Roasted nuts", "Butter & spreads"],
                natural_vs_synthetic="Both Available (e.g. Mixed Tocopherols & Ascorbic Acid are natural/nature-identical; TBHQ & BHA are synthetic)",
                regulatory_disclaimer="Certain synthetic antioxidants carry strict maximum limits in combination with gallates or BHA. Check Codex GSFA and national regulations for fat-basis calculations.",
                official_source_link="https://www.fao.org/gsfaonline/index.html"
            ),
            PreservativeCategory(
                category="Acidity Regulators & pH Stabilizers",
                common_examples=["Citric Acid", "Lactic Acid", "Acetic Acid (Vinegar)", "Malic Acid", "Sodium Citrate"],
                typical_food_use_cases=["Ready-to-eat curries", "Tomato sauces & purees", "Carbonated beverages", "Confectionery", "Canned vegetables"],
                natural_vs_synthetic="Natural & Bio-fermented (typically produced by microbial fermentation)",
                regulatory_disclaimer="Generally recognized as safe (GRAS) or permitted under Good Manufacturing Practice (GMP) in many categories, but specific beverages have titratable acidity caps.",
                official_source_link="https://www.fssai.gov.in"
            ),
            PreservativeCategory(
                category="Humectants & Moisture Retainers",
                common_examples=["Glycerol (Glycerin)", "Sorbitol", "Propylene Glycol", "Sodium Lactate"],
                typical_food_use_cases=["Soft-baked cookies & cakes", "Dried fruits", "Confectionery fillings", "Shredded coconut", "Chewy candies"],
                natural_vs_synthetic="Both Available (Plant-derived Glycerol vs synthetic food-grade glycols)",
                regulatory_disclaimer="Excessive polyol consumption may produce a laxative effect, requiring specific statutory warning text on packaging in several jurisdictions.",
                official_source_link="https://www.fda.gov/food/food-additives-petitions/substances-added-food-formerly-eafus"
            ),
            PreservativeCategory(
                category="Anti-caking & Emulsifiers",
                common_examples=["Soy Lecithin / Sunflower Lecithin", "Silicon Dioxide", "Mono- and Di-glycerides of Fatty Acids", "Magnesium Stearate"],
                typical_food_use_cases=["Ground spice powders", "Milk powder & creamer", "Chocolate & compound coatings", "Cake mixes", "Instant soups"],
                natural_vs_synthetic="Both Available (Sunflower lecithin is allergen-friendly natural; Silicon dioxide is mineral-derived)",
                regulatory_disclaimer="Allergen declarations are mandatory if derived from soy, egg, or dairy sources. Check labeling regulations for cross-contamination declarations.",
                official_source_link="https://www.fssai.gov.in"
            )
        ]
        db.add_all(preservatives)

    # 6. Seed Compliance Checklist (India - FSSAI)
    if db.query(ComplianceChecklist).count() == 0:
        checklists = [
            ComplianceChecklist(
                jurisdiction="India — FSSAI",
                product_category="General Packaged Food",
                checklist_items=[
                    {
                        "item_id": "fssai-lic-1",
                        "item_title": "FSSAI Business Registration or License",
                        "description": "Obtain mandatory registration or state/central license via the FoSCoS portal based on annual turnover and production capacity.",
                        "official_reference_link": "https://foscos.fssai.gov.in",
                        "is_mandatory": True,
                        "stage": "Business Setup"
                    },
                    {
                        "item_id": "fssai-lbl-1",
                        "item_title": "FSSAI Logo & 14-Digit License Number",
                        "description": "Display the official FSSAI logo alongside the 14-digit license number prominently on the primary display panel in contrasting color.",
                        "official_reference_link": "https://www.fssai.gov.in",
                        "is_mandatory": True,
                        "stage": "Labeling"
                    },
                    {
                        "item_id": "fssai-lbl-2",
                        "item_title": "Veg / Non-Veg Indicator Symbol",
                        "description": "Mandatory green filled circle in a green square for vegetarian food, or brown filled circle in brown square (or triangle for non-veg) as per latest regulations.",
                        "official_reference_link": "https://www.fssai.gov.in",
                        "is_mandatory": True,
                        "stage": "Labeling"
                    },
                    {
                        "item_id": "fssai-lbl-3",
                        "item_title": "Ingredient List & Additives Declaration",
                        "description": "List all ingredients in descending order of weight. Mention additives by specific chemical name or official INS number.",
                        "official_reference_link": "https://www.fssai.gov.in",
                        "is_mandatory": True,
                        "stage": "Labeling"
                    },
                    {
                        "item_id": "fssai-lbl-4",
                        "item_title": "Nutritional Information Panel (Per 100g/ml & Per Serve)",
                        "description": "State energy (kcal), protein (g), carbohydrates (g), total sugars (g), added sugars (g), total fat (g), saturated fat (g), trans fat (g), and sodium (mg).",
                        "official_reference_link": "https://www.fssai.gov.in",
                        "is_mandatory": True,
                        "stage": "Labeling"
                    },
                    {
                        "item_id": "fssai-lbl-5",
                        "item_title": "Date Marking ('Date of Mfg' & 'Expiry' / 'Best Before')",
                        "description": "Clearly state manufacturing/packaging date and valid expiry or best-before date with specific storage condition instructions.",
                        "official_reference_link": "https://www.fssai.gov.in",
                        "is_mandatory": True,
                        "stage": "Labeling"
                    },
                    {
                        "item_id": "fssai-lbl-6",
                        "item_title": "Allergen Declaration & Customer Care",
                        "description": "Highlight top allergens (gluten, peanuts, tree nuts, soy, milk, etc.) in bold, and include manufacturer contact phone and email for consumer grievances.",
                        "official_reference_link": "https://www.fssai.gov.in",
                        "is_mandatory": True,
                        "stage": "Labeling"
                    },
                    {
                        "item_id": "fssai-pack-1",
                        "item_title": "Food-Grade Packaging Material Compliance (FSSAI 2018 Regulations)",
                        "description": "Ensure primary contact materials comply with IS/ISO food-contact standards and pass overall migration and heavy metal migration limits.",
                        "official_reference_link": "https://www.fssai.gov.in",
                        "is_mandatory": True,
                        "stage": "Packaging Safety"
                    },
                    {
                        "item_id": "fssai-lab-1",
                        "item_title": "NABL Accredited Laboratory Test Report",
                        "description": "Conduct chemical, microbiological, and packaging migration tests from an FSSAI-notified NABL accredited laboratory before commercial batch dispatch.",
                        "official_reference_link": "https://www.fssai.gov.in",
                        "is_mandatory": False,
                        "stage": "Quality Assurance"
                    }
                ]
            ),
            ComplianceChecklist(
                jurisdiction="India — FSSAI",
                product_category="Bakery & Snacks",
                checklist_items=[
                    {
                        "item_id": "bakery-lic-1",
                        "item_title": "FSSAI Bakery Manufacturing License / Registration",
                        "description": "License under Kind of Business (KoB) 'Food Services / Manufacturing - Bakery & Confectionery'.",
                        "official_reference_link": "https://foscos.fssai.gov.in",
                        "is_mandatory": True,
                        "stage": "Business Setup"
                    },
                    {
                        "item_id": "bakery-lbl-1",
                        "item_title": "Trans Fat Free / Limit Declaration",
                        "description": "Ensure trans fat content is under the statutory 2% limit of total fat and declare percentage on the nutritional panel.",
                        "official_reference_link": "https://www.fssai.gov.in",
                        "is_mandatory": True,
                        "stage": "Labeling"
                    },
                    {
                        "item_id": "bakery-lbl-2",
                        "item_title": "Preservative Class Identification",
                        "description": "Declare 'Class II Preservative Used' with chemical name or INS code (e.g. INS 282 Calcium Propionate, INS 202 Potassium Sorbate).",
                        "official_reference_link": "https://www.fssai.gov.in",
                        "is_mandatory": True,
                        "stage": "Labeling"
                    },
                    {
                        "item_id": "bakery-pack-1",
                        "item_title": "Moisture & Breathability Food Contact Clearance",
                        "description": "Confirm wax or micro-perforated bread wrappers meet Indian Standard IS:9845 for migration into fatty/aqueous food stimulants.",
                        "official_reference_link": "https://www.fssai.gov.in",
                        "is_mandatory": True,
                        "stage": "Packaging Safety"
                    }
                ]
            )
        ]
        db.add_all(checklists)

    # 6. Seed Commodity Aliases (Section 10 & 11)
    if db.query(CommodityAlias).count() == 0:
        mango = db.query(Commodity).filter(Commodity.name.ilike("%mango%")).first()
        tomato = db.query(Commodity).filter(Commodity.name.ilike("%tomato%")).first()
        chips = db.query(Commodity).filter(Commodity.name.ilike("%chips%")).first()
        paneer = db.query(Commodity).filter(Commodity.name.ilike("%paneer%")).first()
        
        aliases = []
        if mango:
            aliases.extend([
                CommodityAlias(commodity_id=mango.commodity_id, alias_name="Hapus", locale="mr"),
                CommodityAlias(commodity_id=mango.commodity_id, alias_name="Aam", locale="hi"),
                CommodityAlias(commodity_id=mango.commodity_id, alias_name="Alphonso", locale="en")
            ])
        if tomato:
            aliases.extend([
                CommodityAlias(commodity_id=tomato.commodity_id, alias_name="Tamatar", locale="hi"),
                CommodityAlias(commodity_id=tomato.commodity_id, alias_name="Tomatoes", locale="en")
            ])
        if chips:
            aliases.extend([
                CommodityAlias(commodity_id=chips.commodity_id, alias_name="Potato Wafers", locale="en"),
                CommodityAlias(commodity_id=chips.commodity_id, alias_name="Aloo Chips", locale="hi")
            ])
        if paneer:
            aliases.extend([
                CommodityAlias(commodity_id=paneer.commodity_id, alias_name="Cottage Cheese", locale="en")
            ])
        if aliases:
            db.add_all(aliases)

    # 7. Seed Documented Research Sources (Section 15)
    if db.query(ResearchSource).count() == 0:
        sources = [
            ResearchSource(
                title="Standard Test Method for Oxygen Gas Transmission Rate Through Plastic Film and Sheeting Using a Coulometric Sensor",
                authors="ASTM Committee F02",
                year=2017,
                doi="10.1520/D3985-17",
                url="https://www.astm.org/d3985-17.html",
                source_type="standard",
                property_measured="Oxygen Transmission Rate (OTR)",
                test_conditions="23°C, 0% RH, 1 atm pure O2 differential",
                notes="Primary ASTM benchmark standard for oxygen permeation measurement."
            ),
            ResearchSource(
                title="Standard Test Method for Water Vapor Transmission Rate Through Plastic Film and Sheeting Using a Modulated Infrared Sensor",
                authors="ASTM Committee F02",
                year=2020,
                doi="10.1520/F1249-20",
                url="https://www.astm.org/f1249-20.html",
                source_type="standard",
                property_measured="Water Vapor Transmission Rate (WVTR)",
                test_conditions="37.8°C (100°F), 90% RH differential",
                notes="Primary ASTM benchmark standard for water vapor permeation measurement."
            ),
            ResearchSource(
                title="Food Packaging: Principles and Practice, Third Edition",
                authors="Gordon L. Robertson",
                year=2016,
                doi="10.1201/b13958",
                url="https://www.crcpress.com",
                source_type="book",
                property_measured="Food Kinetics, Respiration & Permeability",
                test_conditions="Ambient and refrigerated retail storage",
                notes="Authoritative food packaging reference for Arrhenius shelf-life modeling and Equilibrium MAP."
            ),
            ResearchSource(
                title="IS 9845: Determination of Overall Migration of Constituents of Plastics Materials",
                authors="Bureau of Indian Standards / FSSAI",
                year=1998,
                doi="IS-9845-1998",
                url="https://www.fssai.gov.in",
                source_type="standard",
                property_measured="Overall Migration Limit (<60 mg/kg or <10 mg/dm²)",
                test_conditions="Food simulants (water, 3% acetic acid, 15% ethanol, olive oil)",
                notes="Statutory Indian FSSAI benchmark for food-contact polymer safety."
            )
        ]
        db.add_all(sources)

    # 8. Seed ML Model Registry Entry (Section 19-20)
    if db.query(MLModelRegistry).count() == 0:
        db.add(
            MLModelRegistry(
                model_name="PackSmart Multi-Criteria TOPSIS & Kinetic Engine",
                version="v2.0-deterministic",
                status="ACTIVE",
                accuracy_metric="Deterministic Scientific Physical Formulas (Arrhenius, Fick's First Law, Michaelis-Menten)",
                description="Rule-based multi-criteria and physical kinetic solver. Standalone black-box ML neural networks are marked UNAVAILABLE until verified training datasets are integrated."
            )
        )

    db.commit()
    db.close()
    print("PackSmart database seeded successfully with accurate, documented data!")

if __name__ == "__main__":
    seed_database()
