import "./Connection.css";

export default function Connection({
  active,
  sending,
  receiving
}) {

  return (
    <div className="connection-wrapper">

      {/* LINE */}
      <div
        className={`connection-line ${
          active ? "active" : ""
        }`}
      ></div>

      {/* ARROWS */}
      <div className="arrows">

        <div
          className={`connection-arrow ${
            sending ? "active" : ""
          }`}
        >
          →
        </div>

        <div
          className={`connection-arrow ${
            receiving ? "active" : ""
          }`}
        >
          ←
        </div>

      </div>

    </div>
  );
}