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

const convertMatchDbObjectToResponseObject = (match) => {
  return {
    matchId: match.match_id,
    match: match.match,
    year: match.year,
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

//Get request
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayer = `select * from player_details where player_id=${playerId}`;
  const singlePlayer = await db.get(getPlayer);
  response.send(convertPlayerDbObjectToResponseObject(singlePlayer));
});

//Put request
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName } = request.body;
  const updatePlayer = `update player_details set player_name='${playername}' where player_id=${playerId}`;
  await db.get(updatePlayer);
  response.send("Player Details Updated");
});

//Get request
app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } = request.params;
  const getMatch = `select * from match_details where match_id=${matchId}`;
  const singleMatch = await db.get(getMatch);
  response.send(convertMatchDbObjectToResponseObject(singleMatch));
});

//Get request
app.get("/players/:playerId/matches/", async (request, response) => {
  const { playerId } = request.params;
  const getMatches = `select 
  match_details.match_id as match_id,match_details.match as match,match_details.year as year 
  from
  match_details join player_match_score 
  on match_details.match_id=player_match_score.match_id
  where player_match_score.player_id=${playerId}`;
  const matches = await db.all(getMatches);
  response.send(
    matches.map((eachMatch) => convertMatchDbObjectToResponseObject(eachMatch))
  );
});

//get request
app.get("/matches/:matchId/players/", async (request, response) => {
  const { matchId } = request.params;
  const getAllPlayers = `select 
    player_details.player_id,player_details.player_name
    from player_details natural join player_match_score
    where player_match_score.match_id=${matchId}`;
  const players = await db.all(getAllPlayers);
  console.log(players);
  response.send(
    players
    // players.map((player) => convertPlayerDbObjectToResponseObject(player))
  );
});
