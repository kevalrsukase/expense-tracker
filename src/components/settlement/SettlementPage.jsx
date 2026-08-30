import { useState } from "react";
import { getSettlementTotals, summarizeSettlements } from "./settlementLogic";

function SettlementPage({ transactions, onAddSettlementEntry }) {
  const summary = summarizeSettlements(transactions);
  const totals = getSettlementTotals(transactions);
  const people = Object.entries(summary).sort(([, a], [, b]) => {
    return Math.abs(b.total) - Math.abs(a.total);
  });

  const [openPerson, setOpenPerson] = useState(null);

  return (
    <section className="settlement-page">
      <div className="section-header">
        <h2>Settlements</h2>
      </div>

      <div className="settlement-overview">
        <div className="summary-card income">
          <p>Total Given</p>
          <h3>₹{totals.totalGiven.toLocaleString("en-IN")}</h3>
        </div>

        <div className="summary-card expense">
          <p>Total Received</p>
          <h3>₹{totals.totalReceived.toLocaleString("en-IN")}</h3>
        </div>

        <div className={`summary-card ${totals.netOutstanding >= 0 ? "income" : "expense"}`}>
          <p>Outstanding</p>
          <h3>
            {totals.netOutstanding >= 0 ? "+" : "-"}₹{Math.abs(totals.netOutstanding).toLocaleString("en-IN")}
          </h3>
        </div>
      </div>

      {people.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤝</div>
          <h3>No settlements yet</h3>
          <p>Add a lend/settle transaction to track who owes you.</p>
        </div>
      ) : (
        <div className="settlement-list">
          {people.map(([person, values]) => {
            const isOwed = values.total > 0;
            const statusLabel = isOwed ? "They owe you" : "You owe them";
            const statusClass = isOwed ? "settlement-positive" : "settlement-negative";
            const isOpen = openPerson === person;

            return (
              <div className="settlement-card" key={person}>
                <div
                  className="person-accordion"
                  onClick={() => setOpenPerson(isOpen ? null : person)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setOpenPerson(isOpen ? null : person);
                    }
                  }}
                >
                  <div className="settlement-header">
                    <div>
                      <p className="settlement-label">Person</p>
                      <h3>{person}</h3>
                    </div>

                    <div className="accordion-right">
                      <span className={`settlement-status ${statusClass}`}>
                        {statusLabel}
                      </span>

                      <button
                        type="button"
                        className="mini-add-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          if (onAddSettlementEntry) {
                            onAddSettlementEntry(person, values.total);
                          }
                        }}
                      >
                        + Add
                      </button>

                      <span className="accordion-icon">{isOpen ? "▾" : "▸"}</span>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <>
                    <div className="settlement-metrics">
                      <div>
                        <span>Given</span>
                        <strong>₹{values.gave.toLocaleString("en-IN")}</strong>
                      </div>

                      <div>
                        <span>Received</span>
                        <strong>₹{values.received.toLocaleString("en-IN")}</strong>
                      </div>

                      <div>
                        <span>Net</span>
                        <strong className={isOwed ? "income-text" : "expense-text"}>
                          {isOwed ? "+" : "-"}₹{Math.abs(values.total).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>

                    <div className="settlement-entries">
                      {values.entries.map((entry) => (
                        <div className="settlement-entry" key={entry.id}>
                          <div>
                            <strong>{entry.title}</strong>
                            <p>
                              {new Date(`${entry.date}T00:00:00`).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                          <div className="entry-amount-wrap">
                            <span className={entry.type === "gave" ? "expense-amount" : "income-amount"}>
                              {entry.type === "gave" ? "-" : "+"}₹{entry.amount.toLocaleString("en-IN")}
                            </span>
                            <small>{entry.type === "gave" ? "Given" : "Received"}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default SettlementPage;
