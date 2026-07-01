import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translatePage, startPageTranslationObserver, stopPageTranslationObserver } from '../utils/pageTranslator';



const TranslationContext = createContext(null);

const SESSION_STORAGE_KEY = 'kb_translation_session';
const SESSION_LANG_KEY = 'kb_session_lang';

export const TranslationProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const [isTranslating, setIsTranslating] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');
    const [showMask, setShowMask] = useState(false);

    // Initialize session on mount
    useEffect(() => {
        startPageTranslationObserver();

        // Check if there's a saved session
        const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
        const savedLang = sessionStorage.getItem(SESSION_LANG_KEY);

        if (sessionData && savedLang && savedLang !== 'en') {
            // Restore language from session
            i18n.changeLanguage(savedLang);
            // Force react-i18next resource refresh immediately to avoid mixed language states
            i18n.reloadResources?.();
            setCurrentLang(savedLang);



            // Translate page after a short delay to let React render
            const timer = setTimeout(async () => {
                setIsTranslating(true);
                setShowMask(true);
                try {
                    // Translate whole DOM immediately (best coverage)
                    await translatePage(savedLang);
                } finally {
                    setIsTranslating(false);
                    setShowMask(false);
                }
            }, 300);

            return () => {
                clearTimeout(timer);
                stopPageTranslationObserver();
            };
        }

        return () => stopPageTranslationObserver();
    }, [i18n]);

    const changeLanguage = useCallback(async (langCode) => {
        if (langCode === currentLang && langCode === 'en') return;

        setIsTranslating(true);
        setShowMask(true);
        setCurrentLang(langCode);

        try {
            await i18n.changeLanguage(langCode);

            // Save to sessionStorage (persists until tab close)
            sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
            sessionStorage.setItem(SESSION_LANG_KEY, langCode);

            // Translate whole DOM immediately for best coverage
            // Avoid translating progressively; translate once and then stop DOM observer side-effects
            await translatePage(langCode);
            stopPageTranslationObserver();
            startPageTranslationObserver();


        } finally {
            setIsTranslating(false);
            setShowMask(false);
        }
    }, [currentLang, i18n]);

    const resetToEnglish = useCallback(async () => {
        if (currentLang === 'en') return;

        setIsTranslating(true);
        setShowMask(true);
        setCurrentLang('en');

        try {
            await i18n.changeLanguage('en');
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
            sessionStorage.removeItem(SESSION_LANG_KEY);
            // Instant switch back to English: rely on react-i18next only
        } finally {
            setIsTranslating(false);
            setShowMask(false);
        }
    }, [currentLang, i18n]);

    const value = {
        isTranslating,
        currentLang,
        showMask,
        changeLanguage,
        resetToEnglish,
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslationContext = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslationContext must be used within a TranslationProvider');
    }
    return context;
};