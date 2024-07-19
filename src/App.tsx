import { useEffect, useRef, useState } from "react";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasPos, setCanvasPos] = useState<number[]>([]);
  const [players, setPlayers] = useState([
    {
      id: 1,
      color: "pink",
      x: 50,
      y: 50,
      radius: 20,
    },
  ]);

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext("2d");
      const { left, top } = canvasRef.current.getBoundingClientRect();
      setCanvasPos([left, top]);
    }
  }, []);

  useEffect(() => {
    clearBoard();
    players.forEach((player) => {
      ctx.current?.beginPath();
      ctx.current?.arc(
        player.x,
        player.y,
        player.radius * 5,
        0,
        Math.PI * 2,
        true
      );
      ctx.current?.moveTo(player.x + player.radius, player.y);
      ctx.current?.arc(player.x, player.y, player.radius, 0, Math.PI * 2, true);
      ctx.current?.stroke();
    });
  }, [players]);

  function clearBoard() {
    ctx.current?.clearRect(
      0,
      0,
      canvasRef.current?.width as number,
      canvasRef.current?.height as number
    );
  }

  return (
    <div
      style={{
        display: "block",
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      <canvas
        ref={canvasRef}
        width={1500}
        height={700}
        style={{
          backgroundColor: "red",
        }}
        onMouseMove={(e) => {
          const [mouseX, mouseY] = [e.clientX, e.clientY];

          const mousePosX = mouseX - canvasPos[0];
          const mousePosY = mouseY - canvasPos[1];
          console.log(mouseX, mouseY, mousePosX, mousePosY);

          const tmpPlayers = [...players];
          tmpPlayers[0].x = mousePosX;
          tmpPlayers[0].y = mousePosY;
          setPlayers(tmpPlayers);
        }}
      />
    </div>
  );
}

export default App;
