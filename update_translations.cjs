const fs = require('fs');

const backgroundEN = `Packaging plays a very important role in maintaining the quality, safety, and shelf life of food products during storage, transportation, and distribution. Different food commodities require different packaging materials depending on their physical, chemical, and biological properties.

Selection of improper packaging material may result in moisture absorption, oxidation, microbial spoilage, texture degradation, nutrient loss, and reduced shelf life. At present, packaging material selection is mostly dependent on expert knowledge and manual analysis. Small food industries, startups, farmers, and local manufacturers often face difficulties in selecting suitable packaging materials because of the lack of technical knowledge regarding barrier properties, permeability, storage conditions, and food-packaging compatibility.

Fresh fruits and vegetables also continue respiration after harvesting, which further complicates packaging selection because oxygen and carbon dioxide transmission must be perfectly balanced.`;

const backgroundMR = `साठवणूक, वाहतूक आणि वितरणादरम्यान अन्न उत्पादनांची गुणवत्ता, सुरक्षितता आणि टिकण्याची क्षमता (शेल्फ लाइफ) राखण्यात पॅकेजिंग अत्यंत महत्त्वाची भूमिका बजावते. वेगवेगळ्या अन्न उत्पादनांना त्यांच्या भौतिक, रासायनिक आणि जैविक गुणधर्मांनुसार वेगवेगळ्या पॅकेजिंग साहित्याची आवश्यकता असते.

चुकीच्या पॅकेजिंग साहित्याच्या निवडीमुळे ओलावा शोषला जाणे, ऑक्सिडेशन, सूक्ष्मजीवांमुळे होणारी नासाडी, पोत खराब होणे, पोषक तत्त्वे नष्ट होणे आणि टिकण्याची क्षमता कमी होणे अशा समस्या उद्भवू शकतात. सध्या, पॅकेजिंग साहित्याची निवड बहुतांश तज्ञांच्या ज्ञानावर आणि मॅन्युअल विश्लेषणावर अवलंबून असते. लहान अन्न उद्योग, स्टार्टअप्स, शेतकरी आणि स्थानिक उत्पादकांना अनेकदा तांत्रिक ज्ञानाच्या अभावामुळे योग्य पॅकेजिंग साहित्य निवडण्यात अडचणी येतात.

ताजी फळे आणि भाज्या काढणीनंतरही श्वसन करत राहतात, ज्यामुळे पॅकेजिंग निवडणे अधिक क्लिष्ट होते, कारण ऑक्सिजन आणि कार्बन डायऑक्साइडचे वहन योग्यरित्या संतुलित असणे आवश्यक असते.`;

const backgroundHI = `भंडारण, परिवहन और वितरण के दौरान खाद्य उत्पादों की गुणवत्ता, सुरक्षा और शेल्फ लाइफ बनाए रखने में पैकेजिंग बहुत महत्वपूर्ण भूमिका निभाती है। विभिन्न खाद्य पदार्थों को उनके भौतिक, रासायनिक और जैविक गुणों के आधार पर अलग-अलग पैकेजिंग सामग्री की आवश्यकता होती है।

अनुचित पैकेजिंग सामग्री के चयन से नमी का अवशोषण, ऑक्सीकरण, माइक्रोबियल खराब होना, बनावट में गिरावट, पोषक तत्वों की हानि और शेल्फ लाइफ में कमी हो सकती है। वर्तमान में, पैकेजिंग सामग्री का चयन ज्यादातर विशेषज्ञ ज्ञान और मैन्युअल विश्लेषण पर निर्भर है। छोटे खाद्य उद्योगों, स्टार्टअप्स, किसानों और स्थानीय निर्माताओं को अक्सर तकनीकी ज्ञान की कमी के कारण उपयुक्त पैकेजिंग सामग्री का चयन करने में कठिनाइयों का सामना करना पड़ता है।

ताजे फल और सब्जियां कटाई के बाद भी श्वसन जारी रखती हैं, जो पैकेजिंग चयन को और जटिल बना देता है क्योंकि ऑक्सीजन और कार्बन डाइऑक्साइड संचरण को पूरी तरह से संतुलित होना चाहिए।`;

const backgroundPA = `ਸਟੋਰੇਜ, ਆਵਾਜਾਈ ਅਤੇ ਵੰਡ ਦੌਰਾਨ ਭੋਜਨ ਉਤਪਾਦਾਂ ਦੀ ਗੁਣਵੱਤਾ, ਸੁਰੱਖਿਆ ਅਤੇ ਸ਼ੈਲਫ ਲਾਈਫ ਨੂੰ ਬਣਾਈ ਰੱਖਣ ਵਿੱਚ ਪੈਕੇਜਿੰਗ ਬਹੁਤ ਮਹੱਤਵਪੂਰਨ ਭੂਮਿਕਾ ਨਿਭਾਉਂਦੀ ਹੈ। ਵੱਖ-ਵੱਖ ਭੋਜਨ ਪਦਾਰਥਾਂ ਨੂੰ ਉਹਨਾਂ ਦੀਆਂ ਭੌਤਿਕ, ਰਸਾਇਣਕ ਅਤੇ ਜੈਵਿਕ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਵੱਖ-ਵੱਖ ਪੈਕੇਜਿੰਗ ਸਮੱਗਰੀਆਂ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ।

ਗਲਤ ਪੈਕੇਜਿੰਗ ਸਮੱਗਰੀ ਦੀ ਚੋਣ ਦੇ ਨਤੀਜੇ ਵਜੋਂ ਨਮੀ ਨੂੰ ਸੋਖਣਾ, ਆਕਸੀਕਰਨ, ਮਾਈਕਰੋਬਾਇਲ ਵਿਗਾੜ, ਬਣਤਰ ਵਿੱਚ ਗਿਰਾਵਟ, ਪੌਸ਼ਟਿਕ ਤੱਤ ਦਾ ਨੁਕਸਾਨ, ਅਤੇ ਸ਼ੈਲਫ ਲਾਈਫ ਘਟ ਸਕਦੀ ਹੈ। ਵਰਤਮਾਨ ਵਿੱਚ, ਪੈਕੇਜਿੰਗ ਸਮੱਗਰੀ ਦੀ ਚੋਣ ਜ਼ਿਆਦਾਤਰ ਮਾਹਰ ਗਿਆਨ ਅਤੇ ਦਸਤੀ ਵਿਸ਼ਲੇਸ਼ਣ 'ਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ। ਛੋਟੇ ਫੂਡ ਉਦਯੋਗਾਂ, ਸਟਾਰਟਅੱਪਸ, ਕਿਸਾਨਾਂ ਅਤੇ ਸਥਾਨਕ ਨਿਰਮਾਤਾਵਾਂ ਨੂੰ ਅਕਸਰ ਤਕਨੀਕੀ ਗਿਆਨ ਦੀ ਘਾਟ ਕਾਰਨ ਢੁਕਵੀਂ ਪੈਕੇਜਿੰਗ ਸਮੱਗਰੀ ਦੀ ਚੋਣ ਕਰਨ ਵਿੱਚ ਮੁਸ਼ਕਲਾਂ ਦਾ ਸਾਹਮਣਾ ਕਰਨਾ ਪੈਂਦਾ ਹੈ।

ਤਾਜ਼ੇ ਫਲ ਅਤੇ ਸਬਜ਼ੀਆਂ ਵਾਢੀ ਤੋਂ ਬਾਅਦ ਸਾਹ ਲੈਣਾ ਜਾਰੀ ਰੱਖਦੀਆਂ ਹਨ, ਜੋ ਪੈਕੇਜਿੰਗ ਦੀ ਚੋਣ ਨੂੰ ਹੋਰ ਗੁੰਝਲਦਾਰ ਬਣਾਉਂਦੀਆਂ ਹਨ ਕਿਉਂਕਿ ਆਕਸੀਜਨ ਅਤੇ ਕਾਰਬਨ ਡਾਈਆਕਸਾਈਡ ਪ੍ਰਸਾਰਣ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੰਤੁਲਿਤ ਕੀਤਾ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ।`;

const backgroundGU = `સંગ્રહ, પરિવહન અને વિતરણ દરમિયાન ખાદ્ય ઉત્પાદનોની ગુણવત્તા, સલામતી અને શેલ્ફ લાઇફ જાળવવામાં પેકેજિંગ ખૂબ જ મહત્વપૂર્ણ ભૂમિકા ભજવે છે. વિવિધ ખાદ્ય ચીજવસ્તુઓને તેમના ભૌતિક, રાસાયણિક અને જૈવિક ગુણધર્મોના આધારે વિવિધ પેકેજિંગ સામગ્રીની જરૂર પડે છે.

અયોગ્ય પેકેજિંગ સામગ્રીની પસંદગીથી ભેજનું શોષણ, ઓક્સિડેશન, માઇક્રોબાયલ બગાડ, પોતનો બગાડ, પોષક તત્વોની ખોટ અને શેલ્ફ લાઇફમાં ઘટાડો થઈ શકે છે. હાલમાં, પેકેજિંગ સામગ્રીની પસંદગી મોટે ભાગે નિષ્ણાતોના જ્ઞાન અને મેન્યુઅલ વિશ્લેષણ પર આધારિત છે. નાના ખાદ્ય ઉદ્યોગો, સ્ટાર્ટઅપ્સ, ખેડૂતો અને સ્થાનિક ઉત્પાદકોને ઘણીવાર તકનીકી જ્ઞાનના અભાવને કારણે યોગ્ય પેકેજિંગ સામગ્રી પસંદ કરવામાં મુશ્કેલીઓનો સામનો કરવો પડે છે.

તાજા ફળો અને શાકભાજી લણણી પછી પણ શ્વસન ચાલુ રાખે છે, જે પેકેજિંગ પસંદગીને વધુ જટિલ બનાવે છે કારણ કે ઓક્સિજન અને કાર્બન ડાયોક્સાઇડના પ્રસારણનું સંપૂર્ણ સંતુલન હોવું આવશ્યક છે.`;

const logicEN = {
  fp_mat: 'Micro-perforated BOPP or Breathable LDPE',
  fp_map: 'Highly Recommended (High CO2, Low O2)',
  fp_seal: 'Standard Heat Seal',
  fp_eco: 'Compostable PLA (Polylactic Acid) films',
  dg_mat: 'PET / Met-PET / PE Laminate',
  dg_map: 'Not Required',
  dg_seal: 'High Strength Hermetic Seal',
  dg_eco: 'Mono-material PE structures (Recyclable)',
  sn_mat: 'BOPP / Aluminum Foil / CPP',
  sn_map: 'Nitrogen Flushing Required',
  sn_seal: 'High Strength Hot Tack Seal',
  sn_eco: 'High-barrier metallized mono-materials',
  mp_mat: 'PA (Nylon) / EVOH / PE Laminate',
  mp_map: 'Required (High O2 / CO2 blend)',
  mp_seal: 'Ultra-High Strength Vacuum Seal',
  mp_eco: 'Bio-based PE / EVOH laminates',
  da_mat: 'Opaque PET / Alu Foil / PE',
  da_map: 'Nitrogen / CO2 Flushing',
  da_seal: 'Strong Hermetic Seal',
  da_eco: 'Recyclable Opaque Mono-PE',
  def_mat: 'Standard Multi-Layer',
  def_map: 'Optional',
  def_seal: 'Standard',
  def_eco: 'Check local recycling guidelines',
  mod_frozen: ' (Cold-resistant grade PE/EVA)',
  mod_rough: 'Reinforced Quad-Seal'
};

const logicMR = {
  fp_mat: 'मायक्रो-परफोरेटेड बीओपीपी (BOPP) किंवा श्वास घेण्यायोग्य एलडीपीई (LDPE)',
  fp_map: 'अत्यंत शिफारसीय (जास्त CO2, कमी O2)',
  fp_seal: 'प्रमाणित उष्णता सील (Heat Seal)',
  fp_eco: 'विघटनशील पीएलए (PLA) फिल्म्स',
  dg_mat: 'पीईटी (PET) / मेट-पीईटी / पीई लॅमिनेट',
  dg_map: 'आवश्यक नाही',
  dg_seal: 'उच्च क्षमतेचे हर्मेटिक सील',
  dg_eco: 'मोनो-मटेरियल पीई रचना (पुनर्वापरयोग्य)',
  sn_mat: 'बीओपीपी (BOPP) / ॲल्युमिनियम फॉइल / सीपीपी (CPP)',
  sn_map: 'नायट्रोजन फ्लशिंग आवश्यक',
  sn_seal: 'उच्च क्षमतेचे हॉट टॅक सील',
  sn_eco: 'हाय-बॅरियर मेटलाइज्ड मोनो-मटेरियल',
  mp_mat: 'पीए (नायलॉन) / ईव्हीओएच (EVOH) / पीई लॅमिनेट',
  mp_map: 'आवश्यक (जास्त O2 / CO2 मिश्रण)',
  mp_seal: 'अल्ट्रा-हाय स्ट्रेंथ व्हॅक्यूम सील',
  mp_eco: 'बायो-बेस्ड पीई / ईव्हीओएच लॅमिनेट्स',
  da_mat: 'अपारदर्शक पीईटी / ॲल्युमिनियम फॉइल / पीई',
  da_map: 'नायट्रोजन / CO2 फ्लशिंग',
  da_seal: 'मजबूत हर्मेटिक सील',
  da_eco: 'पुनर्वापरयोग्य अपारदर्शक मोनो-पीई',
  def_mat: 'प्रमाणित मल्टी-लेयर',
  def_map: 'ऐच्छिक',
  def_seal: 'प्रमाणित सील',
  def_eco: 'स्थानिक पुनर्वापर मार्गदर्शक तत्त्वे तपासा',
  mod_frozen: ' (थंड-प्रतिरोधक ग्रेड PE/EVA)',
  mod_rough: 'मजबूत क्वाड-सील'
};

const logicHI = {
  fp_mat: 'माइक्रो-परफोरेटेड बीओपीपी (BOPP) या हवादार एलडीपीई (LDPE)',
  fp_map: 'अत्यधिक अनुशंसित (उच्च CO2, निम्न O2)',
  fp_seal: 'मानक हीट सील',
  fp_eco: 'बायोडिग्रेडेबल पीएलए (PLA) फिल्म',
  dg_mat: 'पीईटी (PET) / मेट-पीईटी / पीई लैमिनेट',
  dg_map: 'आवश्यक नहीं',
  dg_seal: 'उच्च शक्ति हर्मेटिक सील',
  dg_eco: 'मोनो-मटेरियल पीई संरचनाएं (रिसाइकिल करने योग्य)',
  sn_mat: 'बीओपीपी (BOPP) / एल्यूमीनियम फॉयल / सीपीपी (CPP)',
  sn_map: 'नाइट्रोजन फ्लशिंग आवश्यक',
  sn_seal: 'उच्च शक्ति हॉट टैक सील',
  sn_eco: 'हाई-बैरियर मेटलाइज्ड मोनो-मटेरियल',
  mp_mat: 'पीए (नायलॉन) / ईवीओएच (EVOH) / पीई लैमिनेट',
  mp_map: 'आवश्यक (उच्च O2 / CO2 मिश्रण)',
  mp_seal: 'अल्ट्रा-हाई स्ट्रेंथ वैक्यूम सील',
  mp_eco: 'बायो-बेस्ड पीई / ईवीओएच लैमिनेट्स',
  da_mat: 'अपारदर्शी पीईटी / एल्यूमीनियम फॉयल / पीई',
  da_map: 'नाइट्रोजन / CO2 फ्लशिंग',
  da_seal: 'मजबूत हर्मेटिक सील',
  da_eco: 'रिसाइकिल करने योग्य अपारदर्शी मोनो-पीई',
  def_mat: 'मानक मल्टी-लेयर',
  def_map: 'वैकल्पिक',
  def_seal: 'मानक सील',
  def_eco: 'स्थानीय रीसाइक्लिंग दिशानिर्देशों की जांच करें',
  mod_frozen: ' (कोल्ड-रेसिस्टेंट ग्रेड PE/EVA)',
  mod_rough: 'प्रबलित क्वाड-सील'
};

const logicPA = {
  fp_mat: 'ਮਾਈਕ੍ਰੋ-ਪਰਫੋਰੇਟਿਡ ਬੀਓਪੀਪੀ (BOPP) ਜਾਂ ਹਵਾਦਾਰ ਐਲਡੀਪੀਈ (LDPE)',
  fp_map: 'ਬਹੁਤ ਸਿਫਾਰਸ਼ ਕੀਤੀ (ਵੱਧ CO2, ਘੱਟ O2)',
  fp_seal: 'ਸਟੈਂਡਰਡ ਹੀਟ ਸੀਲ',
  fp_eco: 'ਬਾਇਓਡੀਗ੍ਰੇਡੇਬਲ ਪੀਐਲਏ (PLA) ਫਿਲਮਾਂ',
  dg_mat: 'ਪੀਈਟੀ (PET) / ਮੈਟ-ਪੀਈਟੀ / ਪੀਈ ਲੈਮੀਨੇਟ',
  dg_map: 'ਲੋੜੀਂਦਾ ਨਹੀਂ',
  dg_seal: 'ਹਾਈ ਸਟ੍ਰੈਂਥ ਹਰਮੇਟਿਕ ਸੀਲ',
  dg_eco: 'ਮੋਨੋ-ਮਟੀਰੀਅਲ ਪੀਈ ਬਣਤਰ (ਰੀਸਾਈਕਲ ਹੋਣ ਯੋਗ)',
  sn_mat: 'ਬੀਓਪੀਪੀ (BOPP) / ਐਲੂਮੀਨੀਅਮ ਫੋਇਲ / ਸੀਪੀਪੀ (CPP)',
  sn_map: 'ਨਾਈਟ੍ਰੋਜਨ ਫਲੱਸ਼ਿੰਗ ਜ਼ਰੂਰੀ',
  sn_seal: 'ਹਾਈ ਸਟ੍ਰੈਂਥ ਹੌਟ ਟੈਕ ਸੀਲ',
  sn_eco: 'ਹਾਈ-ਬੈਰੀਅਰ ਮੈਟਲਾਈਜ਼ਡ ਮੋਨੋ-ਮਟੀਰੀਅਲ',
  mp_mat: 'ਪੀਏ (ਨਾਈਲੋਨ) / ਈਵੀਓਐਚ (EVOH) / ਪੀਈ ਲੈਮੀਨੇਟ',
  mp_map: 'ਜ਼ਰੂਰੀ (ਵੱਧ O2 / CO2 ਮਿਸ਼ਰਣ)',
  mp_seal: 'ਅਲਟਰਾ-ਹਾਈ ਸਟ੍ਰੈਂਥ ਵੈਕਿਊਮ ਸੀਲ',
  mp_eco: 'ਬਾਇਓ-ਬੇਸਡ ਪੀਈ / ਈਵੀਓਐਚ ਲੈਮੀਨੇਟਸ',
  da_mat: 'ਅਪਾਰਦਰਸ਼ੀ ਪੀਈਟੀ / ਐਲੂਮੀਨੀਅਮ ਫੋਇਲ / ਪੀਈ',
  da_map: 'ਨਾਈਟ੍ਰੋਜਨ / CO2 ਫਲੱਸ਼ਿੰਗ',
  da_seal: 'ਮਜ਼ਬੂਤ ਹਰਮੇਟਿਕ ਸੀਲ',
  da_eco: 'ਰੀਸਾਈਕਲ ਹੋਣ ਯੋਗ ਅਪਾਰਦਰਸ਼ੀ ਮੋਨੋ-ਪੀਈ',
  def_mat: 'ਸਟੈਂਡਰਡ ਮਲਟੀ-ਲੇਅਰ',
  def_map: 'ਵਿਕਲਪਿਕ',
  def_seal: 'ਸਟੈਂਡਰਡ ਸੀਲ',
  def_eco: 'ਸਥਾਨਕ ਰੀਸਾਈਕਲਿੰਗ ਦਿਸ਼ਾ ਨਿਰਦੇਸ਼ਾਂ ਦੀ ਜਾਂਚ ਕਰੋ',
  mod_frozen: ' (ਕੋਲਡ-ਰੈਜ਼ਿਸਟੈਂਟ ਗ੍ਰੇਡ PE/EVA)',
  mod_rough: 'ਮਜ਼ਬੂਤ ਕਵਾਡ-ਸੀਲ'
};

const logicGU = {
  fp_mat: 'માઇક્રો-પરફોરેટેડ બીઓપીપી (BOPP) અથવા શ્વાસ લેવા યોગ્ય એલડીપીઇ (LDPE)',
  fp_map: 'ખૂબ ભલામણ કરેલ (વધુ CO2, ઓછું O2)',
  fp_seal: 'સ્ટાન્ડર્ડ હીટ સીલ',
  fp_eco: 'બાયોડિગ્રેડેબલ પીએલએ (PLA) ફિલ્મો',
  dg_mat: 'પીઇટી (PET) / મેટ-પીઇટી / પીઇ લેમિનેટ',
  dg_map: 'જરૂરી નથી',
  dg_seal: 'હાઇ સ્ટ્રેન્થ હર્મેટિક સીલ',
  dg_eco: 'મોનો-મટીરિયલ પીઇ માળખાં (રિસાઇક્લેબલ)',
  sn_mat: 'બીઓપીપી (BOPP) / એલ્યુમિનિયમ ફોઇલ / સીપીપી (CPP)',
  sn_map: 'નાઇટ્રોજન ફ્લશિંગ જરૂરી',
  sn_seal: 'હાઇ સ્ટ્રેન્થ હોટ ટેક સીલ',
  sn_eco: 'હાઇ-બેરિયર મેટલાઇઝ્ડ મોનો-મટીરિયલ',
  mp_mat: 'પીએ (નાયલોન) / ઇવીઓએચ (EVOH) / પીઇ લેમિનેટ',
  mp_map: 'જરૂરી (વધુ O2 / CO2 મિશ્રણ)',
  mp_seal: 'અલ્ટ્રા-હાઇ સ્ટ્રેન્થ વેક્યૂમ સીલ',
  mp_eco: 'બાયો-બેસ્ડ પીઇ / ઇવીઓએચ લેમિનેટ્સ',
  da_mat: 'અપારદર્શક પીઇટી / એલ્યુમિનિયમ ફોઇલ / પીઇ',
  da_map: 'નાઇટ્રોજન / CO2 ફ્લશિંગ',
  da_seal: 'મજબૂત હર્મેટિક સીલ',
  da_eco: 'રિસાઇક્લેબલ અપારદર્શક મોનો-પીઇ',
  def_mat: 'સ્ટાન્ડર્ડ મલ્ટી-લેયર',
  def_map: 'વૈકલ્પિક',
  def_seal: 'સ્ટાન્ડર્ડ સીલ',
  def_eco: 'સ્થાનિક રિસાયક્લિંગ માર્ગદર્શિકા તપાસો',
  mod_frozen: ' (કોલ્ડ-રેઝિસ્ટન્ટ ગ્રેડ PE/EVA)',
  mod_rough: 'રિઇનફોર્સ્ડ ક્વાડ-સીલ'
};

const bgMap = {
  en: backgroundEN, mr: backgroundMR, hi: backgroundHI, pa: backgroundPA, gu: backgroundGU
};
const logicMap = {
  en: logicEN, mr: logicMR, hi: logicHI, pa: logicPA, gu: logicGU
};

let raw = fs.readFileSync('src/data/engineI18n.js', 'utf8');

for (const lang of ['en', 'mr', 'hi', 'pa', 'gu']) {
  const bgText = bgMap[lang];
  const logicData = JSON.stringify(logicMap[lang], null, 6);
  
  // Inject backgroundTitle, backgroundText
  const bgInject = `backgroundTitle: "${lang==='en'?'Why Packaging Matters':lang==='mr'?'पॅकेजिंग का महत्त्वाचे आहे':lang==='hi'?'पैकेजिंग क्यों महत्वपूर्ण है':lang==='pa'?'ਪੈਕੇਜਿੰਗ ਕਿਉਂ ਮਹੱਤਵਪੂਰਨ ਹੈ':'પેકેજિંગ શા માટે મહત્વપૂર્ણ છે'}",\n    backgroundText: ${JSON.stringify(bgText)},\n    inputs: {`;
  
  let regex = new RegExp(`(${lang}: \\{[\\s\\S]*?)inputs: \\{`);
  raw = raw.replace(regex, `$1${bgInject}`);
  
  // Inject logicResults before specs: {
  const logicInject = `logicResults: ${logicData},\n    specs: {`;
  let regexSpecs = new RegExp(`(${lang}: \\{[\\s\\S]*?)specs: \\{`);
  raw = raw.replace(regexSpecs, `$1${logicInject}`);
}

fs.writeFileSync('src/data/engineI18n.js', raw);
console.log("Updated engineI18n.js successfully!");
