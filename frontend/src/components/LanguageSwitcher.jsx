import { useState } from 'react';

import { FaLanguage } from 'react-icons/fa';
import { useTranslationContext } from '../context/TranslationContext';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
];

const LanguageSwitcher = () => {

  const { isTranslating, currentLang, changeLanguage } = useTranslationContext();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = LANGUAGES.find(l => l.code === currentLang) ?? LANGUAGES[0];

  /* ── Change language ─────────────────────────────────────────────────── */
  const handleChangeLanguage = async (code) => {
    setIsOpen(false);
    await changeLanguage(code);
  };

  return (
    <div className="relative" translate="no" data-no-translate>
      {/* Trigger button */}
      <button
        onClick={() => !isTranslating && setIsOpen(o => !o)}
        aria-label="Change language"
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors disabled:opacity-60"
        disabled={isTranslating}
      >
        {isTranslating ? (
          <span className="text-xs text-green-700 animate-pulse font-medium">Translating…</span>
        ) : (
          <>
            <FaLanguage className="text-green-600" />
            <span className="text-sm font-medium text-green-800">
              {currentLanguage.flag} {currentLanguage.name}
            </span>
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-green-200 z-50">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-green-50 transition-colors
                flex items-center space-x-2
                ${currentLang === lang.code
                  ? 'bg-green-50 text-green-800 font-semibold'
                  : 'text-gray-700'}`}
              disabled={isTranslating}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {currentLang === lang.code && (
                <span className="ml-auto text-green-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;