import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="home-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo-text">OpenUniverse</span>
            <p className="footer-tagline">
              The college innovation ecosystem where students compete, build, and grow.
            </p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <div className="footer-col">
              <h4 className="footer-col-title">Product</h4>
              <ul className="footer-list">
                <li><a href="#features">Challenges</a></li>
                <li><a href="#features">Leaderboard</a></li>
                <li><a href="#features">Projects</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Resources</h4>
              <ul className="footer-list">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/my-space">Dashboard</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Company</h4>
              <ul className="footer-list">
                <li><a href="#how-it-works">How it works</a></li>
                <li><a href="#features">About</a></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} OpenUniverse. Built for campus innovation.
          </p>
        </div>
      </div>
    </footer>
  );
}
