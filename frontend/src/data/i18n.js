export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' }
];

export const TRANSLATIONS = {
  en: {
    title: "PACKAGING ENGINE",
    subTitle: "food preservation guide",
    tagline: "RESPIRATION RATE • OXYGEN BARRIER • FOOD PRESERVATION",
    desc: "Physics-driven barrier engineering & shelf-life educational tool for farmers, suppliers, and entrepreneurs.",
    ctaExperience: "START LEARNING",
    ctaInspect: "INSPECT POLYMER LAMINATE",
    freeFlight: "FREE FLIGHT",
    sound: "SOUND",
    experience: "START LEARNING",
    persona: "Guidance Level",
    filmMaterials: "Film Materials",
    shelfLifeSim: "Shelf-Life Sim",
    barrierPhysics: "Barrier Physics",
    topsisScore: "Quality Score",
    launchEngine: "Start Guide",
    farmerBadge: "BEGINNER MODE",
    scientistBadge: "EXPERT MODE",
    adminBadge: "ADMIN SYSTEM MODE",
    
    // Navigation Labels
    nav: {
      home: "Home",
      engine: "Engine",
      materials: "Materials",
      shelfLife: "Shelf-Life",
      checklist: "Checklist",
      library: "Library",
      about: "About",
      login: "Login",
      signup: "Get Started",
      account: "Account",
      admin: "Admin",
      juryDemo: "Jury Demo"
    },
    
    // Home Page Translations
    homeTag: "Smarter Packing. Smoother Logistics.",
    homeTitle1: "Pack-Smart",
    homeTitle2: "Logistics Software for a Faster, Leaner Supply Chain.",
    homeDesc: "Optimize your packing process, reduce material waste, track orders in real-time and keep your supply chain running smarter — all in one place.",
    homeStartTrial: "Start Free Trial",
    homeWatchDemo: "Watch Demo",
    homeWasteTitle: "Less Packaging Waste",
    homeWasteSub: "More sustainability",
    homeSpeedTitle: "Faster Operations",
    homeSpeedSub: "Save time & cost",
    homeTrackTitle: "Real-time Tracking",
    homeTrackSub: "Total visibility",
    homeFeaturesTag: "Key Features",
    homeFeaturesTitle: "Everything you need to pack and ship smarter.",
    homeF1Title: "Smart Packing Rules",
    homeF1Desc: "Automate box selection, reduce void space.",
    homeF2Title: "Real-Time Shipment Tracking",
    homeF2Desc: "Know where every order is, all the time.",
    homeF3Title: "Inventory & Stock Alerts",
    homeF3Desc: "Never run out, never overstock.",
    homeF4Title: "Powerful Analytics",
    homeF4Desc: "Make data-driven decisions and scale faster.",
    
    // Info tooltips
    info: {
      persona: "Choose 'Beginner' for simple advice or 'Expert' for technical details.",
      materials: "Learn about the different plastic layers used in the food industry.",
      sim: "Calculate how packaging materials affect crop freshness.",
      physics: "Learn how barrier layers stop air and moisture from entering.",
      topsis: "A smart rating system to evaluate cost-effective packaging."
    },
    
    // Educational translations
    normalBag: "Basic Packaging (Single Layer)",
    recommendedBag: "Optimal Packaging (Multi-Layer)",
    freshnessGain: "Extra Freshness Days",
    storageTip: "Ideal Storage Advice",
    cropSelect: "Select Your Crop / Harvest",
    simTitle: "Educational Freshness & Shelf-Life Calculator",
    simDesc: "Understand the difference in shelf life between basic single-layer plastic and optimal multi-layer barrier packaging.",
    daysFresh: "Days Fresh",
    spoilsOn: "Spoils on Day",
    keptFreshUntil: "Kept Fresh Until Day",
    savingMoney: "Proper packaging prevents crop waste & maximizes profit",
    downloadSpec: "Download Educational Guide (PDF)",
    close: "Close",
    farmerModeBtn: "🌱 Beginner / Simple Mode",
    scientistModeBtn: "🔬 Expert / Technical Mode",
    gaugeTitle: "Freshness Meter Comparison",
    longerLife: "Longer Life",
    riskOfRot: "High Risk of Rot",
    hotspotTag: "Packaging Physics Point",
    
    crops: {
      strawberry: { name: "Fresh Strawberries" },
      mango: { name: "Alphonso Mangoes" },
      tomato: { name: "Fresh Tomatoes" },
      chips: { name: "Crispy Snack Foods" },
      grain: { name: "Pulses & Grains" }
    },
    spoilBasic: "In basic single-layer packaging, {crop} spoils quickly in just {days} days due to open moisture and oxygen transfer.",
    spoilOptimal: "With optimal multi-layer high-barrier packaging, {crop} stays fresh for up to {days} days by blocking outside air.",
    storeAt: "Store packaging in cool shade at {temp}.",

    personaModal: {
      badge: "CHOOSE YOUR LEVEL",
      title: "Select How You Want to Learn",
      farmerTitle: "Beginner / Simple Mode",
      farmerDesc: "Plain, simple words. Easy educational guidance on keeping fruits, grains, and vegetables fresh without technical jargon.",
      scientistTitle: "Expert / Technical Mode",
      scientistDesc: "Technical packaging parameters (OTR, WVTR gas barrier curves and thermodynamic equations).",
      adminTitle: "System Mode",
      adminDesc: "Manage crop respiration databases and polymer film catalogs.",
      confirmBtn: "Confirm Selection"
    },
    materialsModal: {
      badge: "PACKAGING STRUCTURE GUIDE",
      title: "Understanding Multi-Layer Packaging Structures",
      subtitle: "Click a layer to learn why the food industry uses multiple protective layers",
      layerName: "Standard Multi-Layer Barrier Film",
      ratingBadge: "Industry Standard Protection",
      score: "Quality Rating",
      layer1Title: "Layer 1: Structural & Print Layer (e.g., PET)",
      layer1Role: "Provides mechanical strength to prevent tearing during transport and allows for high-quality printing and branding.",
      layer2Title: "Layer 2: Barrier Layer (e.g., Aluminum/Nylon)",
      layer2Role: "The most critical layer. It blocks oxygen and moisture from entering, which prevents mold, fungus, and staleness.",
      layer3Title: "Layer 3: Sealant Layer (e.g., LDPE/CPP)",
      layer3Role: "A food-grade layer that touches the food safely. It melts when heated to create an airtight seal on the packaging machine.",
      ecoBadge: "Industry Standard Recyclable Structures"
    },
    
    frames: [
      {
        title: "RAW CROP VULNERABILITY",
        subtitle: "Preventing Post-Harvest Rot & Moisture Loss",
        desc: "Fresh fruits & vegetables lose weight and rot quickly when exposed to open air and moisture. Proper packaging is essential."
      },
      {
        title: "ATMOSPHERIC RESPIRATION",
        subtitle: "Controlling Oxygen & Carbon Dioxide",
        desc: "Proper gas control prevents produce from turning brown and keeps natural sweetness intact. This requires specialized barriers."
      },
      {
        title: "MULTI-LAYER PROTECTIVE FILMS",
        subtitle: "Why Single Layers Aren't Enough",
        desc: "The food industry uses multi-layer films because no single plastic can block moisture, block oxygen, AND seal effectively."
      },
      {
        title: "MOISTURE & AIR BARRIER KINETICS",
        subtitle: "Zero Dampness & Ultra-High Sealing",
        desc: "A good barrier layer keeps dry goods crispy and fresh fruits juicy without drying out."
      },
      {
        title: "HEAT & COLD WEATHER PROTECTION",
        subtitle: "Sunlight & Transport Resilience",
        desc: "The outer structural layer protects crops during hot truck transport from farm to city markets."
      },
      {
        title: "OPTIMAL PACKAGING SELECTION",
        subtitle: "Balancing Cost and Protection",
        desc: "Understanding packaging science helps entrepreneurs choose the lowest cost structure that gives maximum shelf life."
      },
      {
        title: "MAXIMUM SHELF-LIFE ACHIEVED",
        subtitle: "Preservation Without Chemicals",
        desc: "With the correct barrier structure, farmers can sell produce at peak market prices without fear of spoilage."
      },
      {
        title: "SUSTAINABILITY IN PACKAGING",
        subtitle: "Moving Towards Recyclability",
        desc: "Modern packaging science is focused on creating multi-layer films that are fully recyclable and safe for the environment."
      },
      {
        title: "PACKAGING ENGINE READY",
        subtitle: "Calculate Your Crop Packaging Now",
        desc: "Choose your crop below and learn how different packaging structures affect its shelf life."
      }
    ],

    databasePage: {
      title: "Materials Database & Polymer Library",
      subtitle: "Technical specification directory for food packaging films, barrier layers, and mono-materials.",
      searchPlaceholder: "Search polymer by name, barrier notes...",
      allCategory: "All Materials",
      barrierCategory: "High Barrier",
      bioCategory: "Bio-Polymer / Recyclable",
      otrLabel: "Oxygen Barrier (OTR)",
      wvtrLabel: "Moisture Barrier (WVTR)",
      costLabel: "Cost Estimate",
      ecoLabel: "Sustainability Score"
    },
    shelfLifePage: {
      title: "Shelf-Life & Freshness Predictor",
      subtitle: "Calculate crop preservation days using Arrhenius thermodynamic equations and oxygen permeability kinetics.",
      cropLabel: "Food Commodity",
      materialLabel: "Packaging Structure",
      tempLabel: "Storage Temperature (°C)",
      rhLabel: "Relative Humidity (%)",
      btnCalculate: "Simulate Shelf-Life",
      daysFresh: "Days Fresh",
      spoilsOn: "Spoils on Day"
    },
    knowledgePage: {
      title: "Packaging Science Library & Knowledge Base",
      subtitle: "Comprehensive educational guides, FSSAI regulatory compliance, and polymer chemistry flashcards.",
      tabFormats: "Packaging Formats",
      tabAdditives: "Additives & Preservatives",
      tabFlashcards: "Science Flashcards"
    },
    checklistPage: {
      title: "Commercial Packaging Launch Regulatory Checklist",
      subtitle: "FSSAI & BIS regulatory compliance verification checklist before commercial printing.",
      printNotice: "Always verify on the official FoSCoS portal before commercial distribution."
    },
    loginPage: {
      title: "Sign in to PackSmart",
      subtitle: "Access your intelligent food packaging workspace.",
      emailLabel: "Email Address",
      passLabel: "Password",
      btnSignin: "Sign In"
    },
    signupPage: {
      title: "Create your Account",
      subtitle: "Join PackSmart to optimize food packaging & shelf life.",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      passLabel: "Password",
      orgLabel: "Organization / Farm Name",
      btnCreate: "Create Account"
    }
  },

  mr: {
    title: "पॅकेजिंग मार्गदर्शक",
    subTitle: "अन्न टिकवण क्षमता तंत्रज्ञान",
    tagline: "श्वसन दर • ऑक्सिजन संरक्षण • पीक साठवणूक तंत्र",
    desc: "शेतकरी आणि नवउद्योजकांसाठी पिकांची टिकवण क्षमता वाढवणारे शैक्षणिक मार्गदर्शक तंत्रज्ञान.",
    ctaExperience: "शिकायला सुरुवात करा",
    ctaInspect: "पॅकिंग थर तपासा",
    freeFlight: "ऑटो टूर",
    sound: "आवाज",
    experience: "शिकायला सुरुवात करा",
    persona: "मार्गदर्शन पातळी",
    filmMaterials: "पॅकिंग प्लास्टिक",
    shelfLifeSim: "टिकवण क्षमता कॅल्क्युलेटर",
    barrierPhysics: "हवा-दमटपणा संरक्षण",
    topsisScore: "सर्वोत्तम रेटिंग",
    launchEngine: "मार्गदर्शक सुरू करा",
    farmerBadge: "नवशिका (Beginner)",
    scientistBadge: "तज्ज्ञ (Expert)",
    adminBadge: "ॲडमिन मोड",
    
    // Navigation Labels (Marathi)
    nav: {
      home: "मुख्यपृष्ठ",
      engine: "इंजिन",
      materials: "साहित्य",
      shelfLife: "टिकवण क्षमता",
      checklist: "यादी",
      library: "ज्ञान भांडार",
      about: "माहिती",
      login: "लॉगिन",
      signup: "सुरुवात करा",
      account: "खाते",
      admin: "ॲडमिन",
      juryDemo: "डेमो"
    },
    
    // Home Page Translations (Marathi)
    homeTag: "स्मार्ट पॅकिंग. सुलभ लॉजिस्टिक्स.",
    homeTitle1: "पॅक-स्मार्ट",
    homeTitle2: "अधिक जलद आणि कार्यक्षम पुरवठा साखळीसाठी लॉजिस्टिक्स सॉफ्टवेअर.",
    homeDesc: "तुमच्या पॅकिंग प्रक्रियेची पुनर्रचना करा, कचरा कमी करा, ऑर्डरचा रिअल-टाइम मागोवा घ्या आणि पुरवठा साखळी स्मार्ट बनवा.",
    homeStartTrial: "विनामूल्य वापर सुरू करा",
    homeWatchDemo: "डेमो व्हिडिओ पहा",
    homeWasteTitle: "पॅकेजिंग कचऱ्यात घट",
    homeWasteSub: "पर्यावरणपूरक तंत्रज्ञान",
    homeSpeedTitle: "जलद कामकाज",
    homeSpeedSub: "वेळ व पैशाची बचत",
    homeTrackTitle: "रिअल-टाइम ट्रॅकिंग",
    homeTrackSub: "पूर्ण पारदर्शकता",
    homeFeaturesTag: "प्रमुख वैशिष्ट्ये",
    homeFeaturesTitle: "स्मार्ट पॅकिंग आणि शिपिंगसाठी आवश्यक सर्व काही.",
    homeF1Title: "स्मार्ट पॅकिंग नियम",
    homeF1Desc: "बॉक्सची स्वयंचलित निवड करा, जागा वाचवा.",
    homeF2Title: "थेट शिपमेंट ट्रॅकिंग",
    homeF2Desc: "प्रत्येक ऑर्डर कुठे आहे ते नेहमी जाणून घ्या.",
    homeF3Title: "स्टॉक आणि साठा सूचना",
    homeF3Desc: "कधीही माल संपणार नाही, जास्त साठा होणार नाही.",
    homeF4Title: "प्रभावी विश्लेषण",
    homeF4Desc: "डेटा आधारित निर्णय घ्या आणि व्यवसाय वाढवा.",
    
    info: {
      persona: "'नवशिका' सोप्या माहितीसाठी निवडा किंवा 'तज्ज्ञ' तांत्रिक माहितीसाठी.",
      materials: "अन्न उद्योगात वापरलेले विविध प्लॅस्टिकचे थर समजून घ्या.",
      sim: "पॅकेजिंगमुळे पिकाच्या ताजेपणावर काय परिणाम होतो ते मोजा.",
      physics: "पॅकेजिंग हवा आणि दमटपणा कसा थांबवते हे जाणून घ्या.",
      topsis: "सर्वात चांगली आणि स्वस्त पिशवी निवडणारी स्मार्ट रेटिंग प्रणाली."
    },
    
    normalBag: "प्राथमिक पॅकेजिंग (सिंगल लेयर)",
    recommendedBag: "उत्तम पॅकेजिंग (मल्टी-लेयर)",
    freshnessGain: "जास्तीचे मिळालेले ताजे दिवस",
    storageTip: "योग्य साठवणूक सल्ला",
    cropSelect: "तुमचे पीक / फळ निवडा",
    simTitle: "शैक्षणिक टिकवण क्षमता कॅल्क्युलेटर",
    simDesc: "साध्या सिंगल-लेयर प्लास्टिक आणि उत्तम मल्टी-लेयर पॅकेजिंगमध्ये काय फरक असतो ते समजून घ्या.",
    daysFresh: "दिवस ताजे राहते",
    spoilsOn: "या दिवशी खराब होते",
    keptFreshUntil: "या दिवसापर्यंत ताजे राहील",
    savingMoney: "योग्य पॅकेजिंग पिकाचे नुकसान टाळते आणि नफा वाढवते",
    downloadSpec: "शैक्षणिक मार्गदर्शक डाउनलोड करा (PDF)",
    close: "बंद करा",
    farmerModeBtn: "🌱 नवशिका / सोपी पद्धत",
    scientistModeBtn: "🔬 तज्ज्ञ / तांत्रिक आलेख",
    gaugeTitle: "ताजेपणाचे प्रमाण तुलना मीटर",
    longerLife: "जास्त टिकाऊ",
    riskOfRot: "खराब होण्याचा धोका",
    hotspotTag: "पॅकेजिंग तंत्रज्ञान बिंदू",

    crops: {
      strawberry: { name: "ताजी स्ट्रॉबेरी" },
      mango: { name: "हापूस आंबे" },
      tomato: { name: "ताजे टोमॅटो" },
      chips: { name: "कुरकुरीत फराळ / वेफर्स" },
      grain: { name: "धान्य व डाळी" }
    },
    spoilBasic: "साध्या पॅकेजिंगमध्ये ऑक्सिजन आणि दमटपणामुळे {crop} फक्त {days} दिवसांत खराब होऊ लागतात.",
    spoilOptimal: "उत्तम मल्टी-लेयर पॅकेजिंगमुळे बाहेरील हवा आत येत नाही आणि {crop} तब्बल {days} दिवस ताजे राहतात.",
    storeAt: "माल साठवताना तापमान {temp} वर ठेवा.",

    personaModal: {
      badge: "तुमची पातळी निवडा",
      title: "तुम्हाला माहिती कशी पाहायची आहे?",
      farmerTitle: "नवशिका (सोपी पद्धत)",
      farmerDesc: "कोणतेही कठीण तांत्रिक शब्द नाहीत. फळे, भाज्या आणि धान्य जास्त दिवस ताजे कसे ठेवायचे याची सोपी माहिती.",
      scientistTitle: "तज्ज्ञ (तांत्रिक पद्धत)",
      scientistDesc: "पॅकेजिंग तज्ज्ञांसाठी वैज्ञानिक आलेख, गॅस रोधक आकडेवारी आणि तपशीलवार माहिती.",
      adminTitle: "प्रणाली व्यवस्थापक",
      adminDesc: "८५+ पिकांचे मॉडेल्स आणि २७ प्लास्टिक फिल्म्स डेटाबेस व्यवस्थापन.",
      confirmBtn: "निश्चित करा"
    },
    materialsModal: {
      badge: "पॅकिंग पिशवीची रचना",
      title: "मल्टी-लेयर पॅकेजिंगची रचना समजून घेणे",
      subtitle: "अन्न उद्योग अन्नाचे संरक्षण करण्यासाठी अनेक थरांचा वापर का करतो हे समजून घेण्यासाठी थरावर क्लिक करा",
      layerName: "प्रमाणित मल्टी-लेयर बॅरियर फिल्म",
      ratingBadge: "उद्योग प्रमाणित संरक्षण",
      score: "गुणवत्ता रेटिंग",
      layer1Title: "थर १: बाहेरील मजबूत व छपाईचा थर (उदा. PET)",
      layer1Role: "वाहतुकीदरम्यान पिशवी फाटण्यापासून सुरक्षित ठेवतो आणि त्यावर दर्जेदार छपाई (ब्रँडिंग) करता येते.",
      layer2Title: "थर २: हवा व दमटपणा रोखणारा थर (उदा. Aluminum/Nylon)",
      layer2Role: "हा सर्वात महत्त्वाचा थर आहे. हा बाहेरील दमट हवा आणि ऑक्सिजन आत जाऊ देत नाही, ज्यामुळे धान्याला बुरशी किंवा फळांना किड लागत नाही.",
      layer3Title: "थर ३: अन्न-सुरक्षित सीलिंग थर (उदा. LDPE/CPP)",
      layer3Role: "हा अन्न-ग्रेड थर आहे जो अन्नाला सुरक्षितपणे स्पर्श करतो. पॅकेजिंग मशीनवर गरम केल्यावर हा वितळतो आणि हवाबंद सील तयार करतो.",
      ecoBadge: "पुनर्वापरयोग्य रचना (Recyclable Structures)"
    },

    frames: [
      {
        title: "पिकांचे होणारे नुकसान",
        subtitle: "काढणीनंतर पिके सुकणे व सडणे टाळा",
        desc: "हवेतील दमटपणामुळे आणि ऑक्सिजनमुळे ताजी फळे व भाज्या पटकन सुकतात. योग्य पॅकेजिंग अत्यंत महत्त्वाचे आहे."
      },
      {
        title: "हवेचे व ऑक्सिजनचे प्रमाण",
        subtitle: "पिशवीतील हवा आणि वायूंचे संतुलन",
        desc: "योग्य हवेचे प्रमाण ठेवल्यास फळांचा गोडवा आणि रंग नैसर्गिक राहतो. यासाठी विशिष्ट अडथळ्यांची आवश्यकता असते."
      },
      {
        title: "मल्टी-लेयर संरक्षक फिल्म",
        subtitle: "सिंगल लेयर पुरेसा का नाही?",
        desc: "कोणतेही एक प्लास्टिक एकाच वेळी दमटपणा, ऑक्सिजन रोखू शकत नाही आणि मजबूत सील देऊ शकत नाही, त्यामुळे मल्टी-लेयर तंत्रज्ञान वापरले जाते."
      },
      {
        title: "दमटपणा व बाष्प रोधक क्षमता",
        subtitle: "ओलसरपणा संपूर्ण बंद",
        desc: "चांगला बॅरियर थर सुकलेला माल कुरकुरीत तर ताजी फळे रसरशीत ठेवतो."
      },
      {
        title: "उकाडा व वाहतूक संरक्षण",
        subtitle: "वाहतुकी दरम्यान पिकांचे संरक्षण",
        desc: "बाहेरील मजबूत थर शेतातून शहरात माल नेताना पिकाचे संरक्षण करतो."
      },
      {
        title: "सर्वोत्तम पॅकेजिंगची निवड",
        subtitle: "किंमत आणि संरक्षण यांचा समतोल",
        desc: "पॅकेजिंगचे विज्ञान समजून घेतल्यास उद्योजकांना कमीत कमी खर्चात जास्तीत जास्त टिकवण क्षमता देणारी रचना निवडण्यास मदत होते."
      },
      {
        title: "जास्तीत जास्त टिकवण क्षमता",
        subtitle: "कोणत्याही रसायनांशिवाय टिकवण",
        desc: "योग्य बॅरियर स्ट्रक्चरमुळे शेतकरी खराब होण्याची भीती न बाळगता योग्य भावात माल विकू शकतात."
      },
      {
        title: "पर्यावरणपूरक पॅकेजिंग",
        subtitle: "पुनर्वापराकडे वाटचाल",
        desc: "आधुनिक पॅकेजिंग विज्ञान पर्यावरणासाठी सुरक्षित आणि पुनर्वापर करता येण्याजोगे मल्टी-लेयर फिल्म्स बनवण्यावर लक्ष केंद्रित करत आहे."
      },
      {
        title: "पॅकेजिंग इंजिन तयार आहे",
        subtitle: "तुमच्या पिकासाठी आजच पॅकेजिंग शोधा",
        desc: "खालील पर्यायातून तुमचे पीक निवडा आणि वेगवेगळ्या पॅकेजिंगमुळे ताजेपणावर काय फरक पडतो ते शिका."
      }
    ],

    databasePage: {
      title: "साहित्य डेटाबेस आणि प्लॅस्टिक लायब्ररी",
      subtitle: "अन्न पॅकेजिंग फिल्म्स, बॅरियर थर आणि पॉलिमर साहित्याची तांत्रिक निर्देशिका.",
      searchPlaceholder: "प्लॅस्टिकचे नाव किंवा गुणधर्मांनुसार शोधा...",
      allCategory: "सर्व साहित्य",
      barrierCategory: "उच्च संरक्षण (High Barrier)",
      bioCategory: "पर्यावरणपूरक / पुनर्वापरयोग्य",
      otrLabel: "ऑक्सिजन संरक्षण (OTR)",
      wvtrLabel: "दमटपणा संरक्षण (WVTR)",
      costLabel: "अंदाजे किंमत",
      ecoLabel: "पर्यावरण रेटिंग"
    },
    shelfLifePage: {
      title: "टिकवण क्षमता व ताजेपणा कॅल्क्युलेटर",
      subtitle: "ऑक्सिजन वहन दर आणि थर्मोडायनामिक समीकरणांचा वापर करून पिकांचे टिकण्याचे दिवस मोजा.",
      cropLabel: "पीक / अन्नपदार्थ",
      materialLabel: "पॅकेजिंग प्लास्टिक",
      tempLabel: "साठवणूक तापमान (°C)",
      rhLabel: "सापेक्ष आर्द्रता (%)",
      btnCalculate: "गणना करा",
      daysFresh: "दिवस ताजे राहते",
      spoilsOn: "या दिवशी खराब होते"
    },
    knowledgePage: {
      title: "पॅकेजिंग विज्ञान ग्रंथालय आणि माहिती केंद्र",
      subtitle: "सर्वसमावेशक शैक्षणिक मार्गदर्शक, FSSAI नियम आणि प्लास्टिक रसायनशास्त्र कार्ड्स.",
      tabFormats: "पॅकेजिंग प्रकार",
      tabAdditives: "अन्न घटक व संरक्षक",
      tabFlashcards: "विज्ञान फ्लॅशकार्ड्स"
    },
    checklistPage: {
      title: "पॅकेजिंग प्रिंटिंग पूर्व तपासणी यादी",
      subtitle: "व्यावसायिक छपाईपूर्वी FSSAI आणि BIS नियम आणि मानकांची पडताळणी यादी.",
      printNotice: "छपाईपूर्वी नेहमी अधिकृत FSSAI पोर्टलबद्दल पडताळणी करा."
    },
    loginPage: {
      title: "पॅकस्मार्ट मध्ये साइन इन करा",
      subtitle: "तुमच्या अन्न पॅकेजिंग वर्कस्पेस मध्ये प्रवेश करा.",
      emailLabel: "ईमेल पत्ता",
      passLabel: "पासवर्ड",
      btnSignin: "लॉगिन करा"
    },
    signupPage: {
      title: "नवीन खाते तयार करा",
      subtitle: "पॅकेजिंग आणि टिकवण क्षमता सुधारण्यासाठी आजच जुडा.",
      nameLabel: "पूर्ण नाव",
      emailLabel: "ईमेल पत्ता",
      passLabel: "पासवर्ड",
      orgLabel: "संस्था / शेताचे नाव",
      btnCreate: "खाते तयार करा"
    }
  },

  hi: {
    title: "पैकेजिंग मार्गदर्शक",
    subTitle: "खाद्य संरक्षण गाइड",
    tagline: "श्वसन दर • ऑक्सीजन अवरोध • फसल सुरक्षा",
    desc: "किसानों और नए उद्यमियों के लिए फसल की शेल्फ लाइफ बढ़ाने वाला शैक्षिक मार्गदर्शक।",
    ctaExperience: "सीखना शुरू करें",
    ctaInspect: "पैकिंग परतें देखें",
    freeFlight: "ऑटो टूर",
    sound: "आवाज",
    experience: "सीखना शुरू करें",
    persona: "मार्गदर्शन स्तर",
    filmMaterials: "पैकिंग सामग्री",
    shelfLifeSim: "शेल्फ-लाइफ कैलकुलेटर",
    barrierPhysics: "नमी-हवा सुरक्षा",
    topsisScore: "गुणवत्ता रेटिंग",
    launchEngine: "मार्गदर्शक चालू करें",
    farmerBadge: "नौसिखिया (Beginner)",
    scientistBadge: "विशेषज्ञ (Expert)",
    adminBadge: "एडमिन मोड",
    
    // Navigation Labels (Hindi)
    nav: {
      home: "मुख्य पृष्ठ",
      engine: "इंजन",
      materials: "सामग्री",
      shelfLife: "शेल्फ-लाइफ",
      checklist: "चेकलिस्ट",
      library: "ज्ञान केंद्र",
      about: "हमारे बारे में",
      login: "लॉगिन",
      signup: "शुरू करें",
      account: "खाता",
      admin: "एडमिन",
      juryDemo: "डेमो"
    },
    
    // Home Page Translations (Hindi)
    homeTag: "स्मार्ट पैकिंग। आसान लॉजिस्टिक्स।",
    homeTitle1: "पैक-स्मार्ट",
    homeTitle2: "तेज और कुशल आपूर्ति श्रृंखला के लिए लॉजिस्टिक्स सॉफ्टवेयर।",
    homeDesc: "अपनी पैकिंग प्रक्रिया को सुव्यवस्थित करें, सामग्री की बर्बादी घटाएं, रियल-टाइम ऑर्डर ट्रैक करें और अपनी सप्लाई चेन को बेहतर बनाएं।",
    homeStartTrial: "मुफ्त ट्रायल शुरू करें",
    homeWatchDemo: "डेमो देखें",
    homeWasteTitle: "कम पैकेजिंग कचरा",
    homeWasteSub: "पर्यावरण के अनुकूल",
    homeSpeedTitle: "तेज परिचालन",
    homeSpeedSub: "समय और लागत की बचत",
    homeTrackTitle: "रियल-टाइम ट्रैकिंग",
    homeTrackSub: "पूर्ण पारदर्शिता",
    homeFeaturesTag: "मुख्य विशेषताएं",
    homeFeaturesTitle: "स्मार्ट पैकिंग और शिपिंग के लिए आवश्यक सब कुछ।",
    homeF1Title: "स्मार्ट पैकिंग नियम",
    homeF1Desc: "बॉक्स का स्वचालित चयन करें, खाली जगह घटाएं।",
    homeF2Title: "लाइव शिपमेंट ट्रैकिंग",
    homeF2Desc: "हर ऑर्डर की लोकेशन हमेशा जाने।",
    homeF3Title: "इन्वेंट्री और स्टॉक अलर्ट",
    homeF3Desc: "स्टॉक कभी खत्म नहीं होगा, न अधिक जमा होगा।",
    homeF4Title: "शक्तिशाली विश्लेषण",
    homeF4Desc: "डेटा-आधारित निर्णय लें और व्यवसाय बढ़ाएं।",
    
    info: {
      persona: "'नौसिखिया' आसान जानकारी के लिए चुनें या 'विशेषज्ञ' तकनीकी जानकारी के लिए।",
      materials: "खाद्य उद्योग में इस्तेमाल होने वाली विभिन्न प्लास्टिक परतों को समझें।",
      sim: "गणना करें कि पैकेजिंग सामग्री फसल की ताजगी को कैसे प्रभावित करती है।",
      physics: "जानें कि बैरियर परतें हवा और नमी को कैसे रोकती हैं।",
      topsis: "आपके लिए सबसे अच्छा और लागत प्रभावी पैकेजिंग चुनने वाली प्रणाली।"
    },

    normalBag: "प्राथमिक पैकेजिंग (सिंगल लेयर)",
    recommendedBag: "उत्तम पैकेजिंग (मल्टी-लेयर)",
    freshnessGain: "अतिरिक्त ताज़गी के दिन",
    storageTip: "उत्तम भंडारण सलाह",
    cropSelect: "अपनी फसल चुनें",
    simTitle: "शैक्षिक शेल्फ-लाइफ कैलकुलेटर",
    simDesc: "साधारण सिंगल-लेयर प्लास्टिक और बेहतरीन मल्टी-लेयर बैरियर पैकेजिंग के बीच का अंतर समझें।",
    daysFresh: "दिन ताज़ा रहेगा",
    spoilsOn: "इस दिन खराब होगा",
    keptFreshUntil: "इस दिन तक बिल्कुल ताज़ा रहेगा",
    savingMoney: "सही पैकेजिंग फसल की बर्बादी रोकती है और मुनाफा बढ़ाती है",
    downloadSpec: "शैक्षिक गाइड डाउनलोड करें (PDF)",
    close: "बंद करें",
    farmerModeBtn: "🌱 नौसिखिया / आसान तरीका",
    scientistModeBtn: "🔬 विशेषज्ञ / तकनीकी ग्राफ",
    gaugeTitle: "ताजगी तुलना मीटर",
    longerLife: "अधिक टिकाऊ",
    riskOfRot: "सड़ने का खतरा",
    hotspotTag: "पैकेजिंग तकनीक बिंदु",

    crops: {
      strawberry: { name: "ताजा स्ट्रॉबेरी" },
      mango: { name: "अल्फांसो आम" },
      tomato: { name: "ताजा टमाटर" },
      chips: { name: "नमकीन / वेफर्स" },
      grain: { name: "अनाज और दालें" }
    },
    spoilBasic: "साधारण सिंगल-लेयर पैकेजिंग में ऑक्सीजन और नमी के कारण {crop} केवल {days} दिनों में खराब होने लगता है।",
    spoilOptimal: "बेहतरीन मल्टी-लेयर बैरियर पैकेजिंग बाहरी हवा को रोककर {crop} को {days} दिनों तक ताज़ा रखती है।",
    storeAt: "भंडारण करते समय तापमान {temp} पर रखें।",

    personaModal: {
      badge: "अपना स्तर चुनें",
      title: "आप कैसे सीखना चाहते हैं?",
      farmerTitle: "नौसिखिया (आसान तरीका)",
      farmerDesc: "कोई कठिन तकनीकी शब्द नहीं। फल, सब्जियां और अनाज लंबे समय तक ताजा कैसे रखें, इसकी शैक्षिक जानकारी।",
      scientistTitle: "विशेषज्ञ (तकनीकी तरीका)",
      scientistDesc: "पैकेजिंग विशेषज्ञों के लिए वैज्ञानिक ग्राफ, गैस अवरोधक आंकड़े और तकनीकी विवरण।",
      adminTitle: "सिस्टम व्यवस्थापक",
      adminDesc: "फसल श्वसन डेटाबेस और पैकेजिंग फिल्मों का प्रबंधन।",
      confirmBtn: "मोड पक्का करें"
    },
    materialsModal: {
      badge: "पैकिंग बैग की संरचना",
      title: "मल्टी-लेयर पैकेजिंग संरचना को समझना",
      subtitle: "खाद्य उद्योग भोजन की सुरक्षा के लिए कई परतों का उपयोग क्यों करता है, यह समझने के लिए परत पर क्लिक करें",
      layerName: "प्रमाणित मल्टी-लेयर बैरियर फिल्म",
      ratingBadge: "उद्योग प्रमाणित सुरक्षा",
      score: "गुणवत्ता रेटिंग",
      layer1Title: "परत 1: बाहरी मजबूत और प्रिंटिंग परत (उदा. PET)",
      layer1Role: "परिवहन के दौरान बैग को फटने से बचाती है और उच्च गुणवत्ता वाली छपाई (ब्रांडिंग) की अनुमति देती है।",
      layer2Title: "परत 2: हवा और नमी रोकने वाली बैरियर परत (उदा. Aluminum/Nylon)",
      layer2Role: "यह सबसे महत्वपूर्ण परत है। यह बाहरी नमी और ऑक्सीजन को अंदर नहीं जाने देती, जिससे फफूंद या सड़न नहीं लगती।",
      layer3Title: "परत 3: खाद्य-सुरक्षित सीलिंग परत (उदा. LDPE/CPP)",
      layer3Role: "यह एक फ़ूड-ग्रेड परत है जो भोजन को सुरक्षित रूप से छूती है। पैकेजिंग मशीन पर गर्म करने पर यह पिघलकर एयरटाइट सील बनाती है।",
      ecoBadge: "पुनर्चक्रण योग्य संरचनाएं"
    },

    frames: [
      {
        title: "फसल का नुकसान",
        subtitle: "कटाई के बाद सड़ने और सूखने से बचाएं",
        desc: "खुली हवा और नमी के संपर्क में आने से फल और सब्जियां तेजी से सड़ती हैं। सही पैकेजिंग आवश्यक है।"
      },
      {
        title: "हवा और गैस संतुलन",
        subtitle: "पैकेट के भीतर ऑक्सीजन और CO₂ का नियंत्रण",
        desc: "गैस संतुलन फसल के स्वाद और प्राकृतिक रंग को बरकरार रखता है। इसके लिए विशेष बैरियर की आवश्यकता होती है।"
      },
      {
        title: "मल्टी-लेयर सुरक्षात्मक फिल्म",
        subtitle: "सिंगल लेयर पर्याप्त क्यों नहीं है?",
        desc: "खाद्य उद्योग मल्टी-लेयर फिल्मों का उपयोग करता है क्योंकि कोई एक प्लास्टिक नमी, ऑक्सीजन को रोक नहीं सकता और सील भी नहीं कर सकता।"
      },
      {
        title: "नमी और हवा रोधक तकनीक",
        subtitle: "जीरो सीपेज और वॉटरप्रूफ सीलिंग",
        desc: "एक अच्छी बैरियर परत सूखे अनाज को कुरकुरा और ताजे फलों को रसीला रखती है।"
      },
      {
        title: "गर्मी और धूप से सुरक्षा",
        subtitle: "परिवहन के दौरान सुरक्षित सुरक्षा",
        desc: "बाहरी परत खेत से मंडी तक गाड़ियों में माल ले जाते समय फसल को धूप और फटने से बचाती है।"
      },
      {
        title: "सर्वोत्तम पैकेजिंग का चयन",
        subtitle: "लागत और सुरक्षा का संतुलन",
        desc: "पैकेजिंग विज्ञान को समझने से उद्यमियों को सबसे कम लागत वाली संरचना चुनने में मदद मिलती है जो अधिकतम शेल्फ लाइफ देती है।"
      },
      {
        title: "अधिकतम शेल्फ लाइफ",
        subtitle: "रसायनों के बिना संरक्षण",
        desc: "सही बैरियर संरचना के साथ, किसान खराब होने के डर के बिना अपनी फसल को बाजार में सही दामों पर बेच सकते हैं।"
      },
      {
        title: "पर्यावरण के अनुकूल पैकेजिंग",
        subtitle: "पुनर्चक्रण की ओर बढ़ते कदम",
        desc: "आधुनिक पैकेजिंग विज्ञान पूरी तरह से सुरक्षित और पुनर्चक्रण योग्य मल्टी-लेयर फिल्में बनाने पर केंद्रित है।"
      },
      {
        title: "पैकेजिंग मार्गदर्शक तैयार है",
        subtitle: "अपनी फसल के लिए पैकेजिंग सीखें",
        desc: "नीचे अपनी फसल चुनें और जानें कि विभिन्न पैकेजिंग सामग्री इसकी शेल्फ लाइफ को कैसे प्रभावित करती हैं।"
      }
    ]
  },

  pa: {
    title: "ਪੈਕੇਜਿੰਗ ਗਾਈਡ",
    subTitle: "ਭੋਜਨ ਸੰਭਾਲ ਮਾਰਗਦਰਸ਼ਨ",
    tagline: "ਸਾਹ ਦਰ • ਆਕਸੀਜਨ ਰੁਕਾਵਟ • ਫ਼ਸਲ ਸੁਰੱਖਿਆ",
    desc: "ਕਿਸਾਨਾਂ ਅਤੇ ਨਵੇਂ ਉੱਦਮੀਆਂ ਲਈ ਫ਼ਸਲਾਂ ਦੀ ਤਾਜ਼ਗੀ ਵਧਾਉਣ ਵਾਲਾ ਵਿਦਿਅਕ ਸਾਧਨ।",
    ctaExperience: "ਸਿੱਖਣਾ ਸ਼ੁਰੂ ਕਰੋ",
    ctaInspect: "ਪੈਕਿੰਗ ਪਰਤਾਂ ਦੇਖੋ",
    freeFlight: "ਆਟੋ ਟੂਰ",
    sound: "ਆਵਾਜ਼",
    experience: "ਸਿੱਖਣਾ ਸ਼ੁਰੂ ਕਰੋ",
    persona: "ਮਾਰਗਦਰਸ਼ਨ ਪੱਧਰ",
    filmMaterials: "ਪੈਕਿੰਗ ਸਮੱਗਰੀ",
    shelfLifeSim: "ਸ਼ੈਲਫ-ਲਾਈਫ ਕੈਲਕੁਲੇਟਰ",
    barrierPhysics: "ਨਮੀ-ਹਵਾ ਸੁਰੱਖਿਆ",
    topsisScore: "ਗੁਣਵੱਤਾ ਰੇਟਿੰਗ",
    launchEngine: "ਗਾਈਡ ਸ਼ੁਰੂ ਕਰੋ",
    farmerBadge: "ਸ਼ੁਰੂਆਤੀ (Beginner)",
    scientistBadge: "ਮਾਹਰ (Expert)",
    adminBadge: "ਐਡਮਿਨ ਮੋਡ",
    
    // Navigation Labels (Punjabi)
    nav: {
      home: "ਮੁੱਖ ਪੰਨਾ",
      engine: "ਇੰਜਨ",
      materials: "ਮਟੀਰੀਅਲ",
      shelfLife: "ਸ਼ੈਲਫ-ਲਾਇਫ",
      checklist: "ਚੈੱਕਲਿਸਟ",
      library: "ਲਾਈਬ੍ਰੇਰੀ",
      about: "ਸਾਡੇ ਬਾਰੇ",
      login: "ਲੌਗਇਨ",
      signup: "ਸ਼ੁਰੂ ਕਰੋ",
      account: "ਖਾਤਾ",
      admin: "ਐਡਮਿਨ",
      juryDemo: "ਡੇਮੋ"
    },
    
    info: {
      persona: "ਆਸਾਨ ਜਾਣਕਾਰੀ ਲਈ 'ਸ਼ੁਰੂਆਤੀ' ਚੁਣੋ ਜਾਂ ਤਕਨੀਕੀ ਜਾਣਕਾਰੀ ਲਈ 'ਮਾਹਰ' ਚੁਣੋ।",
      materials: "ਭੋਜਨ ਉਦਯੋਗ ਵਿੱਚ ਵਰਤੀਆਂ ਜਾਣ ਵਾਲੀਆਂ ਪਲਾਸਟਿਕ ਦੀਆਂ ਪਰਤਾਂ ਬਾਰੇ ਜਾਣੋ।",
      sim: "ਗਣਨਾ ਕਰੋ ਕਿ ਪੈਕੇਜਿੰਗ ਸਮੱਗਰੀ ਫਸਲ ਦੀ ਤਾਜ਼ਗੀ ਨੂੰ ਕਿਵੇਂ ਪ੍ਰਭਾਵਿਤ ਕਰਦੀ ਹੈ।",
      physics: "ਜਾਣੋ ਕਿ ਬੈਰੀਅਰ ਪਰਤਾਂ ਹਵਾ ਅਤੇ ਨਮੀ ਨੂੰ ਕਿਵੇਂ ਰੋਕਦੀਆਂ ਹਨ।",
      topsis: "ਤੁਹਾਡੇ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਪੈਕੇਜਿੰਗ ਚੁਣਨ ਵਾਲਾ ਸਿਸਟਮ।"
    },

    normalBag: "ਮੁੱਢਲੀ ਪੈਕੇਜਿੰਗ (ਸਿੰਗਲ ਲੇਅਰ)",
    recommendedBag: "ਉੱਤਮ ਪੈਕੇਜਿੰਗ (ਮਲਟੀ-ਲੇਅਰ)",
    freshnessGain: "ਵਾਧੂ ਤਾਜ਼ਗੀ ਦੇ ਦਿਨ",
    storageTip: "ਵਧੀਆ ਸੰਭਾਲ ਸਲਾਹ",
    cropSelect: "ਆਪਣੀ ਫ਼ਸਲ ਚੁਣੋ",
    simTitle: "ਵਿਦਿਅਕ ਸ਼ੈਲਫ-ਲਾਈਫ ਕੈਲਕੁਲੇਟਰ",
    simDesc: "ਸਧਾਰਨ ਸਿੰਗਲ-ਲੇਅਰ ਪਲਾਸਟਿਕ ਅਤੇ ਉੱਤਮ ਮਲਟੀ-ਲੇਅਰ ਬੈਰੀਅਰ ਪੈਕੇਜਿੰਗ ਵਿਚਕਾਰ ਫਰਕ ਸਮਝੋ।",
    daysFresh: "ਦਿਨ ਤਾਜ਼ਾ ਰਹੇਗਾ",
    spoilsOn: "ਇਸ ਦਿਨ ਖਰਾਬ ਹੋਵੇਗਾ",
    keptFreshUntil: "ਇਸ ਦਿਨ ਤੱਕ ਬਿਲਕੁਲ ਤਾਜ਼ਾ ਰਹੇਗਾ",
    savingMoney: "ਸਹੀ ਪੈਕੇਜਿੰਗ ਫ਼ਸਲ ਦੀ ਖਰਾਬੀ ਰੋਕਦੀ ਹੈ ਅਤੇ ਮੁਨਾਫ਼ਾ ਵਧਾਉਂਦੀ ਹੈ",
    downloadSpec: "ਵਿਦਿਅਕ ਗਾਈਡ ਡਾਊਨਲੋਡ ਕਰੋ (PDF)",
    close: "ਬੰਦ ਕਰੋ",
    farmerModeBtn: "🌱 ਸ਼ੁਰੂਆਤੀ / ਸੌਖਾ ਤਰੀਕਾ",
    scientistModeBtn: "🔬 ਮਾਹਰ / ਤਕਨੀਕੀ ਗ੍ਰਾਫ",
    gaugeTitle: "ਤਾਜ਼ਗੀ ਤੁਲਨਾ ਮੀਟਰ",
    longerLife: "ਵੱਧ ਟਿਕਾਊ",
    riskOfRot: "ਖਰਾਬ ਹੋਣ ਦਾ ਖ਼ਤਰਾ",
    hotspotTag: "ਪੈਕੇਜਿੰਗ ਤਕਨੀਕ ਬਿੰਦੂ",

    crops: {
      strawberry: { name: "ਤਾਜ਼ੀ ਸਟ੍ਰਾਬੇਰੀ" },
      mango: { name: "ਅਲਫਾਂਸੋ ਅੰਬ" },
      tomato: { name: "ਤਾਜ਼ੇ ਟਮਾਟਰ" },
      chips: { name: "ਸਨੈਕਸ / ਵੇਫਰ" },
      grain: { name: "ਅਨਾਜ ਅਤੇ ਦਾਲਾਂ" }
    },
    spoilBasic: "ਸਧਾਰਨ ਸਿੰਗਲ-ਲੇਅਰ ਪੈਕੇਜਿੰਗ ਵਿੱਚ ਆਕਸੀਜਨ ਅਤੇ ਨਮੀ ਕਾਰਨ {crop} ਸਿਰਫ {days} ਦਿਨਾਂ ਵਿੱਚ ਖਰਾਬ ਹੋ ਜਾਂਦੀ ਹੈ।",
    spoilOptimal: "ਉੱਤਮ ਮਲਟੀ-ਲੇਅਰ ਬੈਰੀਅਰ ਪੈਕੇਜਿੰਗ ਬਾਹਰੀ ਹਵਾ ਨੂੰ ਰੋਕ ਕੇ {crop} ਨੂੰ {days} ਦਿਨਾਂ ਤੱਕ ਤਾਜ਼ਾ ਰੱਖਦੀ ਹੈ।",
    storeAt: "ਸਟੋਰ ਕਰਦੇ ਸਮੇਂ ਤਾਪਮਾਨ {temp} 'ਤੇ ਰੱਖੋ।",

    personaModal: {
      badge: "ਆਪਣਾ ਪੱਧਰ ਚੁਣੋ",
      title: "ਤੁਸੀਂ ਕਿਵੇਂ ਸਿੱਖਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
      farmerTitle: "ਸ਼ੁਰੂਆਤੀ (ਸੌਖਾ ਤਰੀਕਾ)",
      farmerDesc: "ਕੋਈ ਔਖੇ ਤਕਨੀਕੀ ਸ਼ਬਦ ਨਹੀਂ। ਫਲ, ਸਬਜ਼ੀਆਂ ਅਤੇ ਅਨਾਜ ਨੂੰ ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਤਾਜ਼ਾ ਕਿਵੇਂ ਰੱਖੀਏ, ਇਸ ਦੀ ਵਿਦਿਅਕ ਜਾਣਕਾਰੀ।",
      scientistTitle: "ਮਾਹਰ (ਤਕਨੀਕੀ ਤਰੀਕਾ)",
      scientistDesc: "ਪੈਕੇਜਿੰਗ ਮਾਹਿਰਾਂ ਲਈ ਵਿਗਿਆਨਕ ਗ੍ਰਾਫ, ਗੈਸ ਰੋਕਣ ਵਾਲੇ ਅੰਕੜੇ ਅਤੇ ਵੇਰਵੇ।",
      adminTitle: "ਸਿਸਟਮ ਪ੍ਰਬੰਧਕ",
      adminDesc: "ਫਸਲ ਸਾਹ ਪ੍ਰਣਾਲੀ ਅਤੇ ਪੈਕੇਜਿੰਗ ਫਿਲਮਾਂ ਦਾ ਡਾਟਾਬੇਸ।",
      confirmBtn: "ਪੱਕਾ ਕਰੋ"
    },
    materialsModal: {
      badge: "ਪੈਕਿੰਗ ਬਣਤਰ ਗਾਈਡ",
      title: "ਮਲਟੀ-ਲੇਅਰ ਪੈਕੇਜਿੰਗ ਬਣਤਰ ਨੂੰ ਸਮਝਣਾ",
      subtitle: "ਭੋਜਨ ਉਦਯੋਗ ਭੋਜਨ ਨੂੰ ਸੁਰੱਖਿਅਤ ਰੱਖਣ ਲਈ ਕਈ ਪਰਤਾਂ ਦੀ ਵਰਤੋਂ ਕਿਉਂ ਕਰਦਾ ਹੈ, ਇਹ ਸਮਝਣ ਲਈ ਪਰਤ 'ਤੇ ਕਲਿੱਕ ਕਰੋ",
      layerName: "ਪ੍ਰਮਾਣਿਤ ਮਲਟੀ-ਲੇਅਰ ਬੈਰੀਅਰ ਫਿਲਮ",
      ratingBadge: "ਉਦਯੋਗ ਪ੍ਰਮਾਣਿਤ ਸੁਰੱਖਿਆ",
      score: "ਗੁਣਵੱਤਾ ਰੇਟਿੰਗ",
      layer1Title: "ਪਰਤ 1: ਬਾਹਰੀ ਮਜ਼ਬੂਤ ਅਤੇ ਪ੍ਰਿੰਟਿੰਗ ਪਰਤ (ਉਦਾਹਰਣ ਵਜੋਂ PET)",
      layer1Role: "ਢੋਆ-ਢੁਆਈ ਦੌਰਾਨ ਬੈਗ ਨੂੰ ਫਟਣ ਤੋਂ ਬਚਾਉਂਦੀ ਹੈ ਅਤੇ ਉੱਚ ਗੁਣਵੱਤਾ ਵਾਲੀ ਛਪਾਈ ਦੀ ਆਗਿਆ ਦਿੰਦੀ ਹੈ।",
      layer2Title: "ਪਰਤ 2: ਹਵਾ ਅਤੇ ਨਮੀ ਰੋਕਣ ਵਾਲੀ ਬੈਰੀਅਰ ਪਰਤ (ਉਦਾਹਰਣ ਵਜੋਂ Aluminum/Nylon)",
      layer2Role: "ਇਹ ਸਭ ਤੋਂ ਮਹੱਤਵਪੂਰਨ ਪਰਤ ਹੈ। ਇਹ ਬਾਹਰੀ ਨਮੀ ਅਤੇ ਆਕਸੀਜਨ ਨੂੰ ਅੰਦਰ ਨਹੀਂ ਜਾਣ ਦਿੰਦੀ, ਜਿਸ ਨਾਲ ਉੱਲੀ ਨਹੀਂ ਲੱਗਦੀ।",
      layer3Title: "ਪਰਤ 3: ਭੋਜਨ-ਸੁਰੱਖਿਅਤ ਸੀਲਿੰਗ ਪਰਤ (ਉਦਾਹਰਣ ਵਜੋਂ LDPE/CPP)",
      layer3Role: "ਇਹ ਇੱਕ ਫੂਡ-ਗ੍ਰੇਡ ਪਰਤ ਹੈ ਜੋ ਭੋਜਨ ਨੂੰ ਛੂੰਹਦੀ ਹੈ। ਪੈਕੇਜਿੰਗ ਮਸ਼ੀਨ 'ਤੇ ਗਰਮ ਕਰਨ 'ਤੇ ਇਹ ਪਿਘਲ ਕੇ ਏਅਰਟਾਈਟ ਸੀਲ ਬਣਾਉਂਦੀ ਹੈ।",
      ecoBadge: "ਰੀਸਾਈਕਲ ਹੋਣ ਯੋਗ ਬਣਤਰ"
    },

    frames: [
      {
        title: "ਫ਼ਸਲ ਦਾ ਨੁਕਸਾਨ",
        subtitle: "ਵਾਢੀ ਤੋਂ ਬਾਅਦ ਖਰਾਬ ਹੋਣ ਤੋਂ ਬਚਾਓ",
        desc: "ਖੁੱਲ੍ਹੀ ਹਵਾ ਅਤੇ ਨਮੀ ਨਾਲ ਫਲ ਅਤੇ ਸਬਜ਼ੀਆਂ ਜਲਦੀ ਖਰਾਬ ਹੁੰਦੀਆਂ ਹਨ। ਸਹੀ ਪੈਕੇਜਿੰਗ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ।"
      },
      {
        title: "ਹਵਾ ਅਤੇ ਗੈਸ ਸੰਤੁਲਨ",
        subtitle: "ਆਕਸੀਜਨ ਅਤੇ CO₂ ਦਾ ਨਿਯੰਤਰਣ",
        desc: "ਗੈਸ ਸੰਤੁਲਨ ਫ਼ਸਲ ਦੇ ਸੁਆਦ ਅਤੇ ਤਾਜ਼ਗੀ ਨੂੰ ਕਾਇਮ ਰੱਖਦਾ ਹੈ। ਇਸ ਲਈ ਖਾਸ ਬੈਰੀਅਰ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ।"
      },
      {
        title: "ਮਲਟੀ-ਲੇਅਰ ਸੁਰੱਖਿਆ ਫਿਲਮ",
        subtitle: "ਸਿੰਗਲ ਲੇਅਰ ਕਾਫ਼ੀ ਕਿਉਂ ਨਹੀਂ ਹੈ?",
        desc: "ਭੋਜਨ ਉਦਯੋਗ ਮਲਟੀ-ਲੇਅਰ ਫਿਲਮਾਂ ਦੀ ਵਰਤੋਂ ਕਰਦਾ ਹੈ ਕਿਉਂਕਿ ਕੋਈ ਵੀ ਇੱਕ ਪਲਾਸਟਿਕ ਨਮੀ, ਆਕਸੀਜਨ ਨੂੰ ਰੋਕ ਨਹੀਂ ਸਕਦਾ ਅਤੇ ਸੀਲ ਵੀ ਨਹੀਂ ਕਰ ਸਕਦਾ।"
      },
      {
        title: "ਨਮੀ ਅਤੇ ਹਵਾ ਰੋਧਕ",
        subtitle: "ਜੀਰੋ ਲੀਕੇਜ ਅਤੇ ਵਾਟਰਪ੍ਰੂਫ਼ ਸੀਲਿੰਗ",
        desc: "ਇੱਕ ਚੰਗੀ ਬੈਰੀਅਰ ਪਰਤ ਸੁੱਕੇ ਅਨਾਜ ਨੂੰ ਕੁਰਕੁਰਾ ਅਤੇ ਤਾਜ਼ੇ ਫਲਾਂ ਨੂੰ ਰਸੀਲਾ ਰੱਖਦੀ ਹੈ।"
      },
      {
        title: "ਗਰਮੀ ਅਤੇ ਧੁੱਪ ਤੋਂ ਬਚਾਅ",
        subtitle: "ਟ੍ਰਾਂਸਪੋਰਟ ਦੌਰਾਨ ਸੁਰੱਖਿਅਤ",
        desc: "ਬਾਹਰੀ ਪਰਤ ਖੇਤ ਤੋਂ ਮੰਡੀ ਤੱਕ ਟ੍ਰਾਂਸਪੋਰਟ ਦੌਰਾਨ ਫਸਲ ਨੂੰ ਧੁੱਪ ਅਤੇ ਫਟਣ ਤੋਂ ਬਚਾਉਂਦੀ ਹੈ।"
      },
      {
        title: "ਉੱਤਮ ਪੈਕੇਜਿੰਗ ਦੀ ਚੋਣ",
        subtitle: "ਲਾਗਤ ਅਤੇ ਸੁਰੱਖਿਆ ਦਾ ਸੰਤੁਲਨ",
        desc: "ਪੈਕੇਜਿੰਗ ਵਿਗਿਆਨ ਨੂੰ ਸਮਝਣ ਨਾਲ ਉੱਦਮੀਆਂ ਨੂੰ ਸਭ ਤੋਂ ਘੱਟ ਲਾਗਤ ਵਾਲੀ ਬਣਤਰ ਚੁਣਨ ਵਿੱਚ ਮਦਦ ਮਿਲਦੀ ਹੈ।"
      },
      {
        title: "ਵੱਧ ਤੋਂ ਵੱਧ ਸ਼ੈਲਫ ਲਾਈਫ",
        subtitle: "ਬਿਨਾਂ ਕਿਸੇ ਕੈਮੀਕਲ ਦੇ ਤਾਜ਼ਗੀ",
        desc: "ਸਹੀ ਬੈਰੀਅਰ ਬਣਤਰ ਨਾਲ, ਕਿਸਾਨ ਖਰਾਬ ਹੋਣ ਦੇ ਡਰ ਤੋਂ ਬਿਨਾਂ ਆਪਣੀ ਫ਼ਸਲ ਨੂੰ ਸਹੀ ਭਾਅ 'ਤੇ ਵੇਚ ਸਕਦੇ ਹਨ।"
      },
      {
        title: "ਵਾਤਾਵਰਣ ਦੇ ਅਨੁਕੂਲ ਪੈਕੇਜਿੰਗ",
        subtitle: "ਰੀਸਾਈਕਲਿੰਗ ਵੱਲ ਵਧਦੇ ਕਦਮ",
        desc: "ਆਧੁਨਿਕ ਪੈਕੇਜਿੰਗ ਵਿਗਿਆਨ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਅਤ ਅਤੇ ਰੀਸਾਈਕਲ ਹੋਣ ਯੋਗ ਮਲਟੀ-ਲੇਅਰ ਫਿਲਮਾਂ ਬਣਾਉਣ 'ਤੇ ਕੇਂਦ੍ਰਿਤ ਹੈ।"
      },
      {
        title: "ਪੈਕੇਜਿੰਗ ਗਾਈਡ ਤਿਆਰ ਹੈ",
        subtitle: "ਆਪਣੀ ਫ਼ਸਲ ਲਈ ਪੈਕੇਜਿੰਗ ਸਿੱਖੋ",
        desc: "ਹੇਠਾਂ ਆਪਣੀ ਫ਼ਸਲ ਚੁਣੋ ਅਤੇ ਜਾਣੋ ਕਿ ਵੱਖ-ਵੱਖ ਪੈਕੇਜਿੰਗ ਸਮੱਗਰੀ ਇਸਦੀ ਸ਼ੈਲਫ ਲਾਈਫ ਨੂੰ ਕਿਵੇਂ ਪ੍ਰਭਾਵਿਤ ਕਰਦੀ ਹੈ।"
      }
    ]
  },

  gu: {
    title: "પેકેજિંગ માર્ગદર્શિકા",
    subTitle: "ખોરાક સંરક્ષણ માર્ગદર્શિકા",
    tagline: "શ્વસન દર • ઓક્સિજન અવરોધ • પાક સુરક્ષા",
    desc: "ખેડૂતો અને નવા ઉદ્યોગસાહસિકો માટે પાકની શેલ્ફ લાઇફ વધારતું શૈક્ષણિક માર્ગદર્શક.",
    ctaExperience: "શીખવાનું શરૂ કરો",
    ctaInspect: "પેકિંગ સ્તરો તપાસો",
    freeFlight: "ઓટો ટૂર",
    sound: "અવાજ",
    experience: "શીખવાનું શરૂ કરો",
    persona: "માર્ગદર્શન સ્તર",
    filmMaterials: "પેકિંગ સામગ્રી",
    shelfLifeSim: "શેલ્ફ-લાઇફ કેલ્ક્યુલેટર",
    barrierPhysics: "ભેજ-હવા સુરક્ષા",
    topsisScore: "ગુણવત્તા રેટિંગ",
    launchEngine: "માર્ગદર્શિકા શરૂ કરો",
    farmerBadge: "નવા નિશાળીયા (Beginner)",
    scientistBadge: "નિષ્ણાત (Expert)",
    adminBadge: "એડમિન મોડ",

    // Navigation Labels (Gujarati)
    nav: {
      home: "મુખ્ય પૃષ્ઠ",
      engine: "એન્જિન",
      materials: "સામગ્રી",
      shelfLife: "શેલ્ફ-લાઇફ",
      checklist: "ચેકલિસ્ટ",
      library: "જ્ઞાન કેન્દ્ર",
      about: "અમારા વિશે",
      login: "લોગિન",
      signup: "શરૂ કરો",
      account: "ખાતું",
      admin: "એડમિન",
      juryDemo: "ડેમો"
    },

    info: {
      persona: "સરળ માહિતી માટે 'નવા નિશાળીયા' પસંદ કરો અથવા તકનીકી માહિતી માટે 'નિષ્ણાત' પસંદ કરો.",
      materials: "ખોરાક ઉદ્યોગમાં વપરાતા પ્લાસ્ટિકના વિવિધ સ્તરો વિશે જાણો.",
      sim: "ગણતરી કરો કે પેકેજિંગ સામગ્રી પાકની તાજગીને કેવી રીતે અસર કરે છે.",
      physics: "જાણો કે બેરિયર સ્તરો હવા અને ભેજને કેવી રીતે અટકાવે છે.",
      topsis: "તમારા માટે શ્રેષ્ઠ અને ખર્ચ-અસરકારક પેકેજિંગ પસંદ કરતી સિસ્ટમ."
    },

    normalBag: "પ્રાથમિક પેકેજિંગ (સિંગલ લેયર)",
    recommendedBag: "શ્રેષ્ઠ પેકેજિંગ (મલ્ટી-લેયર)",
    freshnessGain: "વધારાના તાજગીના દિવસો",
    storageTip: "ઉત્તમ સંગ્રહ સલાહ",
    cropSelect: "તમારો પાક પસંદ કરો",
    simTitle: "શૈક્ષણિક શેલ્ફ-લાઇફ કેલ્ક્યુલેટર",
    simDesc: "સામાન્ય સિંગલ-લેયર પ્લાસ્ટિક અને શ્રેષ્ઠ મલ્ટી-લેયર બેરિયર પેકેજિંગ વચ્ચેનો તફાવત સમજો.",
    daysFresh: "દિવસ તાજું રહેશે",
    spoilsOn: "આ દિવસે બગડશે",
    keptFreshUntil: "આ દિવસ સુધી બિલકુલ તાજું રહેશે",
    savingMoney: "યોગ્ય પેકેજિંગ પાકનું નુકસાન અટકાવે છે અને નફો વધારે છે",
    downloadSpec: "શૈક્ષણિક માર્ગદર્શિકા ડાઉનલોડ કરો (PDF)",
    close: "બંધ કરો",
    farmerModeBtn: "🌱 નવા નિશાળીયા / સરળ રીત",
    scientistModeBtn: "🔬 નિષ્ણાત / તકનીકી ગ્રાફ",
    gaugeTitle: "તાજગી સરખામણી મીટર",
    longerLife: "વધુ ટકાઉ",
    riskOfRot: "બગડવાનું જોખમ",
    hotspotTag: "પેકેજિંગ ટેકનોલોજી પોઇન્ટ",

    crops: {
      strawberry: { name: "તાજી સ્ટ્રોબેરી" },
      mango: { name: "અલ્ફોન્સો કેરી" },
      tomato: { name: "તાજા ટામેટાં" },
      chips: { name: "નાસ્તો / વેફર્સ" },
      grain: { name: "અનાજ અને દાળ" }
    },
    spoilBasic: "સામાન્ય સિંગલ-લેયર પેકેજિંગમાં ઓક્સિજન અને ભેજને કારણે {crop} માત્ર {days} દિવસમાં બગડવા લાગે છે.",
    spoilOptimal: "શ્રેષ્ઠ મલ્ટી-લેયર બેરિયર પેકેજિંગ બહારની હવાને અટકાવીને {crop} ને {days} દિવસ સુધી તાજું રાખે છે.",
    storeAt: "સંગ્રહ કરતી વખતે તાપમાન {temp} પર રાખો.",

    personaModal: {
      badge: "તમારું સ્તર પસંદ કરો",
      title: "તમે કેવી રીતે શીખવા માંગો છો?",
      farmerTitle: "નવા નિશાળીયા (સરળ રીત)",
      farmerDesc: "કોઈ અઘરા તકનીકી શબ્દો નથી. ફળો, શાકભાજી અને અનાજ લાંબા સમય સુધી તાજા કેવી રીતે રાખવા તેની શૈક્ષણિક માહિતી.",
      scientistTitle: "નિષ્ણાત (તકનીકી રીત)",
      scientistDesc: "પેકેજિંગ નિષ્ણાતો માટે વૈજ્ઞાનિક ગ્રાફ, ગેસ અવરોધક ડેટા અને તકનીકી માહિતી.",
      adminTitle: "સિસ્ટમ સંચાલક",
      adminDesc: "પાક અને પેકેજિંગ ફિલ્મ્સ ડેટાબેઝ વ્યવસ્થાપન.",
      confirmBtn: "નક્કી કરો"
    },
    materialsModal: {
      badge: "પેકિંગ બેગની રચના",
      title: "મલ્ટી-લેયર પેકેજિંગ રચનાને સમજવી",
      subtitle: "ખોરાક ઉદ્યોગ ખોરાકને સુરક્ષિત રાખવા માટે બહુવિધ સ્તરોનો ઉપયોગ કેમ કરે છે તે સમજવા માટે સ્તર પર ક્લિક કરો",
      layerName: "પ્રમાણિત મલ્ટી-લેયર બેરિયર ફિલ્મ",
      ratingBadge: "ઉદ્યોગ પ્રમાણિત સુરક્ષા",
      score: "ગુણવત્તા રેટિંગ",
      layer1Title: "સ્તર 1: બહારનું મજબૂત અને પ્રિન્ટિંગ સ્તર (દા.ત. PET)",
      layer1Role: "પરિવહન દરમિયાન બેગને ફાટતી અટકાવે છે અને ઉચ્ચ ગુણવત્તાવાળી છાપકામની મંજૂરી આપે છે.",
      layer2Title: "સ્તર 2: હવા અને ભેજ રોકતું બેરિયર સ્તર (દા.ત. Aluminum/Nylon)",
      layer2Role: "આ સૌથી મહત્વપૂર્ણ સ્તર છે. તે બહારની ભેજ અને ઓક્સિજનને અંદર જવા દેતું નથી, જેથી ફૂગ કે સડો લાગતો નથી.",
      layer3Title: "સ્તર 3: ખોરાક-સુરક્ષિત સીલિંગ સ્તર (દા.ત. LDPE/CPP)",
      layer3Role: "આ એક ફૂડ-ગ્રેડ સ્તર છે જે ખોરાકને સુરક્ષિત રીતે સ્પર્શે છે. પેકેજિંગ મશીન પર ગરમ કરવાથી તે પીગળીને એરટાઇટ સીલ બનાવે છે.",
      ecoBadge: "રિસાયકલ કરી શકાય તેવી રચનાઓ"
    },

    frames: [
      {
        title: "પાકનું નુકસાન",
        subtitle: "કાપણી પછી બગડતું અટકાવો",
        desc: "ખુલ્લી હવા અને ભેજના સંપર્કમાં આવવાથી ફળ અને શાકભાજી ઝડપથી બગડે છે. યોગ્ય પેકેજિંગ આવશ્યક છે."
      },
      {
        title: "હવા અને ગેસ સંતુલન",
        subtitle: "ઓક્સિજન અને CO₂ નું નિયંત્રણ",
        desc: "ગેસ સંતુલન પાકના સ્વાદ અને તાજગીને જાળવી રાખે છે. આ માટે ખાસ બેરિયરની જરૂર હોય છે."
      },
      {
        title: "મલ્ટી-લેયર સુરક્ષા ફિલ્મ",
        subtitle: "સિંગલ લેયર પૂરતું કેમ નથી?",
        desc: "ખોરાક ઉદ્યોગ મલ્ટી-લેયર ફિલ્મોનો ઉપયોગ કરે છે કારણ કે કોઈ એક પ્લાસ્ટિક ભેજ, ઓક્સિજનને રોકી શકતું નથી અને સીલ પણ કરી શકતું નથી."
      },
      {
        title: "ભેજ અને હવા રોધક",
        subtitle: "ઝીરો લીકેજ અને વોટરપ્રૂફ સીલિંગ",
        desc: "એક સારું બેરિયર સ્તર સુકા અનાજને કડક અને તાજા ફળોને રસદાર રાખે છે."
      },
      {
        title: "ગરમી અને તડકાથી રક્ષણ",
        subtitle: "પરિવહન દરમિયાન સુરક્ષિત",
        desc: "બહારનું સ્તર ખેતરથી માર્કેટ સુધી પરિવહન દરમિયાન પાકને તડકો અને ફાટવાથી બચાવે છે."
      },
      {
        title: "શ્રેષ્ઠ પેકેજિંગની પસંદગી",
        subtitle: "કિંમત અને સુરક્ષાનું સંતુલન",
        desc: "પેકેજિંગ વિજ્ઞાનને સમજવાથી ઉદ્યોગસાહસિકોને સૌથી ઓછી કિંમતવાળી રચના પસંદ કરવામાં મદદ મળે છે જે મહત્તમ શેલ્ફ લાઇફ આપે છે."
      },
      {
        title: "મહત્તમ શેલ્ફ લાઇફ",
        subtitle: "રસાયણો વગર સંરક્ષણ",
        desc: "યોગ્ય બેરિયર રચના સાથે, ખેડૂતો બગડવાના ડર વિના તેમના પાકને યોગ્ય ભાવે વેચી શકે છે."
      },
      {
        title: "પર્યાવરણને અનુકૂળ પેકેજિંગ",
        subtitle: "રિસાયક્લિંગ તરફ આગળ વધવું",
        desc: "આધુનિક પેકેજિંગ વિજ્ઞાન સંપૂર્ણપણે સુરક્ષિત અને રિસાયકલ કરી શકાય તેવી મલ્ટી-લેયર ફિલ્મો બનાવવા પર કેન્દ્રિત છે."
      },
      {
        title: "પેકેજિંગ માર્ગદર્શિકા તૈયાર છે",
        subtitle: "તમારા પાક માટે પેકેજિંગ શીખો",
        desc: "નીચે તમારો પાક પસંદ કરો અને જાણો કે વિવિધ પેકેજિંગ સામગ્રી તેની શેલ્ફ લાઇફને કેવી રીતે અસર કરે છે."
      }
    ]
  }
};
