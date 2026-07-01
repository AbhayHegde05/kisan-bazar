import { useTranslationContext } from '../context/TranslationContext';

const TranslationMask = () => {
    const { showMask, isTranslating, currentLang } = useTranslationContext();

    if (!showMask && !isTranslating) return null;

    const getLanguageName = (code) => {
        const languages = {
            en: 'English',
            hi: 'हिन्दी',
            kn: 'ಕನ್ನಡ',
            ta: 'தமிழ்',
            te: 'తెలుగు',
        };
        return languages[code] || code;
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm transition-opacity duration-300 ${showMask ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            role="status"
            aria-live="polite"
            aria-label={`Translating to ${getLanguageName(currentLang)}`}
        >
            <div className="text-center p-8">
                {/* Animated spinner with pulse rings */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    {/* Outer pulse rings */}
                    <div className="absolute inset-0 border-4 border-green-500/20 rounded-full animate-ping" />
                    <div className="absolute inset-0 border-4 border-green-500/10 rounded-full animate-ping" style={{ animationDelay: '700ms' }} />

                    {/* Main spinner */}
                    <div className="relative w-full h-full">
                        <svg className="w-full h-full text-green-500 animate-spin" viewBox="0 0 50 50">
                            <circle
                                cx="25"
                                cy="25"
                                r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray="90 150"
                                strokeDashoffset="0"
                                strokeLinecap="round"
                                className="animate-spin"
                            />
                        </svg>

                        {/* Center icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Translation message */}
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-800 animate-fade-in">
                        Translating to {getLanguageName(currentLang)}
                    </h3>
                    <p className="text-gray-500 animate-fade-in animate-delay-100">
                        Please wait while we translate the page content...
                    </p>

                    {/* Progress indicator */}
                    <div className="w-64 mx-auto mt-6 animate-fade-in animate-delay-200">
                        <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-progress"
                                style={{ animationDuration: '2s' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Language indicator pills */}
                <div className="mt-8 flex justify-center gap-2 animate-fade-in animate-delay-300">
                    {['en', 'hi', 'kn', 'ta', 'te'].map((lang) => (
                        <span
                            key={lang}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${lang === currentLang
                                    ? 'bg-green-500 text-white shadow-lg scale-110'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                        >
                            {getLanguageName(lang)}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TranslationMask;