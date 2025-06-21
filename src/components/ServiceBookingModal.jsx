import React, { useState, useRef, useEffect } from "react";
import { usePost } from "../hooks/usePost";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../store/cartSlice";
import { ImagePlus, ChevronDown } from "lucide-react";

const ServiceBookingModal = ({ isOpen, onClose, selectedService, roomId }) => {
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
    const [selectedAddons, setSelectedAddons] = useState({});
    const [openGroup, setOpenGroup] = useState(null);

    useEffect(() => {
        if (selectedService?.addons?.length > 0 && width && height) {
            const area = width * height; // in square feet
            const updatedAddons = {};

            // console.log("selectedService.addons", selectedService.addons);

            selectedService.addons.forEach((addon) => {
                const isRequired = addon.is_required === "1";

                // fallback to 1 if addon.qty is not set
                const baseQty = addon.qty ? Number(addon.qty) : 1;

                const calculatedQty = addon.price_type === "square_feet"
                    ? Math.max(1, Math.floor((baseQty / 100) * area))
                    : baseQty;

                if (isRequired || selectedAddons.hasOwnProperty(addon.id)) {
                    updatedAddons[addon.id] = calculatedQty;
                }
            });

            setSelectedAddons(updatedAddons); // only selected or required
        }
    }, [selectedService, width, height]);

    if (!isOpen) return null;


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
                value = `${width}X${height}`; 
            } else {
                value = quantity;
            }

            // console.log("selectedService.addons",selectedService.addons);
            // console.log("selectedAddons",selectedAddons);            
            
            const selectedAddonDetails = (selectedService.addons || [])
                .filter(addon => addon.is_required === "1" || selectedAddons.hasOwnProperty(addon.id))
                .map(addon => {
                    const addonQty = selectedAddons[addon.id] ?? (addon.qty ? Number(addon.qty) : 1);

                    // console.log("addonQty",addonQty);
                    
                    let totalQty = addonQty;
                    // if (addon.price_type === "square_feet") {
                    //     const totalSqFt = width * height;
                    //     totalQty = (addonQty / 100) * totalSqFt;
                    // }

                    const totalPrice = totalQty * addon.price;

                    return {
                        id: addon.id,
                        name: addon.name,
                        price: addon.price,
                        price_type: addon.price_type,
                        qty: totalQty,
                        description: addon.description,
                        group_name: addon.group_name,
                        is_required: addon.is_required,
                        total: totalPrice.toFixed(2),
                    };
                });

                // console.log("AddonDetail",selectedAddonDetails);

            const bookingData = {
                user_id: userId,
                service_id: selectedService.id,
                service_type_id: selectedService.service_type_id,
                room_id: roomId,
                rate_type: selectedService.rate_type,
                value,
                rate: selectedService.rate,
                addons: selectedAddonDetails,
                amount: total,
                ...(referenceImagesJson && { reference_image: referenceImagesJson })
            };


            await postData(bookingData);

            dispatch(fetchCart(user?.id));
            onClose();

            // navigate("/cart");

        } catch (err) {
            console.error("Booking submission failed:", err);
            alert("Something went wrong. Please try again.");
        }
    };

    const handleAddonChange = (addonId, isRequired, addonQty) => {
        setSelectedAddons(prev => {
            if (prev[addonId]) {
                const updated = { ...prev };
                if (!isRequired) delete updated[addonId];
                return updated;
            } else {
                return { ...prev, [addonId]: addonQty };
            }
        });
    };

    const updateAddonQty = (addonId, delta) => {
        setSelectedAddons(prev => {
            const currentQty = prev[addonId] || 0;
            const newQty = Math.max(1, currentQty + delta);
            const updated = { ...prev, [addonId]: newQty };
            return updated;
        });
    };

    console.log("images",images);

    // Calculate base price
    const baseTotal = selectedService.rate_type === "square_feet"
        ? width * height * selectedService.rate
        : quantity * selectedService.rate;

    // Calculate addon total

    // console.log("selected addon", selectedAddons);

    const addonTotal = Object.entries(selectedAddons).reduce((sum, [addonId, addonQty]) => {
        const addon = selectedService.addons.find(a => a.id === addonId);
        if (!addon) return sum;

        const qty = addonQty || 1;
        const price = Number(addon.price) || 0;

        // console.log("addonTotal qty", qty, "area", width * height, "price", price, "sum",)

        // if (addon.price_type === "square_feet") {
        //     return sum + (Math.ceil((parseFloat(qty || 0) / 100) * (width * height)) * price);
        // } else {
            return sum + qty * price;
        // }
    }, 0);

    // Final total
    const total = baseTotal + addonTotal;

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

                {selectedService?.addons.length > 0 && (
                    <>
                        <h3 className="font-semibold mb-2">Select Addons</h3>

                        <div className="mb-4 h-[300px] overflow-y-scroll">

                            {selectedService.addons.reduce((acc, addon) => {
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

                                        {isOpen && (
                                            <div className="p-4 bg-white overflow-hidden transition-all duration-500 ease-in-out">
                                                {group.addons.map((addon) => {
                                                    const isRequired = addon.is_required === "1";
                                                    const isChecked = selectedAddons.hasOwnProperty(addon.id);
                                                    const baseQty = addon.qty ? Number(addon.qty) : 1;
                                                    const calculatedQty = addon.price_type === "square_feet"
                                                        ? Math.ceil((parseFloat(baseQty || 0) / 100) * (width * height))
                                                        : baseQty;

                                                    const addonQty = isChecked ? selectedAddons[addon.id] : calculatedQty;

                                                    // console.log( "addonQty", addonQty, "area", width * height, "selectedAddon", selectedAddons[addon.id]);

                                                    return (
                                                        <label
                                                            key={addon.id}
                                                            className="flex justify-between items-start mb-3 border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                                                        >
                                                            <div className="flex items-start">
                                                                <input
                                                                    type="checkbox"
                                                                    className="mt-1 mr-3"
                                                                    checked={isRequired || isChecked}
                                                                    onChange={() => handleAddonChange(addon.id, isRequired, addonQty)}
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
                                                                                    onClick={() => updateAddonQty(addon.id, -1)}
                                                                                    className="bg-gray-200 px-2 rounded"
                                                                                >
                                                                                    −
                                                                                </button>
                                                                                <span>{addonQty}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => updateAddonQty(addon.id, 1)}
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
                                                                                {addon.price_type.replace("_", " ").replace(/^./, c => c.toUpperCase())}: {addonQty} | Rate: ₹{addon.price}
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
                            })}
                        </div>
                    </>
                )}

                <div className="text-sm text-gray-600 mb-1">
                    Base: ₹{baseTotal.toFixed(2)}
                </div>

                {(selectedService?.addons.length > 0) && (<div className="text-sm text-gray-600 mb-2">
                    Addons: ₹{addonTotal.toFixed(2)}
                </div>)}

                <div className="text-lg font-semibold text-red-600 mb-4">
                    Total: ₹{total.toFixed(2)}
                </div>

                {/* <div
                    className="border-2 border-dashed border-blue-400 rounded-xl p-6 text-center text-blue-600 cursor-pointer mb-4"
                    onClick={() => fileInputRef.current.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                > */}
                {/* <div className="flex justify-center mb-2">
                        <ImagePlus className="w-6 h-6 text-blue-600" />
                    </div> */}
                {/* <span className="text-sm">Tap or Drag & Drop to Upload Reference Images</span> */}
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

                {/* </div> */}

                {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        {images.map((img) => (
                            <div key={img.id} className="relative group">
                                <img src={img.url || img.id} alt="Uploaded" className="w-full h-24 object-cover rounded-lg" />
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
