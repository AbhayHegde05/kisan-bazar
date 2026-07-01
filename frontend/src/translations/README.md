# Translation Files for Kisan Bazar

This directory contains translated strings for all supported languages. All files use the same structure:

```json
{
  "en": {
    "translation": {
      "key1": "value in English",
      "key2": "another value"
    }
  },
  "hi": {
    "translation": {
      "key1": "अंग्रेजी में मान",
      "key2": "एक और मान"
    }
  }
}
```

## Structure

### Directory Organization

- `common.json` - Common translations used across the application
- `navbar.json` - Navigation-related translations
- `home.json` - Homepage-specific translations
- `auth.json` - Authentication-related translations
- `product.json` - Product-related translations
- `order.json` - Order-related translations
- `bot.json` - Bot/KisanBot specific translations
- `layout.json` - Layout and structure translations

### Language Codes

| Code | Language |
|------|----------|
| en   | English |
| hi   | Hindi |
| kn   | Kannada |
| ta   | Tamil |
| te   | Telugu |
| fr   | French |
| de   | German |
| es   | Spanish |
| pt   | Portuguese |
| ru   | Russian |
| ar   | Arabic |
| zh   | Chinese |
| ja   | Japanese |
| ko   | Korean |

## Usage

### Frontend (React)

```javascript
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });
```

### Key Translations for Regional Languages

The following translations are preconfigured for early regional language support:

- **Hindi**: For farmers and consumers in Hindi-speaking regions (North India)
- **Kannada**: For farmers in Karnataka (South India)
- **Tamil**: For farmers in Tamil Nadu (South India)
- **Telugu**: For farmers in Andhra Pradesh/Telangana (South India)

### Backend Integration

The backend supports:

1. **Language Detection**: Automatic detection of user language via `Accept-Language` header or path prefix
2. **Context-Aware Responses**: AI responses in preferred language
3. **Regional Bots**: Different bot personalities for different regions

## Adding New Translations

1. Copy `en/common.json` to your language file
2. Translate all keys
3. Verify translations are working in the app
4. Submit for review

## Language Switching

Users can switch languages via:

1. Language selector in the navbar
2. Browser language detection
3. Force language via URL path (`/en/`, `/hi/`, `/kn/`, etc.)
