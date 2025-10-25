/* eslint-disable no-irregular-whitespace */
import React, { useContext, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosSecure from '../../../../api/axiosSecure'; 
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
      const user = result.user; // Get user info from Google result
      const firebaseToken = await user.getIdToken();

      // Step 1: Send Firebase token to backend to get httpOnly cookie
      await axiosSecure.post('/jwt', { token: firebaseToken });
      
      // --- (NEW) Step 2: Create or Update the user in MongoDB ---
      // This sends the user's info to your backend's PUT /users/:email route
      // Your backend will handle $setOnInsert to add role: 'student' on first login
      const userInfo = {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
      };
      await axiosSecure.put(`/users/${user.email}`, userInfo);
      // --- End of new step ---

      toast.success('Login Successful!');
      // This navigation will now work (once backend 401 error is fixed)
      navigate(from, { replace: true });
    
    } catch (err) {
      // The 401 error from backend will be caught here
      console.error("Google Login Error:", err);
      // Try to get the error message from backend response, or fall back to firebase error
      const errorMsg = err.response?.data?.message || err.message || 'Google login failed.';
      setError(errorMsg);
      toast.error(errorMsg);
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

      {error && <p className="text-red-500 text-sm font-medium text-center capitalize">{error}</p>}
    </div>
  );
};

export default SocialLogin;

