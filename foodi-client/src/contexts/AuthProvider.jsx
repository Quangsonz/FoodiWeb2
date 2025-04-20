/* eslint-disable react/prop-types */
import React from 'react';
import { createContext } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useState } from 'react';
import { useEffect } from 'react';
import app from '../firebase/firebase.config';
import axios from 'axios';

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signUpWithGmail = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const login = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;
            await getToken(user.email);
            return result;
        } finally {
            setLoading(false);
        }
    }

    const logOut = async () => {
        setLoading(true);
        try {
            localStorage.removeItem('access-token');
            await signOut(auth);
        } finally {
            setLoading(false);
        }
    }

    const getToken = async (email) => {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/jwt', { email });
            if (response.data.token) {
                localStorage.setItem('access-token', response.data.token);
                return response.data.token;
            }
        } catch (error) {
            console.error('Error getting token:', error);
            localStorage.removeItem('access-token');
        }
    }

    // update your profile
    const updateUserProfile = (name, photoURL) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photoURL
        });
    }

    // update password
    const updateUserPassword = async (currentPassword, newPassword) => {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        
        // Re-authenticate user
        await reauthenticateWithCredential(user, credential);
        
        // Update password
        return updatePassword(user, newPassword);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Get new token when user state changes
                await getToken(currentUser.email);
            } else {
                localStorage.removeItem('access-token');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user, 
        loading,
        createUser, 
        login, 
        logOut,
        signUpWithGmail,
        updateUserProfile,
        updatePassword: updateUserPassword,
        getToken
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;