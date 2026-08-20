import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const user = { ...form, role: "user" };
    dispatch(loginSuccess({ user, token: "demo-jwt-token" }));
    navigate("/dashboard");
  };

  return (
    <div className="auth-page single">
      <form className="auth-form card-form" onSubmit={submit}>
        <div className="brand brand-dark">
          <div className="brand-mark">J</div>
          <div>
            <strong>JISETI</strong>
            <small>Sauti yako, Mabadiliko yetu.</small>
          </div>
        </div>
        <span className="eyebrow">CREATE ACCOUNT</span>
        <h2>Join Jiseti</h2>
        <p>Create your citizen reporting account.</p>
        {[
          ["username", "Username", "Enter your username", "text"],
          ["email", "Email address", "Enter your email", "email"],
          ["password", "Password", "Create a password", "password"],
        ].map(([key, label, placeholder, type]) => (
          <label key={key}>
            {label}
            <input
              type={type}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              required
            />
          </label>
        ))}
        <button className="btn btn-navy full">Create Account</button>
        <p className="center">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
