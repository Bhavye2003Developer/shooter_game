const express = require("express");
const cors = require("cors");
const port = 3000;
const app = express();
var expressWs = require("express-ws")(app);
const game_routes = require("./game_routes");

app.use(cors());
app.use("/play", game_routes);

app.listen(port, () => {
  console.log(`app listening on port ${port}...`);
});
