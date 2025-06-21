import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CalendarDays, Pencil } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { fetchCart } from "../store/cartSlice";
import AddressModal from "../components/AddressModal";
import CouponModal from "../components/CouponModal";
import RazorpayPayment from "../components/RazorpayPayment";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userInfo);
  const userId = user?.id;

  const [defaultAddress, setDefaultAddress] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    dispatch(fetchCart(userId));
    fetchDefaultAddress();
  }, [dispatch]);

  const fetchDefaultAddress = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}customer-address/default/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDefaultAddress(res.data?.data || "");

    } catch (err) {
      console.error("Failed to load default address", err);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const sgst = totalAmount * 0.09;
  const cgst = totalAmount * 0.09;
  const baseGrandTotal = totalAmount + sgst + cgst;
  const discount = appliedCoupon?.discount ? parseFloat(appliedCoupon.discount) : 0;
  const grandTotal = appliedCoupon?.finalAmount ? parseFloat(appliedCoupon.finalAmount) : baseGrandTotal;

  const handleBooking = async () => {
    try {
      setLoading(true);
      const payload = {
        user_id: userId,
        total_amount: baseGrandTotal,
        discount,
        final_amount: grandTotal,
        paid_amount: paymentMethod === "online" ? grandTotal : 0,
        payment_type: paymentMethod,
        slot_date: startDate.toISOString().split("T")[0],
        applied_coupon: appliedCoupon?.coupon_code || null,
        address_id: defaultAddress.id,
      };

      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}booking/store`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log("Booking response:", res.data.data);

      if (paymentMethod === "pay_later") {
        dispatch(fetchCart(userId));
        // dispatch(clearCart());
        navigate(`/thank-you?booking_id=${res.data.data.id}`);
      } else {
        const order = res.data.data;

        const Razorpay_order_detail = {
          amount: order.amount,
          name: user.name,
          email: user.email,
          contact: user.mobile_no,
          booking_id: order.booking_id,
          razorpay_order: order.razorpay_order,
        };

        RazorpayPayment(Razorpay_order_detail,
          async (paymentRes) => {
            console.log("Payment Done:", paymentRes);

            try {
              const verifyRes = await fetch(`${import.meta.env.VITE_BASE_URL}booking/verify-payment`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`, // if needed
                },
                body: JSON.stringify({
                  razorpay_payment_id: paymentRes.razorpay_payment_id,
                  booking_id: order.booking_id,
                  user_id: user.id,
                }),
              });

              const verifyData = await verifyRes.json();

              if (verifyData.success) {
                console.log("Payment Verified");
                navigate(`/thank-you?booking_id=${order.booking_id}`);
              } else {
                alert("Payment verification failed. Please contact support.");
              }
            } catch (err) {
              console.error("Verification error:", err);
              alert("Payment succeeded but verification failed.");
            }

          },

          () => { console.log("Payment Cancelled or Failed"); });
      }
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">🧾 Checkout</h1>
      {/* Header with Address */}
      <div className="bg-white shadow rounded-xl p-6 mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-4 mb-2">
            🏠 Delivery Address
            <button
              className="text-sm text-blue-600 flex items-center gap-1"
              onClick={() => setShowAddressModal(true)}
            >
              <Pencil className="w-4 h-4" />
              Change
            </button>
          </h2>
          {defaultAddress ? (
            <p className="text-sm text-gray-600">
              <span className="border px-2 py-1 rounded-md">{defaultAddress.address_label}</span>{" "}
              {defaultAddress.house}, {defaultAddress.address}
            </p>
          ) : (
            <p className="text-sm text-red-500">No default address available.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          {cartItems.map((item) => {
            const imageList = item.service_image?.startsWith("[")
              ? JSON.parse(item.service_image)
              : [];
            return (
              <div key={item.id} className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/${imageList[0]}`}
                    alt={item.service_name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                         <div className="flex flex-col gap-1 text-sm text-gray-700 w-full">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900">
            {item.service_name}
          </h3>

          <div className="">
            <span className="font-medium text-gray-600">Addons:</span>
            {item.addons && JSON.parse(item.addons).length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {JSON.parse(item.addons).map((addon, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
                  >
                    {addon.name} ({addon.qty} {addon.price_type})
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">None</span>
            )}
          </div>

          <p>
            <span className="font-medium text-gray-600">Type:</span>{' '}            
            <span className="text-gray-800 font-medium">
              {item.rate_type === "square_feet"
                ? `${item.value} sq ft`
                : `${item.value} unit(s)`}
            </span>
          </p>

          <p>
            <span className="font-medium text-gray-600">Rate:</span>{' '}
            ₹{item.rate}
          </p>

          <p className="text-sm text-red-600 font-bold mt-1">
            Total: ₹{item.amount}
          </p>
        </div>
                </div>


              </div>
            );
          })}
          <button
            className="mt-4 w-full text-sm font-medium text-blue-600 hover:underline text-left"
            onClick={() => navigate('/cart')}
          >
            🛒 Edit Cart Items
          </button>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">🧾 Booking Summary</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span>Service Cost</span><span>₹{totalAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>SGST (9%)</span><span>₹{sgst.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>CGST (9%)</span><span>₹{cgst.toFixed(2)}</span></div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Coupon ({appliedCoupon.coupon_code})</span>
                  <span>-₹{parseFloat(appliedCoupon.discount).toFixed(2)}</span>
                </div>
              )}

              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold text-green-600">
                <span>Total Payable</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                className="text-blue-600 hover:underline text-sm"
                onClick={() => setShowCouponModal(true)}
              >
                🎟️ View Coupons & Offers
              </button>
              <span className="text-xs text-gray-500">Tap to apply</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                📅 Select Start Date:
              </label>

              <div className="relative w-full">

                <span className="absolute inset-y-0 left-3 flex items-center  pointer-events-none z-10">
                  <CalendarDays size={18} />
                </span>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="pl-10 border border-gray-300 rounded-md px-3 py-2 text-sm w-full "
                  placeholderText="Select a date"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">💳 Select Payment Method:</h4>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                Pay Online (Razorpay)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="pay_later"
                  checked={paymentMethod === "pay_later"}
                  onChange={() => setPaymentMethod("pay_later")}
                />
                Pay Later (Cash/Online)
              </label>
            </div>

            <button
              className={`mt-6 py-3 font-semibold rounded-full text-md w-full flex items-center justify-center gap-2 capitalize ${paymentMethod === "online"
                ? "bg-primary hover:bg-primary-700"
                : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              onClick={handleBooking}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : paymentMethod === "online" ? (
                "Proceed to Pay"
              ) : (
                "Book Now"
              )}
            </button>


          </div>

        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <AddressModal
          onClose={() => setShowAddressModal(false)}
          refetchDefaultAddress={fetchDefaultAddress}
        />
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <CouponModal
          cartTotal={totalAmount}
          userId={userId}
          appliedCode={appliedCoupon}
          onApply={(code) => {
            setAppliedCoupon(code);
            setShowCouponModal(false);
          }}
          onClose={() => setShowCouponModal(false)}
        />
      )}
    </div>
  );
}
