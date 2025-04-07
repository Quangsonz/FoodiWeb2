import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8080/api/v1/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your message has been sent successfully.',
                confirmButtonColor: '#10B981'
            });

        } catch (error) {
            console.error('Error sending message:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Could not send message. Please try again later.',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    return (
        <div className="min-h-screen">
            {/* Map Section - Full Width Background */}
            <div className="w-full bg-white pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[400px]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096947685423!2d105.7800632!3d21.028825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4cd0c66f05%3A0xea31563511af2e54!2zMjA2IMSQLiBD4bqndSBHaeG6pXksIFF1YW4gSG9hLCBD4bqndSBHaeG6pXksIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1710400089757!5m2!1svi!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Form Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">CONTACT US</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Your email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Subject"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
                                    placeholder="Your message"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-[120px] h-[40px] bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-300 text-sm font-medium"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Company Info Section */}
                    <div>
                        <div className="mb-8">
                            <img src="/logo.png" alt="BigFood Logo" className="h-16 mb-4" />
                            <p className="text-gray-600">
                                Foodi restaurant chain and delivery service, owned by DKT JSC, is recognized as one of the leading brands in Vietnam
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <FaMapMarkerAlt className="text-xl text-green-500 mt-1" />
                                <p>Floor 6, 206 Doi Can Street, Hanoi</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaPhone className="text-xl text-green-500" />
                                <p>1900 6750</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaEnvelope className="text-xl text-green-500" />
                                <p>support@jspo.vn</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact; 