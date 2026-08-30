export function summarizeSettlements(transactions) {
  const records = transactions.filter(
    (transaction) => transaction.category === "Lend/Settle",
  );

  const ledger = {};

  for (const record of records) {
    const person = (record.person || "Unknown").trim();
    const amount = Number(record.amount) || 0;

    if (!person) continue;

    if (!ledger[person]) {
      ledger[person] = {
        gave: 0,
        received: 0,
        total: 0,
        entries: [],
      };
    }

    const entry = {
      id: record.id,
      title: record.title,
      type: record.type,
      amount,
      date: record.date,
      person,
      note: record.note || "",
    };

    ledger[person].entries.push(entry);

    if (record.type === "gave") {
      ledger[person].gave += amount;
      ledger[person].total += amount;
    } else if (record.type === "received") {
      ledger[person].received += amount;
      ledger[person].total -= amount;
    }
  }

  return Object.fromEntries(
    Object.entries(ledger).map(([person, values]) => [person, values]),
  );
}

export function getSettlementPeople(transactions) {
  return [...new Set(
    transactions
      .filter((transaction) => transaction.category === "Lend/Settle")
      .map((transaction) => (transaction.person || "").trim())
      .filter(Boolean),
  )].sort((a, b) => a.localeCompare(b));
}

export function getSettlementTotals(transactions) {
  const summary = summarizeSettlements(transactions);

  const people = Object.values(summary);
  const totalGiven = people.reduce((total, person) => total + person.gave, 0);
  const totalReceived = people.reduce(
    (total, person) => total + person.received,
    0,
  );
  const netOutstanding = people.reduce(
    (total, person) => total + person.total,
    0,
  );

  return {
    totalGiven,
    totalReceived,
    netOutstanding,
    people: Object.keys(summary),
  };
}
