import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <button className="navbar__logo" onClick={() => navigate("/")}>
          <span className="navbar__logo-icon">▶</span>
          <span className="navbar__logo-text">GameStore</span>
        </button>

        <div className="navbar__links">
          <button
            className={`navbar__link ${location.pathname === "/" ? "navbar__link--active" : ""}`}
            onClick={() => navigate("/")}
          >
            Browse
          </button>
          {isLoggedIn && (
            <button
              className={`navbar__link ${location.pathname === "/dashboard" ? "navbar__link--active" : ""}`}
              onClick={() => navigate("/dashboard")}
            >
              My Account
            </button>
          )}
        </div>

        <div className="navbar__actions">
          <button className="navbar__cart" onClick={() => {}}>
            🛒
            {totalItems > 0 && (
              <span className="navbar__cart-badge">{totalItems}</span>
            )}
          </button>

          {isLoggedIn ? (
            <div className="navbar__user">
              <button
                className="navbar__user-btn"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="navbar__avatar">
                  {(currentUser?.name ?? currentUser?.username ?? "U")[0].toUpperCase()}
                </span>
                <span className="navbar__username">
                  {currentUser?.name ?? currentUser?.username}
                </span>
                <span className="navbar__chevron">{menuOpen ? "▲" : "▼"}</span>
              </button>
              {menuOpen && (
                <div className="navbar__dropdown">
                  <button className="navbar__dropdown-item" onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}>
                    Dashboard
                  </button>
                  <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="navbar__login-btn" onClick={() => navigate("/login")}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}