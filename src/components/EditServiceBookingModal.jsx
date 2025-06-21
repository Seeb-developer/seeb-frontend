import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../store/cartSlice";
import { ImagePlus, ChevronDown } from "lucide-react";
import axios from "axios";


const EditServiceBookingModal = ({ isOpen, onClose, serviceItem, editingItem, roomId }) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.user.token);
    const user = useSelector(state => state.user.userInfo);
    const userId = user?.id;

    const fileInputRef = useRef(null);
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [images, setImages] = useState([]);
    const [selectedAddons, setSelectedAddons] = useState({});
    const [openGroup, setOpenGroup] = useState(null);
    const [baseTotal, setBaseTotal] = useState(0);
    const [addonTotal, setAddonTotal] = useState(0);
    const [total, setTotal] = useState(0);


    useEffect(() => {
        if (editingItem && serviceItem) {
            let widthVal = 0;
            let heightVal = 0;
            let quantityVal = 0;
            let sqft = 0;

            if (serviceItem.rate_type === "square_feet") {
                const [w, h] = editingItem.value.split("X");
                widthVal = w;
                heightVal = h;
                setWidth(w);
                setHeight(h);
                sqft = w * h;
            } else {
                quantityVal = Number(editingItem.value);
                setQuantity(quantityVal);
            }

            if (editingItem?.addons) {
                const addonMap = {};
                try {
                    const parsed = JSON.parse(editingItem.addons);
                    parsed.forEach(a => {
                        addonMap[a.id] = Number(a.qty);
                    });
                } catch (e) {
                    console.error("Invalid addons data:", editingItem.addons);
                }

                setSelectedAddons(addonMap);
            }

            // Base amount
            const baseQty = editingItem.rate_type === "square_feet" ? sqft : quantityVal;
            const baseAmount = baseQty * editingItem.rate;

            setBaseTotal(Number(baseAmount));
            setAddonTotal(Number(editingItem.amount) - Number(baseAmount));
            setTotal(Number(editingItem.amount));

            // Set previously uploaded images if available
            if (editingItem.reference_image) {
                try {
                    const imgs = JSON.parse(editingItem.reference_image);
                    const formattedImages = imgs.map((imgPath) => ({
                        id: imgPath,
                        file: null,
                        url: `${import.meta.env.VITE_BASE_URL}${imgPath}`,
                    }));
                    setImages(formattedImages);
                } catch (e) {
                    console.error("Invalid reference_image:", editingItem.reference_image);
                }
            }
        }
    }, [editingItem, serviceItem]);

    useEffect(() => {
        if (!serviceItem) return;

        let baseQty = 0;

        if (serviceItem.rate_type === "square_feet") {
            baseQty = width && height ? Number(width) * Number(height) : 0;
        } else {
            baseQty = quantity;
        }

        const newBaseTotal = baseQty * serviceItem.rate;

        let newAddonTotal = 0;
        if (serviceItem.addons && serviceItem.addons.length > 0) {
            newAddonTotal = serviceItem.addons.reduce((sum, addon) => {
                const isChecked = selectedAddons.hasOwnProperty(addon.id);
                if (!isChecked && addon.is_required !== "1") return sum;

                const baseQty = addon.qty ? Number(addon.qty) : 1;
                const calculatedQty = addon.price_type === "square_feet"
                    ? Math.ceil((parseFloat(baseQty / 100)) * (width * height))
                    : selectedAddons[addon.id] || baseQty;

                selectedAddons[addon.id] = calculatedQty
                const price = addon.price || 0;
                const addonAmount = calculatedQty * price;

                return sum + addonAmount;
            }, 0);
        }

        setBaseTotal(newBaseTotal);
        setAddonTotal(newAddonTotal);
        setTotal(newBaseTotal + newAddonTotal);
    }, [width, height, quantity, selectedAddons, serviceItem]);


    const handleImageUpload = async () => {
        const newImages = images.filter(img => img.file);
        if (newImages.length === 0) return JSON.stringify(images.map(img => img.id)); // keep old images

        const formData = new FormData();
        newImages.forEach((img) => formData.append("images[]", img.file));

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}seeb-cart/uploadImages`,
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const uploadedPaths = res.data?.data?.images || [];

            const allPaths = [
                ...images.filter(img => !img.file).map(img => img.id), // existing
                ...uploadedPaths, // new
            ];

            return JSON.stringify(allPaths);
        } catch (error) {
            console.error("Image upload failed:", error);
            return null;
        }
    };


    const handleSubmit = async () => {
        try {
            const isSqFt = serviceItem.rate_type === "square_feet";
            const sqft = isSqFt ? width * height : 0;
            const value = isSqFt ? `${width}X${height}` : quantity;

            const baseQty = isSqFt ? sqft : quantity;
            const baseAmount = baseQty * serviceItem.rate;

            // Recalculate addons
            const addonDetails = serviceItem.addons.map(addon => {
                const isChecked = selectedAddons.hasOwnProperty(addon.id);
                if (!isChecked && addon.is_required !== "1") return null;

                let addonQty = selectedAddons[addon.id];
                const addonPrice = addonQty * addon.price;

                return {
                    ...addon,
                    qty: addonQty,
                    total: Number(addonPrice).toFixed(2),
                };
            }).filter(Boolean);

            const addonAmount = addonDetails.reduce((sum, a) => sum + Number(a.total), 0);
            const totalAmount = baseAmount + addonAmount;

            // Upload reference images if any
            const refImageJson = await handleImageUpload();

            // Build payload
            const payload = {
                user_id: userId,
                service_id: serviceItem.id,
                service_type_id: serviceItem.service_type_id,
                room_id: roomId,
                rate_type: serviceItem.rate_type,
                value,
                rate: serviceItem.rate,
                addons: JSON.stringify(addonDetails),
                amount: totalAmount.toFixed(2),
                ...(refImageJson && { reference_image: refImageJson }),
            };

            await fetch(`${import.meta.env.VITE_BASE_URL}seeb-cart/update/${editingItem.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            dispatch(fetchCart(userId));
            onClose();
        } catch (error) {
            alert("Failed to update booking.");
            console.error(error);
        }
    };

    const handleAddonToggle = (addonId, isChecked, addonQty) => {
        setSelectedAddons(prev => {
            if (prev[addonId]) {
                const updated = { ...prev };
                if (isChecked) delete updated[addonId];
                return updated;
            } else {
                return { ...prev, [addonId]: addonQty }; // start with qty 1
            }
        });

    };

    const handleQtyChange = (addonId, delta) => {
        setSelectedAddons(prev => {
            const currentQty = prev[addonId] || 0;
            const newQty = Math.max(1, currentQty + delta); // minimum qty = 1
            const updated = { ...prev, [addonId]: newQty };
            return updated;
        });
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl w-[90%] max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold mb-4">Edit {serviceItem.name}</h2>

                {serviceItem.rate_type === "square_feet" ? (
                    <div className="flex gap-2 mb-4">
                        <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} placeholder="Width" className="w-1/2 border rounded px-2 py-1" />
                        <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} placeholder="Height" className="w-1/2 border rounded px-2 py-1" />
                    </div>
                ) : (
                    <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} placeholder="Quantity" className="w-full border rounded px-2 py-1 mb-4" />
                )}

                {/* Value & Amount Preview */}
                <div className="text-sm mb-2">
                    Total {serviceItem.rate_type.replace("_", " ")}:{" "}
                    {serviceItem.rate_type === "square_feet"
                        ? width && height
                            ? `${width * height}`
                            : "-"
                        : quantity}
                </div>
                <div className="text-sm mb-2">Rate: ₹{serviceItem.rate}</div>


                {serviceItem.addons.length > 0 && (
                    <>
                        <h3 className="font-semibold mb-2">Select Addons</h3>
                        <div className="mb-4  h-[300px] overflow-y-scroll">
                            {serviceItem.addons.reduce((acc, addon) => {
                                const group = acc.find(g => g.name === addon.group_name);
                                if (group) {
                                    group.addons.push(addon);
                                } else {
                                    acc.push({ name: addon.group_name, addons: [addon] });
                                }
                                return acc;
                            }, []).map((group, index) => {
                                const isOpen = openGroup === index;
                                return (
                                    <div key={group.name} className="mb-3 border rounded-lg">
                                        <button
                                            type="button"
                                            onClick={() => setOpenGroup(isOpen ? null : index)}
                                            className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold flex justify-between items-center"
                                        >
                                            <span className="text-blue-600">{group.name}</span>
                                            <ChevronDown
                                                className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>

                                        {isOpen && (<div className="p-4 bg-white overflow-hidden transition-all duration-500 ease-in-out">
                                            {group.addons.map((addon) => {
                                                const isRequired = addon.is_required === "1";
                                                const isChecked = selectedAddons.hasOwnProperty(addon.id);
                                                const baseQty = addon.qty ? Number(addon.qty) : 1;
                                                const calculatedQty = addon.price_type === "square_feet"
                                                    ? Math.ceil((parseFloat(baseQty || 0) / 100) * (width * height))
                                                    : baseQty;
                                                const addonQty = isChecked ? selectedAddons[addon.id] : calculatedQty;

                                                return (
                                                    <label
                                                        key={addon.id}
                                                        className="flex justify-between items-start mb-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                                                    >
                                                        <div className="flex items-start">
                                                            <input
                                                                type="checkbox"
                                                                className="mt-1 mr-3"
                                                                checked={isRequired || isChecked}
                                                                onChange={() => handleAddonToggle(addon.id, isChecked, addonQty)}
                                                                disabled={isRequired}
                                                            />
                                                            <div className="text-sm">
                                                                <div className="font-semibold">{addon.name}</div>
                                                                <div className="text-gray-600">{addon.description}</div>
                                                                <div className="text-xs mt-1 flex items-center gap-2 flex-wrap">
                                                                    {(addon.price_type === "unit" && isChecked) ? (
                                                                        <>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleQtyChange(addon.id, -1)}
                                                                                className="bg-gray-200 px-2 rounded"
                                                                            >
                                                                                −
                                                                            </button>
                                                                            <span>{addonQty}</span>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleQtyChange(addon.id, 1)}
                                                                                className="bg-gray-200 px-2 rounded"
                                                                            >
                                                                                +
                                                                            </button>
                                                                            <span className="ml-2">
                                                                                | ₹{addon.price} per {addon.price_type.replace("_", " ")}
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <span>
                                                                            Qty: {addonQty} | ₹{addon.price} per {addon.price_type.replace("_", " ")}
                                                                        </span>
                                                                    )}
                                                                    {isRequired && (
                                                                        <span className="ml-2 text-red-500 font-medium">(Required)</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="text-sm font-semibold text-right text-gray-700 whitespace-nowrap ml-4">
                                                            ₹{(addonQty * addon.price).toFixed(2)}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        )}
                                    </div>
                                );
                            }
                            )}
                        </div>
                    </>
                )}

                <div className="text-sm text-gray-600 mb-1">
                    Base: ₹{baseTotal.toFixed(2)}
                </div>

                {(editingItem.addons.length > 0) && (<div className="text-sm text-gray-600 mb-2">
                    Addons: ₹{addonTotal.toFixed(2)}
                </div>)}

                <div className="text-lg font-semibold text-red-600 mb-4">
                    Total: ₹{total.toFixed(2)}
                </div>

                <div className="mb-4">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition flex justify-center"
                    >
                        <ImagePlus className="w-6 h-6 mr-2" />  Upload Reference Images
                    </button>
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
                                <img src={img.url || img.id} alt="preview" className="w-full h-32 object-cover rounded-lg" />
                                <button onClick={() => removeImage(img.id)} className="absolute top-1 right-1 h-6 w-6 bg-red-600 text-white p-1 rounded-full text-xs">✕</button>
                            </div>
                        ))}
                    </div>
                )}

                <button onClick={handleSubmit} className="btn-secondary btn w-full !font-bold">Update Cart</button>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">✕</button>

            </div>
        </div>
    );
};

export default EditServiceBookingModal;
