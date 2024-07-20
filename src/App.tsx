import { useEffect, useRef, useState } from "react";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasPos, setCanvasPos] = useState<number[]>([]);
  const [players, setPlayers] = useState([
    {
      id: 1,
      color: "pink",
      x: 800,
      y: 300,
      radius: 20,
    },
  ]);
  const [playersBoundaries, setPlayersBoundaries] = useState({
    1: {
      x: 800,
      y: 300,
      radius: 80,
    },
  });

  interface curPlayerInfoType {
    x: null | number;
    y: null | number;
    id: null | number;
  }
  const curPlayerInfo = useRef<curPlayerInfoType>({
    x: null,
    y: null,
    id: null,
  });
  const isMouseDown = useRef(false);

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
      ctx.current?.arc(player.x, player.y, player.radius, 0, Math.PI * 2, true);
      ctx.current?.stroke();
    });

    Object.keys(playersBoundaries).forEach((playerId) => {
      ctx.current?.beginPath();
      ctx.current?.arc(
        playersBoundaries[playerId].x,
        playersBoundaries[playerId].y,
        playersBoundaries[playerId].radius,
        0,
        Math.PI * 2,
        true
      );
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
          if (isMouseDown.current) {
            const [mouseX, mouseY] = [e.clientX, e.clientY];

            const mousePosX = mouseX - canvasPos[0];
            const mousePosY = mouseY - canvasPos[1];
            console.log(mouseX, mouseY, mousePosX, mousePosY);

            const tmpPlayers = [...players];

            const tmpX = tmpPlayers[0].x;
            const tmpY = tmpPlayers[0].y;

            const playerCornerCoordinateX = mousePosX;
            const playerCornerCoordinateY = mousePosY;

            console.log(
              "playerCorner: ",
              playerCornerCoordinateX,
              playerCornerCoordinateY
            );

            const borderCoordinateX = playersBoundaries[tmpPlayers[0].id].x;
            const borderCoordinateY = playersBoundaries[tmpPlayers[0].id].y;

            const mouseDistanceFromPrevPoint = Math.sqrt(
              Math.pow(borderCoordinateX - playerCornerCoordinateX, 2) +
                Math.pow(borderCoordinateY - playerCornerCoordinateY, 2)
            );

            console.log("pointerRadius: ", mouseDistanceFromPrevPoint);

            if (mouseDistanceFromPrevPoint <= 80) {
              tmpPlayers[0].x = mousePosX;
              tmpPlayers[0].y = mousePosY;
              setPlayers(tmpPlayers);
              curPlayerInfo.current = {
                x: mousePosX,
                y: mousePosY,
                id: tmpPlayers[0].id,
              };
            }
          }
        }}
        onMouseDown={() => (isMouseDown.current = true)}
        onMouseUp={() => {
          const tmpPlayersBoundaries = { ...playersBoundaries };
          tmpPlayersBoundaries[curPlayerInfo.current.id].x =
            curPlayerInfo.current.x;
          tmpPlayersBoundaries[curPlayerInfo.current.id].y =
            curPlayerInfo.current.y;
          setPlayersBoundaries(tmpPlayersBoundaries);
          isMouseDown.current = false;
        }}
      />
    </div>
  );
}

export default App;
