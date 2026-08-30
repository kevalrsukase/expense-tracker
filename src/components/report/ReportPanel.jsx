function ReportPanel({
  selectedMonth,
  monthIncome,
  monthExpenses,
  currentSavings,
  currentMonthTransactions,
  onExportCsv,
  onExportPdf,
  aiInsights,
}) {
  return (
    <div className="report-panel">
      <div className="report-header">
        <div>
          <p className="report-label">Export & report</p>
          <h3>{selectedMonth.toLocaleString("default", { month: "long" })} statement</h3>
        </div>

        <div className="report-actions">
          <button type="button" className="report-button" onClick={onExportCsv}>
            Export CSV
          </button>
          <button type="button" className="report-button secondary" onClick={onExportPdf}>
            Export PDF
          </button>
        </div>
      </div>

      <div className="report-kpis">
        <div className="report-kpi">
          <span>Income</span>
          <strong className="income-amount">₹{monthIncome.toFixed(2)}</strong>
        </div>
        <div className="report-kpi">
          <span>Expenses</span>
          <strong className="expense-amount">₹{monthExpenses.toFixed(2)}</strong>
        </div>
        <div className="report-kpi">
          <span>Net savings</span>
          <strong>₹{currentSavings.toFixed(2)}</strong>
        </div>
      </div>

      <div className="ai-summary">
        {aiInsights.map((insight, index) => (
          <div key={index} className="ai-bubble">
            <span className="ai-icon">✨</span>
            <p>{insight}</p>
          </div>
        ))}
      </div>

      <div className="monthly-statement">
        <div className="statement-header">
          <h4>Monthly statement</h4>
          <span>{currentMonthTransactions.length} transactions</span>
        </div>

        <div className="statement-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentMonthTransactions.length ? (
                [...currentMonthTransactions]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.date}</td>
                      <td>{transaction.title}</td>
                      <td>{transaction.category}</td>
                      <td>{transaction.type}</td>
                      <td className={transaction.type === "income" ? "income-amount" : "expense-amount"}>
                        ₹{Number(transaction.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="5">No transactions for this month.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportPanel;
