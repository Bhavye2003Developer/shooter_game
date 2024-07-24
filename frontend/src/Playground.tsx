import { useEffect, useState } from "react";
import Phaser from "phaser";
import { playersBoundariesType, playersType } from "./types";

export default function Playground() {
  const [players, setPlayers] = useState<playersType>({
    player1: {
      x: 400,
      y: 300,
      radius: 25,
      color: 0xff0000,
    },
  });



  const [playersBoundaries, setPlayersBoundaries] =
    useState<playersBoundariesType>({
      player1: {
        x: 400,
        y: 300,
        radius: 75,
        color: 0xff0000,
        isVisible: false,
      },
    });

  useEffect(() => {
    console.log("changing: ", players);
  }, [players]);

  class GameScene extends Phaser.Scene {
    constructor() {
      super();
    }

    preload() {
      console.log("preload called");
    }
    create(this: Phaser.Scene) {
      console.log("create called");

      for (let playerId of Object.keys(players)) {
        const playerIcon: Phaser.GameObjects.Arc = this.add
          .circle(
            players[playerId].x,
            players[playerId].y,
            players[playerId].radius,
            players[playerId].color
          )
          .setName(playerId)
          .setInteractive();

        this.input.setDraggable(playerIcon);
        // console.log("circle", playerIcon);

        const pl = this.add.graphics({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });

        this.input.on(
          "drag",
          (
            _: Phaser.Input.Pointer,
            gameObject: Phaser.GameObjects.GameObject,
            dragX: number,
            dragY: number
          ) => {
            const distanceFromPointOrigin =
              Math.sqrt(
                Math.pow(dragX - playersBoundaries[playerId].x, 2) +
                  Math.pow(dragY - playersBoundaries[playerId].y, 2)
              ) + players[playerId].radius;

            if (distanceFromPointOrigin <= playersBoundaries[playerId].radius) {
              playerIcon.x = dragX;
              playerIcon.y = dragY;

              console.log("gameobj name: ", gameObject.name);

              const tmpPlayers = { ...players };
              if (tmpPlayers[gameObject.name]) {
                tmpPlayers[gameObject.name].x = dragX;
                tmpPlayers[gameObject.name].y = dragY;

                const tmpPlayersBoundaries = { ...playersBoundaries };
                tmpPlayersBoundaries[gameObject.name].x = dragX;
                tmpPlayersBoundaries[gameObject.name].y = dragY;

                setPlayers(tmpPlayers);
                setPlayersBoundaries(tmpPlayersBoundaries);
              }
            }
          }
        );
      }

      for (let playerId of Object.keys(playersBoundaries)) {
        const playerBoundary = this.add
          .circle(
            playersBoundaries[playerId].x,
            playersBoundaries[playerId].y,
            playersBoundaries[playerId].radius,
            playersBoundaries[playerId].color,
            0.1
          )
          .setName(`${playerId}-boundary`)
          .setInteractive();

        this.input.setDraggable(playerBoundary);
      }
    }
  }

  return <Screen GameScene={GameScene} />;
}

function Screen({ GameScene }: { GameScene: any }) {
  useEffect(() => {
    var config = {
      type: Phaser.AUTO,
      parent: "playground",
      width: 1500,
      height: 700,
      scene: [GameScene],
    };
    new Phaser.Game(config);
  }, []);

  return (
    <div
      id="playground"
      style={{
        width: "1500px",
        height: "700px",
      }}
    ></div>
  );
}
