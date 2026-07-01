const express = require('express');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = new Groq({ apiKey: GROQ_API_KEY });

router.post('/', async (req, res) => {
    try {
        const { message, selectedLanguage } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_KEY_HERE') {
            return res.status(500).json({ message: "Groq API Key is not configured." });
        }

        const systemPrompt = `You are 'Kisan Mitra', an expert farming assistant for Indian farmers. The user has selected ${selectedLanguage || 'English'} as their language. Answer their question helpfully and strictly in ${selectedLanguage || 'English'} only. Keep the response concise and easy to understand for a farmer. Focus on practical farming advice relevant to India.`;

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
            temperature: 0.7,
            max_tokens: 512,
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
