import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../store/cartSlice";
import { ImagePlus } from "lucide-react";

const ServiceBookingModal = ({ isOpen, onClose, selectedService, roomId, editingItem }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const { postData, loading } = usePost("seeb-cart/save");

    const token = useSelector((state) => state.user.token);
    const user = useSelector((state) => state.user.userInfo);
    const userId = user?.id;

    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [images, setImages] = useState([]);

    const [selectedAddons, setSelectedAddons] = useState([]);

    useEffect(() => {
        if (selectedService?.addons?.length) {
            const requiredAddons = selectedService.addons
                .filter(addon => addon.is_required === "1")
                .map(addon => addon.id);
            setSelectedAddons(requiredAddons);
        }
    }, [selectedService]);


    useEffect(() => {
        if (editingItem) {
            // console.log("Editing Item:", editingItem);

            if (selectedService.rate_type === "square_feet") {
                const [w, h] = editingItem.value.split("X").map(Number);
                setWidth(w);
                setHeight(h);
            } else {
                setQuantity(Number(editingItem.value));
            }

            // Load previous images if any
            if (editingItem.reference_image) {
                const savedImages = JSON.parse(editingItem.reference_image).map((url, idx) => ({
                    id: `existing-${idx}`,
                    file: null,
                    url: `${import.meta.env.VITE_BASE_URL}/${url}`,
                }));
                setImages(savedImages);
            }
        }
    }, [editingItem]);



    if (!isOpen) return null;

    const totalSquareFeet = width * height;
    const value = selectedService.rate_type === "square_feet" ? totalSquareFeet : quantity;
    const amount = value * selectedService.rate;

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };

    const handleFiles = (files) => {
        const imageFiles = files.filter((file) => file.type.startsWith("image/"));
        const imagePreviews = imageFiles.map((file) => ({
            id: URL.createObjectURL(file),
            file,
        }));
        setImages((prev) => [...prev, ...imagePreviews]);
    };

    const handleFileChange = (e) => {
        handleFiles(Array.from(e.target.files));
    };

    const removeImage = (id) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
    };

    const handleSubmit = async () => {
        try {
            let referenceImagesJson = null;

            if (
                selectedService.rate_type === "square_feet" &&
                (!width || !height || width <= 0 || height <= 0)
            ) {
                alert("Please enter valid width and height.");
                return;
            }

            // ✅ Upload images only if selected
            if (images.length > 0) {
                const formData = new FormData();
                images.forEach((img) => {
                    formData.append("images[]", img.file); // key: "images[]"
                });

                const uploadRes = await fetch(`${import.meta.env.VITE_BASE_URL}seeb-cart/uploadImages`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                const uploadResult = await uploadRes.json();
                if (!uploadRes.ok) throw new Error("Image upload failed");

                const imagePaths = uploadResult.data || [];
                referenceImagesJson = JSON.stringify(imagePaths.images);
            }

            // 🧾 Booking payload
            let value;
            if (selectedService.rate_type === "square_feet") {
                value = `${width}X${height}`; // Save as "widthXheight" string
            } else {
                value = quantity; // Save number directly
            }

            const totalSquareFeet = width * height; // for amount calculation only
            const amount = (selectedService.rate_type === "square_feet"
                ? totalSquareFeet
                : quantity) * selectedService.rate;

            console.log("selectedAddons", selectedAddons)

            const bookingData = {
                user_id: userId,
                service_id: selectedService.id,
                service_type_id: selectedService.service_type_id,
                room_id: roomId,
                rate_type: selectedService.rate_type,
                value,
                rate: selectedService.rate,
                addons: selectedService.addons
                    .filter(addon => selectedAddons.includes(addon.id))
                    .map(addon => ({
                        id: addon.id,
                        price: addon.price,
                        qty: addon.qty,
                        name: addon.name
                    })),
                amount: amount.toFixed(2),
                ...(referenceImagesJson && { reference_image: referenceImagesJson })
            };

            if (editingItem) {
                await fetch(`${import.meta.env.VITE_BASE_URL}seeb-cart/update/${editingItem.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(bookingData),
                });
            } else {
                await postData(bookingData);
            }

            onClose();
            dispatch(fetchCart(user?.id));
            // navigate("/cart");

        } catch (err) {
            console.error("Booking submission failed:", err);
            alert("Something went wrong. Please try again.");
        }
    };

    const handleAddonChange = (addonId, isRequired) => {
        if (isRequired) return; // prevent unchecking required addons
        setSelectedAddons((prev) =>
            prev.includes(addonId)
                ? prev.filter((id) => id !== addonId)
                : [...prev, addonId]
        );
    };


    return (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex justify-center items-center z-50 !mt-0" onClick={onClose}>
            <div className="bg-white rounded-xl w-[90%] max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>

                <h2 className="text-lg font-bold mb-3">Book {selectedService.name}</h2>

                {selectedService.rate_type === "square_feet" ? (
                    <>
                        <label className="block mb-2 text-sm font-medium">SQUARE FEET:</label>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="number"
                                placeholder="Width (ft)"
                                className="border rounded-md px-3 py-2 w-1/2 text-sm"
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                            />
                            <input
                                type="number"
                                placeholder="Height (ft)"
                                className="border rounded-md px-3 py-2 w-1/2 text-sm"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <label className="block mb-2 text-sm font-medium">
                            {selectedService.rate_type.replace("_", " ").toUpperCase()}:
                        </label>
                        <input
                            type="number"
                            placeholder={`Enter ${selectedService.rate_type.replace("_", " ")}`}
                            className="border rounded-md px-3 py-2 w-full text-sm mb-4"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </>
                )}




                {/* Value & Amount Preview */}
                <div className="text-sm mb-2">
                    Total {selectedService.rate_type.replace("_", " ")}:{" "}
                    {selectedService.rate_type === "square_feet"
                        ? width && height
                            ? `${width * height}`
                            : "-"
                        : quantity}
                </div>
                <div className="text-sm mb-2">Rate: ₹{selectedService.rate}</div>

                <div className="text-lg font-semibold text-red-600 mb-4">
                    Total: ₹
                    {selectedService.rate_type === "square_feet"
                        ? (width * height * selectedService.rate).toFixed(2)
                        : (quantity * selectedService.rate).toFixed(2)}
                </div>

                {selectedService?.addons?.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Select Addons</h3>

                        {selectedService.addons.reduce((acc, addon) => {
                            const group = acc.find(g => g.name === addon.group_name);
                            if (group) {
                                group.addons.push(addon);
                            } else {
                                acc.push({ name: addon.group_name, addons: [addon] });
                            }
                            return acc;
                        }, []).map(group => (
                            <div key={group.name} className="mb-3">
                                <h4 className="text-sm font-bold mb-1 text-blue-600">{group.name}</h4>
                                {group.addons.map((addon) => {
                                    const isRequired = addon.is_required === "1";
                                    const isChecked = selectedAddons.includes(addon.id);

                                    return (
                                        <label
                                            key={addon.id}
                                            className="flex items-start mb-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                className="mt-1 mr-3"
                                                checked={isChecked}
                                                onChange={() => handleAddonChange(addon.id, isRequired)}
                                                disabled={isRequired}
                                            />
                                            <div className="text-sm">
                                                <div className="font-semibold">{addon.name}</div>
                                                <div className="text-gray-600">{addon.description}</div>
                                                <div className="text-xs mt-1">
                                                    Qty: {addon.qty} | ₹{addon.price} per {addon.price_type.replace("_", " ")}
                                                    {isRequired && <span className="ml-2 text-red-500 font-medium">(Required)</span>}
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}

                <div
                    className="border-2 border-dashed border-blue-400 rounded-xl p-6 text-center text-blue-600 cursor-pointer mb-4"
                    onClick={() => fileInputRef.current.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <div className="flex justify-center mb-2">
                        <ImagePlus className="w-6 h-6 text-blue-600" />

                    </div>
                    <span className="text-sm">Tap or Drag & Drop to Upload Reference Images</span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        {images.map((img) => (
                            <div key={img.id} className="relative group">
                                {/* <img src={img.id} alt="Uploaded" className="w-full h-32 object-cover rounded-lg" /> */}
                                <img src={img.url || img.id} alt="Uploaded" className="w-full h-32 object-cover rounded-lg" />
                                <button
                                    onClick={() => removeImage(img.id)}
                                    className="absolute top-1 right-1 h-6 w-6 bg-red-600 text-white p-1 rounded-full text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    className="btn-secondary btn w-full !font-bold"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add To Cart"}
                </button>

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">✕</button>
            </div>
        </div>
    );
};

export default ServiceBookingModal;
