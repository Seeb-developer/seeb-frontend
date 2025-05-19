import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function AddressModal({ onClose, refetchDefaultAddress, }) {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    location: "",
    flat: "",
    landmark: "",
    label: "Home",
  });
  const [saving, setSaving] = useState(false);
  const user = useSelector((state) => state.user.userInfo);
  const token = useSelector((state) => state.user.token);
  const userId = user?.id;

  const getAddressFromCoords = async (lat, lng) => {
    const apiKey = "5533abc9714e432f9983e173d20b9a7c";
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
    );
    const data = await res.json();
    return data?.results?.[0]?.formatted || "";
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const formatted = await getAddressFromCoords(latitude, longitude);
          setNewAddress((prev) => ({
            ...prev,
            location:
              formatted || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
          }));
        },
        () => {
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fetchAllAddresses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}customer-address/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  useEffect(() => {
    fetchAllAddresses();
  }, []);

  const handleSaveAddress = async () => {
    if (!newAddress.location || !newAddress.flat) {
      alert("Location and Flat No. are required");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        user_id: userId,
        house: newAddress.flat,
        address: newAddress.location,
        landmark: newAddress.landmark,
        address_label: newAddress.label,
        is_default: 1,
      };
      await axios.post(`${import.meta.env.VITE_BASE_URL}customer-address`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddForm(false);
      setNewAddress({ location: "", flat: "", landmark: "", label: "Home" });
      fetchAllAddresses();
      refetchDefaultAddress();
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}customer-address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllAddresses();
      refetchDefaultAddress();
    } catch (err) {
      alert("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}customer-address/change-default/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAllAddresses();
      refetchDefaultAddress();
    } catch (err) {
      console.error("Failed to set default address:", err);
      alert("Could not update default address.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4">My Addresses</h3>

        {addresses.length === 0 ? (
          <p className="text-gray-500 text-sm">No addresses available.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto mb-4">
            <p>Select for default Address</p>
            {addresses.map((addr) => (
              <li
                key={addr.id}
                className="flex justify-between items-start bg-gray-50 p-3 rounded-md border"
              >
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="defaultAddress"
                    checked={addr.is_default === "1"}
                    onChange={() => handleSetDefault(addr.id)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">{`${addr.house}, ${addr.address}`}</span>
                </div>
                <button
                  className="text-gray-500 hover:text-red-700"
                  onClick={() => handleDeleteAddress(addr.id)}
                >
                  <X size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {!showAddForm ? (
          <button
            className="mb-4 w-full btn btn-secondary py-2 px-4 flex justify-center items-center gap-2"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={20} /> Add Address
          </button>
        ) : (
          <div className="space-y-3 mb-4">
            <button
              className="text-sm text-blue-600 font-semibold"
              onClick={handleGetLocation}
            >
              📍 Use My Location
            </button>
            <input
              type="text"
              placeholder="📍 Location"
              value={newAddress.location}
              onChange={(e) => setNewAddress({ ...newAddress, location: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="🏠 Flat/House No."
              value={newAddress.flat}
              onChange={(e) => setNewAddress({ ...newAddress, flat: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="📝 Landmark (Optional)"
              value={newAddress.landmark}
              onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map((label) => (
                <button
                  key={label}
                  onClick={() => setNewAddress((prev) => ({ ...prev, label }))}
                  className={`text-sm px-3 py-1 rounded-md border ${newAddress.label === label
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-md"
              onClick={handleSaveAddress}
              disabled={saving}
            >
              {saving ? "Saving..." : "💾 Save Address"}
            </button>
          </div>
        )}

        <button onClick={onClose} className="absolute top-4 right-4 text-black text-2xl">
          ✕
        </button>
      </div>
    </div>
  );
}
