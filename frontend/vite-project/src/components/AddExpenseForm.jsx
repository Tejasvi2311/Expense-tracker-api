import { useState } from "react";
import { addExpense } from "../api/testAPI";

function AddExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    amount: "",
    category: "UTILITIES",
    description: "",
    receipt: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const formData = new FormData();
      formData.append("amount", form.amount);
      formData.append("category", form.category);
      formData.append("description", form.description);
      if (form.receipt) {
        formData.append("receipt", form.receipt);
      }

       for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);  //Log every key/value
    }

      await addExpense(formData, token);
      setMessage("Expense added!");
      setForm({
        amount: "",
        category: "UTILITIES",
        description: "",
        receipt: null,
      });

      if (onAdd) onAdd();
    } catch (err) {
      console.error("Error adding expense:", err.message);
      setMessage("Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mb-6"
      encType="multipart/form-data"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Expense</h2>

      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
        className="w-full px-4 py-2 mb-3 border rounded"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full px-4 py-2 mb-3 border rounded"
        required
      >
        <option value="UTILITIES">Utilities</option>
        <option value="BILLS">Bills</option>
        <option value="INSURANCE">Insurance</option>
        <option value="TRAVEL">Travel</option>
        <option value="HEALTH">Health</option>
        <option value="CLOTHING">Clothing</option>
        <option value="GIFTS">Gifts</option>
        <option value="MISCELLANEOUS">Miscellaneous</option>
      </select>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description (optional)"
        className="w-full px-4 py-2 mb-3 border rounded"
        rows={3}
      />

      <input
        type="file"
        name="receipt"
        accept="image/*"
        onChange={handleChange}
        className="w-full px-4 py-2 mb-3 border rounded"
      />



      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transform transition-transform duration-200 hover:-translate-y-0.5"

      >
        {loading ? "Adding..." : "Add Expense"}
      </button>

      {message && (
        <p
          className={`mt-2 text-sm ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default AddExpenseForm;
