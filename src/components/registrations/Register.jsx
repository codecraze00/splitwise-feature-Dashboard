import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import App from '../../config/firebase';
import db from '../../config/firebasedb';
import LoadingOverlay from '../loading/LoadingOverlay';

const Register = () => {
    const auth = getAuth(App);
    const storage = getStorage(App);
    const [loading, setLoading] = useState(false);
    let imageURL = '';
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        image: null,
        displayName: '',
    });

    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);


    const register = async () => {
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
    
            if (!user) {
                throw new Error('User object is null');
            }
    
            // Update user profile with display name
            await updateProfile(user, { displayName: formData.displayName });
    
            // Upload image if provided
            await storeUserDetails(user); // Await the storeUserDetails function call
            setLoading(false);
            navigate('/');
        } catch (error) {
            console.error('Error creating user:', error.message);
            setLoading(false);
        }
    }
    
    
    const storeUserDetails = async (user) => {
        try {
            if (formData.image) {
                await uploadImage(user.uid); // Await the uploadImage function call
            } 
            // Add user details to the user_detail collection
            await addDoc(collection(db, 'user_detail'), {
                displayName: formData.displayName,
                picture: imageURL,
                email: user.email,
                userID: user.uid,
            });
        } catch (error) {
            console.error('Error storing user details:', error.message);
        }
    }

    const uploadImage = async (userId) => {
        try {
            const storageRef = ref(storage, `profile_images/${userId}/${formData.image.name}`);
            await uploadBytes(storageRef, formData.image);
            const url = await getDownloadURL(storageRef);
            console.log('Image uploaded successfully at URL:', url);
            imageURL = url;
            console.log('Image URL:', imageURL);

        } catch (error) {
            console.error('Error uploading image:', error.message);
        }
    }
    
    
    const handleRegister = () => {
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email');
            return;
        }
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(formData.username)) {
            alert('Username can only contain alphanumeric characters');
            return;
        }
        if (!formData.displayName) {
            alert('Please enter a display name');
            return;
        }
        if (formData.image && formData.image.size > 1024 * 1024) {
            alert('Image size must be less than 1MB');
            return;
        }

        (async () => {
            await register();
        })();
    }

    const handleImageChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            image: e.target.files[0]
        }));
    }



    return (
        <>
        {loading && <LoadingOverlay />}
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded shadow-md w-96">
                <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
                <form>
                    <div className="mb-4">
                        <input
                            type="text"
                            id="username"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData(prevState => ({
                                ...prevState,
                                username: e.target.value
                            }))}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text" 
                            id="displayName"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
                            placeholder="Display Name" 
                            value={formData.displayName}
                            onChange={(e) => setFormData(prevState => ({
                                ...prevState,
                                displayName: e.target.value
                            }))}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData(prevState => ({
                                ...prevState,
                                email: e.target.value
                            }))}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData(prevState => ({
                                ...prevState,
                                password: e.target.value
                            }))}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            id="confirmPassword"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prevState => ({
                                ...prevState,
                                confirmPassword: e.target.value
                            }))}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-purple-500"
                            onChange={handleImageChange}
                        />
                    </div>
                    <button
                        className="w-full bg-purple-500 text-white font-bold py-2 rounded hover:bg-purple-700 focus:outline-none"
                        type="button"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-purple-500">Login here</Link>
                </p>
            </div>
        </div>
        </>
    );
};

export default Register;
