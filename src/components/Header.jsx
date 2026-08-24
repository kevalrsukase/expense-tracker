function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header className="header">
      <h1>💰 Expense Tracker</h1>

      <button
        className="theme-button"
        onClick={onToggleDarkMode}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </header>
  );
}

export default Header;