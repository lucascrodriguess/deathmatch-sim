import { useState } from "react";

import "./App.css";

import Player from "./components/Player/Player";
import Connection from "./components/Connection/Connection";
import Server from "./components/Server/Server";
import Logs from "./components/Logs/Logs";
import GameMap from "./components/GameMap/GameMap";

export default function App() {

  // PLAYERS
  const [players, setPlayers] = useState([
    { id: "A", x: 0, y: 0, life: 100 },
    { id: "B", x: 1, y: 1, life: 100 },
  ]);

  // GAMEMAP
  const [gameMap] = useState([
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0]
  ]);

  // LOGS
  const [logs, setLogs] = useState([]);

  // NETWORK STATES
  const [activeLine, setActiveLine] = useState(null);
  const [sendArrow, setSendArrow] = useState(null);
  const [receiveArrow, setReceiveArrow] = useState(null);

  // SERVER
  const [serverActive, setServerActive] = useState(false);

  // LOG SYSTEM
  function addLog(message) {

    const time = new Date().toLocaleTimeString();

    setLogs((prev) => [
      `[${time}] ${message}`,
      ...prev
    ]);
  }

  // SERVER EFFECT
  function activateServer() {

    setServerActive(true);

    setTimeout(() => {
      setServerActive(false);
    }, 600);
  }

  // MOVE PLAYER
  function movePlayer(playerId, playerX, playerY) {

    // UPDATE PLAYER
    setPlayers((prev) =>
      prev.map((current) => {

        if (current.id === playerId){
          return{
            ...current,
            x: current.x + playerX,
            y: current.y + playerY,
          };
        }

        else{
          return current;
        }
      })
    );

    // ACENDE E APAGA LINHA E SETA
    setActiveLine(playerId);
    setSendArrow(playerId);

    setTimeout(() => {
      setActiveLine(null);
    }, 600);

    setTimeout(() => {
      setSendArrow(null);
    }, 600);


    addLog(`Player ${playerId} enviou MOVE`);

    // SERVER PROCESS
    setTimeout(() => {

      activateServer();

      addLog(
        `Servidor processou movimento do Player ${playerId}`
      );

      // OTHER PLAYERS RECEIVE
      players.forEach((player) => {

        // ACENDE E APAGA LINHA E SETA
        if (player.id !== playerId) {
          
          setTimeout(() => {
            setActiveLine(player.id);
          }, 600);

          setTimeout(() => {
            setReceiveArrow(player.id);
          }, 600);

          setTimeout(() => {
            setActiveLine(null);
          }, 1200);

          setTimeout(() => {
            setReceiveArrow(null);
          }, 1200);

        }

      });

    }, 600);
  }

  return (

    <div className="app">

      {/* HEADER */}
      <div className="header">

        <h1>
          SIMULAÇÃO - SISTEMA DISTRIBUÍDO
        </h1>

        <p>
          Fluxo de dados em um jogo multiplayer online
        </p>

      </div>

      {/* SIMULATION */}
      <div className="simulation-area">

        {/*
        <GameMap
          gameMap={gameMap}
          players={players}
        />
        */}

        {/* PLAYERS */}
        <div className="players-column">

          {players.map((player) => (

            <div
              className="player-row"
              key={player.id}
            >

              <Player
                player={player}
                onMove={movePlayer}
              />

              <Connection
                active={
                  activeLine === player.id
                }

                sending={
                  sendArrow === player.id
                }

                receiving={
                  receiveArrow === player.id
                }
              />

            </div>

          ))}

        </div>

        {/* SERVER */}
        <Server
          active={serverActive}
        />

      </div>

      {/* LOGS */}
      <Logs logs={logs} />

    </div>
  );
}