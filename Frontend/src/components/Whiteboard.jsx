import { Stage, Layer, Line } from "react-konva";
import { useState, useRef, useEffect, useCallback } from "react";
import { joinRoom, sendDrawing, onDrawingUpdate, offDrawingUpdate }
  from "../services/socketService";
import "../styles/global/Whiteboard.css";

export const Whiteboard = () => {
  const [lines, setLines] = useState([]);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [isEraser, setIsEraser] = useState(false);
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight * 0.7
  });
  const isDrawing = useRef(false);
  const lastSentTime = useRef(0);
  const THROTTLE_TIME = 50; 

  useEffect(() => {
    joinRoom("12");

    onDrawingUpdate((drawingData) => {
      setLines(prevLines => [...prevLines, drawingData]);
    });

    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight * 0.7
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      offDrawingUpdate();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const throttledSendDrawing = useCallback((roomId, drawingData) => {
    const now = Date.now();
    if (now - lastSentTime.current >= THROTTLE_TIME) {
      sendDrawing(roomId, drawingData);
      lastSentTime.current = now;
    }
  }, []);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine = {
      points: [pos.x, pos.y],
      strokeWidth: strokeWidth,
      strokeColor: isEraser ? "#FFFFFF" : strokeColor,
      isEraser: isEraser,
      globalCompositeOperation: isEraser ? 'destination-out' : 'source-over'
    };
    setLines([...lines, newLine]);
    throttledSendDrawing("12", newLine);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setLines((prevLines) => {
      const lastLine = prevLines[prevLines.length - 1];
      const newPoints = lastLine.points.concat([point.x, point.y]);
      const newLine = {
        points: newPoints,
        strokeWidth: lastLine.strokeWidth,
        strokeColor: lastLine.strokeColor,
        isEraser: lastLine.isEraser,
        globalCompositeOperation: lastLine.globalCompositeOperation
      };
      const updatedLines = [...prevLines.slice(0, -1), newLine];

      throttledSendDrawing("12", newLine);

      return updatedLines;
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  return (
    <main className="main">
      <div className="controls">
        <div className="control-group">
          <label htmlFor="stroke-width">Width:</label>
          <input
            id="stroke-width"
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          />
          <span>{strokeWidth}px</span>
        </div>
        <div className="control-group">
          <label htmlFor="stroke-color">Color:</label>
          <input
            id="stroke-color"
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            disabled={isEraser}
          />
        </div>
        <div className="control-group">
          <button 
            className={`tool-btn ${isEraser ? 'active' : ''}`}
            onClick={toggleEraser}
            title="Eraser"
          >
            {isEraser ? '✏️' : '🧽'}
          </button>
        </div>
      </div>
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        className="board"
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.strokeColor}
              strokeWidth={line.strokeWidth}
              lineCap="round"
              globalCompositeOperation={line.globalCompositeOperation}
            />
          ))}
        </Layer>
      </Stage>
    </main>
  );
};