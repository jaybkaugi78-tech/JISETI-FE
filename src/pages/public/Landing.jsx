import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="brand brand-dark">
          <div className="brand-mark">J</div>
          <div><strong>JISETI</strong><small>Sauti yako, Mabadiliko yetu.</small></div>
        </div>
        <nav>
          <a href="#how">How It Works</a>
          <a href="#about">About Us</a>
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/register" className="btn btn-gold">Sign Up</Link>
        </nav>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">CITIZEN REPORTING PLATFORM</span>
          <h1>Report corruption.<br /><span>Request intervention.</span></h1>
          <p>Jiseti empowers citizens to report corruption and request government action for a better society.</p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-navy">⚑ Report Corruption</Link>
            <Link to="/login" className="btn btn-gold">⌂ Request Intervention</Link>
          </div>
        </div>
        <div className="hero-illustration">✊<div>YOUR<br />VOICE<br /><b>MATTERS</b></div></div>
      </section>

      <section className="landing-cards" id="how">
        {[
          ["1", "Report", "Submit a report about corruption or an issue needing attention."],
          ["2", "Review", "Relevant authorities review your report."],
          ["3", "Action", "The issue is investigated and progress is tracked."],
          ["4", "Resolution", "Resolved issues create a better community."]
        ].map(([n, t, d]) => <div className="info-card" key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></div>)}
      </section>
    </div>
  );
}