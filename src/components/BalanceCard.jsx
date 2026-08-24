function BalanceCard({ balance }) {
  return (
    <section className="balance-card">
      <p>Total Balance</p>

      <h2 style={{ color: balance < 0 ? "#ef4444" : "#36d16f" }}>
        ₹{balance.toLocaleString("en-IN")}
      </h2>
    </section>
  );
}

export default BalanceCard;