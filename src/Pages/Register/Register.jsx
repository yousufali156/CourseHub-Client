import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import RegisterLottie from '../../assets/Animation/Signup Animation.json';
import AuthContext from '../../FirebaseAuthContext/AuthContext';
import { updateProfile } from 'firebase/auth';
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';

const Register = () => {
  const { createUser, signInWithGoogle, signInWithGithub } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const from = '/';

  // ✅ Send Firebase Token -> Get Custom JWT
  const sendTokenToServer = async (firebaseToken) => {
    try {
      const res = await axios.post('https://course-hub-server-delta.vercel.app/jwt', { token: firebaseToken });
      const jwt = res.data.token;
      localStorage.setItem('jwt-token', jwt);
    } catch (err) {
      console.error('JWT Error:', err);
    }
  };

  // ✅ Handle Register Form Submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const form = e.target;
    const name = form.name.value.trim();
    const photoURL = form.photoURL.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const confirmPassword = form.confirmPassword.value.trim();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return setError('Password must be 8 characters long and include uppercase, lowercase, number & special character.');
    }

    if (password.includes(email)) {
      return setError('Password should not contain your email address.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      const result = await createUser(email, password);
      await updateProfile(result.user, { displayName: name, photoURL });

      const firebaseToken = await result.user.getIdToken();
      await sendTokenToServer(firebaseToken);

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  // ✅ Handle Google/GitHub Login
const handleSocialLogin = async (provider) => {
    try {
      let result;

      if (provider === 'google') {
        result = await signInWithGoogle();
      } else if (provider === 'github') {
        result = await signInWithGithub();
      } else {
        throw new Error('Unsupported provider');
      }

      // ইউজারের ইমেইল চেক
      if (!result.user.email) {
        throw new Error('Email not available from this provider.');
      }

      console.log('User email:', result.user.email);

      // Firebase থেকে ID Token নিয়ে backend-এ পাঠানো
      const firebaseToken = await result.user.getIdToken();

      const response = await fetch('https://your-backend.com/jwt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: firebaseToken }),
        credentials: 'include', // যদি আপনার backend cookie সেট করে থাকে
      });

      if (!response.ok) {
        throw new Error('Failed to get custom JWT');
      }

      const data = await response.json();
      const customJwt = data.token;

      // LocalStorage-এ JWT save করা
      localStorage.setItem('customJwt', customJwt);

      toast.success('Login Successful!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Social login failed.');
      toast.error(err.message || 'Social login failed.');
    }
  };



  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <Helmet>
        <title>Register || CourseHub</title> 
      </Helmet>
      <div className="flex flex-col-reverse lg:flex-row items-center gap-10 w-full max-w-6xl">
        {/* Lottie Animation */}
        <div className="w-full max-w-md lg:max-w-lg">
          <Lottie animationData={RegisterLottie} loop />
        </div>

        {/* Register Form */}
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
                    className="input input-bordered w-full pr-10"
                    required
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
                    className="input input-bordered w-full pr-10"
                    required
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

              {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

              <button
                type="submit"
                className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition duration-300"
              >
                Register
              </button>
            </form>

            <div className="divider text-blue-400 font-medium">OR</div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleSocialLogin('google')}
                className="btn btn-outline w-full flex items-center gap-2 bg-blue-500 hover:text-base-300 transition"
              >
                <FaGoogle className="text-lg" /> Continue with Google
              </button>

              <button
                onClick={() => handleSocialLogin('github')}
                className="btn btn-outline w-full flex items-center gap-2 hover:text-red-600 transition"
              >
                <FaGithub className="text-lg" /> Continue with GitHub
              </button>
            </div>

            <div className="mt-2 text-center">
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
