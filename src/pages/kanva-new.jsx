import { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Transformer, Image as KonvaImage } from 'react-konva'; 
import { RotateCw } from 'lucide-react';
import { useGet } from '../hooks/useGet';
import useImage from 'use-image';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FT_TO_PX = 40;

// Use the correct Konva Image component
const ElementImage = ({ src, ...props }) => {
   const fullSrc = `${import.meta.env.VITE_BASE_URL}${src}`;
    const [image] = useImage(fullSrc,'anonymous');
  // const [image] = useImage(src);
  console.log('Loading image:', src, image);  
  return image ? <KonvaImage {...props} image={image} /> : null;
};

const KanvaNew = ({ roomId = 1 }) => {
  // Fetch room elements
  const { data: roomElements } = useGet(`assets/room/${roomId}`);

  // Multiple elements state
  const [placedElements, setPlacedElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [elementCounter, setElementCounter] = useState(0);

  // Add state for floor size in feet
  const [lengthFt, setLengthFt] = useState(10);
  const [widthFt, setWidthFt] = useState(10);

  const planWidth = widthFt * FT_TO_PX;
  const planLength = lengthFt * FT_TO_PX;

  const trRef = useRef(null);
  // Transformer setup
  useEffect(() => {
    if (trRef.current && selectedElementId) {
      const selectedNode = trRef.current.getStage().findOne(`#${selectedElementId}`);
      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
        trRef.current.getLayer().batchDraw();
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [selectedElementId]);

  // Handle clicking on canvas to deselect
  const handleStageClick = (e) => {
    // If clicking on empty area, deselect
    if (e.target === e.target.getStage()) {
      setSelectedElementId(null);
    }
  };

  // Handle clicking on an element
  const handleElementClick = (elementId) => {
    setSelectedElementId(elementId);
  };

  // Improved boundary function that works with rotation
  const boundBoxFunc = (oldBox, newBox) => {
    if (newBox.width < 20 || newBox.height < 20) {
      return oldBox;
    }
    return newBox;
  };

  // Handle drag with strict boundary enforcement
  const handleDragEnd = (e, elementId) => {
    const node = e.target;
    constrainElementToBounds(node);

    // Update the specific element's position
    setPlacedElements(prev =>
      prev.map(el =>
        el.id === elementId
          ? { ...el, x: node.x(), y: node.y() }
          : el
      )
    );
  };

  // Handle dragging in real-time to prevent going out of bounds
  const handleDragMove = (e) => {
    const node = e.target;
    constrainElementToBounds(node);
  };

  // Utility function to constrain element within canvas bounds
  const constrainElementToBounds = (node) => {
    if (!node) return;

    const rotatedBounds = node.getClientRect();
    let newX = node.x();
    let newY = node.y();
    let wasAdjusted = false;

    // Check left boundary
    if (rotatedBounds.x < 0) {
      newX = newX - rotatedBounds.x;
      wasAdjusted = true;
    }

    // Check top boundary
    if (rotatedBounds.y < 0) {
      newY = newY - rotatedBounds.y;
      wasAdjusted = true;
    }

    // Check right boundary
    if (rotatedBounds.x + rotatedBounds.width > planWidth) {
      newX = newX - (rotatedBounds.x + rotatedBounds.width - planWidth);
      wasAdjusted = true;
    }

    // Check bottom boundary
    if (rotatedBounds.y + rotatedBounds.height > planLength) {
      newY = newY - (rotatedBounds.y + rotatedBounds.height - planLength);
      wasAdjusted = true;
    }

    // Apply the constrained position
    if (wasAdjusted) {
      node.position({ x: newX, y: newY });
      node.getLayer()?.batchDraw();
    }
  };

  // Handle transform (resize/scale) with strict boundary enforcement
  const handleTransformEnd = (e, elementId) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Calculate new dimensions
    let newWidth = Math.max(20, node.width() * scaleX);
    let newHeight = Math.max(20, node.height() * scaleY);

    // Reset scale
    node.scaleX(1);
    node.scaleY(1);

    // Temporarily apply new dimensions to check bounds
    node.size({ width: newWidth, height: newHeight });

    const rotatedBounds = node.getClientRect();
    let currentX = node.x();
    let currentY = node.y();

    // Check if resizing would go out of bounds
    const wouldExceedRight = rotatedBounds.x + rotatedBounds.width > planWidth;
    const wouldExceedBottom = rotatedBounds.y + rotatedBounds.height > planLength;
    const wouldExceedLeft = rotatedBounds.x < 0;
    const wouldExceedTop = rotatedBounds.y < 0;

    // Adjust size if it would exceed boundaries
    if (wouldExceedRight || wouldExceedBottom || wouldExceedLeft || wouldExceedTop) {
      // Try to adjust position first
      let newX = currentX;
      let newY = currentY;

      if (wouldExceedLeft) {
        newX = currentX - rotatedBounds.x;
      }
      if (wouldExceedTop) {
        newY = currentY - rotatedBounds.y;
      }
      if (wouldExceedRight) {
        newX = currentX - (rotatedBounds.x + rotatedBounds.width - planWidth);
      }
      if (wouldExceedBottom) {
        newY = currentY - (rotatedBounds.y + rotatedBounds.height - planLength);
      }

      // Apply adjusted position
      node.position({ x: newX, y: newY });

      // Check bounds again after position adjustment
      const adjustedBounds = node.getClientRect();

      // If still out of bounds after position adjustment, reduce size
      if (adjustedBounds.x < 0 || adjustedBounds.y < 0 ||
        adjustedBounds.x + adjustedBounds.width > planWidth ||
        adjustedBounds.y + adjustedBounds.height > planLength) {

        // Calculate maximum allowed size
        const maxWidth = Math.min(newWidth, planWidth - Math.max(0, adjustedBounds.x));
        const maxHeight = Math.min(newHeight, planLength - Math.max(0, adjustedBounds.y));

        newWidth = Math.max(20, maxWidth);
        newHeight = Math.max(20, maxHeight);

        node.size({ width: newWidth, height: newHeight });
      }

      currentX = newX;
      currentY = newY;
    }

    // Final boundary check and constraint
    constrainElementToBounds(node);

    // Update the specific element's properties
    setPlacedElements(prev =>
      prev.map(el =>
        el.id === elementId
          ? {
            ...el,
            x: node.x(),
            y: node.y(),
            width: newWidth,
            height: newHeight
          }
          : el
      )
    );
  };

  // Handle transform during dragging to prevent going out of bounds
  const handleTransform = (e) => {
    const node = e.target;
    const rotatedBounds = node.getClientRect();

    // Prevent transformer from going out of bounds during transform
    if (rotatedBounds.x < 0 || rotatedBounds.y < 0 ||
      rotatedBounds.x + rotatedBounds.width > planWidth ||
      rotatedBounds.y + rotatedBounds.height > planLength) {

      // Stop the current transform
      e.evt.preventDefault();
      return false;
    }
  };

  // Handle rotate with boundary checking
  const handleRotate = (elementId) => {
    const element = placedElements.find(el => el.id === elementId);
    if (!element) return;

    const newRotation = (element.rotation + 90) % 360;
    const node = trRef.current?.getStage()?.findOne(`#${elementId}`);
    

    if (node) {
      // Apply rotation
      node.rotation(newRotation);

      // Check if rotation causes element to go out of bounds
      const rotatedBounds = node.getClientRect();

      if (rotatedBounds.x < 0 || rotatedBounds.y < 0 ||
        rotatedBounds.x + rotatedBounds.width > planWidth ||
        rotatedBounds.y + rotatedBounds.height > planLength) {

        // Try to adjust position to keep within bounds
        constrainElementToBounds(node);

        // If still out of bounds after position adjustment, revert rotation
        const adjustedBounds = node.getClientRect();
        if (adjustedBounds.x < 0 || adjustedBounds.y < 0 ||
          adjustedBounds.x + adjustedBounds.width > planWidth ||
          adjustedBounds.y + adjustedBounds.height > planLength) {

          // Revert rotation if it can't fit
          node.rotation(element.rotation);
          alert('Cannot rotate: Element would exceed canvas boundaries');
          return;
        }
      }

      // Update element rotation and position
      setPlacedElements(prev =>
        prev.map(el =>
          el.id === elementId
            ? { ...el, rotation: newRotation, x: node.x(), y: node.y() }
            : el
        )
      );

      node.getLayer().batchDraw();
    }
  };

  // Handle sidebar click to place new element
  const handleSidebarClick = (roomElement) => {
    const newElement = {
      id: `${roomElement.id}-${elementCounter}`,
      roomElementId: roomElement.id,
      title: roomElement.title,
      file: roomElement.file,
      x: Math.min(50, planWidth - 120),
      y: Math.min(50, planLength - 80),
      width: 120,
      height: 80,
      rotation: 0,
    };

    console.log('Placing new element:', newElement);    

    setPlacedElements(prev => [...prev, newElement]);
    setElementCounter(prev => prev + 1);
    setSelectedElementId(newElement.id);
  };

  // Delete selected element
  const handleDeleteElement = () => {
    if (selectedElementId) {
      setPlacedElements(prev => prev.filter(el => el.id !== selectedElementId));
      setSelectedElementId(null);
    }
  };

  // Clear all elements
  const handleClearAll = () => {
    setPlacedElements([]);
    setSelectedElementId(null);
  };

  const handleDownloadPDF = async () => {
  const floorPlanElement = document.querySelector('.floor-plan-container');
  if (!floorPlanElement) return;
  console.log('Generating PDF for floor plan:', floorPlanElement);  

  try {
    const canvas = await html2canvas(floorPlanElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('floorplan.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f7fa' }}>
      {/* Sidebar */}
      <div style={{
        width: 260, height: '95vh', overflowY: 'scroll', background: '#fff', borderRadius: 16, margin: 16, padding: 16, boxShadow: '0 2px 8px #0001'
      }}>
        <input
          placeholder="Search elements..."
          style={{
            width: '100%', marginBottom: 16, padding: 8, borderRadius: 8, border: '1px solid #eee'
          }}
        />
        <div>
          {
            (() => {
              const items = [];
              for (let i = 0; i < roomElements?.length; i++) {
                const el = roomElements[i];
                items.push(
                  <div
                    key={el.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: 10, borderRadius: 8, marginBottom: 8,
                      background: '#f9f9f9', cursor: 'pointer', border: '1px solid #eee'
                    }}
                    onClick={() => handleSidebarClick(el)}
                  >
                    <img src={`${import.meta.env.VITE_BASE_URL}${el.file}`} alt={el.title} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{el.title}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>{el.length}ft x {el.width}ft</div>
                    </div>
                  </div>
                );
              }
              return items;
            })()
          }
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 32 }}>
        <h1 style={{ fontWeight: 700, fontSize: 36, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span role="img" aria-label="home">🏠</span> Interior Floor Planner
        </h1>
        <div style={{ marginBottom: 8 }}>
          <label>
            Length (ft):{" "}
            <input
              type="number"
              min={1}
              style={{ width: 40, marginRight: 16 }}
              value={lengthFt}
              onChange={e => setLengthFt(Number(e.target.value))}
            />
          </label>
          <label>
            Width (ft):{" "}
            <input
              type="number"
              min={1}
              style={{ width: 40 }}
              value={widthFt}
              onChange={e => setWidthFt(Number(e.target.value))}
            />
          </label>
        </div>
        <div style={{ fontWeight: 600, color: '#666', marginBottom: 8 }}>
          Floor Plan: {lengthFt}ft x {widthFt}ft
        </div>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>
          Elements Placed: {placedElements.length} | Click sidebar items to add elements
        </div>
        <div className="floor-plan-container" style={{
          position: 'relative',
          width: planWidth + 28,
          height: planLength + 28,
          marginBottom: 32
        }}>
          {/* SVG Border */}
          <svg
            width={planWidth + 28}
            height={planLength + 28}
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
          >
            <rect x="0" y="0" width={planWidth + 28} height={planLength + 28} fill="black" />
            <rect x="1" y="1" width={planWidth + 26} height={planLength + 26} fill="#eee" />
            <rect x="13" y="13" width={planWidth + 2} height={planLength + 2} fill="black" />
            <rect x="14" y="14" width={planWidth} height={planLength} fill="white" />
          </svg>
          {/* Canvas */}
          <Stage
            width={planWidth}
            height={planLength}
            style={{ position: 'absolute', left: 14, top: 14, zIndex: 1 }}
            onClick={handleStageClick}
            onTap={handleStageClick}
          >
            <Layer>
              {placedElements.map((element) => (
                <ElementImage
                  key={element.id}
                  id={element.id}
                  src={element.file}
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  rotation={element.rotation}
                  draggable
                  onClick={() => handleElementClick(element.id)}
                  onTap={() => handleElementClick(element.id)}
                  onDragEnd={(e) => handleDragEnd(e, element.id)}
                  onDragMove={(e) => handleDragMove(e, element.id)}
                  onTransformEnd={(e) => handleTransformEnd(e, element.id)}
                  onTransform={(e) => handleTransform(e, element.id)}
                />
              ))}
              <Transformer
                ref={trRef}
                boundBoxFunc={boundBoxFunc}
                rotateEnabled={false}
                keepRatio={false}
                enabledAnchors={[
                  'top-left', 'top-right', 'bottom-left', 'bottom-right',
                  'top-center', 'bottom-center', 'middle-left', 'middle-right',
                ]}
              />
            </Layer>
          </Stage>
          {/* Rotate Icons for all placed elements */}
          {placedElements.map(element => (
            <button
              key={`rotate-${element.id}`}
              onClick={() => handleRotate(element.id)}
              style={{
                position: 'absolute',
                left: element.x + 14 - 15,
                top: element.y - 15 + 14,
                zIndex: 10,
                background: 'white',
                border: selectedElementId === element.id ? '2px solid #0066cc' : '1px solid #ccc',
                borderRadius: '50%',
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                opacity: selectedElementId === element.id ? 1 : 0.7
              }}
            >
              <RotateCw width={15} />
            </button>
          ))}
        </div>

        <button
          style={{
            marginTop: 24,
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 32px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer'
          }}
          onClick={handleDownloadPDF}
        >
          Download as PDF
        </button>

      </div>
    </div>
  );
};

export default KanvaNew;