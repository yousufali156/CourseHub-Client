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
  const [error, setError] = useState(null);

  // Create user with email & password
  const createUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email & password
  const signInUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      googleProvider.addScope('email');
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Github
  const signInWithGithub = async () => {
    setLoading(true);
    setError(null);
    try {
      githubProvider.addScope('user:email');
      const result = await signInWithPopup(auth, githubProvider);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out user
  const signOutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call backend logout endpoint to clear session or cookies
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'https://course-hub-server-delta.vercel.app'}/logout`,
        {},
        { withCredentials: true }
      );
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(err.message);
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);
      setError(null);

      if (currentUser?.email) {
        try {
          const idToken = await currentUser.getIdToken();
          // Send Firebase token to backend to generate custom JWT or session
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'https://course-hub-server-delta.vercel.app'}/jwt`,
            { token: idToken },
            { withCredentials: true }
          );
        } catch (err) {
          setError('Failed to get JWT from backend');
          console.error('JWT error:', err);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = useMemo(() => ({
    user,
    loading,
    error,
    userId: user?.uid || null,
    createUser,
    signInUser,
    signOutUser,
    signInWithGoogle,
    signInWithGithub,
  }), [user, loading, error]);

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
