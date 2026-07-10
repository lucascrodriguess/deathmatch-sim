import { useState } from "react";
import "./App.css";

import Player from "./components/Player/Player";
import Connection from "./components/Connection/Connection";
import Server from "./components/Server/Server";
import Logs from "./components/Logs/Logs";
import GameMap from "./components/GameMap/GameMap";

export default function App() {
  // ESTADO DO MENU DE LOG
  const [isLogsOpen, setIsLogsOpen] = useState(true);

  // CONFIGURAÇÕES DE ESCALABILIDADE
  const TOTAL_PLAYERS = 3; 

  // GAMEMAP
  const [gameMap] = useState([
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ]);

  const mapWidth = gameMap[0].length;
  const mapHeight = gameMap.length;

  // ESTADOS DE CONTROLE DO SISTEMA DISTRIBUÍDO
  const [latency, setLatency] = useState(500); // Latência em milissegundos
  const [packetLossActive, setPacketLossActive] = useState(false); // Simulação de perda de pacotes

  // FUNÇÃO AUXILIAR: Gera posições aleatórias únicas no mapa com SCORE embutido
  function generateInitialPlayers(count) {
    const list = [];
    const usedPositions = new Set();
    const maxPositions = mapWidth * mapHeight;
    const finalCount = Math.min(count, maxPositions);

    for (let i = 0; i < finalCount; i++) {
      const playerId = String.fromCharCode(65 + i); 
      let randomX, randomY, coordKey;
      
      do {
        randomX = Math.floor(Math.random() * mapWidth);
        randomY = Math.floor(Math.random() * mapHeight);
        coordKey = `${randomX},${randomY}`;
      } while (usedPositions.has(coordKey));

      usedPositions.add(coordKey);
      // Adicionado score: 0 dinamicamente para cada player criado
      list.push({ id: playerId, x: randomX, y: randomY, life: 100, score: 0 });
    }
    return list;
  }

  // ESTADOS PRINCIPAIS
  const [players, setPlayers] = useState(() => generateInitialPlayers(TOTAL_PLAYERS));
  const [logs, setLogs] = useState([]);
  const [serverActive, setServerActive] = useState(false);

  // REDE INDEPENDENTE POR ID (Dicionários)
  const [activeLines, setActiveLines] = useState({});
  const [sendArrows, setSendArrows] = useState({});
  const [receiveArrows, setReceiveArrows] = useState({});

  // LOG SYSTEM
  function addLog(message) {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${message}`, ...prev]);
  }

  // SERVER PING EFFECT
  function activateServer() {
    setServerActive(true);
    setTimeout(() => setServerActive(false), 300);
  }

  // UTILS DE ANIMAÇÃO DE REDE INDEPENDENTE (Latência real / 2)
  function triggerClientSend(playerId) {
    setActiveLines((prev) => ({ ...prev, [playerId]: true }));
    setSendArrows((prev) => ({ ...prev, [playerId]: true }));

    setTimeout(() => {
      setActiveLines((prev) => ({ ...prev, [playerId]: false }));
      setSendArrows((prev) => ({ ...prev, [playerId]: false }));
    }, (latency / 2) - 100 > 0 ? (latency / 2) - 100 : 50);
  }

  function triggerClientReceive(playerId) {
    setActiveLines((prev) => ({ ...prev, [playerId]: true }));
    setReceiveArrows((prev) => ({ ...prev, [playerId]: true }));

    setTimeout(() => {
      setActiveLines((prev) => ({ ...prev, [playerId]: false }));
      setReceiveArrows((prev) => ({ ...prev, [playerId]: false }));
    }, (latency / 2) - 100 > 0 ? (latency / 2) - 100 : 50);
  }

  // SIMULADOR DE PERDA DE PACOTE
  function isPacketLost() {
    if (!packetLossActive) return false;
    return Math.random() < 0.3; // 30% de chance de perda de pacotes
  }

// MOVE PLAYER (HIGIENIZADO E IMUNE A DUPLICAÇÃO DO STRICT MODE)
  function movePlayer(playerId, playerX, playerY) {
    let moveAllowed = true;
    let isCollision = false;
    let targetX = 0;
    let targetY = 0;

    const currentPlayer = players.find((p) => p.id === playerId);
    if (!currentPlayer) return;

    targetX = currentPlayer.x + playerX;
    targetY = currentPlayer.y + playerY;

    if (targetX < 0 || targetX >= mapWidth || targetY < 0 || targetY >= mapHeight) {
      moveAllowed = false;
    }

    const hasAnotherPlayer = players.some(
      (p) => p.id !== playerId && p.x === targetX && p.y === targetY
    );

    if (hasAnotherPlayer) {
      isCollision = true;
      moveAllowed = false;
    }

    if (!moveAllowed) {
      if (isCollision) {
        addLog(`[REJEITADO PELO CLIENTE] Player ${playerId} colidiria em (${targetX}, ${targetY})!`);
      } else {
        addLog(`[REJEITADO PELO CLIENTE] Player ${playerId} ultrapassaria limites do mapa!`);
      }
      return;
    }

    triggerClientSend(playerId);
    addLog(`[REDE - ENVIO] Player ${playerId} transmitindo pacote MOVE para (${targetX}, ${targetY}) com uplink de ${latency / 2}ms...`);

    if (isPacketLost()) {
      setTimeout(() => {
        addLog(`[FALHA DE REDE] Pacote MOVE do Player ${playerId} foi perdido na subida para o servidor.`);
      }, latency / 2);
      return;
    }

    setTimeout(() => {
      activateServer();
      const time = new Date().toLocaleTimeString();
      
      let logsNovosDoTurno = [];

      setPlayers((currentPlayers) => {
        const conflict = currentPlayers.some((p) => p.id !== playerId && p.x === targetX && p.y === targetY);
        let localLogs = [];
        
        if (conflict) {
          localLogs.push(`[SERVER - CONCORRÊNCIA] Movimento do Player ${playerId} negado. Posição já foi ocupada por latência.`);
          logsNovosDoTurno = localLogs;
          return currentPlayers;
        }

        localLogs.push(`[SERVER] Estado do mapa atualizado: Player ${playerId} movido para (${targetX}, ${targetY})`);
        logsNovosDoTurno = localLogs;

        return currentPlayers.map((p) => {
          if (p.id === playerId) {
            return { ...p, x: targetX, y: targetY };
          }
          return p;
        });
      });

      // Sincronia limpa dos Logs de Movimento fora do atualizador de estado
      setTimeout(() => {
        if (logsNovosDoTurno.length > 0) {
          setLogs((prevLogs) => {
            const formatados = logsNovosDoTurno.map(msg => `[${time}] ${msg}`);
            return [...formatados, ...prevLogs];
          });
        }
      }, 0);

      // Broadcast do movimento para os outros nós
      setTimeout(() => {
        const totalNós = TOTAL_PLAYERS;
        for (let i = 0; i < totalNós; i++) {
          const idProcurado = String.fromCharCode(65 + i);
          if (idProcurado !== playerId) {
            if (isPacketLost()) {
              addLog(`[FALHA DE REDE] Broadcast de atualização não alcançou o Player ${idProcurado} (Perda de Downlink).`);
            } else {
              triggerClientReceive(idProcurado);
            }
          }
        }
        addLog(`[BROADCAST] Estado atualizado enviado de volta a todos os nós.`);
      }, 150);

    }, latency / 2);
  }
  
// SHOOT PLAYER (CORRIGIDO: REPARO NOS LOGS E BROADCAST TOTAL)
  function shootPlayer(playerId) {
    const shooter = players.find((p) => p.id === playerId);
    if (!shooter) return;

    triggerClientSend(playerId);
    addLog(`[REDE - ENVIO] Player ${playerId} enviando pacote de ataque SHOOT...`);

    if (isPacketLost()) {
      setTimeout(() => {
        addLog(`[FALHA DE REDE] Comando SHOOT do Player ${playerId} evaporou na rede.`);
      }, latency / 2);
      return;
    }

    setTimeout(() => {
      activateServer();
      const time = new Date().toLocaleTimeString();

      // 🔴 RESOLUÇÃO DO PROBLEMA:
      // Calculamos as consequências do tiro ANTES de atualizar os estados.
      // Assim, criamos os logs em tempo de execução real.
      let hitSomeone = false;
      let killCount = 0;
      let localLogs = [];

      // Passamos por uma leitura idêntica do estado atual dos players para gerar os logs estáticos
      players.forEach((target) => {
        if (target.id === playerId) return;

        const hitX = target.y === shooter.y;
        const hitY = target.x === shooter.x;

        if (hitX || hitY) {
          hitSomeone = true;
          const newLife = target.life - 25;
          if (newLife <= 0) {
            killCount++;
            localLogs.push(`[SERVER - MORTE] 💀 Player ${target.id} foi eliminado por ${playerId}!`);
          } else {
            localLogs.push(`[SERVER - HIT] 💥 Player ${target.id} foi atingido por ${playerId}! Vida restante: ${newLife}%`);
          }
        }
      });

      if (!hitSomeone) {
        localLogs.push(`[SERVER] O disparo do Player ${playerId} não atingiu nenhuma entidade.`);
      }

      // Atualiza o estado dos jogadores de forma limpa
      setPlayers((currentPlayers) => {
        const actualShooter = currentPlayers.find((p) => p.id === playerId);
        if (!actualShooter) return currentPlayers;

        let updatedPlayers = currentPlayers.map((target) => {
          if (target.id === playerId) return target;

          const hitX = target.y === actualShooter.y;
          const hitY = target.x === actualShooter.x;

          if (hitX || hitY) {
            const newLife = target.life - 25;
            if (newLife <= 0) {
              let newX, newY;
              do {
                newX = Math.floor(Math.random() * mapWidth);
                newY = Math.floor(Math.random() * mapHeight);
              } while (currentPlayers.some((p) => p.x === newX && p.y === newY));

              return { ...target, x: newX, y: newY, life: 100 };
            } else {
              return { ...target, life: newLife };
            }
          }
          return target;
        });

        if (killCount > 0) {
          updatedPlayers = updatedPlayers.map((p) => {
            if (p.id === playerId) {
              const currentScore = p.score && !isNaN(p.score) ? p.score : 0;
              return { ...p, score: currentScore + killCount };
            }
            return p;
          });

          const placarString = updatedPlayers
            .map(p => `P${p.id}: ${p.score} Kills`)
            .join(" | ");
          
          localLogs.push(`[SERVER - PLACAR] 🏆 Atualização de Liderança -> [ ${placarString} ]`);
        }

        return updatedPlayers;
      });

      // Dispara os logs acumulados com segurança de uma única vez
      setLogs((prevLogs) => {
        const formatados = localLogs.map(msg => `[${time}] ${msg}`);
        return [...formatados, ...prevLogs];
      });

      // Broadcast visual para todos os outros nós conectados
      setTimeout(() => {
        const totalNós = TOTAL_PLAYERS;
        for (let i = 0; i < totalNós; i++) {
          const idProcurado = String.fromCharCode(65 + i);
          
          if (idProcurado !== playerId) {
            if (isPacketLost()) {
              addLog(`[FALHA DE REDE] Broadcast do evento SHOOT não alcançou o Player ${idProcurado} (Perda de Downlink).`);
            } else {
              triggerClientReceive(idProcurado);
            }
          }
        }
        addLog(`[BROADCAST] Estado do servidor (Disparo/Vidas) enviado para todos os nós da rede.`);
      }, 150);

    }, latency / 2);
  }

  return (
    <div className="app">
      <div className="header">
        <h1>SIMULAÇÃO - SISTEMA DISTRIBUÍDO</h1>
        <p>Fluxo de dados em um jogo multiplayer online autoritativo cliente-servidor</p>
      </div>

      {/* PAINEL TÉCNICO DE SIMULAÇÃO DE REDE */}
      <div className="network-dashboard">
        <div className="dashboard-control">
          <label className="dashboard-label">
            Latência da Rede (Ping): {latency}ms
          </label>
          <input 
            type="range" 
            min="50" 
            max="2000" 
            step="50" 
            value={latency} 
            onChange={(e) => setLatency(Number(e.target.value))}
            className="latency-slider"
          />
        </div>
        
        <div className="dashboard-control">
          <label className="dashboard-checkbox-label">
            <input 
              type="checkbox" 
              checked={packetLossActive} 
              onChange={(e) => setPacketLossActive(e.target.checked)} 
              className="packet-loss-checkbox"
            />
            Forçar Perda de Pacotes (Falha de Comunicação 30%)
          </label>
        </div>
      </div>

      {/* PLACAR DINÂMICO DE LIDERANÇA */}
      <div className="scoreboard-panel">
        <h2 className="scoreboard-title">🏆 Placar Geral do Servidor</h2>
        <div className="scoreboard-cards">
          {players.map((player) => (
            <div key={player.id} className="player-score-card">
              <span className="player-score-badge">Player {player.id}</span>
              <span className="player-score-value">{player.score} <span>Kills</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* ESTRUTURA FLEXÍVEL DE DUAS COLUNAS LADO A LADO */}
      <div className="main-layout">
        
        {/* COLUNA DA ESQUERDA: Jogo, Mapa, Players e Servidor */}
        <div className="simulation-content">
          <div className="simulation-area">
            
            <div className="map-top-row">
              <GameMap gameMap={gameMap} players={players} />
            </div>

            <div className="network-floor">
              <div className="players-column">
                {players.map((player) => (
                  <div className="player-row" key={player.id}>
                    <Player 
                      player={player} 
                      onMove={movePlayer} 
                      onShoot={shootPlayer} 
                    />
                    <Connection
                      active={!!activeLines[player.id]}
                      sending={!!sendArrows[player.id]}
                      receiving={!!receiveArrows[player.id]}
                    />
                  </div>
                ))}
              </div>

              <Server active={serverActive} />
            </div>

          </div>
        </div>

        {/* COLUNA DA DIREITA: Logs com botão de Minimizar/Expandir */}
        <div className={`logs-sidebar ${isLogsOpen ? "open" : "collapsed"}`}>
          <button 
            className="toggle-logs-btn" 
            onClick={() => setIsLogsOpen(!isLogsOpen)}
          >
            {isLogsOpen ? "Minimizar Logs ▶" : "◀ Logs"}
          </button>
          
          <div className="logs-content-wrapper">
            <Logs logs={logs} />
          </div>
        </div> 

      </div>
    </div>
  );
}