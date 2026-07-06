const translations = {
    // App
    "app.title": "Civic Reporter",
    "app.description": "Report civic issues in your neighbourhood",

    // Navigation
    "nav.back": "Back",
    "nav.next": "Next",
    "nav.submit": "Submit Report",
    "nav.reportAnother": "Report Another Issue",
    "nav.viewReports": "View My Reports",

    // Language toggle
    "lang.switch": "Switch to Hindi",
    "lang.label": "EN",

    // Step indicator
    "step.category": "Category",
    "step.details": "Details",
    "step.confirmation": "Done",

    // Screen 1: Category
    "category.title": "What is the issue about?",
    "category.subtitle": "Select the category that best describes your issue",
    "category.roads": "Roads & Footpaths",
    "category.water": "Water Supply",
    "category.electricity": "Electricity",
    "category.sanitation": "Sanitation & Waste",
    "category.safety": "Public Safety",
    "category.other": "Other",

    // Screen 2: Details
    "details.title": "Describe the issue",
    "details.subtitle": "Provide details to help resolve this faster",
    "details.descriptionLabel": "Description",
    "details.descriptionPlaceholder":
        "What happened? Where exactly? Any other details...",
    "details.photoLabel": "Add a Photo",
    "details.photoHint": "Optional. Helps responders understand the issue.",
    "details.removePhoto": "Remove photo",
    "details.voiceLabel": "Voice Input",
    "details.voiceStart": "Tap to speak",
    "details.voiceStop": "Tap to stop",
    "details.voiceListening": "Listening...",
    "details.voiceUnsupported": "Voice input is not supported in this browser",
    "details.voiceError": "Voice input error. Please try again.",
    "details.minChars": "Minimum 10 characters required",
    "details.selectedCategory": "Category",

    // Screen 3: Confirmation
    "confirmation.title": "Issue Reported",
    "confirmation.subtitle":
        "Your report has been saved. Use the reference ID to track its status.",
    "confirmation.referenceId": "Reference ID",
    "confirmation.copied": "Copied!",
    "confirmation.copy": "Copy",
    "confirmation.summary": "Summary",
    "confirmation.category": "Category",
    "confirmation.description": "Description",
    "confirmation.photo": "Photo attached",
    "confirmation.submittedAt": "Submitted at",
    "confirmation.status": "Status",
    "confirmation.statusSubmitted": "Submitted",
    "confirmation.statusOffline": "Saved locally",

    // Tracker
    "tracker.title": "My Reports",
    "tracker.empty": "No reports yet",
    "tracker.statusSubmitted": "Submitted",
    "tracker.statusUnderReview": "Under Review",
    "tracker.statusInProgress": "In Progress",
    "tracker.statusResolved": "Resolved",

    // Offline
    "offline.banner":
        "You are offline. Reports will be saved locally and synced when you reconnect.",
    "offline.synced": "All reports synced",

    // Errors
    "error.submissionFailed": "Failed to save report. Please try again.",
    "error.generic": "Something went wrong. Please try again.",

    // Accessibility
    "a11y.stepProgress": "Step {current} of {total}",
    "a11y.categorySelected": "{category} selected",
    "a11y.photoPreview": "Preview of attached photo",
    "a11y.voiceInputActive": "Voice input is active, speak now",
    "a11y.languageToggle": "Switch language",
} as const;

export type TranslationKeys = keyof typeof translations;
export type Translations = Record<TranslationKeys, string>;
export default translations as Translations;
