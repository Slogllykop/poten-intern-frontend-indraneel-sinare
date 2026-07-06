import type { Translations } from "./en";

const translations: Translations = {
    // App
    "app.title": "Novus",
    "app.description": "अपने आस-पास की नागरिक समस्याओं की रिपोर्ट करें",

    // Navigation
    "nav.back": "वापस",
    "nav.next": "आगे",
    "nav.submit": "रिपोर्ट जमा करें",
    "nav.reportAnother": "एक और समस्या रिपोर्ट करें",
    "nav.viewReports": "मेरी रिपोर्ट देखें",

    // Language toggle
    "lang.switch": "अंग्रेज़ी में बदलें",
    "lang.label": "HI",

    // Step indicator
    "step.category": "श्रेणी",
    "step.details": "विवरण",
    "step.confirmation": "पूर्ण",

    // Screen 1: Category
    "category.title": "समस्या किस बारे में है?",
    "category.subtitle": "अपनी समस्या के अनुसार श्रेणी चुनें",
    "category.roads": "सड़कें और फुटपाथ",
    "category.water": "जल आपूर्ति",
    "category.electricity": "बिजली",
    "category.sanitation": "स्वच्छता और कचरा",
    "category.safety": "सार्वजनिक सुरक्षा",
    "category.other": "अन्य",

    // Screen 2: Details
    "details.title": "समस्या का विवरण दें",
    "details.subtitle": "जल्दी समाधान के लिए विवरण प्रदान करें",
    "details.descriptionLabel": "विवरण",
    "details.descriptionPlaceholder": "क्या हुआ? कहाँ पर? कोई और जानकारी...",
    "details.photoLabel": "फोटो जोड़ें",
    "details.photoHint": "वैकल्पिक। समस्या समझने में मदद करता है।",
    "details.removePhoto": "फोटो हटाएं",
    "details.voiceLabel": "आवाज़ से लिखें",
    "details.voiceStart": "बोलने के लिए टैप करें",
    "details.voiceStop": "रुकने के लिए टैप करें",
    "details.voiceListening": "सुन रहा है...",
    "details.voiceUnsupported": "इस ब्राउज़र में आवाज़ इनपुट उपलब्ध नहीं है",
    "details.voiceError": "आवाज़ इनपुट में त्रुटि। कृपया पुनः प्रयास करें।",
    "details.voiceErrorPermission":
        "माइक की अनुमति नहीं मिली। कृपया ब्राउज़र में अनुमति दें।",
    "details.voiceErrorNetwork": "आवाज़ पहचानने के लिए इंटरनेट कनेक्शन आवश्यक है।",
    "details.voiceErrorNoMic": "आपके डिवाइस पर कोई माइक्रोफ़ोन नहीं मिला।",
    "details.voiceErrorService": "आवाज़ सेवा उपलब्ध नहीं है। कृपया बाद में प्रयास करें।",
    "details.minChars": "न्यूनतम 10 अक्षर आवश्यक हैं",
    "details.selectedCategory": "श्रेणी",

    // Screen 3: Confirmation
    "confirmation.title": "समस्या दर्ज हो गई",
    "confirmation.subtitle":
        "आपकी रिपोर्ट सहेज ली गई है। स्थिति जानने के लिए संदर्भ आईडी का उपयोग करें।",
    "confirmation.referenceId": "संदर्भ आईडी",
    "confirmation.copied": "कॉपी हो गया!",
    "confirmation.copy": "कॉपी",
    "confirmation.summary": "सारांश",
    "confirmation.category": "श्रेणी",
    "confirmation.description": "विवरण",
    "confirmation.photo": "फोटो संलग्न",
    "confirmation.submittedAt": "जमा किया गया",
    "confirmation.status": "स्थिति",
    "confirmation.statusSubmitted": "जमा हो गया",
    "confirmation.statusOffline": "स्थानीय रूप से सहेजा गया",
    "confirmation.reportAnother": "एक और समस्या दर्ज करें",

    // Tracker
    "tracker.title": "मेरी रिपोर्ट",
    "tracker.empty": "अभी तक कोई रिपोर्ट नहीं",
    "tracker.statusSubmitted": "जमा",
    "tracker.statusUnderReview": "समीक्षाधीन",
    "tracker.statusInProgress": "प्रगति पर",
    "tracker.statusResolved": "समाधान हो गया",

    // Offline
    "offline.banner":
        "आप ऑफ़लाइन हैं। रिपोर्ट स्थानीय रूप से सहेजी जाएंगी और दोबारा जुड़ने पर सिंक होंगी।",
    "offline.synced": "सभी रिपोर्ट सिंक हो गईं",
    "offline.backOnline": "वापस ऑनलाइन",

    // Errors
    "error.submissionFailed": "रिपोर्ट सहेजने में विफल। कृपया पुनः प्रयास करें।",
    "error.generic": "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",

    // Accessibility
    "a11y.stepProgress": "चरण {current} / {total}",
    "a11y.categorySelected": "{category} चयनित",
    "a11y.photoPreview": "संलग्न फोटो का पूर्वावलोकन",
    "a11y.voiceInputActive": "आवाज़ इनपुट चालू है, अब बोलें",
    "a11y.languageToggle": "भाषा बदलें",
} as const;

export default translations;
