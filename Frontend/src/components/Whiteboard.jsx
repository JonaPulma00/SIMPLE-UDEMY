import { Stage, Layer, Line } from "react-konva";
import { useState, useRef } from "react";
import "../styles/global/Whiteboard.css";

export const Whiteboard = () => {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
    console.log(pos)
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setLines((prevLines) => {
      const lastLine = prevLines[prevLines.length - 1];
      const newPoints = lastLine.points.concat([point.x, point.y]);
      const updatedLines = [...prevLines.slice(0, -1), { points: newPoints }];
      return updatedLines;
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <main className="main">
      <Stage
        width={window.innerWidth}
        height={400}
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
              stroke="black"
              strokeWidth={2}
              lineCap="round"
            />
          ))}
        </Layer>
      </Stage>
    </main>
  );
};