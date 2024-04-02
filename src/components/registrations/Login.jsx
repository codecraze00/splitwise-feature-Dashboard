import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
    const auth = getAuth(); // Use getAuth directly
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        // Redirect to home page if the user is already logged in
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleLogin = () => {
        // Login the user
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                navigate('/'); // Redirect to home page
                alert('User logged in successfully');
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded shadow-md w-96">
                <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
                <form>
                    <div className="mb-4">
                        <input
                            type="text"
                            id="email"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-blue-500"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 rounded bg-gray-700 text-white border focus:outline-none focus:border-blue-500"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-700 focus:outline-none"
                        type="button"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Don't have an account? <Link to="/register" className="text-blue-500">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
