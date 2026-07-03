import { toast } from 'react-toastify';

import { useGoogleLogin } from '@react-oauth/google';


const API_URL = import.meta.env.VITE_API_URL;

/**
 * Props:
 *  - onGoogleSuccess: (tokenResponse) => void
 *  - text: button label
 */
export default function GoogleAuthButton({ onGoogleSuccess, text }) {


  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      try {
        onGoogleSuccess?.(tokenResponse);
      } catch (e) {
        toast.error(e?.message || 'Google login failed');
      }
    },
    onError: () => toast.error('Google authentication failed'),
    // We need id_token to validate on backend (id_token flow)
    // NOTE: Using a token-based flow that includes id_token is required.
    // Google OAuth client must be configured to return id_token.
    flow: 'implicit',
    scope: 'openid email profile',
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50"
    >
      <span className="text-lg">🔐</span>
      {text || 'Continue with Google'}
    </button>
  );
}

