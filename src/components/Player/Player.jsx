import "./Player.css";

export default function Player({
  player,
  onMove,
  onShoot
}) {
  return (
    <div className="player-card">

      {/* Cabeçalho */}
      <div className="player-header">
        <h2>PLAYER {player.id}</h2>

        <div className="player-online"></div>
      </div>

      {/* Informações */}
      <div className="player-info">

        <div className="info-item">
          <span>Posição</span>
          <strong>({player.x}, {player.y})</strong>
        </div>

        <div className="info-item">
          <span>Vida</span>

          <div className="life-bar">
            <div
              className="life-fill"
              style={{
                width: `${player.life}%`
              }}
            ></div>
          </div>

          <strong>{player.life}%</strong>
        </div>

        <div className="info-item">
          <span>Direção</span>
          <strong>{player.direction}</strong>
        </div>

      </div>

      {/* Movimento */}
      <div className="movement">


        <button
          className="left"
          onClick={() => onMove(player.id, -1, 0)}
        >
          ←
        </button>

        <button
          className="up"
          onClick={() => onMove(player.id, 0, -1)}
        >
          ↑
        </button>
        
        <button
          className="right"
          onClick={() => onMove(player.id, 1, 0)}
        >
          →
        </button>

        <button
          className="down"
          onClick={() => onMove(player.id, 0, 1)}
        >
          ↓
        </button>

      </div>

      {/* Ação */}
      <button
        className="shoot-button"
        onClick={() => onShoot(player.id)}
      >
      ATIRAR
      </button>

    </div>
  );
}