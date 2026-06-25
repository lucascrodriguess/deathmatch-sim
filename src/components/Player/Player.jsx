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
        Passos: {player.steps}
      </p>

      <p>
        Vida: {player.life}
      </p>

      <button
        onClick={() => onMove(player.id)}
      >
        Andar
      </button>

    </div>
  );
}