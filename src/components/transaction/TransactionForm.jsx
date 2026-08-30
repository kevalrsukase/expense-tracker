import { useEffect, useState } from "react";

function TransactionForm({ onAddTransaction, people = [], prefill = null }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [person, setPerson] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Food");

  useEffect(() => {
    const nextDate = new Date().toISOString().split("T")[0];

    if (prefill) {
      setTitle(prefill.title || "");
      setAmount(prefill.amount ?? "");
      setPerson(prefill.person || "");
      setType(prefill.type || "expense");
      setDate(prefill.date || nextDate);
      setCategory(prefill.category || "Food");
      return;
    }

    setTitle("");
    setAmount("");
    setPerson("");
    setType("expense");
    setCategory("Food");
    setDate(nextDate);
  }, [prefill]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !amount) {
      return;
    }

    const normalizedType =
      category === "Lend/Settle"
        ? type === "gave"
          ? "gave"
          : "received"
        : type;

    const newTransaction = {
      id: Date.now(),
      title,
      amount: Number(amount),
      type: normalizedType,
      category,
      person: category === "Lend/Settle" ? person : "",
      note: category === "Lend/Settle" ? title : "",
      date,
    };

    onAddTransaction(newTransaction);
  };

  const personOptions = [...people].sort((a, b) => a.localeCompare(b));
  const personSelectedValue =
    category === "Lend/Settle" && person && personOptions.includes(person)
      ? person
      : "new-person";

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
      </div>

      <div className="form-group">
        <label>Category</label>

        <select
          value={category}
          onChange={(event) => {
            const nextCategory = event.target.value;
            setCategory(nextCategory);

            if (nextCategory !== "Lend/Settle") {
              setType("expense");
            } else {
              setType("gave");
            }
          }}
        >
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

      <div className="form-group">
        <label>Title</label>

        <input
          type="text"
          placeholder="e.g. Coffee"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Type</label>

        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          {category === "Lend/Settle" && (
            <>
              <option value="gave">Gave</option>
              <option value="received">Received</option>
            </>
          )}
        </select>
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

      {category === "Lend/Settle" && (
        <div className="form-group">
          <label>Person</label>

          <select
            value={personSelectedValue}
            onChange={(event) => {
              const nextValue = event.target.value;

              if (nextValue === "new-person") {
                setPerson("");
                return;
              }

              setPerson(nextValue);
            }}
          >
            <option value="new-person">+ New person</option>
            {personOptions.map((personName) => (
              <option key={personName} value={personName}>
                {personName}
              </option>
            ))}
          </select>

          {personSelectedValue === "new-person" && (
            <input
              type="text"
              placeholder="e.g. Rahul"
              value={person}
              onChange={(event) => setPerson(event.target.value)}
              style={{ marginTop: "8px" }}
            />
          )}
        </div>
      )}

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
