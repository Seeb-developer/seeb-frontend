import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, deleteCartItem } from "../store/cartSlice";
import { X, Edit2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditServiceBookingModal from "../components/EditServiceBookingModal";
import { useGet } from "../hooks/useGet";

const CartItem = ({ item, onDelete, onEdit }) => {

  const imageList = item.service_image?.startsWith("[")
    ? JSON.parse(item.service_image)
    : [];

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      {/* Image + Content */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {/* Image */}
        <img
          src={`${import.meta.env.VITE_BASE_URL}/${imageList[0] || "placeholder.png"}`}
          alt={item.service_name}
          className="w-24 h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0"
        />

        {/* Details */}
        <div className="flex-1 flex flex-col gap-1 text-sm text-gray-700">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">{item.service_name}</h3>

          <div>
            <span className="font-medium text-gray-600">Addons:</span>{' '}
            {item.addons && JSON.parse(item.addons).length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {JSON.parse(item.addons).map((addon, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
                  >
                    {addon.name} ({addon.qty}{" "}
                    {addon.price_type === "square_feet" ? "sq ft" : "unit(s)"})
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">None</span>
            )}
          </div>

          <p>
            <span className="font-medium text-gray-600">Type:</span>{" "}
            <span className="text-gray-800 font-medium">
              {item.rate_type === "square_feet"
                ? `${item.value} sq ft`
                : `${item.value} unit(s)`}
            </span>
          </p>

          <p>
            <span className="font-medium text-gray-600">Rate:</span> ₹{item.rate}
          </p>

          <p className="text-sm text-red-600 font-bold mt-1">
            Total: ₹{item.amount}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end self-end md:self-center">
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => onEdit(item)}
        >
          <Edit2 size={20} />
        </button>
        <button
          className="text-red-600 hover:text-red-800"
          onClick={() => onDelete(item.id)}
        >
          <X size={24} />
        </button>
      </div>
    </div>

  );
};

export default function CartPage() {
  const [showModal, setShowModal] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: cartItems, loading, error } = useSelector((state) => state.cart);
  const { data: service, seriveLoading, serviceError } = useGet(
    editingItem ? `services/${editingItem.service_id}` : null
  );

  // console.log("cartitems",cartItems);

  const user = useSelector((state) => state.user.userInfo);
  const userId = user?.id;

  useEffect(() => {
    dispatch(fetchCart(userId));
  }, [dispatch]);

  useEffect(() => {
    if (service && editingItem) {
      setSelectedService(service);
      setRoomId(editingItem.room_id);
      setShowModal(true);
    }
  }, [service, editingItem]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      dispatch(deleteCartItem(id));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setEditingItem(null);
  };


  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );

  return (
    <div className="">
      <div className="px-4 sm:px-10 py-6 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          🛒 My Cart
        </h2>

        {loading ? (
          <p className="text-center text-blue-500">Loading cart...</p>
        ) : error ? (
          <p className="text-center text-red-500">Failed to load cart.</p>
        ) : (
          <div className="flex flex-col lg:flex-row justify-between gap-8 items-start">
            <div className="flex-1">
              {cartItems.length === 0 ? (
                <p className=" text-gray-500 mb-6">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))
              )}

              <button className="btn btn-primary flex gap-2" onClick={() => { navigate("/") }}>
                {cartItems.length === 0 ? "Add Services" : "Continue Shopping"}
              </button>
            </div>

            <div className="bg-white shadow rounded-xl p-6 w-full lg:w-96">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="flex justify-between text-sm mb-2">
                <span>Total Items:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span>Total Price:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <button className="btn btn-secondary w-full" onClick={() => { navigate("/checkout") }}>
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedService && <EditServiceBookingModal
        isOpen={showModal}
        onClose={handleCloseModal}
        serviceItem={selectedService}
        roomId={roomId}
        editingItem={editingItem}
      />}

    </div>
  );
}
