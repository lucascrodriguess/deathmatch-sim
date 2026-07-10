import "./Server.css";

export default function Server({
  active
}) {

  return (
    <div
      className={`server-card ${
        active
          ? "server-active"
          : ""
      }`}
    >

      <h2>GAME SERVER</h2>

      <p>
        Processando eventos
      </p>

      <div className="server-status">
        ONLINE
      </div>

    </div>
  );
}