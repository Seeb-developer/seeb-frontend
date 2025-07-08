import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Download } from "lucide-react";

export default function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("booking_id");

  const handleDownloadInvoice = () => {
    const link = document.createElement("a");
    link.href = `${import.meta.env.VITE_BASE_URL}invoice/${bookingId}`;
    link.setAttribute("download", `invoice-${bookingId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-3">🎉 Booking Confirmed!</h1>
        <p className="text-gray-700 mb-4">Your booking ID is <span className="font-semibold text-black">{bookingId}</span></p>
        <p className="text-sm text-gray-500 mb-6">
          Thank you for choosing Seeb Interiors! You can download your invoice below.
        </p>

        <button
          onClick={handleDownloadInvoice}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium w-full"
        >
          <Download size={18} />
          Download Invoice
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
