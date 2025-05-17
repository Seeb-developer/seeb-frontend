import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CalendarDays } from "lucide-react";
import { useSelector } from "react-redux";  

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userInfo);
  const userId = user?.id;

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}booking/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.data || []);
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-800">📄 My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {bookings.map((booking) => {
            const createdDate = new Date(booking.created_at).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={booking.id}
                onClick={() => navigate("/booking-detail",{
                  state:{
                    id:booking.id
                  }
                })}              
                className="bg-white border hover:shadow-lg rounded-xl p-5 transition cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800">Booking ID: #{booking.booking_id}</h2>
                    <p className="text-sm mt-1 text-gray-600">
                      <span className="font-medium">Service:</span>{" "}
                      {booking.services?.[0]?.name || "No service name"}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <CalendarDays size={14} /> {createdDate}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${
                        booking.payment_status === "paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {booking.payment_status}
                    </span>

                    <p className="text-sm text-gray-500 mt-2">Final Amount</p>
                    <p className="text-xl font-bold text-red-600">₹{booking.final_amount}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
