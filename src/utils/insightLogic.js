const sameMonth = (dateValue, targetMonth) => {
  const date = new Date(dateValue);

  return (
    date.getFullYear() === targetMonth.getFullYear() &&
    date.getMonth() === targetMonth.getMonth()
  );
};

const aggregateByCategory = (records, typeFilter) => {
  return records.reduce((totals, transaction) => {
    if (!transaction.category || transaction.category === "Lend/Settle") {
      return totals;
    }

    if (typeFilter && transaction.type !== typeFilter) {
      return totals;
    }

    totals[transaction.category] =
      (totals[transaction.category] || 0) + Number(transaction.amount);

    return totals;
  }, {});
};

const comparePercent = (current, previous) => {
  if (previous === 0) {
    if (current === 0) {
      return 0;
    }

    return current > 0 ? 100 : -100;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
};

const getCategoryMessage = (category, kind, percent) => {
  const amountText = Math.abs(percent).toFixed(0);

  if (kind === "income") {
    return percent >= 0
      ? `You earned ${amountText}% more from ${category} this month.`
      : `You earned ${amountText}% less from ${category} this month.`;
  }

  return percent >= 0
    ? `You spent ${amountText}% more on ${category} this month.`
    : `You spent ${amountText}% less on ${category} this month.`;
};

const getTopCategoryTrend = (currentTotals, previousTotals, kind) => {
  const currentTop = Object.entries(currentTotals).sort((a, b) => b[1] - a[1])[0];
  const previousTop = Object.entries(previousTotals).sort((a, b) => b[1] - a[1])[0];

  if (!currentTop) {
    return {
      amount: 0,
      percent: 0,
      message:
        kind === "income"
          ? "Your earnings are balanced this month."
          : "Your spending is well balanced this month.",
    };
  }

  const currentAmount = Number(currentTop[1]);
  const previousAmount = previousTop ? Number(previousTop[1]) : 0;
  const percent =
    previousTop && currentTop[0] === previousTop[0]
      ? comparePercent(currentAmount, previousAmount)
      : 100;

  return {
    amount: currentAmount,
    percent,
    message: getCategoryMessage(currentTop[0], kind, percent),
  };
};

export function buildAiInsights(transactions, selectedMonth) {
  const currentMonthDate = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth(),
    1,
  );

  const previousMonthDate = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth() - 1,
    1,
  );

  const currentMonthTransactions = transactions.filter((transaction) =>
    sameMonth(transaction.date, currentMonthDate),
  );

  const previousMonthTransactions = transactions.filter((transaction) =>
    sameMonth(transaction.date, previousMonthDate),
  );

  const monthIncome = currentMonthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const monthExpenses = currentMonthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const previousMonthIncome = previousMonthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const previousMonthExpenses = previousMonthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const currentSavings = monthIncome - monthExpenses;
  const previousSavings = previousMonthIncome - previousMonthExpenses;

  const incomeCategoryTotals = aggregateByCategory(
    currentMonthTransactions,
    "income",
  );
  const expenseCategoryTotals = aggregateByCategory(
    currentMonthTransactions,
    "expense",
  );
  const previousIncomeCategoryTotals = aggregateByCategory(
    previousMonthTransactions,
    "income",
  );
  const previousExpenseCategoryTotals = aggregateByCategory(
    previousMonthTransactions,
    "expense",
  );

  const incomeTrend = getTopCategoryTrend(
    incomeCategoryTotals,
    previousIncomeCategoryTotals,
    "income",
  );
  const expenseTrend = getTopCategoryTrend(
    expenseCategoryTotals,
    previousExpenseCategoryTotals,
    "expense",
  );

  const dominantTrend =
    (incomeTrend.amount || 0) >= (expenseTrend.amount || 0)
      ? incomeTrend
      : expenseTrend;

  const savingsPercent =
    previousSavings === 0
      ? currentSavings === 0
        ? 0
        : currentSavings > 0
          ? 100
          : -100
      : comparePercent(currentSavings, previousSavings);

  const savingsInsight =
    previousSavings === 0
      ? currentSavings >= 0
        ? "Your savings are positive this month."
        : "Your savings are still negative this month."
      : currentSavings >= previousSavings
        ? `Your savings improved by ${Math.abs(savingsPercent).toFixed(0)}% from last month.`
        : `Your savings dipped by ${Math.abs(savingsPercent).toFixed(0)}% from last month.`;

  return {
    currentMonthTransactions,
    previousMonthTransactions,
    monthIncome,
    monthExpenses,
    previousMonthIncome,
    previousMonthExpenses,
    currentSavings,
    previousSavings,
    dominantTrend,
    aiInsights: [dominantTrend.message, savingsInsight],
  };
}
