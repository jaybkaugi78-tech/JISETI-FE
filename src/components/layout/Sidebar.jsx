import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

export default function Sidebar({ admin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const links = admin
    ? [
        ["/admin", "⌂", "Dashboard"],
        ["/reports", "▤", "My Reports"],
        ["/profile", "◯", "Profile"],
      ]
    : [
        ["/dashboard", "⌂", "Dashboard"],
        ["/reports", "▤", "My Reports"],
        ["/reports/new", "+", "New Report"],
        ["/notifications", "♢", "Notifications"],
        ["/profile", "◯", "Profile"],
      ];

  const signOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">J</div>
        <div>
          <strong>JISETI</strong>
          <small>Sauti yako, Mabadiliko yetu.</small>
        </div>
      </div>

      <nav className="side-nav">
        {links.map(([to, icon, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? "active" : ""}>
            <span>{icon}</span>{label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-message">
        <div className="shield">◈</div>
        <p>Together, we can build a <b>corruption free</b> society.</p>
      </div>

      <button className="logout-btn" onClick={signOut}>↪ Logout</button>
    </aside>
  );
}