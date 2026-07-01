import { useState } from 'react';
import Tesseract from 'tesseract.js';
import { toast } from 'react-toastify';

const IdVerification = () => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [resultText, setResultText] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setVerified(false);
            setResultText('');
        }
    };

    const verifyIdentity = async () => {
        if (!image) {
            toast.error("Please upload an ID card image first.");
            return;
        }

        setLoading(true);
        try {
            const { data: { text } } = await Tesseract.recognize(
                image,
                'eng+hin', // English and Hindi support
                { logger: m => console.log(m) }
            );

            setResultText(text);

            const keywords = ["Govt", "India", "Kisan", "Identity", "Sarkar", "Government", "Election", "Aadhaar", "PAN"];
            const isVerified = keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));

            if (isVerified) {
                setVerified(true);
                toast.success("ID Verified Successfully! ✅");
            } else {
                setVerified(false);
                toast.warning("Verification Failed. Could not find valid keywords. ❌");
            }

        } catch (error) {
            console.error("OCR Error:", error);
            toast.error("Failed to verify ID. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto mt-4">
            <h2 className="text-xl font-bold mb-4">AI-Driven ID Verification</h2>

            <div className="mb-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-50 file:text-green-700
                        hover:file:bg-green-100"
                />
            </div>

            {image && (
                <div className="mb-4">
                    <img src={image} alt="Uploaded ID" className="w-full h-48 object-cover rounded-md border" />
                </div>
            )}

            <button
                onClick={verifyIdentity}
                disabled={loading || !image}
                className={`w-full py-2 px-4 rounded-md text-white font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
            >
                {loading ? 'Verifying...' : 'Verify Identity'}
            </button>

            {verified && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
                    ID Verified: Govt/Kisan Identity Found ✅
                </div>
            )}

            {!verified && resultText && !loading && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md text-center">
                    Verification Failed. Upload a valid Kisan/Govt ID.
                </div>
            )}
        </div>
    );
};

export default IdVerification;
