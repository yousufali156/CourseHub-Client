import React, { useContext, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../../../FirebaseAuthContext/AuthContext';

const SocialLogin = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  // ✅ Handle Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithGoogle();
      const firebaseToken = await result.user.getIdToken();

      // ✅ Send Firebase Token to backend.
      // The backend will set an httpOnly cookie.
      await axios.post('https://course-hub-server-delta.vercel.app/jwt', { token: firebaseToken });
      toast.success('Login Successful!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google login failed.');
      toast.error(err.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="btn btn-outline w-full flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
      >
        <FaGoogle className="text-lg" />
        {loading ? 'Processing...' : 'Continue with Google'}
      </button>

      {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
    </div>
  );
};

export default SocialLogin;