
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useGet } from '../hooks/useGet';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const FT_TO_PX = 40;

const FloorPlan = () => {
  const { roomId } = useParams();
  const floorRef = useRef(null);
  const stageRef = useRef(null);
  const token = useSelector((state) => state.user.token);

  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState({});
  const [baseElements, setBaseElements] = useState({});
  const [floorSize, setFloorSize] = useState({ width: 400, height: 400 });
  const [selectedId, setSelectedId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [elementCounts, setElementCounts] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  const { data: roomElements } = useGet(`assets/room/${roomId}`);

  useEffect(() => {
    const loadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        // img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };

    if (roomElements) {
      const loadImages = async () => {
        const newItems = {};
        const baseMap = {};

        for (const el of roomElements) {
          const img = await loadImage(`${import.meta.env.VITE_BASE_URL}${el.file}`);
          const id = el.title.toLowerCase();
          baseMap[id] = {
            width: parseFloat(el.width) * FT_TO_PX,
            height: parseFloat(el.length) * FT_TO_PX,
            image: img,
            imgSrc: `${import.meta.env.VITE_BASE_URL}${el.file}`,
          };

          newItems[id] = {
            x: 100,
            y: 100,
            width: parseFloat(el.width) * FT_TO_PX,
            height: parseFloat(el.length) * FT_TO_PX,
            rotation: 0,
            image: img,
            ref: React.createRef(),
          };
        }

        console.log("Base Map:", baseMap);
        console.log("New Items:", newItems);

        setItems(newItems);
        setBaseElements(baseMap);
      };

      loadImages();
    }
  }, [roomElements]);

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setFloorSize((prev) => ({ ...prev, [name]: value * FT_TO_PX }));
  };

  const handleDragResize = (id, newData) => {
    setItems((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...newData,
      },
    }));
  };

  const handleAddElement = (baseId, baseItem) => {
    setElementCounts((prevCounts) => {
      const newCount = (prevCounts[baseId] || 0) + 1;
      const newId = `${baseId}-${newCount}`;
      setItems((prevItems) => ({
        ...prevItems,
        [newId]: {
          ...baseItem,
          x: 150,
          y: 150,
          ref: React.createRef(),
        },
      }));
      return {
        ...prevCounts,
        [baseId]: newCount,
      };
    });
  };

  const handleDeleteElement = (id) => {
    setItems((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    if (selectedId === id) setSelectedId(null);
  };


  const pxToFt = (px) => (px / FT_TO_PX);
  const width = floorSize.width;
  const height = floorSize.height;
  const colCount = Math.floor(width / 80) + (width % 80 !== 0 ? 1 : 0);
  const rowCount = Math.floor(height / 80) + (height % 80 !== 0 ? 1 : 0);



  // const handleDownloadPDF = async () => {
  //   const rotateButtons = document.querySelectorAll(".rotate-button");
  //   const deleteButtons = document.querySelectorAll(".delete-button");

  //   [...rotateButtons, ...deleteButtons].forEach((btn) => {
  //     btn.dataset.originalDisplay = btn.style.display || "flex";
  //     btn.style.display = "none";
  //   });

  //   const canvas = await html2canvas(floorRef.current, {
  //     backgroundColor: null,
  //     useCORS: true,
  //     scale: 2,
  //   });

  //   // Restore button visibility after capture
  //   [...rotateButtons, ...deleteButtons].forEach((btn) => {
  //     btn.style.display = btn.dataset.originalDisplay || "flex";
  //   });

  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF({
  //     orientation: canvas.width > canvas.height ? "landscape" : "portrait",
  //     unit: "px",
  //     format: [canvas.width + 100, canvas.height + 100],
  //   });

  //   const x = (pdf.internal.pageSize.getWidth() - canvas.width) / 2;
  //   const y = (pdf.internal.pageSize.getHeight() - canvas.height) / 2;

  //   pdf.addImage(imgData, "PNG", x, y, canvas.width, canvas.height);
  //   pdf.save("floorplan.pdf");
  // };

  const uploadCanvasToBackend = async (canvas, token) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("images[]", blob, "floorplan.png");

        try {
          const uploadRes = await fetch(`${import.meta.env.VITE_BASE_URL}seeb-cart/uploadImages`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          const uploadResult = await uploadRes.json();
          if (!uploadRes.ok || !uploadResult.data) throw new Error("Image upload failed");

          const imageUrl = uploadResult.data?.images?.[0];
          if (!imageUrl) throw new Error("No image returned");
          resolve(imageUrl);
        } catch (error) {
          reject(error);
        }
      }, "image/png");
    });
  };

  const getObjectListFromGPT = async (imageUrl) => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a floor plan analysis expert. Your job is to extract a structured JSON layout from floor plan images.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze the following top-down floor plan image.\nReturn only a JSON array of visible furniture objects, with each object described using:\n- \"type\": the kind of furniture (e.g., \"bed\", \"wardrobe\")\n- \"position\": rough location in the room (e.g., \"top left\", \"bottom center\")\n- \"size\": estimated size in feet, if available (e.g., \"6x6 ft\")\n- \"facing\": direction the object is facing (e.g., \"facing the door\", \"toward the wardrobe\", \"toward bottom\")\n- \"neighbors\": nearby or adjacent objects (e.g., \"next to bed\", \"between table and wardrobe\")\nStrictly follow the visual layout. Only include objects that are clearly visible. Output a valid JSON array. Do not add commentary or explanations.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `${import.meta.env.VITE_BASE_URL}${imageUrl}`,
                },
              },
            ],
          },
        ],
      }),
    });

    const result = await response.json();
    let gptMessage = result.choices[0].message.content;

    // Remove markdown code block wrapper if present
    if (gptMessage.startsWith("```json")) {
      gptMessage = gptMessage.replace(/^```json\s*|\s*```$/g, "");
    }

    try {
      const objects = JSON.parse(gptMessage.trim());
      console.log("🧠 GPT Object List:", objects);
      return objects;
    } catch (err) {
      console.error("❌ Failed to parse GPT JSON:", gptMessage);
      return [];
    }
  };

  const buildDallePrompt = (objects) => {
    const objectDescriptions = objects.map(obj => {
      const size = obj.size || "unknown size";
      const type = obj.type || "object";
      const position = obj.position || "unknown position";
      const facing = obj.facing ? `, facing ${obj.facing}` : "";

      let neighbors = "";
      if (Array.isArray(obj.neighbors) && obj.neighbors.length > 0) {
        neighbors = `, near ${obj.neighbors.join(" and ")}`;
      } else if (typeof obj.neighbors === "string") {
        neighbors = `, near ${obj.neighbors}`;
      }

      return `${size} ${type} placed at the ${position}${facing}${neighbors}`;
    }).join(", ");

    return (
      `Generate a photorealistic 3D image of a modern master bedroom layout from a corner perspective. ` +
      `Place only the following objects in the exact described configuration: ${objectDescriptions}. ` +
      `Do not include any additional furniture or decorations. ` +
      `Ensure object sizes, spacing, orientation, and layout are accurate and realistic.`
    );
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      const actualCanvas = await html2canvas(floorRef.current, {
        backgroundColor: null,
        useCORS: true,
        scale: 2,
      });

      const actualImgData = actualCanvas.toDataURL("image/png");

      // const uploadedImageUrl = await uploadCanvasToBackend(actualCanvas, token);
      // console.log("🖼️ Uploaded Image URL:", uploadedImageUrl);

      // const objects = await getObjectListFromGPT(uploadedImageUrl);
      // console.log("🧠 Objects from GPT:", objects);

      // const dallePrompt = buildDallePrompt(objects);
      // console.log("🖼️ Prompt for DALL·E:", dallePrompt);

      // const dalleResponse = await fetch("https://api.openai.com/v1/images/generations", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      //   },
      //   body: JSON.stringify({
      //     model: "dall-e-3",
      //     prompt: dallePrompt,
      //     n: 1,
      //     size: "1024x1024",
      //   }),
      // });

      // const dalleData = await dalleResponse.json();
      // const imageUrl = dalleData.data[0]?.url;
      // if (!imageUrl) throw new Error("Image generation failed");

      // const aiImage = new Image();
      // aiImage.crossOrigin = "anonymous";
      // aiImage.src = imageUrl;
      // await new Promise((resolve, reject) => {
      //   aiImage.onload = resolve;
      //   aiImage.onerror = reject;
      // });

      // const aiCanvas = document.createElement("canvas");
      // aiCanvas.width = aiImage.width;
      // aiCanvas.height = aiImage.height;
      // const ctx = aiCanvas.getContext("2d");
      // ctx.drawImage(aiImage, 0, 0);
      // const aiImgData = aiCanvas.toDataURL("image/png");

      const pdfWidth = 1200;
      const pdfHeight = 900;
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [pdfWidth, pdfHeight],
      });

      const imageWidth = (pdfWidth - 60) / 2;
      const imageHeight = imageWidth;
      const marginX = 30;
      const marginY = (pdfHeight - imageHeight) / 2;

      pdf.setFontSize(16);
      pdf.text("Actual Floor Plan", marginX + imageWidth / 2, marginY - 10, { align: "center" });
      pdf.addImage(actualImgData, "PNG", marginX, marginY, imageWidth, imageHeight);

      // pdf.text("AI-Generated Design", marginX + imageWidth + marginX + imageWidth / 2, marginY - 10, { align: "center" });
      // pdf.addImage(aiImgData, "PNG", marginX + imageWidth + marginX, marginY, imageWidth, imageHeight);

      pdf.save("comparison_floorplan.pdf");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsDownloading(false);
    }
  };
  const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const searchFilteredItems = Object.entries(baseElements).filter(([id]) =>
    id.toLowerCase().includes(searchTerm.toLowerCase())
  );


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

          <div ref={floorRef} className="flex flex-col items-center gap-3" style={{ width: floorSize.width + 100, height: floorSize.height + 110 }}>

            <div className="text-base font-bold text-gray-600 mb-2">
              Floor Plan: {pxToFt(floorSize.width)}ft x {pxToFt(floorSize.height)}ft
            </div>

            {/* Wall and Grid Container */}
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
                      border: "1px solid #F8F8F8",
                      boxSizing: "border-box",
                    }}
                  />
                ))}
              </div>

              {/* Konva Canvas */}
              <div
                className="absolute top-[14px] left-[14px] z-30 "
                style={{ width: width, height: height }}
              >
                <Stage
                  width={floorSize.width + 26}
                  height={floorSize.height + 26}
                  ref={stageRef}
                  onMouseDown={handleStageMouseDown}
                  style={{ position: "absolute", top: -13, left: -13 }}
                >
                  <Layer>
                    {Object.entries(items).map(([id, item]) => (
                      <React.Fragment key={id}>
                        <KonvaImage
                          image={item.image}
                          x={item.x}
                          y={item.y}
                          width={item.width}
                          height={item.height}
                          rotation={item.rotation}
                          draggable
                          ref={item.ref}
                          onClick={() => setSelectedId(id)}
                          onTap={() => setSelectedId(id)}
                          onDragStart={() => setIsDragging(true)}
                          onDragEnd={(e) => {
                            setIsDragging(false);
                            handleDragResize(id, {
                              x: e.target.x(),
                              y: e.target.y(),
                            });
                          }}
                          onTransformEnd={(e) => {
                            const node = item.ref.current;
                            const scaleX = node.scaleX();
                            const scaleY = node.scaleY();
                            node.scaleX(1);
                            node.scaleY(1);

                            const width = Math.max(20, node.width() * scaleX);
                            const height = Math.max(20, node.height() * scaleY);

                            handleDragResize(id, {
                              x: node.x(),
                              y: node.y(),
                              width,
                              height,
                              rotation: node.rotation(),
                            });
                          }}
                        />
                        {selectedId === id && (
                          <Transformer
                            nodes={[item.ref.current]}
                            rotateEnabled={true}
                            keepRatio={false}
                            boundBoxFunc={(oldBox, newBox) => {
                              if (newBox.width < 30 || newBox.height < 30) return oldBox;
                              return newBox;
                            }}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </Layer>
                </Stage>

              </div>

              {/* Dimension Lines */}
              <div
                className="absolute top-full left-[14px] "
                style={{ marginTop: "8px", width: `${width}px` }}
              >
                <div className="relative w-full h-6 flex items-center justify-center">
                  <div className="border-t border-black w-full" />
                  <div className="absolute left-1/2 -translate-x-1/2 text-sm font-bold bg-gray-100 px-1">
                    {pxToFt(width)} ft
                  </div>
                </div>
              </div>
              <div
                className="absolute top-[14px] left-full"
                style={{ marginLeft: "8px", height: `${height}px` }}
              >
                <div className="relative w-6 h-full flex items-center justify-center">
                  <div className="border-l border-black h-full mx-auto" />
                  <div className="absolute w-[55px] top-1/2 -translate-y-1/2 rotate-90 text-sm font-bold bg-gray-100 px-1">
                    {pxToFt(height)} ft
                  </div>
                </div>
              </div>

              {/* Delete Icon */}
              {selectedId && items[selectedId] && floorRef.current && !isDragging && (
                <div
                  style={{
                    position: "absolute",
                    top: items[selectedId].y,
                    left: items[selectedId].x + items[selectedId].width + 30,
                    zIndex: 30,
                  }}
                >
                  <button
                    className="bg-gray-700 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md transition"
                    onClick={() => handleDeleteElement(selectedId)}
                    title="Delete"
                  >
                    <X width={15} />
                  </button>
                </div>
              )}
            </div>
          </div>


          <div className="text-center mt-12">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className={`${isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-5 py-2 rounded-xl transition`}
            >
              {isDownloading ? "Downloading..." : "Download as PDF"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloorPlan;
