import { useState } from "react";

function TransactionForm({ onAddTransaction }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !amount) {
      return;
    }

    const newTransaction = {
      id: Date.now(),
      title,
      amount: Number(amount),
      type,
      category,
      date,
    };

    onAddTransaction(newTransaction);

    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("Food");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const [category, setCategory] = useState("Food");

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="transaction-date">Date</label>

        <input
          id="transaction-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />

        <label>Title</label>

        <input
          type="text"
          placeholder="e.g. Coffee"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Amount</label>

        <input
          type="number"
          placeholder="e.g. 150"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Type</label>

        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className="form-group">
        <label>Category</label>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
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

      <div className="form-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={() => onAddTransaction(null)}
        >
          Cancel
        </button>

        <button type="submit" className="add-button">
          Add Transaction 💰
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
