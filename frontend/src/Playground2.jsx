import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

const Playground = () => {
  const phaserRef = useRef(null);
  const gameRef = useRef(null);
  const playersRef = useRef([]);
  const boundaryGraphicsRef = useRef(null);
  const boundaryVisibleRef = useRef(false);
  const boundaryCenterRef = useRef({ x: 0, y: 0 });
  const boundaryRadius = 100;
  const playerRadius = 30;
  const isDraggingRef = useRef(false);
  const playerId = useRef(null);

  function addPlayer(x, y, color, playerId) {
    console.log("inside addPlayer: ", playerId);
    const player = gameRef.current.scene.scenes[0].add.graphics({ x, y });
    player.fillStyle(color, 1);
    player.fillCircle(0, 0, playerRadius);
    player.setInteractive(
      new Phaser.Geom.Circle(0, 0, playerRadius),
      Phaser.Geom.Circle.Contains
    );
    player.name = playerId;

    // Set draggable
    gameRef.current.scene.scenes[0].input.setDraggable(player);

    // Add event listeners
    player.on("pointerdown", (pointer) => {
      console.log("Player clicked!");
      console.log(isDraggingRef.current);
      toggleBoundary(player);
    });
    return player;
  }

  function toggleBoundary(player) {
    if (player.name === playerId.current) {
      const graphics = boundaryGraphicsRef.current;

      if (!graphics || !player) return;

      if (boundaryVisibleRef.current) {
        graphics.clear();
        boundaryVisibleRef.current = false;
      } else {
        const playerX = player.x;
        const playerY = player.y;

        boundaryCenterRef.current = { x: playerX, y: playerY };

        graphics.lineStyle(3, 0xff0000);
        graphics.strokeCircle(playerX, playerY, boundaryRadius);
        boundaryVisibleRef.current = true;
      }
    }
  }

  function clearBoundary() {
    const graphics = boundaryGraphicsRef.current;
    if (!graphics) return;
    graphics.clear();
    boundaryVisibleRef.current = false;
  }

  useEffect(() => {
    const websocket = new WebSocket("ws://127.0.0.1:3000/play");

    websocket.onopen = (e) => {
      console.log("connected");
      websocket.send(
        JSON.stringify({
          playerId: null,
          x: Math.random() * 300,
          y: Math.random() * 400,
          color: 0x0000ff,
        })
      ); // player initial info
    };

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: phaserRef.current,
      scene: {
        preload,
        create,
        update,
      },
    };

    gameRef.current = new Phaser.Game(config);

    function preload() {
      console.log("Preloading assets...");
    }

    function create() {
      console.log("Creating scene...");

      this.cameras.main.setBackgroundColor("#242424");

      const graphics = this.add.graphics();
      boundaryGraphicsRef.current = graphics;

      this.input.on("dragstart", (pointer, gameObject) => {
        console.log("Drag started");
        gameObject.setAlpha(0.5);
      });

      this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
        console.log(
          `Dragging: (${dragX}, ${dragY}), ${gameObject.name}, ${playerId.current}`
        );
        if (gameObject.name == playerId.current) {
          isDraggingRef.current = true;
          if (!boundaryVisibleRef.current) {
            toggleBoundary(gameObject);
          }
          const distance = Phaser.Math.Distance.Between(
            boundaryCenterRef.current.x,
            boundaryCenterRef.current.y,
            dragX,
            dragY
          );
          const maxDistance = boundaryRadius - playerRadius;
          if (distance <= maxDistance) {
            gameObject.setPosition(dragX, dragY);
          } else {
            const angle = Phaser.Math.Angle.Between(
              boundaryCenterRef.current.x,
              boundaryCenterRef.current.y,
              dragX,
              dragY
            );
            const constrainedX =
              boundaryCenterRef.current.x + maxDistance * Math.cos(angle);
            const constrainedY =
              boundaryCenterRef.current.y + maxDistance * Math.sin(angle);
            gameObject.setPosition(constrainedX, constrainedY);
          }
        }
      });

      this.input.on("dragend", (pointer, gameObject) => {
        console.log("Drag ended", gameObject.x, gameObject.y, gameObject.name);
        gameObject.setAlpha(1);
        if (gameObject.name == playerId.current) {
          if (isDraggingRef.current) {
            clearBoundary();
            isDraggingRef.current = false;
          }
          websocket.send(
            JSON.stringify({
              playerId: playerId.current,
              status: "POSCHANGE",
              x: gameObject.x,
              y: gameObject.y,
            })
          );
        }
      });
    }

    websocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.status === "POSUPDATE") {
        console.log("players pos updated: ", data);
        console.log("prev players info: ", playersRef.current);
        // re rendering all players with updated coordinates
        playersRef.current.forEach((player) => {
          player.destroy();
        });
        playersRef.current = [];
        data.players.forEach((player) => {
          console.log(
            `playerid: ${player.playerId}\nx: ${player.x} y: ${player.y}`
          );
          const [x, y] = [player.x, player.y];
          const playerInfo = addPlayer(x, y, player.color, player.playerId);
          playersRef.current.push(playerInfo);
          console.log("playerInfo: ", playerInfo, "name: ", playerInfo.name);
          console.log("rendering player: ", player);
        });
      }
      if (data.status === "NEWPLAYER") {
        console.log("player init: ", data);
        playerId.current = data.playerId;
      }
    };

    function update() {}

    return () => {
      console.log("Destroying game...");
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return <div ref={phaserRef} style={{ width: "100%", height: "100%" }} />;
};

export default Playground;
