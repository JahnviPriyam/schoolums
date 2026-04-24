import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "overview": "Overview",
        "students": "Students",
        "attendance": "Attendance",
        "exams": "Exams",
        "timetable": "Timetable",
        "settings": "Settings",
        "sign_out": "Sign Out"
      },
      "settings": {
        "title": "Settings",
        "subtitle": "Manage your profile, language, and security preferences",
        "profile_card": "Profile Information",
        "avatar": "Select Avatar",
        "language": "Platform Language",
        "language_desc": "Choose your preferred language for the interface.",
        "security_card": "Security & Password",
        "current_password": "Current Password",
        "new_password": "New Password",
        "update_password": "Update Password",
        "save_changes": "Save Changes"
      }
    }
  },
  hi: {
    translation: {
      "nav": {
        "overview": "अवलोकन",
        "students": "छात्र",
        "attendance": "उपस्थिति",
        "exams": "परीक्षाएँ",
        "timetable": "समय सारणी",
        "settings": "सेटिंग्स",
        "sign_out": "साइन आउट"
      },
      "settings": {
        "title": "सेटिंग्स",
        "subtitle": "अपनी प्रोफ़ाइल, भाषा और सुरक्षा प्राथमिकताएं प्रबंधित करें",
        "profile_card": "प्रोफ़ाइल जानकारी",
        "avatar": "अवतार चुनें",
        "language": "मंच की भाषा",
        "language_desc": "इंटरफ़ेस के लिए अपनी पसंदीदा भाषा चुनें।",
        "security_card": "सुरक्षा और पासवर्ड",
        "current_password": "वर्तमान पासवर्ड",
        "new_password": "नया पासवर्ड",
        "update_password": "पासवर्ड अपडेट करें",
        "save_changes": "परिवर्तन सहेजें"
      }
    }
  }
};

const validLanguages = ["en", "hi"];
const storedLanguage = localStorage.getItem("language");
const defaultLanguage = storedLanguage && validLanguages.includes(storedLanguage) ? storedLanguage : "en";

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
