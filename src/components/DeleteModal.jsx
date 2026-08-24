function DeleteModal({
  transaction,
  onCancel,
  onConfirm,
}) {
  if (!transaction) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
    >
      <div
        className="delete-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="delete-icon">
          🗑️
        </div>

        <h2>Delete transaction?</h2>

        <p>
          Are you sure you want to delete{" "}
          <strong>{transaction.title}</strong>{" "}
          for{" "}
          <strong>
            ₹{transaction.amount.toLocaleString("en-IN")}
          </strong>
          ?
          <br />
          This action cannot be undone.
        </p>

        <div className="delete-actions">
          <button
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="confirm-delete-button"
            onClick={onConfirm}
          >
            Delete 🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;