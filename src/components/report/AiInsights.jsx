function AiInsights({ insights = [] }) {
  if (!insights.length) {
    return null;
  }

  return (
    <div className="ai-summary">
      {insights.map((insight, index) => (
        <div key={index} className="ai-bubble">
          <span className="ai-icon">✨</span>
          <p>{insight}</p>
        </div>
      ))}
    </div>
  );
}

export default AiInsights;
