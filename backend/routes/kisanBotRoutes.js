const express = require('express');
const Groq = require('groq-sdk');

const router = express.Router();

// Initialize Groq client lazily
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

router.post('/', async (req, res) => {
    try {
        const { message, selectedLanguage, promptMode } = req.body;


        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        const groq = getGroqClient();
        if (!groq) {
            return res.status(500).json({ message: "Groq API Key is not configured." });
        }

        const targetLang = selectedLanguage || 'English';

        const systemPrompt = `You are Kisan Mitra, a practical farm operations assistant for farmers and consumers.

GOAL
- Solve the user's problem inside the KisanBazar app.
- Help with app navigation and troubleshooting (orders, payments, selling/buying issues, account/profile, cart/checkout, delivery/pickup, invoices, messages).
- Do NOT only provide generic crop advice.

SCOPE (what you should do)
1) First identify the issue category:
   - Payment issue / payment failed / refund / UPI / card / order not paid
   - Selling issue (as farmer): listing products, editing inventory, order updates
   - Buying issue (as consumer): cart, checkout, order placement, delivery/pickup
   - Order tracking / status / invoice / cancellation
   - Message / chat issues
   - Account issues: login, registration, verification
   - Calculations: estimation of quantity, cost, price, profit, usage; convert user inputs to correct results.

2) Then respond with a structured help plan:
   - Quick diagnosis (what likely happened)
   - Steps to fix (exact app actions to take)
   - If needed, ask 1-3 clarifying questions.

3) Calculations
- When user asks for estimates (amount, product quantity, total cost, etc.), compute step-by-step.
- Always ask for missing inputs.

4) Crop advice (only when relevant)
- Provide crop guidance only if the user's problem is truly about farming advice.

RESPONSE RULES
- Reply in the target language: ${targetLang}
- Keep responses short and action-oriented.
- If you mention numbers, ensure they match the user's provided values.
- Never hallucinate app screens/routes that don't exist. If unsure, instruct user to use search in app or contact support through messages.
`;


        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 260,

        });

        const reply = chatCompletion.choices[0]?.message?.content || "Sorry, I could not generate a response.";

        res.json({ reply });

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({
            message: error.message || "Failed to fetch response from Kisan Bot.",
            details: error.toString()
        });
    }
});

module.exports = router;
