# TODO - KisanBazar fixes

## Translation (instant + complete)
- [ ] Convert `AboutPage.jsx` all hard-coded text to `t()` keys (add missing keys to `frontend/public/locales/*/translation.json`).
- [ ] Ensure all pages/components use `t()` (no raw text nodes left behind).
- [ ] Remove/disable DOM MutationObserver translation fallback if react-i18next covers everything (prevents mixed-language delays).
- [ ] Update `LanguageSwitcher` / `TranslationContext` to switch language instantly (no setTimeout delay, no per-node translation).

## Message voice
- [ ] Implement read-aloud on `frontend/src/components/MessageItem.jsx` volume icon using Web Speech API (speechSynthesis).

## Google OAuth
- [ ] Verify existing Google OAuth components (e.g. `GoogleAuthButton.jsx`, `GoogleRoleGate.jsx`).
- [ ] If missing, add backend OAuth route + controller, and frontend login flow.

## Quality checks
- [ ] Run `frontend` lint and build after each major translation change.

