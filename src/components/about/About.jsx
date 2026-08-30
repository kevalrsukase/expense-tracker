function About({ transactions, income, expenses, userProfile, onResetLocalData }) {
  const stats = [
    { value: transactions.length, label: "Transactions recorded" },
    { value: `₹${income.toLocaleString()}`, label: "Total income" },
    { value: `₹${expenses.toLocaleString()}`, label: "Total expenses" },
  ];

  return (
    <section className="about-page">
      <div className="about-intro">
        <p className="about-eyebrow">About the app</p>
        <h2>Make every rupee easier to understand.</h2>
        <p>
          Track Daily Expenses gives you a clear view of your income, spending,
          and balance in one calm, practical workspace.
        </p>
      </div>

      {userProfile && (
        <div className="profile-summary-box">
          <h3>Profile</h3>
          <div className="profile-summary-grid">
            <div>
              <span>Name</span>
              <strong>{userProfile.fullName}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{userProfile.email}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{userProfile.phone || "Not provided"}</strong>
            </div>
            <div>
              <span>City</span>
              <strong>{userProfile.city || "Not provided"}</strong>
            </div>
          </div>
        </div>
      )}

      <div className="about-stats">
        {stats.map((stat) => (
          <div className="about-stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="about-details">
        <div>
          <h3>What you can do</h3>
          <p>Add income and expenses, organize them by category, search your
            history, and remove entries whenever you need to correct them.</p>
        </div>
        <div>
          <h3>Built for daily clarity</h3>
          <p>Monthly summaries and category charts help you notice patterns
            without making your finances feel complicated.</p>
        </div>
      </div>

      <div className="about-actions">
        <button type="button" className="reset-data-button" onClick={onResetLocalData}>
          Reset all local data
        </button>
      </div>
    </section>
  );
}

export default About;