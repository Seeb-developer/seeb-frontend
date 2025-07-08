import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const ContactFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact_number: '',
    email_id: '',
    message: '',
    status: '1',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/customer/contact-us/query`,
        formData
      );

      if (response.status === 200) {
        setSuccess(true);
        setFormData({
          name: '',
          contact_number: '',
          email_id: '',
          message: '',
          status: '1',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-black border border-[#facc15]/30 w-full max-w-lg rounded-xl p-6 relative" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#facc15] hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-[#facc15] text-2xl font-bold mb-4">Get A Free Estimate</h2>
        {success && (
          <p className="text-green-400 text-sm mb-4">Thank you! We'll contact you soon.</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-black border border-gray-600 text-white focus:outline-none focus:border-[#facc15]"
          />
          <input
            type="tel"
            name="contact_number"
            placeholder="Contact Number"
            value={formData.contact_number}
            onChange={handleChange}
            required
            pattern="^[6-9]\d{9}$"
            maxLength={10}
            title="Please enter a valid 10-digit mobile number"
            className="w-full px-4 py-2 rounded bg-black border border-gray-600 text-white focus:outline-none focus:border-[#facc15]"
          />

          <input
            type="email"
            name="email_id"
            placeholder="Email Address"
            value={formData.email_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-black border border-gray-600 text-white focus:outline-none focus:border-[#facc15]"
          />
          
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#facc15] text-black font-semibold py-3 rounded hover:bg-[#facc15]/90 transition"
          >
            {submitting ? 'Sending...' : 'Request A Call Back'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactFormModal;
