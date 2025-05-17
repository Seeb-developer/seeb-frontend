import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUserInfo } from "../store/userSlice";

export default function RegistrationModal({ userId, mobile, onClose, onRegistered }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (!name || !email) {
      setError("Name and Email are required.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}customer/updateCustomer/${userId}`, {
        name,
        email,
        mobile_no: mobile,
      });


    dispatch(updateUserInfo({
      name: name,
      email: email,
    }));

    // alert("Profile updated successfully! 🎉");
      onRegistered();
      onClose();
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Failed to save details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 !mt-0">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-xs sm:max-w-sm relative">
        <h2 className="text-xl font-bold text-center mb-4">📝 Complete Registration</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-md w-full px-4 py-2 mb-3 text-sm"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md w-full px-4 py-2 mb-4 text-sm"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={handleRegister}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded-md text-white font-semibold"
        >
          {saving ? "Saving..." : "Save & Continue"}
        </button>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✖
        </button>
      </div>
    </div>
  );
}
