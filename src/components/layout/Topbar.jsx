import { useSelector } from "react-redux";

export default function Topbar({ admin }) {
  const user = useSelector((state) => state.auth.user);
  return (
    <header className="topbar">
      <div>
        <button className="menu-btn">☰</button>
        <h1>{admin ? "Admin Dashboard" : "Dashboard"}</h1>
      </div>
      <div className="top-user">
        <span className="bell">♧</span>
        <div className="avatar">{(user?.username || "J").charAt(0).toUpperCase()}</div>
        <div>
          <strong>{user?.username || "Citizen"}</strong>
          <small>{admin ? "Super Admin" : "Active Citizen"}</small>
        </div>
      </div>
    </header>
  );
}