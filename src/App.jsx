import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Canvas from './Canvas';
import { Instructions, InstructionIcon } from './Instructions';
import { ExportButton } from './ExportButton';
import './index.css';

function App() {
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [pathName, setPathName] = useState('splineTo');
  const [showInstructions, setShowInstructions] = useState(false);
  const [isExportModalVisible, setExportModalVisible] = useState(false);
  const [exportData, setExportData] = useState('');

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'd':
        if (points.length > 0) {
          const newPoints = points.slice(0, -1);
          setPoints(newPoints);
          if (selectedPoint === points.length - 1) {
            setSelectedPoint(null);
          }
        }
        break;
      case 'e':
        setSelectedPoint(null);
        break;
    }
  };

  const scalePoint = (value, canvasSize) => {
    return (value / (canvasSize / 2)) * 72;
  };
  
  const roundToDecimalPlaces = (value, decimalPlaces) => {
    return Math.round(value * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  };
  
  const formatExportData = () => {
    const canvasSize = 600;
    let exportLines = [];
  
    if (points.length > 0) {
      const firstPoint = points[0];
      const formattedFirstPoint = `myBot.runAction(myBot.getDrive().actionBuilder(new Pose2d(${
        roundToDecimalPlaces(scalePoint(-firstPoint.y, canvasSize), 2)
      }, ${
        roundToDecimalPlaces(scalePoint(-firstPoint.x, canvasSize), 2)
      }, Math.toRadians(${roundToDecimalPlaces(-firstPoint.theta, 2)})))`;
      exportLines.push(formattedFirstPoint);
  
      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        const formattedPoint = `.${pathName}(new Vector2d(${
          roundToDecimalPlaces(scalePoint(-point.y, canvasSize), 2)
        }, ${
          roundToDecimalPlaces(scalePoint(-point.x, canvasSize), 2)
        }), Math.toRadians(${roundToDecimalPlaces(-point.theta, 2)}))`;
        exportLines.push(formattedPoint);
      }
      exportLines.push('.build()');
    }
  
    return exportLines.join('\n');
  };

  const handleExport = () => {
    const exportData = formatExportData();
    setExportData(exportData);
    setExportModalVisible(true);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [points]);

  return (
    <div className="relative w-full p-4">
      <InstructionIcon toggleInstructions={() => setShowInstructions(prev => !prev)} />
      <ExportButton onClick={handleExport} />
      <Instructions show={showInstructions} onClose={() => setShowInstructions(false)} />
      <Modal isVisible={isExportModalVisible} onClose={() => setExportModalVisible(false)}>
        <h2 className="text-xl font-bold text-white mb-4">Exported Code</h2>
        <div className="hidden-data">{exportData}</div>
        <button onClick={() => navigator.clipboard.writeText(exportData)} className="copy-button">Copy</button>
      </Modal>
      <Canvas
        points={points}
        setPoints={setPoints}
        selectedPoint={selectedPoint}
        setSelectedPoint={setSelectedPoint}
      />
    </div>
  );
}

export default App;
