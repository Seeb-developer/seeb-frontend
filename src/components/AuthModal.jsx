import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice'; 

export default function AuthModal({ onClose, onLoginSuccess, onNeedRegistration }) {
  const [step, setStep] = useState("mobile"); // "mobile" or "otp"
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}customer/new-send-otp`, {
        mobile_no: mobile,
      });
      setStep("otp");
    } catch (err) {
      setError("Failed to send OTP.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}customer/login`, {
        mobile_no: mobile,
        otp: otp,
        fcm_token: "11111111111",
      });

      const { user, token } = res.data;
      dispatch(setUser({ token, user }));

      if (user.name && user.email) {
        onLoginSuccess(token);
        onClose();
      } else {
        setUserId(user.id);
        onNeedRegistration(user.id, mobile);
      }
    } catch (err) {
      setError("Invalid OTP or login failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}customer/new-send-otp`, {
        mobile_no: mobile,
      });
      alert("OTP resent successfully!");
    } catch (err) {
      console.error("Failed to resend OTP", err);
      alert("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-xs sm:max-w-sm relative" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-center mb-4">
          {step === "mobile" ? "🔒 Login" : "🔑 Enter OTP"}
        </h2>

        {step === "mobile" ? (
          <>
            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
              className="border border-gray-300 rounded-md w-full px-4 py-2 mb-4 text-sm"
              maxLength="10"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              onClick={handleSendOtp}              
              disabled={loading}
              className=" w-full btn btn-secondary"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
              className="border border-gray-300 rounded-md w-full px-4 py-2 mb-4 text-sm"
              maxLength="6"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 w-full py-2 rounded-md text-white font-semibold mb-3"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button
              onClick={handleResendOtp}
              disabled={resending}
              className="w-full text-blue-600 hover:underline text-sm mb-2"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
