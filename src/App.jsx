import { useEffect, useState } from "react";
import "./App.css";

import TransactionForm from "./components/TransactionForm";
import ExpenseChart from "./components/ExpenseChart";
import Header from "./components/Header";
import BalanceCard from "./components/BalanceCard";
import SummaryCards from "./components/SummaryCards";
import TransactionList from "./components/TransactionList";
import DeleteModal from "./components/DeleteModal";
import Toast from "./components/Toast";
import MonthlySummary from "./components/MonthlySummary";

function App() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const toggleDarkMode = () => {
    setDarkMode((currentMode) => {
      const newMode = !currentMode;

      localStorage.setItem("darkMode", newMode);

      return newMode;
    });
  };

  // Transactions
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");

    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  // Save transactions
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // UI states
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Delete
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  // Calculate income
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  // Calculate expenses
  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  // Balance
  const balance = income - expenses;

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    const matchesCategory =
      categoryFilter === "all" || transaction.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Add transaction
  const addTransaction = (transaction) => {
    if (!transaction) {
      setShowForm(false);
      return;
    }

    setTransactions((currentTransactions) => [
      ...currentTransactions,
      transaction,
    ]);

    setShowForm(false);

    setToast({
      type: "success",
      message: `${transaction.title} added successfully!`,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Start delete
  const deleteTransaction = (id) => {
    setDeleteTransactionId(id);
  };

  // Confirm delete
  const confirmDelete = () => {
    const transactionToDelete = transactions.find(
      (transaction) => transaction.id === deleteTransactionId,
    );

    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) => transaction.id !== deleteTransactionId,
      ),
    );

    setDeleteTransactionId(null);

    setToast({
      type: "delete",
      message: `${transactionToDelete?.title} deleted`,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Transaction being deleted
  const transactionToDelete = transactions.find(
    (transaction) => transaction.id === deleteTransactionId,
  );

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      <main className="container">
        {/* Balance */}
        <BalanceCard balance={balance} />

        {/* Income / Expense cards */}
        <SummaryCards income={income} expenses={expenses} />

        {/* Monthly summary */}
        <MonthlySummary
          transactions={transactions}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        {/* Transactions */}
        <section className="transactions">
          <div className="section-header">
            <h2>Recent Transactions</h2>

            <button
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              + Add
            </button>
          </div>

          {/* Add transaction modal */}
          {showForm && (
            <div className="modal-overlay" onClick={() => setShowForm(false)}>
              <div
                className="modal"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="modal-header">
                  <div className="modal-title">
                    <span className="modal-icon">➕</span>

                    <div>
                      <h2>Add Transaction</h2>
                      <p>Add your income or expense</p>
                    </div>
                  </div>

                  <button
                    className="close-button"
                    onClick={() => setShowForm(false)}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <TransactionForm onAddTransaction={addTransaction} />
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="filters">
            <input
              type="text"
              placeholder="🔍 Search transactions..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚕 Transport</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Bills">💡 Bills</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Salary">💼 Salary</option>
              <option value="Freelance">💻 Freelance</option>
              <option value="Other">📦 Other</option>
            </select>
          </div>

          {/* Transaction list */}
          <TransactionList
            transactions={filteredTransactions}
            onDelete={deleteTransaction}
          />
        </section>

        {/* Expense chart */}
        <ExpenseChart
          transactions={transactions}
          selectedMonth={selectedMonth}
        />

        {/* Delete modal */}
        <DeleteModal
          transaction={transactionToDelete}
          onCancel={() => setDeleteTransactionId(null)}
          onConfirm={confirmDelete}
        />
      </main>

      {/* Toast */}
      <Toast toast={toast} />
    </div>
  );
}

export default App;
