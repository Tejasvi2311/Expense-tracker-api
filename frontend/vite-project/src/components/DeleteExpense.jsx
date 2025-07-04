// components/DeleteExpense.jsx
import { deleteExpense } from "../api/testAPI";

function DeleteExpense({ id, token, onSuccess }) {
  const handleDelete = async () => {
    try {
      await deleteExpense(id, token);
      onSuccess(); // Refresh the list
    } catch (error) {
      console.error("Error deleting expense:", error.message);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
    >
      Delete
    </button>
  );
}

export default DeleteExpense;
