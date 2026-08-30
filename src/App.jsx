import { useEffect, useState } from "react";
import "./App.css";
import "./components/summary/summary.css";
import "./components/monthly/monthlySummary.css";
import "./components/report/report.css";

import TransactionForm from "./components/transaction/TransactionForm";
import ExpenseChart from "./components/chart/ExpenseChart";
import Header from "./components/header/Header";
import BalanceCard from "./components/balance/BalanceCard";
import SummaryCards from "./components/summary/SummaryCards";
import TransactionList from "./components/transaction/TransactionList";
import DeleteModal from "./components/modal/DeleteModal";
import Toast from "./components/modal/Toast";
import MonthlySummary from "./components/monthly/MonthlySummary";
import About from "./components/about/About";
import SettlementPage from "./components/settlement/SettlementPage";
import ReportPanel from "./components/report/ReportPanel";
import RegisterPage from "./components/register/RegisterPage";
import { buildAiInsights } from "./utils/insightLogic";

const USER_PROFILE_KEY = "ks-money-flow-user";

function App() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [activePage, setActivePage] = useState("dashboard");
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem(USER_PROFILE_KEY);

    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  const [showRegisterPage, setShowRegisterPage] = useState(() => {
    return !localStorage.getItem(USER_PROFILE_KEY);
  });

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

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
      setShowRegisterPage(false);
      return;
    }

    localStorage.removeItem(USER_PROFILE_KEY);
  }, [userProfile]);

  // UI states
  const [showForm, setShowForm] = useState(false);
  const [formPrefill, setFormPrefill] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [recentSectionOpen, setRecentSectionOpen] = useState(true);
  const [transactionPage, setTransactionPage] = useState(1);
  const TRANSACTION_PAGE_SIZE = 5;

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

  const insightData = buildAiInsights(transactions, selectedMonth);
  const {
    currentMonthTransactions,
    monthIncome,
    monthExpenses,
    currentSavings,
    aiInsights,
  } = insightData;

  const exportCsv = () => {
    const reportRows = [
      ["Expense Tracker Report"],
      ["Owner", "Keval Sukase"],
      ["Brand", "KS Money Flow"],
      ["Generated On", new Date().toLocaleString("en-IN")],
      ["Month", selectedMonth.toLocaleString("default", { month: "long", year: "numeric" })],
      [],
      ["Date", "Title", "Category", "Type", "Amount", "Person"],
      ...transactions.map((transaction) => [
        transaction.date,
        transaction.title,
        transaction.category,
        transaction.type,
        transaction.amount,
        transaction.person || "",
      ]),
    ];

    const csvContent = reportRows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ks-money-flow-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const printable = currentMonthTransactions.length
      ? currentMonthTransactions
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map(
            (transaction) => `
              <tr>
                <td>${transaction.date}</td>
                <td>${transaction.title}</td>
                <td>${transaction.category}</td>
                <td>${transaction.type}</td>
                <td>${Number(transaction.amount).toFixed(2)}</td>
              </tr>
            `,
          )
          .join("")
      : '<tr><td colspan="5">No transactions for this month.</td></tr>';

    const logoUrl = `${window.location.origin}/Metallic_KS_Emblem_with_Circuit_Accents.png`;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>KS Money Flow - Monthly Statement</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #111827; }
            .pdf-header { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }
            .pdf-header img { width: 56px; height: 56px; border-radius: 12px; }
            .pdf-header h2 { margin: 0; font-size: 24px; }
            .pdf-header p { margin: 4px 0 0; color: #4b5563; }
            .summary-box { margin: 18px 0; padding: 12px 14px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
            th { background: #f3f4f6; }
            .footer-note { margin-top: 18px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="pdf-header">
            <img src="${logoUrl}" alt="KS logo" />
            <div>
              <h2>KS Money Flow</h2>
              <p>Keval Sukase • Expense Tracker</p>
            </div>
          </div>

          <div class="summary-box">
            <strong>Month:</strong> ${selectedMonth.toLocaleString("default", { month: "long", year: "numeric" })}<br />
            <strong>Generated:</strong> ${new Date().toLocaleString("en-IN")}
          </div>

          <h3>Monthly Statement</h3>
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
              ${printable}
            </tbody>
          </table>

          <div class="footer-note">Expense tracker by KS Money Flow • All rights reserved.</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

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

  useEffect(() => {
    setTransactionPage(1);
  }, [search, typeFilter, categoryFilter]);

  const totalTransactionPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / TRANSACTION_PAGE_SIZE),
  );
  const visibleTransactions = filteredTransactions.slice(
    (transactionPage - 1) * TRANSACTION_PAGE_SIZE,
    transactionPage * TRANSACTION_PAGE_SIZE,
  );

  // Add transaction
  const handleRegister = (profile) => {
    setUserProfile(profile);
    setShowRegisterPage(false);
  };

  const resetLocalData = () => {
    localStorage.removeItem("transactions");
    localStorage.removeItem("darkMode");
    localStorage.removeItem(USER_PROFILE_KEY);

    setTransactions([]);
    setDarkMode(false);
    setUserProfile(null);
    setActivePage("dashboard");
    setShowRegisterPage(true);
    setToast({
      type: "delete",
      message: "All local app data has been reset.",
    });

    setTimeout(() => setToast(null), 3000);
  };

  const addTransaction = (transaction) => {
    if (!transaction) {
      setShowForm(false);
      setFormPrefill(null);
      return;
    }

    setTransactions((currentTransactions) => [
      ...currentTransactions,
      transaction,
    ]);

    setShowForm(false);
    setFormPrefill(null);

    setToast({
      type: "success",
      message: `${transaction.title} added successfully!`,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const openTransactionForm = (prefill = null) => {
    setFormPrefill(prefill);
    setShowForm(true);
  };

  const openSettlementQuickAdd = (person, total) => {
    const nextType = total > 0 ? "received" : "gave";

    openTransactionForm({
      category: "Lend/Settle",
      person,
      type: nextType,
      title:
        total > 0 ? `Received from ${person}` : `Given to ${person}`,
      amount: Math.abs(total || 0),
      date: new Date().toISOString().split("T")[0],
    });
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

  if (showRegisterPage) {
    return <RegisterPage onSubmit={handleRegister} />;
  }

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="container">
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
                    <p>Add your income, expense, or settlement</p>
                  </div>
                </div>

                <button
                  className="close-button"
                  onClick={() => {
                    setShowForm(false);
                    setFormPrefill(null);
                  }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <TransactionForm
                onAddTransaction={addTransaction}
                people={Array.from(
                  new Set(
                    transactions
                      .filter(
                        (transaction) => transaction.category === "Lend/Settle",
                      )
                      .map((transaction) => (transaction.person || "").trim())
                      .filter(Boolean),
                  ),
                ).sort((a, b) => a.localeCompare(b))}
                prefill={formPrefill}
              />
            </div>
          </div>
        )}

        {activePage === "about" ? (
          <About
            transactions={transactions}
            income={income}
            expenses={expenses}
            userProfile={userProfile}
            onResetLocalData={resetLocalData}
          />
        ) : activePage === "settlements" ? (
          <SettlementPage
            transactions={transactions}
            onAddSettlementEntry={openSettlementQuickAdd}
          />
        ) : (
          <>
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
              <div className="accordion-shell">
                <button
                  type="button"
                  className="section-toggle"
                  onClick={() => setRecentSectionOpen((current) => !current)}
                >
                  <div className="section-header">
                    <h2>Recent Transactions</h2>
                    <span className="toggle-meta">{recentSectionOpen ? "Hide" : "Show"}</span>
                  </div>
                  <span className={`toggle-chevron ${recentSectionOpen ? "open" : ""}`}>▾</span>
                </button>

                {recentSectionOpen && (
                  <div className="accordion-content">
                    <div className="section-header inline-action-row">
                      <span className="section-muted">{filteredTransactions.length} matching entries</span>

                      <button
                        className="primary-button"
                        onClick={() => openTransactionForm()}
                      >
                        + Add
                      </button>
                    </div>

                    <ReportPanel
                      selectedMonth={selectedMonth}
                      monthIncome={monthIncome}
                      monthExpenses={monthExpenses}
                      currentSavings={currentSavings}
                      currentMonthTransactions={currentMonthTransactions}
                      onExportCsv={exportCsv}
                      onExportPdf={exportPdf}
                      aiInsights={aiInsights}
                    />

                    <div className="filter-folder-wrap">
                      <button
                        type="button"
                        className="filter-folder-button"
                        onClick={() => setFiltersOpen((current) => !current)}
                      >
                        <span>📁 Filters</span>
                        <span>{filtersOpen ? "Hide" : "Open"}</span>
                      </button>
                    </div>

                    {filtersOpen && (
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
                          <option value="gave">Gave</option>
                          <option value="received">Received</option>
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
                          <option value="Lend/Settle">🤝 Lend/Settle</option>
                          <option value="Other">📦 Other</option>
                        </select>
                      </div>
                    )}

                    <div className="section-header inline-action-row">
                      <h3>All Transactions</h3>
                      <span className="section-muted">Page {transactionPage} of {totalTransactionPages}</span>
                    </div>

                    <TransactionList
                      transactions={visibleTransactions}
                      onDelete={deleteTransaction}
                    />

                    {totalTransactionPages > 1 && (
                      <div className="pagination-row">
                        <button
                          type="button"
                          className="pagination-button"
                          onClick={() => setTransactionPage((current) => Math.max(1, current - 1))}
                          disabled={transactionPage === 1}
                        >
                          Previous
                        </button>

                        <div className="pagination-pages">
                          {Array.from({ length: totalTransactionPages }, (_, index) => index + 1).map((pageNumber) => (
                            <button
                              key={pageNumber}
                              type="button"
                              className={`page-number ${transactionPage === pageNumber ? "active" : ""}`}
                              onClick={() => setTransactionPage(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          className="pagination-button"
                          onClick={() => setTransactionPage((current) => Math.min(totalTransactionPages, current + 1))}
                          disabled={transactionPage === totalTransactionPages}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
          </>
        )}
      </main>

      {/* Toast */}
      <Toast toast={toast} />
    </div>
  );
}

export default App;
