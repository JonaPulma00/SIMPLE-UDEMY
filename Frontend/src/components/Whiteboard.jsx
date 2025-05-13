import { Stage, Layer, Line } from "react-konva";
import { useState, useRef, useEffect, useCallback } from "react";
import { socketService } from "../services/socketService";
import { useUser } from "../context/UserContext";
import "../styles/global/Whiteboard.css";

export const Whiteboard = () => {
  const [lines, setLines] = useState([]);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [isEraser, setIsEraser] = useState(false);
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const isDrawing = useRef(false);
  const lastSentTime = useRef(0);
  const THROTTLE_TIME = 50;
  const boardContainerRef = useRef(null);
  const { user } = useUser();


  useEffect(() => {
    if (user) {
      socketService.joinRoom("12", user.uuid);

      socketService.onDrawingUpdate((drawingData) => {
        setLines(prevLines => [...prevLines, drawingData]);
      });
    }

    const updateStageSize = () => {
      if (boardContainerRef.current) {
        const container = boardContainerRef.current.getBoundingClientRect();
        setStageSize({
          width: container.width,
          height: container.height
        });
      }
    };


    updateStageSize();
    window.addEventListener('resize', updateStageSize);

    return () => {
      socketService.offDrawingUpdate();
      window.removeEventListener('resize', updateStageSize);
    };
  }, [user]);

  const throttledSendDrawing = useCallback((roomId, drawingData) => {
    const now = Date.now();
    if (now - lastSentTime.current >= THROTTLE_TIME) {
      socketService.sendDrawing(roomId, drawingData);
      lastSentTime.current = now;
    }
  }, []);

  const handleMouseDown = (e) => {
    if(!user || !user.isInstructor) return;
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
    if(!user || !user.isInstructor) return;
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

  const handleClear = () => {
    setLines([]);
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
            max="50"
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
            {isEraser ? <i class="fa-sharp fa-solid fa-pencil"></i> : <i class="fa-solid fa-eraser"></i>}
          </button>
        </div>
        <div className="control-group">
          <button
            className="tool-btn"
            onClick={handleClear}
            title="Clear Everything"
          >
            <i className="fa-solid fa-trash"></i> Clear
          </button>
        </div>
      </div>
      <div
        className="board"
        ref={boardContainerRef}
        style={{ position: "relative" }}
      >
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          style={{ width: "100%", height: "100%" }}
          className="board-stage"
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
      </div>
    </main>
  );
};