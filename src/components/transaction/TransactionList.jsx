function TransactionList({ transactions, onDelete }) {
  return (
    <div>
      {transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💸</div>

          <h3>No transactions found</h3>

          <p>Try adding a transaction or changing your filters.</p>
        </div>
      ) : (
        <div className="transaction-list">
          {transactions.map((transaction) => {
            const isSettlement = transaction.category === "Lend/Settle";
            const isOutgoing = transaction.type === "expense" || transaction.type === "gave";
            const sign = isOutgoing ? "-" : "+";
            const amountClass = isOutgoing ? "expense-amount" : "income-amount";
            const icon = isSettlement
              ? transaction.type === "gave"
                ? "🤝"
                : "💰"
              : transaction.type === "expense"
                ? "💸"
                : "💰";

            return (
              <div className="transaction" key={transaction.id}>
                <div className="transaction-info">
                  <div className="transaction-icon">{icon}</div>
                  <h3>{transaction.title}</h3>

                  <div className="transaction-meta">
                    <span>{transaction.category}</span>
                    {isSettlement && transaction.person && (
                      <>
                        <span>•</span>
                        <span>{transaction.person}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>
                      {new Date(
                        transaction.date + "T00:00:00",
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="transaction-right">
                  <span className={amountClass}>
                    {sign} ₹{transaction.amount.toLocaleString("en-IN")}
                  </span>

                  <button
                    className="delete-button"
                    onClick={() => onDelete(transaction.id)}
                    aria-label={`Delete ${transaction.title}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TransactionList;
