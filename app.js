const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbpath = path.join(__dirname, "cricketMatchDetails.db");
let db = null;

const intializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3002, () => {
      console.log("server running at http://localhost/3002");
    });
  } catch (e) {
    console.log(`${e.message}`);
    process.exit(1);
  }
};

intializeDBandServer();

const convertPlayerDbObjectToResponseObject = (player) => {
  return {
    playerId: player.player_id,
    PlayerName: player.player_name,
  };
};
//Get request
app.get("/players/", async (request, response) => {
  const allPlayers = `select * from player_details`;
  const players = await db.all(allPlayers);
  response.send(
    players.map((eachPlayer) =>
      convertPlayerDbObjectToResponseObject(eachPlayer)
    )
  );
});