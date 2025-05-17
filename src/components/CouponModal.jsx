import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function CouponModal({ userId, cartTotal, appliedCode, onClose, onApply }) {

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customCode, setCustomCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}coupon/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoupons(res.data.data || []);
      } catch (err) {
        console.error("Failed to load coupons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const applyCoupon = async (code) => {
    try {
      setErrorMessage("");

      const payload = {
        user_id: userId,
        coupon_code: code,
        cart_total: cartTotal,
      };

      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}coupon/use-coupon`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { coupon_code, discount, final_amount } = res.data;
      onApply({
        coupon_code,
        discount,
        finalAmount: final_amount,
      });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to apply coupon.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <h3 className="text-lg font-bold mb-4 text-center">Available Offers</h3>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-1">Enter coupon code:</label>
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="Enter code manually"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button
            className="mt-2 btn btn-secondary px-4 py-2 w-full"
            onClick={() => applyCoupon(customCode)}
          >
            Apply Code
          </button>
          {errorMessage && (
            <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
          )}
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p className="text-sm text-gray-500">No coupons available.</p>
        ) : (
          <ul className="space-y-3 mb-4">
            {coupons.map((coupon) => (
              <li
                key={coupon.id}
                className="border border-gray-300 rounded-md p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div>
                  <p className="font-semibold">{coupon.coupon_name}</p>
                  <p className="text-sm text-gray-600">{coupon.description}</p>
                </div>
                <button
                  className={`mt-2 sm:mt-0 px-4 py-1 rounded-md text-sm font-semibold ${appliedCode?.coupon_code === coupon.coupon_code
                    ? "bg-green-500 cursor-default"
                    : "bg-primary hover:bg-green-500 hover:text-white"
                    }`}
                  onClick={() => applyCoupon(coupon.coupon_code)}
                >
                  {appliedCode?.coupon_code === coupon.coupon_code ? "Applied" : "Apply"}
                </button>
              </li>
            ))}
          </ul>
        )}

        <button onClick={onClose} className="absolute top-4 right-4 text-black text-2xl">✕</button>
      </div>
    </div>
  );
}
