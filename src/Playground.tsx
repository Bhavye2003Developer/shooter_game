import { useEffect, useState } from "react";
import Phaser from "phaser";
import { playersType } from "./types";

export default function Playground() {
  const [players, setPlayers] = useState<playersType>({
    player1: {
      x: 400,
      y: 300,
      radius: 25,
      color: 0xff0000,
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
        console.log("circle", playerIcon);

        this.input.on(
          "drag",
          (
            _: Phaser.Input.Pointer,
            gameObject: Phaser.GameObjects.GameObject,
            dragX: number,
            dragY: number
          ) => {
            playerIcon.x = dragX;
            playerIcon.y = dragY;
            const tmpPlayers = { ...players };
            tmpPlayers[gameObject.name].x = dragX;
            tmpPlayers[gameObject.name].y = dragY;
            setPlayers(tmpPlayers);
          }
        );

        playerIcon.addListener("pointerdown", () => {
          console.log("circle clicked: ", playerIcon.name);
        });
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
