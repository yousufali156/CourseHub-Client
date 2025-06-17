import React, { useEffect, useState, useMemo } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';

import { auth } from '../Firebase/Firebase.init';
import AuthContext from './AuthContext';
import LoadingSpinner from '../Components/LoadingSpinner';
import axios from 'axios';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Create user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // 🔐 Sign in
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 🔐 Google & GitHub
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const signInWithGithub = () => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider);
  };

  // 🔓 Sign out
  const signOutUser = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'https://course-hub-server-delta.vercel.app'}/logout`,
        {},
        { withCredentials: true }
      );
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const idToken = await currentUser.getIdToken();

          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'https://course-hub-server-delta.vercel.app'}/jwt`,
            { token: idToken },
            { withCredentials: true } // ✅ Important for sending cookie
          );
        } catch (err) {
          console.error('❌ JWT error:', err);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = useMemo(
    () => ({
      user,
      loading,
      userId: user?.uid || null,
      createUser,
      signInUser,
      signOutUser,
      signInWithGoogle,
      signInWithGithub,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={authInfo}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
