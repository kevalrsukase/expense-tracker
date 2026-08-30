import { describe, expect, it } from "vitest";

import { getSettlementPeople, summarizeSettlements } from "./settlementLogic";

describe("settlement logic", () => {
  it("tracks debt and settlements per person correctly", () => {
    const result = summarizeSettlements([
      {
        id: 1,
        title: "Money given to Rahul",
        amount: 2000,
        type: "gave",
        category: "Lend/Settle",
        date: "2026-08-01",
        person: "Rahul",
        note: "Lunch advance",
      },
      {
        id: 2,
        title: "Refund from Rahul",
        amount: 500,
        type: "received",
        category: "Lend/Settle",
        date: "2026-08-05",
        person: "Rahul",
        note: "Part payment",
      },
      {
        id: 3,
        title: "Money given to Neha",
        amount: 1500,
        type: "gave",
        category: "Lend/Settle",
        date: "2026-08-07",
        person: "Neha",
        note: "Borrowed for rent",
      },
    ]);

    expect(result.Rahul.gave).toBe(2000);
    expect(result.Rahul.received).toBe(500);
    expect(result.Rahul.total).toBe(1500);
    expect(result.Neha.total).toBe(1500);
    expect(result.Rahul.entries).toHaveLength(2);
  });

  it("collects a list of unique settlement people", () => {
    const people = getSettlementPeople([
      { person: "Rahul", category: "Lend/Settle" },
      { person: "Neha", category: "Lend/Settle" },
      { person: "Rahul", category: "Lend/Settle" },
      { person: "", category: "Lend/Settle" },
      { person: "Aman", category: "Food" },
    ]);

    expect(people).toEqual(["Neha", "Rahul"]);
  });
});
