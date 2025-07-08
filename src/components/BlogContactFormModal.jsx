import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BlogContactFormModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        contact_number: '',
        email_id: '',
        space_type: '',
        city: '',
        status: '1',
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/customer/contact-us/query`,
                formData
            );

            if (response.status === 200) {
                navigate('/thank-you');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-lg rounded-xl p-6 relative shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Let’s Transform Your Space, Together</h2>
                <p className="text-gray-600 mb-4">Tell us a few quick details and our expert will contact you with a personalized interior plan.</p>
             
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded border border-gray-300 text-gray-800 focus:outline-none focus:border-yellow-500"
                    />
                    <input
                        type="text"
                        name="contact_number"
                        placeholder="Contact Number"
                        value={formData.contact_number}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded border border-gray-300 text-gray-800 focus:outline-none focus:border-yellow-500"
                    />
                    <input
                        type="email"
                        name="email_id"
                        placeholder="Email Address"
                        value={formData.email_id}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded border border-gray-300 text-gray-800 focus:outline-none focus:border-yellow-500"
                    />
                     <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded border border-gray-300 text-gray-800 focus:outline-none focus:border-yellow-500"
                    />
                    <select
                        name="space_type"
                        value={formData.space_type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded border border-gray-300 text-gray-800 bg-white focus:outline-none focus:border-yellow-500"
                    >
                        <option value="" disabled>Select Space For</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Retail">Retail</option>
                    </select>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-secondary w-full"
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
                <p className="text-gray-600 text-sm">🔐 Your information is 100% secure and will never be shared.</p>
            </div>
        </div>
    );
};

export default BlogContactFormModal;
