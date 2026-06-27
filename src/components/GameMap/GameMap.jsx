import "./GameMap.css";

export default function GameMap({ gameMap, players, onMove }) {
  return (
    <div className="gameMap">
      {gameMap.map((row, y) =>
        row.map((cell, x) => {
          const player = players.find(
            (p) => p.x === x && p.y === y
          );

          return (
            <div
              key={`${x}-${y}`}
              className="cell"
              onClick={() => onMove?.(x, y)}
            >
              {player ? player.id : cell}
            </div>
          );
        })
      )}
    </div>
  );
}