export default function RazorpayPayment(orderDetails, onSuccess, onFailure) {
  console.log("RazorpayPayment", orderDetails);
  
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: orderDetails.amount,
    currency: "INR",
    name: "Seeb Interiors",
    description: "Service Booking Payment",
    order_id: orderDetails.razorpay_order,
    handler: (response) => {
      console.log("Payment Success:", response);
      onSuccess?.(response);
    },
    prefill: {
      name: orderDetails.name,
      email: orderDetails.email,
      contact: orderDetails.contact,
    },
    notes: {
      booking_id: orderDetails.booking_id,
    },
    theme: {
      color: "#f97316",
    },
    modal: {
      ondismiss: () => {
        onFailure?.();
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
