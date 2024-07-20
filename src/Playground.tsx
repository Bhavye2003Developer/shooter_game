import { useEffect } from "react";
import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    console.log("preload called");
  }
  create(this: Phaser.Scene) {
    console.log("create called");
    const circle: Phaser.GameObjects.Arc = this.add
      .circle(400, 300, 25, 0xff0000)
      .setName("player1")
      .setInteractive();

    console.log("circle", circle);

    circle.addListener("click", () => {
      console.log("circle clicked");
    });

    this.input.on(
      "pointerdown",
      (
        _pointer: Phaser.Input.Pointer,
        playerClicked: Phaser.GameObjects.GameObject[]
      ) => {
        if (playerClicked.length > 0) {
          console.log("plpayer clicked: ", playerClicked[0].name);
        } else console.log("no player is clicked");
      }
    );

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      console.log("move: ", pointer.position);
    });
  }
}

export default function Playground() {
  useEffect(() => {
    var config = {
      type: Phaser.AUTO,
      parent: "playground",
      width: 1500,
      height: 700,
      scene: [GameScene],
    };
    // const game =
    new Phaser.Game(config);
  }, []);

  return (
    <div>
      <div
        id="playground"
        style={{
          width: "1500px",
          height: "700px",
        }}
      ></div>
    </div>
  );
}
