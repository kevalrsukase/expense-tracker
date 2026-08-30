function SummaryCards({ income, expenses }) {
  return (
    <section className="summary">
      <div className="summary-card income">
        <p>Income</p>

        <h3>₹{income.toLocaleString("en-IN")}</h3>
      </div>

      <div className="summary-card expense">
        <p>Expenses</p>

        <h3>₹{expenses.toLocaleString("en-IN")}</h3>
      </div>
    </section>
  );
}

export default SummaryCards;
