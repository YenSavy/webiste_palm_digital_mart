import React from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "km", flag: "./flags/cam-flag.webp", alt: "Khmer" },
  { code: "en", flag: "./flags/uk-flag.jpg", alt: "English" },
  {code: "ch", flag: "./flags/china-flag.png", alt:"China"}
] as const;
 
const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleSwitch = (lang: string) => {
    if (i18n.language === lang) return;

    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);

    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <span className="flex gap-1" role="group" aria-label="Language switcher">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleSwitch(lang.code)}
          className={`focus:outline-none focus:ring-2 focus:ring-[#8f7c15] rounded ${
            i18n.language === lang.code ? "opacity-100" : "opacity-60"
          }`}
          aria-label={`Switch to ${lang.alt}`}
        >
          <img
            src={lang.flag}
            className="w-6 cursor-pointer hover:opacity-80 transition-opacity"
            alt={lang.alt}
            width={24}
            height={16}
          />
        </button>
      ))}
    </span>
  );
};

export default LanguageSwitcher;
