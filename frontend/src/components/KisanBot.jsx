import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const KisanBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('English');
    const messagesEndRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL;

    const languages = [
        "English",
        "Hindi",
        "Kannada",
        "Tamil",
        "Telugu"
    ];

    const speak = (text, lang) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);

            // Map languages to BCP 47 tags roughly
            const langMap = {
                "English": "en-IN",
                "Hindi": "hi-IN",
                "Kannada": "kn-IN",
                "Tamil": "ta-IN",
                "Telugu": "te-IN"
            };

            utterance.lang = langMap[lang] || 'en-US';
            window.speechSynthesis.cancel(); // Stop previous speech
            window.speechSynthesis.speak(utterance);
        } else {
            toast.warning("Text-to-Speech not supported in this browser.");
        }
    };

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await axios.post(`${API_URL}/kisan-bot`, {
                message: input,
                selectedLanguage: language
            });

            const botMessage = { text: data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            const msg = error.response?.data?.message || "Sorry, I am facing some issues. Please try again later.";
            const errorMessage = { text: msg, sender: 'bot', error: true };
            setMessages(prev => [...prev, errorMessage]);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-300"
                >
                    <span className="text-2xl mr-2">🤖</span>
                    <span className="font-bold hidden md:inline">Kisan Mitra</span>
                </button>
            )}

            {isOpen && (
                <div className="bg-white rounded-xl shadow-2xl w-80 md:w-96 flex flex-col h-[500px] border border-gray-200">
                    {/* Header */}
                    <div className="bg-green-600 text-white p-4 rounded-t-xl flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-2xl mr-2">🤖</span>
                            <div>
                                <h3 className="font-bold">Kisan Mitra</h3>
                                <p className="text-xs text-green-100">Your AI Farming Assistant</p>
                            </div>
                        </div>
                        <button onClick={toggleChat} className="text-white hover:text-gray-200">
                            ✕
                        </button>
                    </div>

                    {/* Language Selector */}
                    <div className="bg-gray-50 p-2 border-b">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full text-sm p-1 rounded border-gray-300 focus:ring-green-500 focus:border-green-500"
                        >
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 mt-10">
                                <p>👋 Namaste!</p>
                                <p className="text-sm">Ask me anything about farming in {language}.</p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user'
                                    ? 'bg-green-600 text-white rounded-tr-none'
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                    {msg.sender === 'bot' && (
                                        <button
                                            onClick={() => speak(msg.text, language)}
                                            className="ml-2 text-gray-400 hover:text-gray-600 mt-1 block"
                                            title="Listen"
                                        >
                                            🔊
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-200 text-gray-500 p-3 rounded-lg rounded-tl-none text-xs italic">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t bg-white rounded-b-xl flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            disabled={loading}
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-500"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className={`p-2 rounded-full text-white ${loading || !input.trim() ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default KisanBot;
