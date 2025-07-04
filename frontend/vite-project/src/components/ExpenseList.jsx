import { useEffect, useState } from "react";
import { getExpenses, updateExpense, deleteExpense } from "../api/testAPI";

function ExpenseList({ onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ category: "", amount: "", description: "" });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("⚠️ Unauthorized. Please login again.");
      if (onLogout) onLogout();
      return;
    }

    try {
      const data = await getExpenses(token);
      const expensesList = Array.isArray(data) ? data : data.results;
      setExpenses(expensesList);
    } catch (err) {
      console.error("Failed to fetch expenses:", err.message);
      setError("⚠️ Unauthorized or token expired. Please login again.");
      localStorage.clear();
      if (onLogout) onLogout();
    }
  };

  const handleEditClick = (expense) => {
    setEditingId(expense.id);
    setEditForm({
      category: expense.category,
      amount: expense.amount,
      description: expense.description || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (expenseId) => {
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("category", editForm.category);
    formData.append("amount", editForm.amount);
    formData.append("description", editForm.description);

    try {
      await updateExpense(expenseId, formData, token);
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      console.error("Edit failed:", err.message);
    }
  };

  const handleDelete = async (expenseId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await deleteExpense(expenseId, token);
      fetchExpenses();
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Your Expenses</h2>
        <button
          className="text-sm text-red-500 hover:underline"
          onClick={() => {
            localStorage.clear();
            if (onLogout) onLogout();
          }}
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {expenses.length === 0 ? (
        <p className="text-gray-600 text-sm">No expenses found.</p>
      ) : (
        <ul className="space-y-2">
  {expenses.map((expense) => (
    <li
      key={expense.id}
      className="border px-4 py-2 rounded-md shadow-sm flex flex-col gap-1 bg-white hover:shadow-md transition"
    >
      {editingId === expense.id ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="category"
              value={editForm.category}
              onChange={handleEditChange}
              placeholder="Category"
              className="border px-2 py-1 rounded text-sm"
            />
            <input
              type="number"
              name="amount"
              value={editForm.amount}
              onChange={handleEditChange}
              placeholder="Amount"
              className="border px-2 py-1 rounded text-sm"
            />
          </div>
          <input
            type="text"
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            placeholder="Description"
            className="border px-2 py-1 rounded text-sm w-full"
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={() => handleEditSubmit(expense.id)}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="px-3 py-1 text-xs bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-700">{expense.category}</span>
            <span className="text-indigo-600 font-bold">₹{expense.amount}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{expense.date}</span>
            {expense.receipt && (
              <a
                href={expense.receipt}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                📎 Receipt
              </a>
            )}
          </div>
          {expense.description && (
            <p className="text-xs text-gray-600 italic line-clamp-2">
              {expense.description}
            </p>
          )}
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={() => handleEditClick(expense)}
              className="px-2 py-1 text-xs border border-yellow-400 text-yellow-600 rounded hover:bg-yellow-50"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(expense.id)}
              className="px-2 py-1 text-xs border border-red-400 text-red-600 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  ))}
</ul>

      )}
    </div>
  );
}

export default ExpenseList;
