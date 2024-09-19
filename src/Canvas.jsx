import React, { useState, useRef, useEffect } from 'react';
import backgroundImage from './assets/2025Background.png';

const drawArrowhead = (ctx, fromX, fromY, toX, toY, isSelected) => {
  const headLength = 35;
  const retraction = 20;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  const thirtyDegrees = Math.PI / 6;
  const x1 = toX - headLength * Math.cos(angle - thirtyDegrees / 2);
  const y1 = toY - headLength * Math.sin(angle - thirtyDegrees / 2);
  const x2 = toX - headLength * Math.cos(angle + thirtyDegrees / 2);
  const y2 = toY - headLength * Math.sin(angle + thirtyDegrees / 2);
  const x3 = toX - (headLength - retraction) * Math.cos(angle);
  const y3 = toY - (headLength - retraction) * Math.sin(angle);

  ctx.beginPath();
  ctx.moveTo(toX, toY);  // Tip of the arrowhead
  ctx.lineTo(x1, y1);    // Left side
  ctx.lineTo(x3, y3);    // Base
  ctx.lineTo(x2, y2);    // Right side
  ctx.closePath();

  if (isSelected) {
    ctx.shadowBlur = 50;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  } else {
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }

  ctx.fillStyle = isSelected ? '#FFFFFF' : '#7e22ce';
  ctx.fill();

  // Draw the purple outline
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#7e22ce';
  ctx.stroke();
};

const Canvas = ({ points, setPoints, selectedPoint, setSelectedPoint }) => {
  const canvasRef = useRef(null);
  const [draggingPoint, setDraggingPoint] = useState(null);
  const [adjustingAngle, setAdjustingAngle] = useState(false);
  const [image, setImage] = useState(null);
  const [canvasSize, setCanvasSize] = useState(600);

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => setImage(img);
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      const viewportHeight = window.innerHeight * 0.9;
      setCanvasSize(viewportHeight);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvasSize, canvasSize);

    ctx.strokeStyle = '#FFFFFF';
    ctx.save();
    ctx.translate(canvasSize / 2, canvasSize / 2);

    points.forEach((point, index) => {
      if (point && point.x !== undefined && point.y !== undefined) {
        const { x, y, theta } = point;

        if (index > 0 && points[index - 1]) {
          const { x: prevX, y: prevY } = points[index - 1];
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        ctx.fillStyle = index === selectedPoint ? '#FFFFFF' : '#7e22ce';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Draw purple outline for selected point
        if (index === selectedPoint) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#7e22ce';
          ctx.stroke();
        }

        const arrowLength = 30;
        const thetaRad = theta * (Math.PI / 180);
        const arrowX = x + arrowLength * Math.sin(thetaRad);
        const arrowY = y - arrowLength * Math.cos(thetaRad);
        drawArrowhead(ctx, x, y, arrowX, arrowY, index === selectedPoint);
      }
    });

    ctx.restore();
  }, [points, selectedPoint, image, canvasSize]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width / 2;
    const y = e.clientY - rect.top - canvas.height / 2;

    const existingPointIndex = points.findIndex(point =>
      point && Math.hypot(point.x - x, point.y - y) < 10
    );

    if (existingPointIndex !== -1) {
      if (selectedPoint === existingPointIndex) {
        setAdjustingAngle(!adjustingAngle);
      } else {
        setSelectedPoint(existingPointIndex);
        setAdjustingAngle(true);
      }
    } else {
      setPoints([...points, { x, y, theta: 0 }]);
      setSelectedPoint(points.length);
      setAdjustingAngle(true);
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (draggingPoint !== null) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - canvas.width / 2;
      const y = e.clientY - rect.top - canvas.height / 2;

      const updatedPoints = points.map((point, index) =>
        index === draggingPoint ? { ...point, x, y } : point
      );

      setPoints(updatedPoints);
    } else if (adjustingAngle && selectedPoint !== null && points[selectedPoint]) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - canvas.width / 2;
      const y = e.clientY - rect.top - canvas.height / 2;

      const dx = x - points[selectedPoint].x;
      const dy = y - points[selectedPoint].y;
      const theta = Math.atan2(dy, dx);

      const angleInDegrees = theta * (180 / Math.PI);
      const adjustedAngle = (angleInDegrees + 90) % 360;

      const normalizedAngle = adjustedAngle > 180 ? adjustedAngle - 360 : adjustedAngle;

      const updatedPoints = points.map((point, index) =>
        index === selectedPoint ? { ...point, theta: normalizedAngle } : point
      );

      setPoints(updatedPoints);
    }
  };

  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width / 2;
    const y = e.clientY - rect.top - canvas.height / 2;

    const existingPointIndex = points.findIndex(point =>
      point && Math.hypot(point.x - x, point.y - y) < 10
    );

    if (existingPointIndex !== -1) {
      setDraggingPoint(existingPointIndex);
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggingPoint(null);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="border border-black"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseDown={handleCanvasMouseDown}
        onMouseUp={handleCanvasMouseUp}
      />
    </div>
  );
};

export default Canvas;
