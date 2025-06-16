import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';
import toast from 'react-hot-toast';
import RegisterLottie from '../../assets/Animation/Signup Animation.json';
import AuthContext from '../../FirebaseAuthContext/AuthContext';

const Login = () => {
  const { signInUser, signInWithGoogle, signInWithGithub } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInUser(email, password);
      toast.success('Login Successful!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
      toast.error(err.message || 'Login failed.');
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else if (provider === 'github') {
        await signInWithGithub();
      }
      toast.success('Login Successful!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Social login failed.');
      toast.error(err.message || 'Social login failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
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

              {/* Error Message */}
              {error && (
                <p className="text-sm text-red-600 font-medium mt-2">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition duration-300"
              >
                Login
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-purple-500 font-medium">OR</div>

            {/* Social Login */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleSocialLogin('google')}
                className="btn btn-outline w-full flex items-center gap-2 bg-blue-500 hover:text-base-300 transition"
              >
                <FaGoogle className="text-lg " /> Continue with Google
              </button>

              <button
                onClick={() => handleSocialLogin('github')}
                className="btn btn-outline w-full flex items-center gap-2 hover:text-red-600 transition"
              >
                <FaGithub className="text-lg" /> Continue with GitHub
              </button>
            </div>

            {/* Register Redirect */}
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
