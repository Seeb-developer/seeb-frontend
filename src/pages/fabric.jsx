import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { Link } from "react-router-dom";

export const FloorPlan_fabric = () => {
    const canvasRef = useRef(null);

    useEffect(() => {      
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 600,
            backgroundColor: "#fff",
        });

        // Disable default rotation control
        fabric.Object.prototype.set({
            hasRotatingPoint: false,
            lockRotation: true
        });

        // Prevent objects from moving outside the canvas (handles rotation)
        canvas.on('object:moving', function(e) {
            const obj = e.target;
            if (!obj) return;
            obj.setCoords();
            const boundingRect = obj.getBoundingRect(true);
            // Clamp left
            if (boundingRect.left < 0) {
                obj.left -= boundingRect.left;
            }
            // Clamp top
            if (boundingRect.top < 0) {
                obj.top -= boundingRect.top;
            }
            // Clamp right
            if (boundingRect.left + boundingRect.width > canvas.width) {
                obj.left -= (boundingRect.left + boundingRect.width) - canvas.width;
            }
            // Clamp bottom
            if (boundingRect.top + boundingRect.height > canvas.height) {
                obj.top -= (boundingRect.top + boundingRect.height) - canvas.height;
            }
            obj.setCoords();
        });

        const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png";

        fabric.util.loadImage(imageUrl, { crossOrigin: 'anonymous' })
            .then(element => {                
                const img = new fabric.FabricImage(element, {
                    left: 100,
                    top: 100,
                    scaleX: 0.5,
                    scaleY: 0.5,
                    selectable: true,
                    hasRotatingPoint: false,
                    lockRotation: true,
                });
                // Hide the rotation control using setControlVisible
                img.setControlVisible('mtr', false);
                canvas.add(img);
                canvas.setActiveObject(img);
            })
            .catch(err => {
                console.error("Error loading image:", err);
            });

        // Expose canvas for button handler
        window._fabricCanvas = canvas;

        // Clean up on unmount
        return () => {
            canvas.dispose();
            window._fabricCanvas = undefined;
        };
    }, []);

    // Custom rotate handler
    const handleRotate = () => {
        const canvas = window._fabricCanvas;
        if (!canvas) return;
        const activeObj = canvas.getActiveObject();
        if (activeObj) {
            activeObj.rotate((activeObj.angle || 0) + 90);
            canvas.requestRenderAll();
        }
    };

    return (
        <>
            <nav className="bg-black text-white px-6 py-2 md:flex justify-between items-center hidden sticky top-0 w-full z-50">
                <div className="flex items-center space-x-3">
                    <Link to='/'><img src="/logo.png" alt="Logo" className="h-20 w-20" /></Link>
                    <div>
                        <span className="font-bold text-2xl">SEEB</span>
                        <span className="block text-gray-300 text-sm">Pune, Maharashtra</span>
                    </div>
                </div>
            </nav>
            <div className="flex justify-center items-center mt-6">
                <canvas ref={canvasRef} style={{ border: "1px solid red" }} />
            </div>
            <div className="flex justify-center mt-4">
                <button onClick={handleRotate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Rotate 90°</button>
            </div>
        </>
    );
};
