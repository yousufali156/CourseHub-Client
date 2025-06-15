// import React, { useContext, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router';
// import Lottie from 'lottie-react';
// import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';
// import RegisterLottie from '../../assets/Animation/Signup Animation.json';
// import AuthContext from '../../FirebaseAuthContext/AuthContext';
// import axios from 'axios';

// const Login = () => {
//   const { signInUser, signInWithGoogle, signInWithGithub } = useContext(AuthContext);
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');

//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname || '/';

//   const sendTokenToServer = async () => {
//     const user = window?.localStorage.getItem('user');
//     if (!user) return;

//     const { accessToken } = JSON.parse(user);
//     try {
//       // Example: Ping protected route with token
//       await axios.get('http://localhost:3000/courses', {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//     } catch (err) {
//       console.error('Token send error:', err);
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     const email = e.target.email.value;
//     const password = e.target.password.value;

//     try {
//       const result = await signInUser(email, password);
//       const idToken = await result.user.getIdToken();
//       localStorage.setItem(
//         'user',
//         JSON.stringify({ email: result.user.email, accessToken: idToken })
//       );
//       await sendTokenToServer();
//       navigate(from, { replace: true });
//     } catch (err) {
//       setError(err.message || 'Login failed.');
//     }
//   };

//   const handleSocialLogin = async (provider) => {
//     try {
//       let result;
//       if (provider === 'google') {
//         result = await signInWithGoogle();
//       } else if (provider === 'github') {
//         result = await signInWithGithub();
//       }

//       const idToken = await result.user.getIdToken();
//       localStorage.setItem(
//         'user',
//         JSON.stringify({ email: result.user.email, accessToken: idToken })
//       );
//       await sendTokenToServer();
//       navigate(from, { replace: true });
//     } catch (err) {
//       setError(err.message || 'Social login failed.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
//       <div className="flex flex-col-reverse lg:flex-row items-center gap-10 w-full max-w-6xl">
//         {/* Animation */}
//         <div className="w-full max-w-md lg:max-w-lg">
//           <Lottie animationData={RegisterLottie} loop={true} />
//         </div>

//         {/* Login Card */}
//         <div className="card w-full max-w-sm bg-base-300/90 shadow-xl backdrop-blur-md rounded-xl">
//           <div className="card-body p-8">
//             <h1 className="text-4xl font-extrabold text-blue-500 mb-6 text-center">
//               Login Now
//             </h1>

//             <form onSubmit={handleLogin} className="space-y-4">
//               <div>
//                 <label htmlFor="email" className="label text-blue-900 font-medium">
//                   Email
//                 </label>
//                 <input
//                   name="email"
//                   type="email"
//                   className="input input-bordered w-full"
//                   placeholder="Your Email"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="label text-blue-900 font-medium">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     name="password"
//                     type={showPassword ? 'text' : 'password'}
//                     className="input input-bordered w-full pr-10"
//                     placeholder="Password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     className="absolute top-1/2 right-3 -translate-y-1/2 text-base-300"
//                     onClick={() => setShowPassword(!showPassword)}
//                     aria-label="Toggle Password Visibility"
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//               </div>

//               <div className="text-right">
//                 <a href="#" className="link link-hover text-sm text-blue-500">
//                   Forgot password?
//                 </a>
//               </div>

//               {error && (
//                 <p className="text-sm text-red-600 font-medium mt-2">{error}</p>
//               )}

//               <button
//                 type="submit"
//                 className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition duration-300"
//               >
//                 Login
//               </button>
//             </form>

//             {/* Divider */}
//             <div className="divider text-blue-900 font-medium">OR</div>

//             {/* Social Login Buttons */}
//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={() => handleSocialLogin('google')}
//                 className="btn btn-outline w-full flex items-center gap-2"
//               >
//                 <FaGoogle className="text-lg" /> Continue with Google
//               </button>
//               <button
//                 onClick={() => handleSocialLogin('github')}
//                 className="btn btn-outline w-full flex items-center gap-2"
//               >
//                 <FaGithub className="text-lg" /> Continue with GitHub
//               </button>
//             </div>

//             {/* Register Redirect */}
//             <div className="mt-6 text-center">
//               <p className="text-sm text-blue-900">
//                 Don’t have an account?{' '}
//                 <button
//                   onClick={() => navigate('/register')}
//                   className="ml-1 inline-block text-purple-700 font-semibold hover:underline"
//                 >
//                   Register
//                 </button>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Lottie from 'lottie-react';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';
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
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
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

        {/* Login Card */}
        <div className="card w-full max-w-sm bg-base-300/90 shadow-xl backdrop-blur-md rounded-xl">
          <div className="card-body p-8">
            <h1 className="text-4xl font-extrabold text-blue-500 mb-6 text-center">
              Login Now
            </h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="label text-blue-900 font-medium">
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

              <div>
                <label htmlFor="password" className="label text-blue-900 font-medium">
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
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-base-300"
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
                <p className="text-sm text-red-600 font-medium mt-2">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-2 mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition duration-300"
              >
                Login
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-blue-900 font-medium">OR</div>

            {/* Social Login Buttons */}
            <div className="flex flex-col gap-3">
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

            {/* Register Redirect */}
            <div className="mt-6 text-center">
              <p className="text-sm text-blue-900">
                Don’t have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="ml-1 inline-block text-purple-700 font-semibold hover:underline"
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
