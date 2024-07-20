import { useEffect, useRef, useState } from "react";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasPos, setCanvasPos] = useState<number[]>([]);
  const [players, setPlayers] = useState({
    1: {
      color: "pink",
      x: 300,
      y: 300,
      radius: 20,
    },
    2: {
      color: "pink",
      x: 900,
      y: 300,
      radius: 20,
    },
  });
  const [playersBoundaries, setPlayersBoundaries] = useState({
    1: {
      x: 300,
      y: 300,
      radius: 80,
      isVisible: false,
    },
    2: {
      x: 900,
      y: 300,
      radius: 80,
      isVisible: false,
    },
  });

  interface curPlayerInfoType {
    id: null | number;
    x: null | number;
    y: null | number;
  }
  const curPlayerInfo = useRef<curPlayerInfoType>({
    id: 1,
    x: 300,
    y: 300,
  });
  const isMouseDown = useRef(false);
  const activePlayerId = useRef(1);

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext("2d");
      const { left, top } = canvasRef.current.getBoundingClientRect();
      setCanvasPos([left, top]);
    }
  }, []);

  useEffect(() => {
    clearBoard();
    for (let playerId of Object.keys(players)) {
      ctx.current?.beginPath();
      ctx.current?.arc(
        players[playerId].x,
        players[playerId].y,
        players[playerId].radius,
        0,
        Math.PI * 2,
        true
      );
      ctx.current?.stroke();
    }

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
        style={{}}
        onMouseMove={(e) => {
          if (isMouseDown.current) {
            const [mouseX, mouseY] = [e.clientX, e.clientY];

            const mousePosX = mouseX - canvasPos[0];
            const mousePosY = mouseY - canvasPos[1];
            console.log(mouseX, mouseY, mousePosX, mousePosY);

            const tmpPlayers = { ...players };

            const tmpX = tmpPlayers[activePlayerId.current].x;
            const tmpY = tmpPlayers[activePlayerId.current].y;

            const playerCornerCoordinateX = mousePosX;
            const playerCornerCoordinateY = mousePosY;

            // console.log(
            //   "playerCorner: ",
            //   playerCornerCoordinateX,
            //   playerCornerCoordinateY
            // );

            const borderCoordinateX =
              playersBoundaries[activePlayerId.current].x;
            const borderCoordinateY =
              playersBoundaries[activePlayerId.current].y;

            const mouseDistanceFromPrevPoint = Math.sqrt(
              Math.pow(borderCoordinateX - playerCornerCoordinateX, 2) +
                Math.pow(borderCoordinateY - playerCornerCoordinateY, 2)
            );

            if (mouseDistanceFromPrevPoint <= 80) {
              tmpPlayers[activePlayerId.current].x = mousePosX;
              tmpPlayers[activePlayerId.current].y = mousePosY;
              setPlayers(tmpPlayers);
              curPlayerInfo.current = {
                x: mousePosX,
                y: mousePosY,
                id: activePlayerId.current,
              };
            }
          }
        }}
        onMouseDown={(e) => {
          console.log("clicked");
          const [mouseX, mouseY] = [e.clientX, e.clientY];
          const mousePosX = mouseX - canvasPos[0];
          const mousePosY = mouseY - canvasPos[1];

          for (let playerId of Object.keys(players)) {
            const PlayerDistanceFromPoint = Math.sqrt(
              Math.pow(mousePosX - players[playerId].x, 2) +
                Math.pow(mousePosY - players[playerId].y, 2)
            );
            if (PlayerDistanceFromPoint <= players[playerId].radius) {
              console.log("active: ", playerId);
              activePlayerId.current = Number(playerId);
              break;
            }
          }
          isMouseDown.current = true;
        }}
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
