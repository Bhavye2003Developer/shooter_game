//movement done

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

export default function Playground() {
  const phaserRef = useRef(null);
  const gameRef = useRef(null);
  const playerRef = useRef(null);
  const boundaryGraphicsRef = useRef(null);
  const boundaryVisibleRef = useRef(false);
  const boundaryCenterRef = useRef({ x: 0, y: 0 });
  const boundaryRadius = 100;
  const playerRadius = 30;

  useEffect(() => {
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

      const player = this.add.circle(
        window.innerWidth / 2,
        window.innerHeight / 2,
        playerRadius,
        0x0000ff
      );
      playerRef.current = player;

      const graphics = this.add.graphics();
      boundaryGraphicsRef.current = graphics;

      player.setInteractive();
      this.input.setDraggable(player);

      this.input.on("dragstart", (pointer, gameObject) => {
        console.log("Drag started");
        gameObject.setAlpha(0.5);
      });

      this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
        if (boundaryVisibleRef.current) {
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
        } else {
          gameObject.setPosition(dragX, dragY);
        }
      });

      this.input.on("dragend", (pointer, gameObject) => {
        console.log("Drag ended");
        gameObject.setAlpha(1);
        clearBoundary();
      });

      player.on("pointerdown", () => {
        console.log("Player clicked!");
        toggleBoundary();
      });
    }

    function update() {
      // No update logic needed now
    }

    function toggleBoundary() {
      const graphics = boundaryGraphicsRef.current;
      const player = playerRef.current;

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

    function clearBoundary() {
      const graphics = boundaryGraphicsRef.current;
      if (!graphics) return;
      graphics.clear();
      boundaryVisibleRef.current = false;
    }

    return () => {
      console.log("Destroying game...");
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return <div ref={phaserRef} style={{ width: "100%", height: "100%" }} />;
}

// export default Playground;
