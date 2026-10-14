import { Complaint } from '../models/Complaint.js';

export const askEcoAI = async (req, res) => {
  try {
    const { prompt, language = 'en', history = [] } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt query is required.' });
    }

    const userId = req.user ? req.user._id : null;

    // 1. Check if the user is asking about their complaints or a specific complaint ID
    const complaintIdMatch = prompt.match(/ECO-\d{4}-\d+/i);
    let matchedComplaint = null;

    if (complaintIdMatch) {
      const code = complaintIdMatch[0].toUpperCase();
      matchedComplaint = await Complaint.findOne({ complaintId: code })
        .populate('assignedStaff', 'name phone department')
        .populate('citizen', 'name');
    } else if (
      userId &&
      (prompt.toLowerCase().includes('my complaint') ||
        prompt.toLowerCase().includes('my report') ||
        prompt.toLowerCase().includes('status of my') ||
        prompt.includes('मेरी शिकायत') ||
        prompt.includes('ମୋର ଅଭିଯୋଗ'))
    ) {
      matchedComplaint = await Complaint.findOne({ citizen: userId })
        .sort({ createdAt: -1 })
        .populate('assignedStaff', 'name phone department');
    }

    // If complaint context is relevant, build verified real record response
    if (matchedComplaint) {
      let responseText = '';
      const c = matchedComplaint;
      const lang = language.toLowerCase();

      if (lang === 'hi') {
        responseText = `📌 **शिकायत विवरण:** [${c.complaintId}]\n` +
          `• **शीर्षक:** ${c.title}\n` +
          `• **वर्तमान स्थिति:** ${c.status.toUpperCase()}\n` +
          `• **विभाग:** ${c.department}\n` +
          `• **स्थान:** ${c.location.area}\n` +
          `• **नियुक्त कर्मचारी:** ${c.assignedStaffName || 'प्रक्रियाधीन'}\n` +
          `• **अंतिम अपडेट:** ${c.statusHistory[c.statusHistory.length - 1]?.comment || 'समीक्षा जारी है'}\n\n` +
          `आप अपने डैशबोर्ड पर जाकर संपूर्ण इतिहास और सबूत देख सकते हैं।`;
      } else if (lang === 'or') {
        responseText = `📌 **ଅଭିଯୋଗ ବିବରଣୀ:** [${c.complaintId}]\n` +
          `• **ଶୀର୍ଷକ:** ${c.title}\n` +
          `• **ବର୍ତ୍ତମାନର ସ୍ଥିତି:** ${c.status.toUpperCase()}\n` +
          `• **ବିଭାଗ:** ${c.department}\n` +
          `• **ସ୍ଥାନ:** ${c.location.area}\n` +
          `• **ନିୟୋଜିତ କର୍ମଚାରୀ:** ${c.assignedStaffName || 'ପ୍ରକ୍ରିୟାଧୀନ'}\n` +
          `• **ଶେଷ ଅପଡେଟ୍:** ${c.statusHistory[c.statusHistory.length - 1]?.comment || 'ସମୀକ୍ଷା ଚାଲିଛି'}\n\n` +
          `ଆପଣ ଡ୍ୟାସବୋର୍ଡରେ ସମସ୍ତ ତଥ୍ୟ ଯାଞ୍ଚ କରିପାରିବେ।`;
      } else {
        responseText = `📌 **Verified Record for Complaint [${c.complaintId}]:**\n\n` +
          `• **Title:** ${c.title}\n` +
          `• **Status:** **${c.status.toUpperCase()}**\n` +
          `• **Department:** ${c.department.toUpperCase()}\n` +
          `• **Location:** ${c.location.area} (${c.location.address})\n` +
          `• **Priority:** ${c.priority.toUpperCase()}\n` +
          `• **Assigned Officer:** ${c.assignedStaffName || 'Pending Assignment'}\n` +
          `• **Latest Progress Note:** "${c.statusHistory[c.statusHistory.length - 1]?.comment || 'Under review'}"\n` +
          (c.status === 'verified' ? `• **Outcome:** Issue resolved and verified by Local Admin. Thank you!` : '') +
          `\nYou can track real-time resolution photos directly in your SmartSathi timeline.`;
      }

      return res.json({
        success: true,
        source: 'Database Record Retrieval (Strict Anti-Hallucination)',
        reply: responseText,
        complaintData: c,
      });
    }

    // 2. Check for configured remote AI API (Gemini or OpenAI)
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const systemPrompt = `You are EcoAI, the intelligent civic assistant for EcoVerse AI (Smart Village & Smart City Management Platform).
You assist citizens and administrators in 3 languages: English, Hindi, and Odia.
Current requested response language: ${language.toUpperCase()}.
Your knowledge:
- SmartSathi: Citizen complaint portal for potholes, streetlights, drainage, garbage, leaks.
- EcoMind: Waste management, AI image classification for waste, collection tracking, segregation (Blue = Dry, Green = Wet, Yellow = Glass, Red = Hazardous).
- JalRakshak: Smart water management, pipeline leakage, reservoir telemetry, conservation tips.
- EnergyGuard: Solar park, renewable grid, streetlights fault monitoring, power outages.
- EcoMap 3D: Interactive 3D visualization of the village and smart city.
- Workflow: Citizen reports -> Local Admin reviews & assigns -> Department Staff repairs & uploads before/after evidence -> Local Admin verifies -> Citizen rates service.
Guidelines:
- Provide helpful, friendly, and practical guidance.
- Never invent fake complaint statuses or fake legal codes.
- Reply fluently in the requested language (${language}).`;

    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return res.json({
              success: true,
              source: 'Gemini AI (Configured Provider)',
              reply,
            });
          }
        }
      } catch (err) {
        console.warn('[EcoAI] Remote API error, falling back to local multilingual civic knowledgebase:', err.message);
      }
    }

    // 3. Multilingual Civic Knowledge Base Fallback
    const lower = prompt.toLowerCase();
    let fallbackReply = '';

    if (language === 'hi') {
      if (lower.includes('कचरा') || lower.includes('अपशिष्ट') || lower.includes('वेस्ट')) {
        fallbackReply = `♻️ **EcoMind कचरा पृथक्करण गाइड:**\n\n1. **गीला कचरा (हरा डिब्बा):** फलों/सब्जियों के छिलके, बचा हुआ भोजन और जैविक कचरा।\n2. **सूखा कचरा (नीला डिब्बा):** प्लास्टिक की बोतलें, कागज, कार्डबोर्ड और धातु।\n3. **कांच (पीला डिब्बा):** कांच की बोतलें और जार।\n4. **खतरनाक (लाल डिब्बा):** ई-कचरा, पुरानी बैटरियां और चिकित्सा अपशिष्ट।\n\nआप **EcoMind** मॉड्यूल में जाकर कचरे की फोटो अपलोड कर सकते हैं; हमारी AI तुरंत उसका वर्गीकरण करेगी!`;
      } else if (lower.includes('पानी') || lower.includes('जल') || lower.includes('लीकेज')) {
        fallbackReply = `💧 **JalRakshak जल संरक्षण एवं शिकायत सेवा:**\n\n• यदि आपके क्षेत्र में पाइपलाइन लीक हो रही है या पानी की कमी है, तो तुरंत **SmartSathi** या **JalRakshak** टैब से शिकायत दर्ज करें।\n• 3D मानचित्र पर लीकेज का सटीक स्थान चिह्नित करें।\n• स्थानीय जल आपूर्ति विभाग 24-48 घंटों में मरम्मत सुनिश्चित करेगा।\n• जल संरक्षण सुझाव: वर्षा जल संचयन (Rainwater Harvesting) अपनाएं और घरेलू उपयोग में ड्रिप सिंचाई तकनीकों का प्रयोग करें।`;
      } else if (lower.includes('बिजली') || lower.includes('सोलर') || lower.includes('लाइट')) {
        fallbackReply = `⚡ **EnergyGuard ऊर्जा प्रबंधन सेवा:**\n\n• खराब स्ट्रीटलाइट या ट्रांसफार्मर समस्या की रिपोर्ट करने के लिए **EnergyGuard** या **SmartSathi** का उपयोग करें।\n• EcoVerse 3D में अपने क्षेत्र के पोल नंबर को चिह्नित करें।\n• हमारे सौर पार्क (Solar Park) से स्मार्ट गांव और शहर को 68% स्वच्छ हरित ऊर्जा प्राप्त हो रही है।`;
      } else {
        fallbackReply = `नमस्ते! मैं **EcoVerse AI** सहायक हूँ।\n\nआप मुझसे निम्न विषयों पर सहायता ले सकते हैं:\n1. नई नागरिक शिकायत दर्ज करना (सड़क, जल, बिजली, कचरा)\n2. दर्ज शिकायत की स्थिति जानना (उदा. ECO-2026-1001)\n3. स्मार्ट अपशिष्ट पृथक्करण और पुनर्चक्रण नियम\n4. जल और ऊर्जा संरक्षण के सर्वोत्तम उपाय\n\nकृपया बताएं मैं आपकी क्या सहायता कर सकता हूँ?`;
      }
    } else if (language === 'or') {
      if (lower.includes('ଆବର୍ଜନା') || lower.includes('ଅଳିଆ') || lower.includes('waste')) {
        fallbackReply = `♻️ **EcoMind ବର୍ଜ୍ୟବସ୍ତୁ ପରିଚାଳନା ନିର୍ଦ୍ଦେଶାବଳୀ:**\n\n1. **ଓଦା ବର୍ଜ୍ୟବସ୍ତୁ (ସବୁଜ ବାକ୍ସ):** ପନିପରିବା ଚୋପା, ବଳକା ଖାଦ୍ୟ ଏବଂ ଜୈବିକ ପଦାର୍ଥ।\n2. **ଶୁଖିଲା ବର୍ଜ୍ୟବସ୍ତୁ (ନୀଳ ବାକ୍ସ):** ପ୍ଲାଷ୍ଟିକ୍ ବୋତଲ, କାଗଜ, ଧାତବ ପଦାର୍ଥ।\n3. **ବିପଦଜନକ ବର୍ଜ୍ୟବସ୍ତୁ (ନାଲି ବାକ୍ସ):** ପୁରୁଣା ବ୍ୟାଟେରୀ, ମେଡିକାଲ ବର୍ଜ୍ୟ।\n\nଆପଣ **EcoMind** ରେ ଫଟୋ ଅପଲୋଡ୍ କରି AI ମାଧ୍ୟମରେ ସଠିକ୍ ବର୍ଗୀକରଣ ଜାଣିପାରିବେ।`;
      } else if (lower.includes('ପାଣି') || lower.includes('ଜଳ') || lower.includes('water')) {
        fallbackReply = `💧 **JalRakshak ଜଳ ପରିଚାଳନା ସହାୟତା:**\n\n• ପାଇପଲାଇନ ଲିକ୍ କିମ୍ବା ଜଳ ଅଭାବ ସମ୍ବନ୍ଧରେ ଅଭିଯୋଗ କରିବା ପାଇଁ **SmartSathi** ବା **JalRakshak** ବ୍ୟବହାର କରନ୍ତୁ।\n• 3D ମାନଚିତ୍ରରେ ସ୍ଥାନ ଚିହ୍ନଟ କରନ୍ତୁ। ଜଳ ଯୋଗାଣ ବିଭାଗ ଶୀଘ୍ର ଏହାର ସମାଧାନ କରିବ।`;
      } else {
        fallbackReply = `ନମସ୍କାର! ମୁଁ **EcoVerse AI** ସହାୟକ।\n\nଆପଣ ନିମ୍ନ ବିଷୟରେ ମୋତେ ପଚାରିପାରିବେ:\n1. ନୂତନ ଅଭିଯୋଗ ଦାଖଲ ଏବଂ ଟ୍ରାକିଂ (ରାସ୍ତା, ପାଣି, ବିଜୁଳି, ଆବର୍ଜନା)\n2. ବର୍ଜ୍ୟବସ୍ତୁ ପୃଥକୀକରଣ ନିୟମ\n3. ଜଳ ଏବଂ ସୌରଶକ୍ତି ସଂରକ୍ଷଣ ପରାମର୍ଶ।\n\nକହନ୍ତୁ, ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?`;
      }
    } else {
      if (lower.includes('waste') || lower.includes('garbage') || lower.includes('recycle') || lower.includes('plastic')) {
        fallbackReply = `♻️ **EcoMind Waste Segregation Guide:**\n\n• **Blue Bin (Dry Recyclables):** Clean plastic bottles (PET/HDPE), paper cartons, metal cans, glass jars.\n• **Green Bin (Wet Organics):** Fruit & vegetable peels, food scraps, tea leaves (converted into village compost).\n• **Red Bin (Hazardous / E-Waste):** Batteries, medical waste, paint cans, broken CFL tubes.\n\n📸 **AI Tip:** Head over to the **EcoMind** tab and upload a picture of any item — our integrated computer vision model will instantly classify the material and tell you the exact disposal method!`;
      } else if (lower.includes('water') || lower.includes('leak') || lower.includes('jalrakshak')) {
        fallbackReply = `💧 **JalRakshak Smart Water Network:**\n\n• To report a pipeline fracture, low water pressure, or reservoir issue, click **Report Issue** in SmartSathi or JalRakshak.\n• You can drop an interactive pin on the **EcoMap 3D** world to pinpoint the exact valve or line.\n• Water department technicians receive high-priority alerts with automated SLA tracking.\n• **Conservation Tip:** Fixing a single leaking household tap saves over 3,000 litres of clean potable water every year!`;
      } else if (lower.includes('electricity') || lower.includes('streetlight') || lower.includes('energy') || lower.includes('solar')) {
        fallbackReply = `⚡ **EnergyGuard Clean Power & Grid Management:**\n\n• Report damaged streetlights, power fluctuations, or broken poles directly through SmartSathi or EnergyGuard.\n• Our Smart Village solar array produces over 420 kW of peak renewable energy with battery storage feeding both streetlights and civic water pumps.\n• Staff members attach timestamped repair photos for admin verification before tickets are marked resolved.`;
      } else if (lower.includes('how to report') || lower.includes('submit complaint') || lower.includes('workflow')) {
        fallbackReply = `🏛️ **EcoVerse Civic Resolution Workflow:**\n\n1. **Report:** Go to **SmartSathi**, describe the issue, take or attach a photo, and pick the location on the 3D Map.\n2. **Admin Review:** Local Admin verifies the ticket and assigns it to authorized department staff.\n3. **Field Repair:** Staff inspects the site, updates status to *In Progress*, and uploads resolution evidence photos.\n4. **Verification:** Admin inspects the evidence and officially closes the case.\n5. **Citizen Rating:** You receive a real-time notification and can rate the quality of service from 1 to 5 stars!`;
      } else {
        fallbackReply = `Hello! I am **EcoAI**, your smart assistant for EcoVerse AI — Smart Village & Smart City Management Platform.\n\nI can assist you with:\n• Filing and tracking municipal & village complaints (Roads, Water, Waste, Electricity)\n• Looking up specific complaint statuses (e.g. "What is status of ECO-2026-1001?")\n• Smart waste classification and recycling guidance\n• Water conservation and clean solar energy telemetry\n• Navigating the interactive 3D Smart Village & City environment\n\nHow may I help you today?`;
      }
    }

    res.json({
      success: true,
      source: 'EcoVerse Civic AI Engine (Multilingual Knowledge Base)',
      reply: fallbackReply,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
