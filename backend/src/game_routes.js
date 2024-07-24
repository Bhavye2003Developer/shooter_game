const express = require("express");
const router = express.Router();

const players = [];
const clients = [];

let playerId = 1;

function broadcastPlayersPos() {
  clients.forEach((client) =>
    client.send(
      JSON.stringify({
        status: "POSUPDATE",
        players,
      })
    )
  );
}

router.ws("/", function (ws, _) {
  ws.on("message", function (msg) {
    console.log("msg found: ", msg);
    const playerInfo = JSON.parse(msg);
    const isPlayerExisted = playerInfo.playerId !== null;
    if (!isPlayerExisted) {
      console.log("player initial conn req", playerInfo);
      players.push({ ...playerInfo, playerId });
      clients.push(ws);
      ws.send(
        JSON.stringify({
          status: "NEWPLAYER",
          playerId,
        })
      );
      broadcastPlayersPos();
      ++playerId;
    } else {
      console.log("found playerinfo: ", playerInfo);
      if (playerInfo.status === "POSCHANGE") {
        const playerIndex = players.findIndex(
          (player) => player.playerId === playerInfo.playerId
        );
        players[playerIndex] = {
          ...players[playerIndex],
          x: playerInfo.x,
          y: playerInfo.y,
        };
        console.log("updated: ", players);
        broadcastPlayersPos();
      }
    }
  });
});

module.exports = router;
