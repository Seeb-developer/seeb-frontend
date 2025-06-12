import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useGet } from '../hooks/useGet';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { X, Sparkles, RotateCw } from "lucide-react";
import useImage from 'use-image';
import { GoogleGenAI, Modality } from "@google/genai";

const FT_TO_PX = 40;
const pxToFeet = (px) => (px / FT_TO_PX).toFixed(2); // PX ➝ FT
const feetToInches = (ft) => (ft * 12).toFixed(2); // FT ➝ INCH
const pxToInches = (px) => feetToInches(pxToFeet(px)); // PX ➝ INCH directly (combined)

const FloorPlan = () => {
  const { roomId, roomName } = useParams();
  const navigate = useNavigate();
  const roomNameFormatted = roomName ? roomName.replace(/-/g, ' ') : '';
  const floorRef = useRef(null);
  const stageRef = useRef(null);
  const token = useSelector((state) => state.user.token);
  const userDetail = useSelector((state) => state.user.userInfo);

  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState({});
  const [baseElements, setBaseElements] = useState({});
  const [floorSize, setFloorSize] = useState({ width: 400, height: 400 });
  const [selectedId, setSelectedId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [elementCounts, setElementCounts] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [aiImages, setAiImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // const [customPrompt, setCustomPrompt] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [selectedView, setSelectedView] = useState("corner"); // "top", "corner", "eye"
  const [selectedCorner, setSelectedCorner] = useState("A-B"); // "A-B", "B-C", "C-D", "D-A"
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, rotation: 0 });

  const { data: roomElements } = useGet(`assets/room/${roomId}`);

  useEffect(() => {

    // const loadImage = (url) => {
    //   // return new Promise((resolve, reject) => {
    //   //   const img = new window.Image();
    //   //   img.crossOrigin = "anonymous";
    //   //   img.src = url;
    //   //   img.onload = () => resolve(img);
    //   //   img.onerror = reject;
    //   // });
    //   const [image] = useImage(url);
    //   return image;
    // };

    if (roomElements) {
      const loadImages = async () => {
        // const newItems = {};
        const baseMap = {};

        for (const el of roomElements) {
          // const img = await loadImage(`${import.meta.env.VITE_BASE_URL}${el.file}`);
          // const [image] = useImage(`${import.meta.env.VITE_BASE_URL}${el.file}`);
          const id = el.title.toLowerCase();
          baseMap[id] = {
            width: parseFloat(el.width) * FT_TO_PX,
            height: parseFloat(el.length) * FT_TO_PX,
            // image: img,
            imgSrc: el.file,
          };

          // newItems[id] = {
          //   x: 100,
          //   y: 100,
          //   width: parseFloat(el.width) * FT_TO_PX,
          //   height: parseFloat(el.length) * FT_TO_PX,
          //   rotation: 0,
          //   image: img,
          //   ref: React.createRef(),
          // };
        }

        // setItems(newItems);
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
          rotation: 0,
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
                // text: `Analyze the following top-down floor plan image.
                //       Return only a JSON array of visible furniture objects, with each object described using:
                //       - "type": the kind of furniture (e.g., "bed", "wardrobe")
                //       - "position": grid-based label using alphabetic rows and numeric columns (e.g., "A1", "B3"), assuming the top-left of the room is A1, and zones increase right and downward like Excel
                //       - "size": estimated size in feet, if available (e.g., "6x6 ft")
                //       - "facing": direction the object is facing (e.g., "facing the door", "toward the wardrobe", "toward bottom")
                //       - "neighbors": nearby or adjacent objects (e.g., "next to bed", "between table and wardrobe")
                //       Strictly follow the visual layout. Only include objects that are clearly visible. Output a valid JSON array. Do not add commentary or explanations.`,
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

  const buildPrompt = (objects, theme) => {
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
      `Generate a photorealistic 3D interior render of a ${roomNameFormatted} from a corner perspective. ` +
      `The room should reflect a "${theme}" style with appropriate colors, textures, lighting, and furniture design. ` +
      `Include only the following objects in the specified configuration: ${objectDescriptions}. ` +
      `Ensure all object sizes, positions, and orientations are accurate. Do not add extra items or decorations beyond those described.`
    );
  };

  const handleDownloadFloorplan = async () => {
    setIsDownloading(true);
    try {
      const actualCanvas = await html2canvas(floorRef.current, { scale: 2 });
      const actualImgData = actualCanvas.toDataURL("image/png");

      const compassBase64 = `${import.meta.env.VITE_BASE_URL}serve-file/0dc0029bae2cf900f1d21748587339.jpeg`;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 297;
      const pageHeight = 210;
      const leftColWidth = 90;
      const marginTop = 20;

      // Title
      pdf.setFontSize(18);
      pdf.text("FLOOR PLAN REPORT", pageWidth / 2, 15, { align: "center" });

      // Compass Image
      pdf.addImage(compassBase64, "PNG", pageWidth - 30, 10, 20, 20);

      // Element List with thumbnails
      let currentY = marginTop;
      const maxImgW = 15;
      const maxImgH = 15;

      Object.entries(items).forEach(([key, el]) => {
        if (currentY > pageHeight - 30) return;

        const fileName = el.imgSrc.split('/').pop();

        const img = new Image();
        img.src = `${import.meta.env.VITE_BASE_URL}serve-file/${fileName}`;

        pdf.addImage(img.src, "PNG", 10, currentY, maxImgW, maxImgH);

        const labelX = 10 + maxImgW + 3;
        const feetW = pxToFeet(el.width || 0);
        const feetH = pxToFeet(el.height || 0);
        const inchW = feetToInches(feetW);
        const inchH = feetToInches(feetH);

        pdf.setFontSize(11);
        pdf.text(key.replace(/-\d+$/, ""), labelX, currentY + 6); // clean name
        pdf.setFontSize(10);
        pdf.text(`${inchW}in x ${inchH}in`, labelX, currentY + 12);

        currentY += maxImgH + 10;
      });

      const dividerX = 90;
      const dividerY = 165; // Adjust as needed (bottom margin)

      pdf.setDrawColor(0);
      pdf.setLineWidth(0.2);

      // Vertical line between left column and floorplan
      pdf.line(dividerX, 20, dividerX, dividerY);

      // Horizontal line at bottom across full page
      pdf.line(10, dividerY, pageWidth - 10, dividerY);

      // Floorplan Image
      const imageX = leftColWidth + 10;
      const imageW = pageWidth - imageX - 15;
      const imageH = imageW * 0.75;
      pdf.addImage(actualImgData, "PNG", imageX, marginTop + 5, imageW, imageH);

      // Footer
      const footerY = pageHeight - 30;
      const now = new Date();
      const dateTimeStr = now.toLocaleString();

      const companyDetails = {
        name: "SEEB DESIGN PVT LTD",
        address: "S.No 29/13b, Wadachiwadi Road, Jakat Naka,\nUndri, Pune, Maharashtra - 411060",
        contact: "18005703133",
        email: "info@seeb.in"
      };

      // Set spacing and alignment
      const labelWidth = 30;           // width reserved for label
      const leftX = 10;                // left column X
      const rightX = pageWidth / 2 + 10; // right column X (more spaced)
      const valueXLeft = leftX + labelWidth;
      const valueXRight = rightX + labelWidth;
      const lineHeight = 5;

      let y = footerY;

      pdf.setFontSize(10);

      // 🏢 Left: Company Info
      pdf.text("Company:", leftX, y);
      pdf.text(companyDetails.name, valueXLeft, y);

      y += lineHeight;
      pdf.text("Email:", leftX, y);
      pdf.text(companyDetails.email, valueXLeft, y);

      y += lineHeight;
      pdf.text("Contact:", leftX, y);
      pdf.text(companyDetails.contact, valueXLeft, y);

      y += lineHeight;
      pdf.text("Address:", leftX, y);
      pdf.setFontSize(8);
      pdf.text(companyDetails.address.split("\n")[0], valueXLeft, y);
      pdf.text(companyDetails.address.split("\n")[1], valueXLeft, y + lineHeight);

      // 👤 Right: User Info
      y = footerY;
      pdf.setFontSize(10);
      pdf.text("Space Name:", rightX, y);
      pdf.text(roomNameFormatted || "N/A", valueXRight, y);

      y += lineHeight;
      pdf.text("Generated By:", rightX, y);
      pdf.text(userDetail?.name || "User", valueXRight, y);

      y += lineHeight;
      pdf.text("Mobile:", rightX, y);
      pdf.text(userDetail?.mobile_no || "N/A", valueXRight, y);

      y += lineHeight;
      pdf.text("Date:", rightX, y);
      pdf.text(dateTimeStr, valueXRight, y);


      pdf.save("floorplan.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerateAIImages = async (theme) => {
    // if (!selectedTheme) return;
    setIsGenerating(true);
    try {
      // Initialize Gemini AI
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY
      });

      // Capture current floor plan as canvas
      const canvas = await html2canvas(floorRef.current, {
        backgroundColor: null,
        useCORS: true,
        scale: 2,
      });

      // Convert canvas to base64
      const base64Image = canvas.toDataURL("image/png").split(",")[1];

      // Get layout analysis from GPT
      // const uploadedImageUrl = await uploadCanvasToBackend(canvas, token);
      // const objects = await getObjectListFromGPT(uploadedImageUrl);
      // const prompt = buildPrompt(objects, selectedTheme);
      // const prompt = `Generate a photorealistic 3D interior design image using the following layout, room parameters, and element placement. Follow the exact wall assignments and design inputs provided by the user — with no changes or assumptions allowed.
      //     ROOM DIMENSIONS:
      //     Room Size: ${pxToFt(floorSize.width)}ft x ${pxToFt(floorSize.height)}ft

      //     Room Height: [e.g., 10ft to 12ft]

      //     Room Type: ${roomNameFormatted}

      //     WALL ORIENTATION SYSTEM (Fixed Logic):
      //     Treat the floor plan like a phone held vertically:

      //     Wall A = Left side

      //     Wall B = Right side

      //     Wall C = Top wall (Head side)

      //     Wall D = Bottom wall (Foot side)

      //     USER-DEFINED ELEMENT PLACEMENT (Dynamic — follow strictly):
      //     Place the [Main Element] (e.g., Bed, TV Unit, Kitchen Counter) exactly on Wall [X]

      //     Place the [Secondary Element] (e.g., Wardrobe, Entry Door) exactly on Wall [Y]

      //     Window/Door must be placed on Wall [Z], as per user selection

      //     Window element is in blue rectangle box, please check the placement in the provided image

      //     Do not guess or rotate any placement — follow user-selected wall sides exactly

      //     DESIGN STYLE, MATERIAL & COLOR (User Input):
      //     Style Theme: ${theme}

      //     Material Palette: [e.g., Walnut wood, White laminate, Tinted Glass]

      //     Finish Type:

      //     Laminate

      //     Veneer

      //     PU (Glossy or Matte)

      //     Pure Wood
      //     (Use only what the user selects)

      //     Color Code:

      //     Primary Color: [e.g., #FFFFFF for white]

      //     Accent Color: [e.g., #FF0000 for red]

      //     Lighting Type: [e.g., recessed ceiling lights, pendant, strip LED]

      //     CAMERA VIEW (User Input):
      //     Show [Wall X + Wall Y] if corner view selected

      //     Or show [Wall A to B] or [Wall D to C] if straight view selected

      //     Match the view logic and show only the requested walls

      //     Render from realistic eye-level perspective

      //     HARD RESTRICTIONS:
      //     Do NOT reposition any furniture

      //     Do NOT add people, extra objects, or random decor

      //     Do NOT apply default finishes — only use user-specified finish

      //     Layout must match user input line-to-line, 100% accurately`;

      // const prompt = `Generate a photorealistic 3D interior image of a Living Room using this exact layout logic:
      // Read the layout with this phone-orientation logic:
      // - Top wall = head side (usually for bed or main element)
      // - Bottom wall = foot side (usually for wardrobe or exit)
      // - Left and right = as seen while facing the floor plan

      // - Room height = [X] feet\n- Layout should be locked — no changes in furniture position allowed.
      // Style: [MODERN / MINIMAL / LUXURY]\nMaterial Palette: [WALNUT WOOD / BEIGE FABRIC / WHITE LAMINATE / etc.]
      // Color Palette: [Primary Color], [Accent Color]\nLighting: [Recessed ceiling lights / under-cabinet strip / etc.]
      // Camera Angle: From corner view showing [X WALL] and [Y WALL] both clearly
      // Do not add any people, objects, or walls not mentioned.
      // The layout must match 100% — not approximate. Match all placements line to line.`;

      const width = pxToFt(floorSize.width);
      const height = pxToFt(floorSize.height);

      const getViewPrompt = () => {
        switch (selectedView) {
          case "top-view":
            return "from a top-down perspective, showing the entire room layout clearly from above";
          case "corner-view":
            const [wall1, wall2] = selectedCorner.split("-");
            return `from the inside of the ${selectedCorner} corner, showing both wall ${wall1} and wall ${wall2}, creating a sense of depth`;
          case "eye-level":
            return "from a natural human eye-level, as if standing inside the room and looking ahead";
          default:
            return "from a realistic interior camera angle";
        }
      };

      const prompt = `Generate a photorealistic 3D interior image of a ${width}ft x ${height}ft ${roomNameFormatted} ${getViewPrompt()}.

      Layout Instructions:
      - Use the attached floorplan image as the **strict layout reference**
      - Accurately recreate the furniture positions, proportions, and spacing **as shown in the floorplan**
      - Do **not** add, remove, or move any furniture — follow the layout exactly

      Design Style:
      - Theme: ${selectedTheme}
      - Primary Color: ${primaryColor}
      - Secondary Color: ${secondaryColor}

      Perspective Details:
      - Render the view from the ${selectedCorner} corner, showing both walls (${selectedCorner.split("-").join(" and ")})
      - Camera should be placed at ~5–6 ft height, angled for realistic depth
      - Show two adjacent walls to give a strong corner perspective

      Visual Realism:
      - Use realistic materials (wood, marble, fabrics, etc.)
      - Include natural lighting, shadows, and soft reflections
      - Keep the design clean, elegant, and professionally styled

      Important:
      - Do not change furniture count, type, or size
      - Do not use flat, isometric, or bird’s eye view unless top-view is selected
      - The image must look like a real photograph from inside the room`;

      // Prepare content for Gemini
      const contents = [
        { text: prompt },
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image,
          },
        },
      ];

      // Generate images using Gemini
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: contents,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
          numImages: 1, // Request 1 image
        },
      });

      // Process and store generated images
      const generatedImages = [];

      if (response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            generatedImages.push(imageUrl);
            break; // Only take the first image
          }
        }
      }
      console.log("generatedImages:", generatedImages);

      setAiImages(generatedImages);

    } catch (err) {
      console.error("AI generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  // const handleGenratedObjects = async () => {

  //     const canvas = await html2canvas(floorRef.current, {
  //       backgroundColor: null,
  //       useCORS: true,
  //       scale: 2,
  //     });
  //     const uploadedImageUrl = await uploadCanvasToBackend(canvas, token);
  //     const objects = await getObjectListFromGPT(uploadedImageUrl);
  //     localStorage.setItem('ai-items', JSON.stringify(objects));
  //     window.open('/generate-ai-items', '_blank');
  // }

  const searchFilteredItems = Object.entries(baseElements).filter(([id]) =>
    id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const DraggableImage = ({ id, src, x, y, width, height, rotation, isSelected, onSelect, onChange, floorWidth, floorHeight }) => {

    const fileName = src.split('/').pop();

    const [image] = useImage(`${import.meta.env.VITE_BASE_URL}serve-file/${fileName}`, 'anonymous');

    const shapeRef = React.useRef();

    const constrainElementToBounds = (node) => {
      const rotatedBounds = node.getClientRect();
      let newX = node.x();
      let newY = node.y();
      let wasAdjusted = false;

      const noPadding = id.startsWith('door') || id.startsWith('window');
      const padding = noPadding ? 0 : 14;

      const minX = padding;
      const minY = padding;
      const maxX = floorWidth + 28 - padding;
      const maxY = floorHeight + 28 - padding;

      if (rotatedBounds.x < minX) {
        newX -= (rotatedBounds.x - minX);
        wasAdjusted = true;
      }
      if (rotatedBounds.y < minY) {
        newY -= (rotatedBounds.y - minY);
        wasAdjusted = true;
      }
      if (rotatedBounds.x + rotatedBounds.width > maxX) {
        newX -= (rotatedBounds.x + rotatedBounds.width - maxX);
        wasAdjusted = true;
      }
      if (rotatedBounds.y + rotatedBounds.height > maxY) {
        newY -= (rotatedBounds.y + rotatedBounds.height - maxY);
        wasAdjusted = true;
      }

      if (wasAdjusted) {
        node.position({ x: newX, y: newY });
        node.getLayer()?.batchDraw();
      }
    };


    React.useEffect(() => {
      if (isSelected && shapeRef.current) {
        shapeRef.current.moveToTop();
      }
    }, [isSelected]);

    return (
      <>
        <KonvaImage
          id={id}
          ref={shapeRef}
          image={image}
          x={x}
          y={y}
          width={width}
          height={height}
          rotation={rotation}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragMove={(e) => {
            constrainElementToBounds(e.target);
          }}
          onDragEnd={(e) => {
            constrainElementToBounds(e.target);
            onChange({ x: e.target.x(), y: e.target.y() });
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);

            let newWidth = Math.max(30, node.width() * scaleX);
            let newHeight = Math.max(30, node.height() * scaleY);

            node.size({ width: newWidth, height: newHeight });
            constrainElementToBounds(node);

            onChange({
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              width: newWidth,
              height: newHeight,
            });
          }}
        />
        {isSelected && shapeRef.current && (
          <Transformer
            nodes={[shapeRef.current]}
            keepRatio={false}
            rotateEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 30 || newBox.height < 30) return oldBox;
              return newBox;
            }}
          />
        )}
      </>
    );
  };

  const updateCameraPosition = (corner) => {
    const padding = 40; // Distance from the walls
    switch (corner) {
      case 'A-C':
        return { x: width - padding, y: height, rotation: 45 }; // Place at B-D corner
      case 'C-B':
        return { x: -padding, y: height, rotation: 130 }; // Place at D-A corner
      case 'B-D':
        return { x: -padding, y: -padding, rotation: 230 }; // Place at A-C corner
      case 'D-A':
        return { x: width - padding, y: -padding, rotation: 310 }; // Place at C-B corner
      default:
        return { x: 0, y: 0, rotation: 0 };
    }
  };

  const handleRotate = (elementId) => {
  const element = items[elementId];
  if (!element) return;

  const newRotation = (element.rotation || 0) + 90;
  const normalizedRotation = newRotation % 360;

  const node = stageRef.current?.findOne(`${elementId}`);
  console.log("node", node, "rotation", normalizedRotation);
  
  if (node) {
    node.rotation(normalizedRotation);

    // Check bounds after rotation
    const rotatedBounds = node.getClientRect();
    const noPadding = elementId.startsWith('door') || elementId.startsWith('window');
    const padding = noPadding ? 0 : 14;

    const minX = padding;
    const minY = padding;
    const maxX = width + 28 - padding;
    const maxY = height + 28 - padding;

    if (
      rotatedBounds.x < minX ||
      rotatedBounds.y < minY ||
      rotatedBounds.x + rotatedBounds.width > maxX ||
      rotatedBounds.y + rotatedBounds.height > maxY
    ) {
      // Revert rotation if out of bounds
      node.rotation(element.rotation || 0);
      return;
    }

    // Update in state
    handleDragResize(elementId, {
      x: node.x(),
      y: node.y(),
      rotation: normalizedRotation,
    });

    node.getLayer()?.batchDraw();
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

      <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-100">
        <div className="w-80 h-[90vh] overflow-y-scroll bg-white shadow-lg rounded-xl p-4 mr-4">
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
                <img src={`${import.meta.env.VITE_BASE_URL}${item.imgSrc}`} alt={id} className="w-10 h-10 object-contain" />
                <div>
                  <div className="font-semibold capitalize">{id}</div>
                  <div className="text-sm text-gray-600">{pxToFt(item.width)}ft x {pxToFt(item.height)}ft</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className=" w-full">
          <div className="flex flex-row items-center justify-between mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Interior Floor Planner </h1>
            <div className="flex gap-2">
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 flex items-center gap-2 transition"
                onClick={handleGenerateAIImages}
              >
                <Sparkles /> Design AI Generated Items
              </button>

              <button
                onClick={handleDownloadFloorplan}
                disabled={isDownloading}
                className={`${isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-5 py-2 rounded-xl transition`}
              >
                {isDownloading ? "Downloading..." : "Download Floor Plan PDF"}
              </button>
            </div>
          </div>


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

          <div className="flex flex-col xl:flex-row gap-6 mb-4">

            <div ref={floorRef} className="flex flex-col items-center gap-3" style={{ width: floorSize.width + 100, height: floorSize.height + 110 }}>

              <div className="text-base font-bold text-gray-600 mb-5">
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

                {/* Konva Canvas */}
                <div
                  className="absolute top-[0px] left-[0px] z-20"
                  style={{ width: width + 28, height: height + 28 }}
                >
                  <Stage
                    width={width + 28}
                    height={height + 28}
                    ref={stageRef}
                    onMouseDown={handleStageMouseDown}
                    style={{ position: "absolute", top: 0, left: 0 }}
                  >
                    <Layer>
                      {Object.entries(items).map(([id, item]) => (
                        <DraggableImage
                          key={id}
                          id={id}
                          src={item.imgSrc}
                          x={item.x}
                          y={item.y}
                          width={item.width}
                          height={item.height}
                          rotation={item.rotation}
                          isSelected={selectedId === id}
                          onSelect={() => setSelectedId(id)}
                          onChange={(newAttrs) => {
                            handleDragResize(id, newAttrs);
                          }}
                          floorWidth={width}
                          floorHeight={height}
                        />
                      ))}
                    </Layer>
                  </Stage>
                </div>

                {/* Grid */}
                <div
                  className="absolute top-[14px] left-[14px] overflow-hidden"
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

                {/* Dimension Lines */}
                <div
                  className="absolute top-full left-[14px] "
                  style={{ marginTop: "22px", width: `${width}px` }}
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
                  style={{ marginLeft: "20px", height: `${height}px` }}
                >
                  <div className="relative w-6 h-full flex items-center justify-center">
                    <div className="border-l border-black h-full mx-auto" />
                    <div className="absolute w-[55px] top-1/2 -translate-y-1/2 rotate-90 text-sm font-bold bg-gray-100 px-1">
                      {pxToFt(height)} ft
                    </div>
                  </div>
                </div>

                {/* Wall Labels */}
                <div className="absolute top-[14px] left-[-14px] h-full flex items-center">
                  <span className="text-sm font-bold transform -translate-x-1/2">A</span>
                </div>
                <div className="absolute top-[14px] right-[-14px] h-full flex items-center">
                  <span className="text-sm font-bold transform translate-x-1/2">B</span>
                </div>
                <div className="absolute top-[-14px] left-[14px]  w-full flex justify-center">
                  <span className="text-sm font-bold transform -translate-y-1/2">C</span>
                </div>
                <div className="absolute bottom-[-14px] left-[14px] w-full flex justify-center">
                  <span className="text-sm font-bold transform translate-y-1/2">D</span>
                </div>

                {/* Add this inside the floor plan container, after the wall labels */}
                {selectedView === "corner-view" && selectedCorner && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${14 + cameraPosition.x}px`,
                      top: `${14 + cameraPosition.y}px`,
                      transform: `rotate(${cameraPosition.rotation}deg)`,
                      zIndex: 40,
                    }}
                    className="text-purple-600"
                  >
                    <img src="/camera.png" alt="camera" style={{ width: '50px', height: '50px' }} />
                  </div>
                )}

                {/* Delete Icon */}
                {selectedId && items[selectedId] && floorRef.current && !isDragging && (
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      position: "absolute",
                      top: items[selectedId].y,
                      left: items[selectedId].x + items[selectedId].width + 30,
                      zIndex: 30,
                    }}
                  >
                    <button
                      className="bg-gray-700 hover:bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md transition"
                      onClick={() => handleRotate(selectedId)}
                      title="Rotate"
                    >
                      <RotateCw width={15} />
                    </button>
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

            {/* <div className="mt-4 flex flex-wrap gap-4">
              {aiImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Generated Design ${index + 1}`}
                  className="w-full h-96 border rounded shadow"
                />
              ))}
            </div> */}


            <div>
              {/* <div className="text-center md:text-start mt-12">
                <button
                  onClick={handleDownloadFloorplan}
                  disabled={isDownloading}
                  className={`${isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-5 py-2 rounded-xl transition`}
                >
                  {isDownloading ? "Downloading..." : "Download Floor Plan PDF"}
                </button>
              </div> */}

              <div className="w-full max-w-2xl bg-white p-4 rounded-xl shadow mt-6 mb-6">
                {/* <h2 className="text-lg font-semibold text-gray-800 mb-3">Custom Generation Prompt</h2>
                <textarea
                  className="w-full p-2 border rounded-lg mb-4 min-h-[100px]"
                  placeholder="Enter your custom prompt for AI image generation..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                /> */}

                <h2 className="text-lg font-semibold text-gray-800 mb-3">Color Scheme</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter primary color"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter secondary color"
                    />
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-3">View Settings</h2>
                <div className="space-y-4 mb-4">
                  {/* View Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      View Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Top View", "Corner View", "Eye Level"].map((view) => (
                        <label
                          key={view}
                          className={`flex items-center justify-center p-2 border rounded cursor-pointer ${selectedView === view.toLowerCase().replace(" ", "-")
                            ? "bg-purple-100 border-purple-500"
                            : "hover:bg-gray-50"
                            }`}
                        >
                          <input
                            type="radio"
                            name="viewType"
                            value={view.toLowerCase().replace(" ", "-")}
                            checked={selectedView === view.toLowerCase().replace(" ", "-")}
                            onChange={(e) => setSelectedView(e.target.value)}
                            className="hidden"
                          />
                          <span>{view}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Corner Selection - Only show if Corner View is selected */}
                  {selectedView === "corner-view" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Corner
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["A-C", "C-B", "B-D", "D-A"].map((corner) => (
                          <label
                            key={corner}
                            className={`flex items-center justify-center p-2 border rounded cursor-pointer ${selectedCorner === corner
                              ? "bg-purple-100 border-purple-500"
                              : "hover:bg-gray-50"
                              }`}
                          >
                            <input
                              type="radio"
                              name="cornerType"
                              value={corner}
                              checked={selectedCorner === corner}
                              onChange={(e) => {
                                setSelectedCorner(e.target.value);
                                setCameraPosition(updateCameraPosition(e.target.value));
                              }}
                              className="hidden"
                            />
                            <span>Corner {corner}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-3">Choose a Room Theme</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {["Modern", "Kashmiri", "Rajasthani", "Luxury"].map((theme) => (
                    <label key={theme} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value={theme}
                        checked={selectedTheme === theme}
                        onChange={() => setSelectedTheme(theme)}
                      />
                      <span>{theme} Style</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => handleGenerateAIImages(selectedTheme)}
                  disabled={(!selectedTheme) || isGenerating}
                  className={`${isGenerating || (!selectedTheme)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                    } text-white px-5 py-2 rounded-xl transition`}
                >
                  {isGenerating ? "Generating..." : "Generate AI Room Design"}
                </button>
              </div>

              {/* Display Generated Images */}
              {aiImages.length > 0 && (
                <div className="w-full ">
                  {aiImages.map((img, index) => (
                    <div key={index} className="rounded-xl shadow border overflow-hidden">
                      <img src={img} alt={`AI Room ${index + 1}`} className="w-full h-96 object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default FloorPlan;
