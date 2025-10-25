 
import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router'; // Added useLocation
import Lottie from 'lottie-react';
import RegisterLottie from '../../assets/Animation/Signup Animation.json';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import SocialLogin from '../Shared/SocialLogin/SocialLogin';
import AuthContext from '../../FirebaseAuthContext/AuthContext';
import axiosSecure from '../../../api/axiosSecure';

const Register = () => {
  // Get both createUser and updateUserProfile from context
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const from = location.state?.from?.pathname || '/'; // Navigate to home or previous page

  // Send Firebase Token -> Get Custom JWT (via Cookie)
  const sendTokenToServer = async (firebaseToken) => {
    // This call will set the cookie
    await axiosSecure.post('/jwt', { token: firebaseToken });
  };

  // Handle Register Form Submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Start loading

    const form = e.target;
    const name = form.name.value.trim();
    const photoURL = form.photoURL.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const confirmPassword = form.confirmPassword.value.trim();

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setLoading(false);
      return setError('Password must be 8+ chars, with uppercase, lowercase, number & special char.');
    }
    if (password.includes(email)) {
      setLoading(false);
      return setError('Password should not contain your email address.');
    }
    if (password !== confirmPassword) {
      setLoading(false);
      return setError('Passwords do not match.');
    }

    try {
      const result = await createUser(email, password);

      // (FIX) Use updateUserProfile from AuthContext
      await updateUserProfile(name, photoURL);
      // This updates auth.currentUser internally in Firebase

      const firebaseToken = await result.user.getIdToken();
      // Exchange token for cookie
      await sendTokenToServer(firebaseToken);

      toast.success('Registration Successful!');
      // This navigation will now work (once 401 error is fixed)
      navigate(from, { replace: true });
    } catch (err) {
      // Provide user-friendly Firebase error messages
      let friendlyError = 'Registration failed. Please try again.';
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            friendlyError = 'This email is already in use.';
            break;
          case 'auth/weak-password':
            friendlyError = 'Password is too weak. Please choose a stronger one.';
            break;
          case 'auth/invalid-email':
            friendlyError = 'Please enter a valid email address.';
            break;
          default:
            friendlyError = err.message;
        }
      }
      setError(friendlyError);
      toast.error(friendlyError);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <Helmet>
        <title>Register || CourseHub</title>
      </Helmet>

      <div className="flex flex-col-reverse lg:flex-row items-center gap-10 w-full max-w-6xl">
        <div className="w-full max-w-md lg:max-w-lg">
          <Lottie animationData={RegisterLottie} loop />
        </div>
        <div className="card w-full max-w-sm bg-base-300/90 shadow-xl backdrop-blur-md rounded-xl">
          <div className="card-body p-5">
            <h1 className="text-4xl font-extrabold text-blue-500 mb-6 text-center">
              Create Account
            </h1>

            <form onSubmit={handleRegister} className="space-y-2">
              <div>
                <label className="label text-blue-400 mb-2 font-medium">Name</label>
                <input name="name" type="text" className="input input-bordered w-full" required />
              </div>

              <div>
                <label className="label text-blue-400 mb-2 font-medium">Photo URL</label>
                <input name="photoURL" type="text" className="input input-bordered w-full" required />
              </div>

              <div>
                <label className="label text-blue-400 mb-2 font-medium">Email</label>
                <input name="email" type="email" className="input input-bordered w-full" required />
              </div>

              <div>
                <label className="label text-blue-400 mb-2 font-medium">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="input input-bordered w-full pr-10" required
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label text-blue-400 mb-2 font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="input input-bordered w-full pr-10" required
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-600 text-sm font-medium capitalize">{error}</p>}

              <button
                type="submit"
                className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition duration-300 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
            <div className="divider text-blue-400 font-medium">OR</div>
            <SocialLogin />
            <div className="mt-4 text-center">
              <p className="text-sm text-blue-400">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="ml-1 inline-block text-purple-500 font-semibold hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

