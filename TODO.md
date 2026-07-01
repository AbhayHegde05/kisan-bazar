# TODO - kisan-bazar fixes

## 1) Instant translations (remove DOM “line-by-line” behavior)
- [x] Update `frontend/src/context/TranslationContext.jsx` to stop calling `translatePage()` on language change (instant i18next update)
- [ ] Disable DOM text translator usage for core UI (keep only as fallback if needed)


## 2) Coverage: About + Footer should translate via i18next keys (not raw English)
- [ ] Update `frontend/src/pages/AboutPage.jsx` to use `t()` for all visible English strings
- [ ] Update `frontend/src/components/Footer.jsx` to use `t()` for all visible English strings
- [ ] Add missing translation keys to `frontend/public/locales/{en,hi,kn,ta,te}/translation.json`

## 3) Message voice (volume icon)
- [ ] Locate component that renders message volume icon
- [ ] Wire Web Speech API speech synthesis to play message content in selected language

## 4) Google OAuth login
- [ ] Add “Continue with Google” button + handler in `frontend/src/pages/LoginPage.jsx`
- [ ] Add a new Redux thunk in `frontend/src/redux/slices/authSlice.js` to call `/auth/google-login`
- [ ] Verify backend route `/api/auth/google-login` usage

## 5) Smoke tests
- [ ] Verify language switching updates instantly on navigation without delays
- [ ] Verify About page translates fully for non-English
- [ ] Verify message voice plays aloud
- [ ] Verify Google OAuth login works end-to-end

