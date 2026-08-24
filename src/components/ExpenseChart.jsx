import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#f97316",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#ef4444",
  "#06b6d4",
  "#64748b",
];

function ExpenseChart({ transactions, selectedMonth }) {

    const monthlyTransactions = transactions.filter(
  (transaction) => {
    const transactionDate = new Date(
      transaction.date + "T00:00:00"
    );

    return (
      transactionDate.getMonth() ===
        selectedMonth.getMonth() &&
      transactionDate.getFullYear() ===
        selectedMonth.getFullYear()
    );
  }
);
  const expenses = monthlyTransactions.filter(
    (transaction) => transaction.type === "expense",
  );

  const categoryTotals = {};

  expenses.forEach((transaction) => {
    if (categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] += transaction.amount;
    } else {
      categoryTotals[transaction.category] = transaction.amount;
    }
  });

  const data = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  if (data.length === 0) {
    return (
      <section className="chart-card">
        <h2>Expenses by Category</h2>
        <p>No expenses yet.</p>
      </section>
    );
  }

  return (
    <section className="chart-card">
      <h2>Expenses by Category</h2>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(value) => `₹${value}`} />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ExpenseChart;
