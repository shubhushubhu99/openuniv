import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/active-repo", label: "Active Repo" },
  { to: "/events", label: "Events" },
  { to: "/docs", label: "Docs" },
  { to: "/missions", label: "Missions" },
  { to: "/rankings", label: "Rankings" },
  { to: "/community", label: "Community" },
] as const;

export function MainNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      if (
        mobileOpen &&
        mobileRef.current &&
        burgerRef.current &&
        !mobileRef.current.contains(target) &&
        !burgerRef.current.contains(target)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  const closeAll = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeAll();
  };

  return (
    <>
      <nav className="main-navbar" aria-label="Main navigation">
        <div className="main-navbar-inner">
          <Link to="/" className="main-navbar-logo" onClick={closeAll}>
            <img src={logo} alt="OpenUniverse" className="nav-logo" />
          </Link>

          {/* Desktop: center nav links */}
          <div className="main-navbar-links">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `main-navbar-link ${isActive ? "main-navbar-link--active" : ""}`
                }
                onClick={closeAll}
              >
                {label}
              </NavLink>
            ))}
            {user && (
              <NavLink
                to="/my-space"
                className={({ isActive }) =>
                  `main-navbar-link ${isActive ? "main-navbar-link--active" : ""}`
                }
                onClick={closeAll}
              >
                My Space
              </NavLink>
            )}
          </div>

          {/* Desktop: right actions */}
          <div className="main-navbar-actions">
            <button
              type="button"
              className="main-navbar-icon-btn"
              aria-label="Notifications"
            >
              <svg
                className="main-navbar-icon-svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            {user ? (
              <div className="main-navbar-user" ref={dropdownRef}>
                <button
                  type="button"
                  className="main-navbar-avatar-btn"
                  onClick={() => setDropdownOpen((o) => !o)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="main-navbar-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="main-navbar-avatar-name">{user.name}</span>
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="main-navbar-dropdown"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to="/profile"
                        className="main-navbar-dropdown-item"
                        onClick={() => {
                          setDropdownOpen(false);
                          closeAll();
                        }}
                      >
                        Profile
                      </Link>
                      <Link
                        to="#"
                        className="main-navbar-dropdown-item"
                        onClick={() => {
                          setDropdownOpen(false);
                          closeAll();
                        }}
                      >
                        Settings
                      </Link>
                      <button
                        type="button"
                        className="main-navbar-dropdown-item main-navbar-dropdown-item--action"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="main-navbar-auth">
                <Link
                  to="/login"
                  className="main-navbar-link main-navbar-link--text"
                  onClick={closeAll}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="main-navbar-btn main-navbar-btn--primary"
                  onClick={closeAll}
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: burger */}
          <button
            ref={burgerRef}
            type="button"
            className="main-navbar-burger"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            <span className="main-navbar-burger-bar" />
            <span className="main-navbar-burger-bar" />
            <span className="main-navbar-burger-bar" />
          </button>
        </div>
      </nav>

      {/* Mobile menu: backdrop + slide-in panel from left */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="nav-backdrop"
              className="main-navbar-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeAll}
              aria-hidden
            />
            <motion.div
              ref={mobileRef}
              key="nav-menu"
              className="main-navbar-mobile"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="main-navbar-mobile-link"
                onClick={closeAll}
              >
                {label}
              </Link>
            ))}
            {user && (
              <Link
                to="/my-space"
                className="main-navbar-mobile-link"
                onClick={closeAll}
              >
                My Space
              </Link>
            )}
            <div className="main-navbar-mobile-divider" />
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="main-navbar-mobile-link"
                  onClick={closeAll}
                >
                  Profile
                </Link>
                <Link
                  to="#"
                  className="main-navbar-mobile-link"
                  onClick={closeAll}
                >
                  Settings
                </Link>
                <button
                  type="button"
                  className="main-navbar-mobile-link main-navbar-mobile-link--action"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="main-navbar-mobile-link"
                  onClick={closeAll}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="main-navbar-mobile-link main-navbar-mobile-link--primary"
                  onClick={closeAll}
                >
                  Join Now
                </Link>
              </>
            )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
