import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * After Google login, backend returns user.role.
 * If role is already set, we navigate immediately.
 * If role is consumer/farmer missing or we need farmer verification, we show gate.
 */
export default function GoogleRoleGate({ googleTokenId }) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('loading');
  const [role, setRole] = useState('consumer');

  const [verificationDetails, setVerificationDetails] = useState({
    documentType: 'RTC',
    documentNumber: '',
    documentImage: '',
  });

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        // backend should figure if user is new; if new, it will return needsRole=true
        const { data } = await axios.post(`${API_URL}/auth/google-login`, {
          tokenId: googleTokenId,
          // role/verification is handled after gate, but backend can also accept it.
        });

        if (!mounted) return;

        // If user already has role assigned, go to dashboard
        if (data?.user?.role) {
          const targetRole = data.user.role;
          if (targetRole === 'admin') navigate('/admin/dashboard');
          else if (targetRole === 'farmer') navigate('/farmer/dashboard');
          else navigate('/');
          return;
        }

        // Otherwise, show role selection
        setRole('consumer');
        setStep('choose-role');
      } catch (e) {
        console.error(e);
        toast.error(e?.response?.data?.message || 'Google login failed');
        navigate('/login');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [googleTokenId, navigate]);

  const title = useMemo(() => {
    if (step === 'choose-role') return 'Select your account type';
    if (step === 'verify-farmer') return 'Farmer verification';
    return 'Loading...';
  }, [step]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 glass p-10 rounded-xl">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">{title}</h2>
        </div>

        {step === 'choose-role' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">I am a:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-sm p-2 rounded border-gray-300 focus:ring-green-500 focus:border-green-500"
            >
              <option value="consumer">Consumer</option>
              <option value="farmer">Farmer</option>
            </select>

            {role === 'farmer' && (
              <button
                type="button"
                onClick={() => setStep('verify-farmer')}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                Continue
              </button>
            )}

            {role === 'consumer' && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const { data } = await axios.post(`${API_URL}/auth/google-login`, {
                      tokenId: googleTokenId,
                      role: 'consumer',
                    });

                    if (data?.user?.role === 'farmer') navigate('/farmer/dashboard');
                    else navigate('/');
                  } catch (e) {
                    toast.error(e?.response?.data?.message || 'Failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                Enter as Consumer
              </button>
            )}
          </div>
        )}

        {step === 'verify-farmer' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
              <select
                value={verificationDetails.documentType}
                onChange={(e) =>
                  setVerificationDetails((p) => ({ ...p, documentType: e.target.value }))
                }
                className="w-full text-sm p-2 rounded border-gray-300 focus:ring-green-500 focus:border-green-500"
              >
                <option value="RTC">RTC (Pahani)</option>
                <option value="Kisan Card">Kisan Credit Card</option>
                <option value="Farmer ID">Farmer ID Card</option>
                <option value="Other">Other Government ID</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Number</label>
              <input
                value={verificationDetails.documentNumber}
                onChange={(e) =>
                  setVerificationDetails((p) => ({ ...p, documentNumber: e.target.value }))
                }
                className="w-full text-sm p-2 rounded border-gray-300 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter ID number"
              />
            </div>

            <button
              type="button"
              disabled={!verificationDetails.documentNumber}
              onClick={async () => {
                try {
                  setLoading(true);
                  await axios.post(`${API_URL}/auth/google-login`, {
                    tokenId: googleTokenId,
                    role: 'farmer',
                    verificationDetails,
                  });
                  toast.success('Farmer verification submitted. Please wait for approval.');
                  navigate('/farmer/dashboard');
                } catch (e) {
                  toast.error(e?.response?.data?.message || 'Verification failed');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-60"
            >
              Submit Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

