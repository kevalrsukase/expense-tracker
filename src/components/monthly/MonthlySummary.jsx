import { useState } from "react";

function MonthlySummary({ transactions, selectedMonth, onMonthChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const today = new Date();
  const isCurrentMonth =
    selectedMonth.getMonth() === today.getMonth() &&
    selectedMonth.getFullYear() === today.getFullYear();

  const selectedMonthNumber = selectedMonth.getMonth();
  const selectedYear = selectedMonth.getFullYear();

  const monthlyTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date + "T00:00:00");

    return (
      transactionDate.getMonth() === selectedMonthNumber &&
      transactionDate.getFullYear() === selectedYear
    );
  });

  const income = monthlyTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expenses = monthlyTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const saved = income - expenses;

  const monthName = selectedMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const goToPreviousMonth = () => {
    const newDate = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() - 1,
      1,
    );

    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    if (isCurrentMonth) {
      return;
    }

    const newDate = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      1,
    );

    onMonthChange(newDate);
  };

  const goToCurrentMonth = () => {
    onMonthChange(new Date());
  };

  return (
    <section className="monthly-summary">
      <div
        className="monthly-summary-header accordion-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="accordion-title">
          <span className="monthly-icon">📅</span>

          <div>
            <p>Monthly Summary</p>
            <h2>{monthName}</h2>
          </div>
        </div>

        <button
          className={`accordion-button ${isOpen ? "open" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          ⌄
        </button>
      </div>

      {isOpen && (
        <div className="monthly-content">
          <div className="month-selector">
            <button className="month-button" onClick={goToPreviousMonth}>
              ←
            </button>

            <h2>{monthName}</h2>

            <button
              className="month-button"
              onClick={goToNextMonth}
              disabled={isCurrentMonth}
            >
              →
            </button>
          </div>

          {!isCurrentMonth && (
            <button className="current-month-button" onClick={goToCurrentMonth}>
              Today
            </button>
          )}

          <div className="monthly-stats">
            <div>
              <span>Income</span>
              <strong className="income-text">₹{income.toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <span>Expenses</span>
              <strong className="expense-text">₹{expenses.toLocaleString("en-IN")}</strong>
            </div>

            <div>
              <span>Saved</span>
              <strong className={saved >= 0 ? "income-text" : "expense-text"}>
                ₹{saved.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MonthlySummary;
