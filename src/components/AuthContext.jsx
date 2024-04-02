import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null); // To store the current user
  const [loading, setLoading] = useState(true); // To display a loading spinner until the auth state is loaded

  useEffect(() => { // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => { // method is used to subscribe to the auth state changes
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  const signInWithGoogle = async () => { // Sign in with Google
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert('User logged in successfully');
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
    }
  };

  const signOutUser = async () => { // Sign out the user
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const value = {
    currentUser,
    signInWithGoogle,
    signOutUser,
  };

  // Render children only when loading is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
