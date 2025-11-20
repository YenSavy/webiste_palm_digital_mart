import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import enHeader from "./locales/en/header.json";
import enService from "./locales/en/service.json"

import kmCommon from "./locales/km/common.json";
import kmHeader from "./locales/km/header.json";
import kmService from "./locales/km/service.json"


import chCommon from "./locales/ch/common.json";
import chHeader from "./locales/ch/header.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, header: enHeader, service: enService },
      km: { common: kmCommon, header: kmHeader, service: kmService },
      ch: { common: chCommon, header: chHeader },

    },
    fallbackLng: "en",
    ns: ["common", "header", "service"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
