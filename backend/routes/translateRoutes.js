const express = require('express');
const Groq = require('groq-sdk');

const router = express.Router();

let groqClient = null;
const getGroqClient = () => {
    if (groqClient) return groqClient;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('GROQ_API_KEY is not configured in environment variables');
    }

    groqClient = new Groq({ apiKey });
    return groqClient;
};

const LANG_NAMES = { hi: 'Hindi', kn: 'Kannada', ta: 'Tamil', te: 'Telugu' };

router.post('/', async (req, res) => {
    const { texts, targetLanguage } = req.body;

    // Validate input
    if (!Array.isArray(texts) || texts.length === 0) {
        return res.status(400).json({ message: 'texts must be a non-empty array' });
    }

    // Pass-through for English
    if (!targetLanguage || targetLanguage === 'en') {
        return res.json({ translations: texts });
    }

    try {
        const groq = getGroqClient();
        if (!groq) {
            return res.status(500).json({ message: 'Translation service not configured' });
        }

        const langName = LANG_NAMES[targetLanguage] || targetLanguage;

        // Only translate non-trivial strings (skip pure numbers/symbols)
        const indexed = texts
            .map((t, i) => ({ i, t: String(t).trim() }))
            .filter(({ t }) => t.length >= 2 && !/^[\d\s.,₹$%+\-*/:()]+$/.test(t));

        if (indexed.length === 0) {
            return res.json({ translations: texts });
        }

        const textsToTranslate = indexed.map(({ t }) => t);

        const prompt = `You are a professional translator. Translate the following JSON array of English UI text strings to ${langName}.

STRICT RULES:
- Output ONLY a JSON array with exactly ${textsToTranslate.length} translated strings in the same order
- Keep these unchanged: brand names (KisanBazar, Kisan Mitra), prices (₹100), emails, URLs, numbers
- Translate naturally for a farming/agricultural audience
- No markdown, no explanations – output the JSON array only

${JSON.stringify(textsToTranslate)}`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
            max_tokens: 2048,
        });

        let content = (completion.choices[0]?.message?.content || '[]').trim();
        // Strip markdown code fences if the model wraps output
        content = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();

        let translated;
        try {
            const parsed = JSON.parse(content);
            // Handle if model wrapped result in an object
            if (Array.isArray(parsed)) {
                translated = parsed;
            } else if (Array.isArray(parsed.translations)) {
                translated = parsed.translations;
            } else if (Array.isArray(parsed.result)) {
                translated = parsed.result;
            } else {
                translated = textsToTranslate; // fallback
            }
        } catch {
            translated = textsToTranslate; // parse failure fallback
        }

        // Rebuild the full result array preserving non-translated entries
        const result = [...texts];
        indexed.forEach(({ i }, j) => {
            result[i] = translated[j] || texts[i];
        });

        res.json({ translations: result });
    } catch (error) {
        console.error('Translate route error:', error.message);
        // Fallback: return originals so the page doesn't break
        res.json({ translations: texts });
    }
});

module.exports = router;
