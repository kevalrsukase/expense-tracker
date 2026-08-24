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

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");

    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }

    return [
      {
        id: 1,
        title: "Food",
        amount: 450,
        type: "expense",
        category: "Food",
        date: "2026-07-20",
      },
      {
        id: 2,
        title: "Transport",
        amount: 200,
        type: "expense",
        category: "Transport",
        date: "2026-08-20",
      },
      {
        id: 3,
        title: "Salary",
        amount: 50000,
        type: "income",
        category: "Salary",
        date: "2026-08-20",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [deleteTransactionId, setDeleteTransactionId] = useState(null);

  const [toast, setToast] = useState(null);

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income - expenses;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    const matchesCategory =
      categoryFilter === "all" || transaction.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

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

  const deleteTransaction = (id) => {
    setDeleteTransactionId(id);
  };
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

  const transactionToDelete = transactions.find(
    (transaction) => transaction.id === deleteTransactionId,
  );
  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      <main className="container">
        <BalanceCard balance={balance} />

        <SummaryCards income={income} expenses={expenses} />

        <MonthlySummary
          transactions={transactions}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        <section className="transactions">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <button onClick={() => setShowForm(!showForm)}>+ Add</button>{" "}
          </div>
          {showForm && (
            <div className="modal-overlay" onClick={() => setShowForm(false)}>
              <div
                className="modal"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="modal-header">
                  <div>
                    <span className="modal-icon">➕</span>
                    <h2>Add Transaction</h2>
                  </div>

                  <button
                    className="primary-button"
                    onClick={() => setShowForm(true)}
                  >
                    + Add Transaction
                  </button>
                </div>

                <TransactionForm onAddTransaction={addTransaction} />
              </div>
            </div>
          )}{" "}
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
          <TransactionList
            transactions={filteredTransactions}
            onDelete={deleteTransaction}
          />
        </section>

        <ExpenseChart
          transactions={transactions}
          selectedMonth={selectedMonth}
        />

        <DeleteModal
          transaction={transactionToDelete}
          onCancel={() => setDeleteTransactionId(null)}
          onConfirm={confirmDelete}
        />
      </main>

      <Toast toast={toast} />
    </div>
  );
}

export default App;
