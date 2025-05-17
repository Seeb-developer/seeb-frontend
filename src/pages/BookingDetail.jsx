import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export default function BookingDetail() {
  // const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const {id} = state || {};
  const [booking, setBooking] = useState(null);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchBooking = async () => {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}booking/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooking(res?.data?.data);
    };
    fetchBooking();
  }, [id]);

  if (!booking) return <p className="text-center mt-10 text-sm text-gray-500">Loading...</p>;

  const { booking: bk, services } = booking;
  const sgst = bk.total_amount * 0.09;
  const cgst = bk.total_amount * 0.09;
  
  return (

    <div className=" p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button className="text-gray-700 font-medium hover:underline" onClick={() => navigate(-1)} >&larr; Back</button>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">📋 Booking Details</h1>

      {/* Booking Info */}
      <div className="bg-white p-6 rounded-xl shadow mb-6 space-y-2">
        <div className="flex justify-between text-sm text-gray-700">
          <span><strong>Booking ID:</strong> #{bk.booking_id}</span>
          <span><strong>Date:</strong> {new Date(bk.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-sm">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            Booking Status: Confirmed
          </span>
          <span
            className={`px-3 py-1 rounded-full font-medium ${bk.payment_status === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
              }`}
          >
            Payment Status: {bk.payment_status}
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            Payment Type: {bk.payment_type.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Services */}
      <h2 className="text-lg font-semibold mb-3 text-gray-800">🛠️ Services</h2>
      {services.map((srv, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow mb-4">
          <p><strong>Service Name:</strong> {srv.service_name}</p>
          <p><strong>Size:</strong> {srv.value}</p>
          <p><strong>Rate:</strong> ₹{srv.rate}</p>
          <p><strong>Total:</strong> ₹{srv.amount}</p>
        </div>
      ))}

      {/* Payment Summary */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow space-y-2">
        <h3 className="text-lg font-bold text-gray-800 mb-3">💳 Payment Summary</h3>
        <div className="flex justify-between text-sm">
          <span>Total Amount:</span>
          <span>₹{bk.total_amount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>SGST (9%):</span>
          <span>₹{bk.sgst}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>CGST (9%):</span>
          <span>₹{bk.cgst}</span>
        </div>
        <div className="flex justify-between text-sm text-green-700 font-medium">
          <span>Coupon Discount:</span>
          <span>-₹{bk.discount}</span>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between text-md font-bold text-green-600">
          <span>Final Payable Amount:</span>
          <span>₹{bk.final_amount}</span>
        </div>
      </div>

      {/* Payment Button */}
      {bk.payment_status === "pending" && (
        <button className="mt-6 bg-green-600 text-white py-3 px-6 rounded-md font-semibold w-full">
          💸 Pay Now
        </button>
      )}

      <button
        onClick={() => {                
          const link = document.createElement("a");
          link.href = `${import.meta.env.VITE_BASE_URL}invoice/${booking.booking.id}`;
          link.setAttribute("download", `invoice-${booking.booking.booking_id}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }}
        className="btn btn-secondary mt-6 !font-bold"
      >
        🧾 Download Invoice
      </button>

    </div>
  );
}
