export type Language = "en" | "hi" | "ta";

export interface I18nStrings {
  // Header
  emblem: string;
  governmentOfIndia: string;
  ministryOfCorporateAffairs: string;
  language: string;
  textSize: string;
  contrast: string;
  
  // Navigation
  home: string;
  students: string;
  employers: string;
  government: string;
  help: string;
  login: string;
  
  // Hero
  heroTitle: string;
  heroSubtext: string;
  studentLogin: string;
  employerLogin: string;
  governmentDashboard: string;
  
  // Trust Strip
  secure: string;
  mobileFirst: string;
  multilingual: string;
  inclusive: string;
  
  // Highlights
  highlightsTitle: string;
  highlightsSubtitle: string;
  internshipDuration: string;
  internshipDurationDesc: string;
  topCompanies: string;
  topCompaniesDesc: string;
  guidedJourney: string;
  guidedJourneyDesc: string;
  
  // How It Works
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1: string;
  step1Desc: string;
  step2: string;
  step2Desc: string;
  step3: string;
  step3Desc: string;
  step4: string;
  step4Desc: string;
  
  // Eligibility
  eligibilityTitle: string;
  eligibilitySubtitle: string;
  
  // Important Links
  importantLinksTitle: string;
  guidelinesEn: string;
  guidelinesHi: string;
  faqs: string;
  helpdesk: string;
  
  // Footer
  footerTitle: string;
  about: string;
  guidelines: string;
  contact: string;
  helpdeskEmail: string;
  helpline: string;
  copyright: string;
  digitalIndia: string;
}

export const i18n: Record<Language, I18nStrings> = {
  en: {
    // Header
    emblem: "Emblem",
    governmentOfIndia: "Government of India",
    ministryOfCorporateAffairs: "Ministry of Corporate Affairs",
    language: "Language",
    textSize: "Text Size",
    contrast: "Contrast",
    
    // Navigation
    home: "Home",
    students: "Students",
    employers: "Employers",
    government: "Government",
    help: "Help",
    login: "Login",
    
    // Hero
    heroTitle: "Prime Minister's Internship Scheme (PMIS)",
    heroSubtext: "Empowering students with real-world experience through government and industry internships. A bridge between education and employment for India's future workforce.",
    studentLogin: "Student Login / Register",
    employerLogin: "Employer Login / Register",
    governmentDashboard: "Government Dashboard",
    
    // Trust Strip
    secure: "Secure",
    mobileFirst: "Mobile-first",
    multilingual: "Multilingual",
    inclusive: "Inclusive",
    
    // Highlights
    highlightsTitle: "Key Highlights",
    highlightsSubtitle: "Discover the benefits of PMIS",
    internshipDuration: "Bridge between education and employment",
    internshipDurationDesc: "Connect academic learning with practical industry experience through structured internship programs.",
    topCompanies: "Opportunities across government and industry",
    topCompaniesDesc: "Access internships in government departments, PSUs, and leading private sector organizations across India.",
    guidedJourney: "Inclusive access for students nationwide",
    guidedJourneyDesc: "Open to students from recognized universities and colleges across all disciplines and regions.",
    
    // How It Works
    howItWorksTitle: "How It Works",
    howItWorksSubtitle: "Simple steps to get started",
    step1: "Registration",
    step1Desc: "Create your account and verify your student credentials through the official portal.",
    step2: "Profile Creation",
    step2Desc: "Complete your profile with academic details, skills, and internship preferences.",
    step3: "Internship Search",
    step3Desc: "Browse available internships and receive personalized recommendations based on your profile.",
    step4: "Application Submission",
    step4Desc: "Apply to selected internships and track your application status through the dashboard.",
    
    // Eligibility
    eligibilityTitle: "Who Can Apply",
    eligibilitySubtitle: "Eligibility snapshot",
    
    // Important Links
    importantLinksTitle: "Important Links",
    guidelinesEn: "Guidelines (EN)",
    guidelinesHi: "Guidelines (HI)",
    faqs: "FAQs",
    helpdesk: "Helpdesk",
    
    // Footer
    footerTitle: "Prime Minister's Internship Scheme (PMIS) — Ministry of Corporate Affairs, Government of India",
    about: "About",
    guidelines: "Guidelines",
    contact: "Contact",
    helpdeskEmail: "pmi.helpdesk@mca.gov.in",
    helpline: "1800-XXX-XXXX",
    copyright: "© 2024 Government of India. All rights reserved.",
    digitalIndia: "Digital India",
  },
  hi: {
    // Header
    emblem: "Emblem",
    governmentOfIndia: "Government of India",
    ministryOfCorporateAffairs: "Ministry of Corporate Affairs",
    language: "Language",
    textSize: "Text Size",
    contrast: "Contrast",
    
    // Navigation
    home: "Home",
    students: "Students",
    employers: "Employers",
    government: "Government",
    help: "Help",
    login: "Login",
    
    // Hero
    heroTitle: "Prime Minister's Internship Scheme (PMIS)",
    heroSubtext: "Empowering students with real-world experience through government and industry internships. A bridge between education and employment for India's future workforce.",
    studentLogin: "Student Login / Register",
    employerLogin: "Employer Login / Register",
    governmentDashboard: "Government Dashboard",
    
    // Trust Strip
    secure: "Secure",
    mobileFirst: "Mobile-first",
    multilingual: "Multilingual",
    inclusive: "Inclusive",
    
    // Highlights
    highlightsTitle: "Key Highlights",
    highlightsSubtitle: "Discover the benefits of PMIS",
    internshipDuration: "Bridge between education and employment",
    internshipDurationDesc: "Connect academic learning with practical industry experience through structured internship programs.",
    topCompanies: "Opportunities across government and industry",
    topCompaniesDesc: "Access internships in government departments, PSUs, and leading private sector organizations across India.",
    guidedJourney: "Inclusive access for students nationwide",
    guidedJourneyDesc: "Open to students from recognized universities and colleges across all disciplines and regions.",
    
    // How It Works
    howItWorksTitle: "How It Works",
    howItWorksSubtitle: "Simple steps to get started",
    step1: "Registration",
    step1Desc: "Create your account and verify your student credentials through the official portal.",
    step2: "Profile Creation",
    step2Desc: "Complete your profile with academic details, skills, and internship preferences.",
    step3: "Internship Search",
    step3Desc: "Browse available internships and receive personalized recommendations based on your profile.",
    step4: "Application Submission",
    step4Desc: "Apply to selected internships and track your application status through the dashboard.",
    
    // Eligibility
    eligibilityTitle: "Who Can Apply",
    eligibilitySubtitle: "Eligibility snapshot",
    
    // Important Links
    importantLinksTitle: "Important Links",
    guidelinesEn: "Guidelines (EN)",
    guidelinesHi: "Guidelines (HI)",
    faqs: "FAQs",
    helpdesk: "Helpdesk",
    
    // Footer
    footerTitle: "Prime Minister's Internship Scheme (PMIS) — Ministry of Corporate Affairs, Government of India",
    about: "About",
    guidelines: "Guidelines",
    contact: "Contact",
    helpdeskEmail: "pmi.helpdesk@mca.gov.in",
    helpline: "1800-XXX-XXXX",
    copyright: "© 2024 Government of India. All rights reserved.",
    digitalIndia: "Digital India",
  },
  ta: {
    // Header
    emblem: "Emblem",
    governmentOfIndia: "Government of India",
    ministryOfCorporateAffairs: "Ministry of Corporate Affairs",
    language: "Language",
    textSize: "Text Size",
    contrast: "Contrast",
    
    // Navigation
    home: "Home",
    students: "Students",
    employers: "Employers",
    government: "Government",
    help: "Help",
    login: "Login",
    
    // Hero
    heroTitle: "Prime Minister's Internship Scheme (PMIS)",
    heroSubtext: "Empowering students with real-world experience through government and industry internships. A bridge between education and employment for India's future workforce.",
    studentLogin: "Student Login / Register",
    employerLogin: "Employer Login / Register",
    governmentDashboard: "Government Dashboard",
    
    // Trust Strip
    secure: "Secure",
    mobileFirst: "Mobile-first",
    multilingual: "Multilingual",
    inclusive: "Inclusive",
    
    // Highlights
    highlightsTitle: "Key Highlights",
    highlightsSubtitle: "Discover the benefits of PMIS",
    internshipDuration: "Bridge between education and employment",
    internshipDurationDesc: "Connect academic learning with practical industry experience through structured internship programs.",
    topCompanies: "Opportunities across government and industry",
    topCompaniesDesc: "Access internships in government departments, PSUs, and leading private sector organizations across India.",
    guidedJourney: "Inclusive access for students nationwide",
    guidedJourneyDesc: "Open to students from recognized universities and colleges across all disciplines and regions.",
    
    // How It Works
    howItWorksTitle: "How It Works",
    howItWorksSubtitle: "Simple steps to get started",
    step1: "Registration",
    step1Desc: "Create your account and verify your student credentials through the official portal.",
    step2: "Profile Creation",
    step2Desc: "Complete your profile with academic details, skills, and internship preferences.",
    step3: "Internship Search",
    step3Desc: "Browse available internships and receive personalized recommendations based on your profile.",
    step4: "Application Submission",
    step4Desc: "Apply to selected internships and track your application status through the dashboard.",
    
    // Eligibility
    eligibilityTitle: "Who Can Apply",
    eligibilitySubtitle: "Eligibility snapshot",
    
    // Important Links
    importantLinksTitle: "Important Links",
    guidelinesEn: "Guidelines (EN)",
    guidelinesHi: "Guidelines (HI)",
    faqs: "FAQs",
    helpdesk: "Helpdesk",
    
    // Footer
    footerTitle: "Prime Minister's Internship Scheme (PMIS) — Ministry of Corporate Affairs, Government of India",
    about: "About",
    guidelines: "Guidelines",
    contact: "Contact",
    helpdeskEmail: "pmi.helpdesk@mca.gov.in",
    helpline: "1800-XXX-XXXX",
    copyright: "© 2024 Government of India. All rights reserved.",
    digitalIndia: "Digital India",
  },
};
