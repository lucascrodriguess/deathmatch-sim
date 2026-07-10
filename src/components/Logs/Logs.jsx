import "./Logs.css";

export default function Logs({
  logs
}) {

  return(
    <div className="logs-panel">

    <h2>LOG DE EVENTOS</h2>

    <div className="logs-container">

        {logs.map((log, index) => (
        <div key={index} className="log-item">
            {log}
        </div>
        ))}

    </div>

    </div>
  );
}