import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "km", flag: "./flags/cam-flag.webp", alt: "Khmer" },
  { code: "en", flag: "./flags/uk-flag.jpg", alt: "English" },
  { code: "ch", flag: "./flags/china-flag.png", alt: "China" }
] as const;

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitch = (lang: string) => {
    if (i18n.language === lang) return;

    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);

    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());
    setIsOpen(false); 
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8f7c15]"
        aria-label="Language switcher"
      >
        <img
          src={LANGUAGES.find((lang) => lang.code === i18n.language)?.flag}
          alt={i18n.language}
          className="w-6"
          width={24}
          height={16}
        />
        <span className="text-sm text-gray-400">{i18n.language}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 py-2 bg-white/20 shadow-lg rounded-md z-10">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSwitch(lang.code)}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm focus:outline-none hover:bg-gray-100/10 ${
                i18n.language === lang.code ? "font-bold" : ""
              }`}
              aria-label={`Switch to ${lang.alt}`}
            >
              <img
                src={lang.flag}
                alt={lang.alt}
                className="w-6"
                width={24}
                height={16}
              />
              <span className="text-gray-400">{lang.alt}</span>
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default LanguageSwitcher;
