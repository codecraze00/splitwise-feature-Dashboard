import React from 'react';
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, getDocs } from 'firebase/firestore';

import { useAuth } from '../AuthContext';
import db from '../../config/firebasedb';
import { useNavigate } from 'react-router-dom';
import GoogleButton from './GoogleButton';
import LogoutIcon from '../icons/LogoutIcon';
import LoadingOverlay from '../loading/LoadingOverlay';

const LoginButton = () => {
  const { currentUser, signInWithGoogle, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const registerWithGoogle = async () => {
    setLoading(true);
    const auth = getAuth();
    let { displayName, email, photoURL: imageUrl = 'https://via.placeholder.com/250' } = auth.currentUser;

    try {
      const docRef = collection(db, 'user_detail');
      let found = false;
      // check if email already exists
      const querySnapshot = await getDocs(docRef);
      querySnapshot.forEach((doc) => {
        if (doc.data().email === email) {
          found = true;
        }
      });

      if (found) {
        return;
      }

      await addDoc(docRef, {
        displayName,
        email,
        picture: imageUrl,
        userName: displayName,
      });
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Error adding user:', error.message);
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      await registerWithGoogle();
      setLoading(false);
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      setLoading(false);
    }
    
  };


  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="flex items-center space-x-2">
        {currentUser ? (
          <button type="button" onClick={signOutUser}>
            <LogoutIcon />
            <span className="sr-only">Logout</span>
          </button>
        ) : (
          <GoogleButton onClick={handleGoogleSignIn} />
        )}
      </div>
    </>
  );
};

export default LoginButton;
