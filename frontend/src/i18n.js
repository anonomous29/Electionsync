import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      heroTitlePrefix: "Vote with ",
      heroTitleHighlight: "Confidence.",
      heroSubtitle: "From registration to the polling booth, VoteWise ensures you are prepared, informed, and ready to make an impact.",
      startJourney: "Start Your Journey",
      findBooth: "Find My Booth"
    }
  },
  mr: {
    translation: {
      heroTitlePrefix: "आत्मविश्वासाने ",
      heroTitleHighlight: "मतदान करा.",
      heroSubtitle: "नोंदणीपासून ते मतदान केंद्रापर्यंत, व्होटवाइज तुम्हाला तयार आणि माहितीपूर्ण बनवते.",
      startJourney: "तुमचा प्रवास सुरू करा",
      findBooth: "माझे केंद्र शोधा"
    }
  },
  hi: {
    translation: {
      heroTitlePrefix: "आत्मविश्वास के साथ ",
      heroTitleHighlight: "वोट दें.",
      heroSubtitle: "पंजीकरण से लेकर मतदान केंद्र तक, वोटवाइज़ आपको तैयार और जागरूक रखता है।",
      startJourney: "अपनी यात्रा शुरू करें",
      findBooth: "मेरा बूथ खोजें"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
