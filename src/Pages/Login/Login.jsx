/* eslint-disable no-irregular-whitespace */
import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Using react-toastify as per your register component
import RegisterLottie from '../../assets/Animation/Signup Animation.json'; // Assuming you have this
import { Helmet } from 'react-helmet';
import SocialLogin from '../Shared/SocialLogin/SocialLogin';
import AuthContext from '../../FirebaseAuthContext/AuthContext';
import axiosSecure from '../../../api/axiosSecure';

const Login = () => {
  const { signInUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for the form

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Get JWT cookie from backend after Firebase login
  const getCustomJwt = async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken();
    // This call will set the httpOnly cookie
    await axiosSecure.post('/jwt', { token: idToken });
    // No localStorage.setItem('access-token', jwt) needed
  };

  // Email/Password Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Start loading
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const result = await signInUser(email, password);
      // Exchange Firebase token for the httpOnly cookie
      await getCustomJwt(result.user);

      toast.success('Login Successful!');
      // This navigation will now work once the backend 401 error is fixed
      navigate(from, { replace: true });
    } catch (err) {
      // Provide user-friendly Firebase error messages
      let friendlyError = 'Login failed. Please check credentials.';
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            friendlyError = 'Invalid email or password.';
            break;
          case 'auth/too-many-requests':
            friendlyError = 'Access temporarily disabled due to many attempts. Please reset password or try again later.';
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
        <title>Login || CourseHub</title>
      </Helmet>

      <div className="flex flex-col-reverse lg:flex-row items-center gap-10 w-full max-w-6xl">
        {/* Animation */}
        <div className="w-full max-w-md lg:max-w-lg">
          <Lottie animationData={RegisterLottie} loop={true} />
        </div>

        {/* Login Card */}
        <div className="card w-full max-w-sm bg-base-300 shadow-xl backdrop-blur-md rounded-xl">
          <div className="card-body p-8">
            <h1 className="text-4xl font-extrabold text-blue-400 mb-6 text-center">
              Login Now
            </h1>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="label text-blue-400 mb-2 font-medium">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="Your Email"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="label text-blue-400 mb-2 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="input input-bordered w-full pr-10"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle Password Visibility"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <a href="#" className="link link-hover text-sm text-blue-500">
                  Forgot password?
                </a>
              </div>

              {error && (
                <p className="text-sm text-red-600 font-medium mt-2 capitalize">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition duration-300 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="divider text-purple-500 font-medium">OR</div>
            <SocialLogin />

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-400">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="ml-1 inline-block text-purple-500 font-semibold hover:underline"
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

