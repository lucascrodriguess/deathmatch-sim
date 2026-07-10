import "./GameMap.css";

export default function GameMap({ gameMap = [], players = [] }) {
  return (
    <div className="game-map-card">
      <h2>MAPA</h2>
      <div className="game-map">
        {gameMap.map((row, y) =>
          row.map((cell, x) => {
            const player = players.find((p) => p.x === x && p.y === y);

            return (
              <div
                key={`${x}-${y}`}
                className={`cell ${player ? "occupied" : ""}`}
              >
                {player ? (
                  <span className="player-token">{player.id}</span>
                ) : (
                  <span className="cell-value">{cell}</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
