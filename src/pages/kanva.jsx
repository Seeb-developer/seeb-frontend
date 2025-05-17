import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useGet } from '../hooks/useGet';
import * as fabric from 'fabric';
import { Image, util } from 'fabric';


const FT_TO_PX = 40;

const FloorPlan = () => {
  const { roomId } = useParams();
  const canvasRef = useRef(null);

  const fabricCanvasRef = useRef(null);
  const token = useSelector((state) => state.user.token);

  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState({});
  const [baseElements, setBaseElements] = useState({});
  const [floorSize, setFloorSize] = useState({ width: 400, height: 400 });
  const [selectedObject, setSelectedObject] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [elementCounts, setElementCounts] = useState({});

  const { data: roomElements } = useGet(`assets/room/${roomId}`);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#fff',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;

    canvas.on('selection:created', (e) => {
      setSelectedObject(e.target);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.target);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {

    const loadItem = async (url) => {
      try {

        const element = await util.loadImage(url, {crossOrigin: 'anonymous'});

        if (!element) throw new Error("Image element could not be loaded.");

        // We return both the fabric image and raw element
        return { img: new Image(element), element };
      } catch (err) {
        console.error("Error loading image:", err.message);
        return null;
      }
    };


    if (roomElements) {
      const loadItems = async () => {
        const newItems = {};
        const baseMap = {};

        console.log("roomElements", roomElements);

        for (const el of roomElements) {
          const { img, element } = await loadItem(`${import.meta.env.VITE_BASE_URL}${el.file}`) || {};

          if (!img || !element) continue;

          const id = el.title.toLowerCase();
          const width = parseFloat(el.width) * FT_TO_PX;
          const height = parseFloat(el.length) * FT_TO_PX;

          baseMap[id] = {
            width,
            height,
            image: img,
            element,
            imgSrc: `${import.meta.env.VITE_BASE_URL}${el.file}`,
          };

          newItems[id] = { width, height, image: img, element };
        }

        console.log("baseMap", baseMap);


        setItems(newItems);
        setBaseElements(baseMap);
      };

      loadItems();
    }
  }, [roomElements]);

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setFloorSize((prev) => ({ ...prev, [name]: value * FT_TO_PX }));
  };

  const handleAddElement = (baseId, baseItem) => {
      console.log("baseId, baseItem",baseId, baseItem)

    setElementCounts((prevCounts) => {
      const newCount = (prevCounts[baseId] || 0) + 1;
      const newId = `${baseId}-${newCount}`;

      const imgElement = new fabric.Image(baseItem.element, {
        left: 150,
        top: 150,
        width: baseItem.width,
        height: baseItem.height,
        hasControls: true,
        hasBorders: true,
        selectable: true,
        objectCaching: false,
        name: newId,
      });

      console.log("imgElement",imgElement);

      
    fabricCanvasRef.current.add(imgElement);
    fabricCanvasRef.current.setActiveObject(imgElement);

      return {
        ...prevCounts,
        [baseId]: newCount,
      };
    });
  };



  const handleDeleteElement = () => {
    if (selectedObject) {
      fabricCanvasRef.current.remove(selectedObject);
      setSelectedObject(null);
    }
  };

  const pxToFt = (px) => (px / FT_TO_PX).toFixed(1);
  const width = floorSize.width;
  const height = floorSize.height;
  const colCount = Math.floor(width / 80) + (width % 80 !== 0 ? 1 : 0);
  const rowCount = Math.floor(height / 80) + (height % 80 !== 0 ? 1 : 0);

  const searchFilteredItems = Object.entries(baseElements).filter(([id]) =>
    id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    const canvasElement = canvasRef.current;
    const canvasClone = canvasElement.cloneNode(true);
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.appendChild(canvasClone);
    document.body.appendChild(container);

    const canvasData = await html2canvas(canvasClone);
    const imgData = canvasData.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvasData.width, canvasData.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvasData.width, canvasData.height);
    pdf.save('floorplan.pdf');

    document.body.removeChild(container);
    setIsDownloading(false);
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

      <div className="flex p-6 bg-gray-100">
        <div className="w-64 bg-white shadow-lg rounded-xl p-4 mr-4 overflow-y-auto">
          <input
            type="text"
            placeholder="Search elements..."
            className="w-full mb-4 px-3 py-2 border rounded-md"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="space-y-3">
            {searchFilteredItems.map(([id, item]) => (
              <div
                key={id}
                onClick={() => handleAddElement(id, item)}
                className="cursor-pointer p-2 border rounded-lg hover:bg-gray-100 flex items-center gap-3"
              >
                <img src={item.imgSrc} alt={id} className="w-10 h-10 object-contain" />
                <div>
                  <div className="font-semibold capitalize">{id}</div>
                  <div className="text-sm text-gray-600">{pxToFt(item.width)}ft x {pxToFt(item.height)}ft</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center w-full">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8"> 🏠 Interior Floor Planner </h1>

          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2">
              Length (ft):
              <input
                type="number"
                name="width"
                value={pxToFt(floorSize.width)}
                onChange={handleDimensionChange}
                className="border px-2 py-1 rounded w-20"
              />
            </label>
            <label className="flex items-center gap-2">
              Width (ft):
              <input
                type="number"
                name="height"
                value={pxToFt(floorSize.height)}
                onChange={handleDimensionChange}
                className="border px-2 py-1 rounded w-20"
              />
            </label>
          </div>

          <div className="relative" style={{ width: width + 28, height: height + 28 }}>
            {/* Walls and floor */}
            <svg
              width={width + 28}
              height={height + 28}
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            >
              <rect x="0" y="0" width={width + 28} height={height + 28} fill="black" />
              <rect x="1" y="1" width={width + 26} height={height + 26} fill="#eee" />
              <rect x="13" y="13" width={width + 2} height={height + 2} fill="black" />
              <rect x="14" y="14" width={width} height={height} fill="white" />
            </svg>

            {/* Grid */}
            <div
              className="absolute top-[14px] left-[14px] z-30 overflow-hidden"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                display: "grid",
                gridTemplateColumns: `repeat(${colCount}, 80px)`,
                gridTemplateRows: `repeat(${rowCount}, 80px)`,
                pointerEvents: "none",
              }}
            >
              {Array.from({ length: colCount * rowCount }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #ccc",
                    width: "80px",
                    height: "80px",
                    boxSizing: "border-box",
                  }}
                />
              ))}
            </div>

            {/* Fabric.js Canvas */}
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="absolute top-[14px] left-[14px] z-40"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleDeleteElement}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              disabled={!selectedObject}
            >
              Delete Selected
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading..." : "Download PDF"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloorPlan;

