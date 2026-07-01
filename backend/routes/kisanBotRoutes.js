const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.post('/', async (req, res) => {
    try {
        const { message, selectedLanguage } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_KEY_HERE') {
            return res.status(500).json({ message: "Gemini API Key is not configured." });
        }

        const systemPrompt = `You are 'Kisan Mitra', an expert farming assistant. The user has selected ${selectedLanguage || 'English'}. Answer their question helpfuly and strictly in ${selectedLanguage || 'English'} only. Keep the response concise and easy to understand for a farmer.`;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: `Namaste! I am Kisan Mitra. How can I help you today in ${selectedLanguage || 'English'}?` }],
                },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({
            message: error.message || "Failed to fetch response from Kisan Bot.",
            details: error.toString()
        });
    }
});

module.exports = router;
