import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updateUserInfo } from "../store/userSlice"; 

const ProfileSettings = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ location: "", flat: "", landmark: "", label: "Home" });
  const [savingAddress, setSavingAddress] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const dispatch = useDispatch();  

  const user = useSelector((state) => state.user.userInfo);
  const token = useSelector((state) => state.user.token);
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchAddresses();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}customer/getCustomerById/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data[0];
      setFullName(data?.name || "");
      setEmail(data?.email || "");
      setPhone(data?.mobile_no || "");
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}customer-address/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}customer/updateCustomer/${userId}`, {
        name: fullName,
        email,
        mobile_no: phone,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
      dispatch(updateUserInfo({ name: fullName, email: email }));
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Something went wrong!");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}customer-address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAddresses();
    } catch (err) {
      alert("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}customer-address/change-default/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAddresses();
    } catch (err) {
      alert("Failed to set default address");
    }
  };

  const handleSaveAddress = async () => {
    if (!newAddress.location || !newAddress.flat) {
      alert("Location and Flat No. are required");
      return;
    }
    try {
      setSavingAddress(true);
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
      fetchAddresses();
    } catch (err) {
      alert("Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const apiKey = "5533abc9714e432f9983e173d20b9a7c"; // Your OpenCageData API key
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
            const data = await response.json();
            const formattedAddress = data?.results?.[0]?.formatted || "";
            
            if (formattedAddress) {
              setNewAddress((prev) => ({
                ...prev,
                location: formattedAddress,
              }));
            } else {
              alert("Unable to fetch address. Please enter manually.");
            }
          } catch (error) {
            console.error("Failed to fetch address from OpenCage:", error);
            alert("Failed to fetch address. Please try again later.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Location access denied or unavailable.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  

  return (
    <div className="mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h2>

      {/* Profile Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            disabled
            className="w-full border border-gray-300 bg-gray-100 rounded-md px-4 py-2 text-gray-500"
          />
        </div>
      </div>

      {/* Save Profile Button */}
      <div className="text-right mb-10">
        <button
          onClick={handleSaveProfile}
          className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 transition"
        >
          Save Changes
        </button>
      </div>

      {/* Address Management Section */}
      <div className="bg-white rounded-md shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">My Addresses</h3>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              ➕ Add Address
            </button>
          )}
        </div>

        {/* Add Address Form */}
        {showAddForm && (
  <div className="space-y-3 mb-6">
    <div className="flex justify-between items-center">
      <button
        onClick={handleGetLocation}
        className="text-blue-600 underline text-sm"
      >
        📍 Use My Location
      </button>
    </div>
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

    {/* Address Label Selection */}
    <div className="flex gap-2">
      {["Home", "Work", "Other"].map((label) => (
        <button
          key={label}
          onClick={() => setNewAddress((prev) => ({ ...prev, label }))}
          className={`text-sm px-3 py-1 rounded-md border ${
            newAddress.label === label
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>

    {/* Save and Cancel Buttons */}
    <div className="flex justify-end gap-4">
      <button
        onClick={() => setShowAddForm(false)}
        className="text-gray-600 underline"
      >
        Cancel
      </button>
      <button
        onClick={handleSaveAddress}
        disabled={savingAddress}
        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
      >
        {savingAddress ? "Saving..." : "Save Address"}
      </button>
    </div>
  </div>
)}

        {/* Address List */}
        {addresses.length === 0 ? (
          <p className="text-gray-500 text-sm">No addresses available.</p>
        ) : (
          <ul className="space-y-4">
            {addresses.map((addr) => (
              <li key={addr.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="defaultAddress"
                    checked={addr.is_default === "1"}
                    onChange={() => handleSetDefault(addr.id)}
                    className="mt-1"
                  />
                  <span className="text-sm">{`${addr.house}, ${addr.address}`}</span>
                </div>
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
