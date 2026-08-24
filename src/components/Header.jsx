function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header className="header">
      <div className="brand">
        <img
          src="/Metallic_KS_Emblem_with_Circuit_Accents.png"
          alt="KS Logo"
          className="brand-logo"
        />

        <div className="brand-text">
          <h1>Expense Tracker</h1>
          <p>Manage your expenses easily</p>
        </div>
      </div>

      <button
        className="theme-button"
        onClick={onToggleDarkMode}
        aria-label="Toggle dark mode"
      >
        <span className="theme-icon">
          {darkMode ? "☀️" : "🌙"}
        </span>

        <span className="theme-label">
          {darkMode ? "Light Mode" : "Dark Mode"}
        </span>
      </button>
    </header>
  );
}

export default Header;