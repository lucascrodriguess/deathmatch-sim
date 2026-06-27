import "./Player.css";

export default function Player({
  player,
  onMove
}) {

  return (

    <div className="player-card">

      <h2>
        PLAYER {player.id}
      </h2>

      <p>
        Coordenada x: {player.x}
        Coordenada y: {player.y}
      </p>

      <p>
        Vida: {player.life}
      </p>

      <div className="button-area">
        <button
          onClick={() => onMove(player.id, -1, 0)}
        >
          ←
        </button>

        <button
          onClick={() => onMove(player.id, 0, 1)}
        >
          ↑
        </button>

        <button
          onClick={() => onMove(player.id, 1, 0)}
        >
          →
        </button>

        <button
          onClick={() => onMove(player.id, 0, -1)}
        >
          ↓
        </button>
      </div>

    </div>
  );
}