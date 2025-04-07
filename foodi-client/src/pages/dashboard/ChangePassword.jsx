import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthProvider'
import { useForm } from 'react-hook-form';
import { FaUser, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const ChangePassword = () => {
    const { user, updatePassword } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Update password in Firebase
            await updatePassword(data.currentPassword, data.newPassword);
            
            // Update password in database
            await axiosPublic.put('/users/update', {
                email: user.email,
                password: data.newPassword
            });

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Password updated successfully!",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Error updating password:', error);
            let errorMessage = "Failed to update password. Please check your current password and try again.";
            
            if (error.code === 'auth/wrong-password') {
                errorMessage = "Current password is incorrect.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "New password should be at least 6 characters.";
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
                        <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden mb-4">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FaUser className="text-gray-400 text-4xl" />
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl text-pink-500 font-medium mb-1">{user?.displayName}</h3>
                        <p className="text-blue-500 text-sm hover:underline cursor-pointer mb-6">View profile</p>
                    </div>
                    
                    <div className="space-y-1">
                        <Link to="/update-profile" 
                            className="flex items-center w-full p-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                            <FaUser className="mr-3" /> Account
                        </Link>
                        <Link to="/change-password" 
                            className="flex items-center w-full p-3 text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                            <FaLock className="mr-3" /> Change Password
                        </Link>
                    </div>
                </div>

                {/* Right Form Section */}
                <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center mb-8">
                            <FaLock className="text-gray-400 mr-3 text-xl" />
                            <h2 className="text-2xl font-medium text-gray-800">Change Password</h2>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    {...register("currentPassword", {
                                        required: "Current password is required"
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.currentPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    {...register("newPassword", {
                                        required: "New password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.newPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: value => value === watch("newPassword") || "Passwords do not match"
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            {/* Update button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword 