import { Stage, Layer, Line } from "react-konva";
import { useState, useRef, useEffect } from "react";
import { joinRoom, sendDrawing, onDrawingUpdate, offDrawingUpdate }
  from "../services/socketService";
import "../styles/global/Whiteboard.css";

export const Whiteboard = () => {
  const [lines, setLines] = useState([]);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight * 0.7
  });
  const isDrawing = useRef(false);

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

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, {
      points: [pos.x, pos.y],
      strokeWidth: strokeWidth,
      strokeColor: strokeColor
    }]);
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
        strokeColor: lastLine.strokeColor
      };
      const updatedLines = [...prevLines.slice(0, -1), newLine];

      sendDrawing("12", newLine);

      return updatedLines;
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
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
          />
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
            />
          ))}
        </Layer>
      </Stage>
    </main>
  );
};