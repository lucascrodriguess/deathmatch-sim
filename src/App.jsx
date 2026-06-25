import { useState } from "react";

import "./App.css";

import Player from "./components/Player/Player";
import Connection from "./components/Connection/Connection";
import Server from "./components/Server/Server";
import Logs from "./components/Logs/Logs";

export default function App() {

  // PLAYERS
  const [players, setPlayers] = useState([
    { id: "A", steps: 0, life: 100 },
    { id: "B", steps: 0, life: 100 },
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
    }, 500);
  }

  // MOVE PLAYER
  function movePlayer(playerId) {

    // UPDATE PLAYER
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId
          ? {
              ...player,
              steps: player.steps + 1
            }
          : player
      )
    );

    // LINE EFFECT
    setActiveLine(playerId);

    setTimeout(() => {
      setActiveLine(null);
    }, 600);

    // SEND EFFECT
    setSendArrow(playerId);

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

        if (player.id !== playerId) {

          setReceiveArrow(player.id);

          setTimeout(() => {
            setReceiveArrow(null);
          }, 600);

        }

      });

    }, 300);
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