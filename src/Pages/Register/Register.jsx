import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Lottie from 'lottie-react';
import RegisterLottie from '../../assets/Animation/Signup Animation.json';
import AuthContext from '../../FirebaseAuthContext/AuthContext';
import { updateProfile } from 'firebase/auth';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const Register = () => {
  const { createUser, signInWithGoogle, signInWithGithub } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

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
      return setError(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
    }

    if (password.includes(email)) {
      return setError('Password should not contain your email address.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      const result = await createUser(email, password);
      await updateProfile(result.user, {
        displayName: name,
        photoURL: photoURL,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else if (provider === 'github') {
        await signInWithGithub();
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Social login failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-10 w-full max-w-6xl">
        {/* Animation */}
        <div className="w-full max-w-md lg:max-w-lg">
          <Lottie animationData={RegisterLottie} loop={true} />
        </div>

        {/* Register Card */}
        <div className="card w-full max-w-sm bg-white/90 shadow-xl backdrop-blur-md rounded-xl">
          <div className="card-body p-5">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
              Create Account
            </h1>

            <form onSubmit={handleRegister} className="space-y-2">
              <div>
                <label className="label text-blue-900 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <label className="label text-blue-900 font-medium">Photo URL</label>
                <input
                  type="text"
                  name="photoURL"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Photo URL"
                  required
                />
              </div>

              <div>
                <label className="label text-blue-900 font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Email"
                  required
                />
              </div>

              <div>
                <label className="label text-blue-900 font-medium">Password</label>
                <input
                  name="password"
                  type="password"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Password"
                  required
                />
              </div>

              <div>
                <label className="label text-blue-900 font-medium">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Confirm Password"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 font-medium mt-2">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition duration-300"
              >
                Register
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-blue-900 font-medium">OR</div>

            {/* Social Login Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleSocialLogin('google')}
                className="btn btn-outline w-full flex items-center gap-2"
              >
                <FaGoogle className="text-lg" /> Continue with Google
              </button>
              <button
                onClick={() => handleSocialLogin('github')}
                className="btn btn-outline w-full flex items-center gap-2"
              >
                <FaGithub className="text-lg" /> Continue with GitHub
              </button>
            </div>

            {/* Login Redirect */}
            <div className="mt-2 text-center">
              <p className="text-sm text-blue-900">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="ml-1 inline-block text-purple-700 font-semibold hover:underline"
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
