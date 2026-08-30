function Header({ darkMode, onToggleDarkMode, activePage, onNavigate }) {
  return (
    <header className="header">
      <div className="brand">
        <img
          src="/Metallic_KS_Emblem_with_Circuit_Accents.png"
          alt="KS Logo"
          className="brand-logo"
        />

        <div className="brand-text">
          <h1>Track Daily Expenses</h1>
          <p>Manage your money with clarity</p>
        </div>
      </div>

      <div className="header-actions">
        <nav className="page-nav" aria-label="Main navigation">
          <button
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => onNavigate("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={activePage === "settlements" ? "active" : ""}
            onClick={() => onNavigate("settlements")}
          >
            Settlements
          </button>
          <button
            className={activePage === "about" ? "active" : ""}
            onClick={() => onNavigate("about")}
          >
            About
          </button>
        </nav>

        <button
          className="theme-button"
          onClick={onToggleDarkMode}
          aria-label="Toggle dark mode"
        >
          <span className="theme-icon">{darkMode ? "☀️" : "🌙"}</span>
          <span className="theme-label">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;