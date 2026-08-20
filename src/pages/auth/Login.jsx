import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const isAdmin = email.toLowerCase().includes("admin");
    const user = {
      username: isAdmin ? "Admin User" : "Citizen User",
      email,
      role: isAdmin ? "admin" : "user",
    };
    dispatch(loginSuccess({ user, token: "demo-jwt-token" }));
    navigate(isAdmin ? "/admin" : "/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="brand">
          <div className="brand-mark">J</div>
          <div>
            <strong>JISETI</strong>
            <small>Sauti yako, Mabadiliko yetu.</small>
          </div>
        </div>
        <h1>
          Together, we can build a <span>corruption free</span> society.
        </h1>
        <p>
          Report corruption or request government intervention. Your voice
          matters.
        </p>
        <div className="trust-list">
          <div>
            ◈ <b>Secure & Confidential</b>
          </div>
          <div>
            ⌖ <b>Location Based</b>
          </div>
          <div>
            ♧ <b>Real Impact</b>
          </div>
        </div>
      </div>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Log in to Jiseti</h2>
          <p>Access your reports and account.</p>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>
          <div className="form-row">
            <label className="check">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button className="btn btn-navy full">Log In</button>
          <p className="center">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
          <small className="demo-note">
            Demo: use any email. An email containing “admin” opens the admin
            dashboard.
          </small>
        </form>
      </div>
    </div>
  );
}
