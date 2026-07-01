/**
 * pageTranslator.js
 *
 * Custom DOM-based translator that uses the KisanBazar backend /api/translate
 * endpoint (powered by Groq LLM) to translate every visible text node on the
 * page. Key properties:
 *
 *  - No Google Translate bar – zero UI intrusion
 *  - <title> is automatically skipped (lives in <head>, we only walk <body>)
 *  - Translations are cached in localStorage; navigating back is instant
 *  - A MutationObserver re-translates new DOM nodes injected by React (route
 *    changes, lazy-loaded components, API-driven content, etc.)
 *  - Batched in groups of 60 to keep Groq payloads manageable
 *  - On error, original text is always restored so the page never breaks
 */

const API_URL = import.meta.env.VITE_API_URL;
const CACHE_PREFIX = 'kb_tr_v1_'; // bump suffix to invalidate all cached translations
const BATCH_SIZE = 60;            // strings per Groq call

// Tags whose text content must never be translated
const SKIP_TAGS = new Set([
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'TITLE', 'SVG', 'PATH',
    'TEXTAREA', 'CODE', 'PRE', 'INPUT', 'OPTION',
]);

/* ─── State ─────────────────────────────────────────────────────────────── */
let currentLang = 'en';
let domObserver = null;
let debounceTimer = null;
const pendingNodes = new Set();

/* ─── Cache helpers ──────────────────────────────────────────────────────── */
const simpleHash = (str) => {
    let h = 0;
    const len = Math.min(str.length, 200);
    for (let i = 0; i < len; i++) {
        h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return (h >>> 0).toString(36);
};

const cacheGet = (text, lang) => {
    try { return localStorage.getItem(`${CACHE_PREFIX}${lang}_${simpleHash(text)}`); }
    catch { return null; }
};

const cachePut = (text, lang, translation) => {
    try { localStorage.setItem(`${CACHE_PREFIX}${lang}_${simpleHash(text)}`, translation); }
    catch { /* storage full – silently skip */ }
};

/* ─── Node helpers ───────────────────────────────────────────────────────── */
// WeakMap: textNode → original English text (set once, first time we translate a node)
const originals = new WeakMap();

const isTranslatable = (node) => {
    if (node.nodeType !== Node.TEXT_NODE) return false;
    const text = node.textContent.trim();
    if (text.length < 2) return false;
    // Skip pure-numeric / symbol strings (prices etc. are kept unchanged by the LLM anyway,
    // but no need to send them at all)
    if (/^[\d\s.,₹$%+\-*/:()@]+$/.test(text)) return false;

    let el = node.parentElement;
    while (el && el !== document.documentElement) {
        if (SKIP_TAGS.has(el.tagName)) return false;
        if (el.getAttribute('translate') === 'no') return false;
        if (el.hasAttribute('data-no-translate')) return false;
        el = el.parentElement;
    }
    return true;
};

const collectNodes = (root) => {
    const nodes = [];
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        { acceptNode: n => isTranslatable(n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP },
    );
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
};

/* ─── API call ───────────────────────────────────────────────────────────── */
const callAPI = async (texts, lang) => {
    const resp = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts, targetLanguage: lang }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data.translations;
};

/* ─── Core translate function ────────────────────────────────────────────── */
const translateNodes = async (nodes, lang) => {
    if (!nodes.length) return;

    if (lang === 'en') {
        // Restore English originals
        nodes.forEach(node => {
            const orig = originals.get(node);
            if (orig !== undefined) {
                node.textContent = orig;
            }
            // If we don't have an original stored, we can't restore it
            // This will happen for nodes first encountered while language was English
            // In that case, the node is already in English (its original state), so we leave it as is
        });
        return;
    }

    // For non-English languages, we need to store originals before translating
    // Deduplicate: multiple nodes can share the same text
    const textToNodes = new Map();
    nodes.forEach(node => {
        // Store original text if we haven't seen this node before
        if (!originals.has(node)) {
            originals.set(node, node.textContent);
        }
        
        const text = node.textContent.trim();
        if (!textToNodes.has(text)) textToNodes.set(text, []);
        textToNodes.get(text).push(node);
    });

    const uniqueTexts = [...textToNodes.keys()];
    const uncached = [];

    // Apply cached translations immediately (zero network wait)
    for (const text of uniqueTexts) {
        const cached = cacheGet(text, lang);
        if (cached) {
            textToNodes.get(text).forEach(node => {
                if (!originals.has(node)) originals.set(node, node.textContent);
                node.textContent = cached;
            });
        } else {
            uncached.push(text);
        }
    }

    // Fetch uncached texts in batches
    for (let i = 0; i < uncached.length; i += BATCH_SIZE) {
        const batch = uncached.slice(i, i + BATCH_SIZE);
        try {
            const translations = await callAPI(batch, lang);
            batch.forEach((text, j) => {
                const translation = translations[j];
                if (!translation) return;
                cachePut(text, lang, translation);
                (textToNodes.get(text) || []).forEach(node => {
                    if (!originals.has(node)) originals.set(node, node.textContent);
                    node.textContent = translation;
                });
            });
        } catch (err) {
            console.warn('[pageTranslator] batch failed, keeping originals for this batch', err);
        }
    }
};

/* ─── Public API ─────────────────────────────────────────────────────────── */

/**
 * Translate (or restore) the whole page.
 * Call this when the user picks a language from the switcher.
 */
export const translatePage = async (lang) => {
    currentLang = lang;
    const nodes = collectNodes(document.body);
    await translateNodes(nodes, lang);
};

/**
 * Start watching for new DOM nodes (React route changes, lazy loads, etc.)
 * and translate them automatically.  Call this once on app mount.
 */
export const startPageTranslationObserver = () => {
    if (domObserver) domObserver.disconnect();

    domObserver = new MutationObserver((mutations) => {
        if (currentLang === 'en') return;

        for (const mut of mutations) {
            for (const added of mut.addedNodes) {
                if (added.nodeType === Node.TEXT_NODE) {
                    if (isTranslatable(added)) pendingNodes.add(added);
                } else if (added.nodeType === Node.ELEMENT_NODE) {
                    collectNodes(added).forEach(n => pendingNodes.add(n));
                }
            }
        }

        if (pendingNodes.size > 0) {
            clearTimeout(debounceTimer);
            // Short delay so React finishes flushing the render before we walk the tree
            debounceTimer = setTimeout(async () => {
                const toTranslate = [...pendingNodes];
                pendingNodes.clear();
                await translateNodes(toTranslate, currentLang);
            }, 350);
        }
    });

    domObserver.observe(document.body, { childList: true, subtree: true });
};

/**
 * Stop the observer (call on unmount / cleanup if needed).
 */
export const stopPageTranslationObserver = () => {
    clearTimeout(debounceTimer);
    if (domObserver) { domObserver.disconnect(); domObserver = null; }
};
