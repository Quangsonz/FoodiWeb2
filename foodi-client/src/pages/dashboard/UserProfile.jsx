import React, { useContext, useState, useRef } from 'react'
import { AuthContext } from '../../contexts/AuthProvider'
import { useForm } from 'react-hook-form';
import { FaUser, FaLock, FaCamera } from 'react-icons/fa';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: user?.displayName || '',
            email: user?.email || '',
        }
    });

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            // Create form data
            const formData = new FormData();
            formData.append('file', file);

            // Upload file
            const response = await axiosPublic.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const photoURL = response.data;

            // Update profile in Firebase
            await updateUserProfile(user.displayName, photoURL);
            
            // Update user in database
            await axiosPublic.put(`/users/update`, {
                email: user.email,
                name: user.displayName,
                photoURL: photoURL
            });

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Profile photo updated successfully!",
                showConfirmButton: false,
                timer: 1500,
            });

            // Reload page to show new photo
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error updating profile photo:', error);
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: "Failed to update profile photo. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Update profile in Firebase
            await updateUserProfile(data.username);
            
            // Update user in database
            await axiosPublic.put(`/users/update`, {
                email: user.email,
                name: data.username,
                photoURL: user.photoURL
            });

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Profile updated successfully!",
                showConfirmButton: false,
                timer: 1500,
            });

            // Reload page after successful update to show new info
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error updating profile:', error);
            let errorMessage = "Failed to update profile. Please try again.";
            
            if (error.response) {
                // Handle specific error messages from backend
                errorMessage = error.response.data.message || errorMessage;
            }
            
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: errorMessage
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen py-12 flex items-center justify-center bg-gray-50">
            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 max-w-5xl">
                {/* Left Profile Card */}
                <div className="md:w-80 bg-white rounded-lg shadow-sm p-6">
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden mb-4 group cursor-pointer"
                             onClick={handleImageClick}>
                            {user?.photoURL ? (
                                <img 
                                    src={user.photoURL} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop
                                        e.target.src = 'https://via.placeholder.com/150'; // Default image
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FaUser className="text-gray-400 text-4xl" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FaCamera className="text-white text-2xl" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <h3 className="text-xl text-pink-500 font-medium mb-1">{user?.displayName}</h3>
                        <p className="text-blue-500 text-sm hover:underline cursor-pointer mb-6">View profile</p>
                    </div>
                    
                    <div className="space-y-1">
                        <Link to="/update-profile" 
                            className="flex items-center w-full p-3 text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                            <FaUser className="mr-3" /> Account
                        </Link>
                        <Link to="/change-password" 
                            className="flex items-center w-full p-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                            <FaLock className="mr-3" /> Change Password
                        </Link>
                    </div>
                </div>

                {/* Right Form Section */}
                <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center mb-8">
                            <FaUser className="text-gray-400 mr-3 text-xl" />
                            <h2 className="text-2xl font-medium text-gray-800">Profile Information</h2>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    {...register("username", {
                                        required: "Name is required"
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    {...register("email")}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                                />
                            </div>

                            {/* Update button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile