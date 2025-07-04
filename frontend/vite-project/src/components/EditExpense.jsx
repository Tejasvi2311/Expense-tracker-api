// components/EditExpense.jsx
import { useState } from "react";

function EditExpense({ expense, onSave }) {
  const [formData, setFormData] = useState({
    title: expense.title,
    amount: expense.amount,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // You should define onSave to call your PATCH/PUT API
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="border px-2 py-1 rounded"
      />
      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        className="border px-2 py-1 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
      >
        Save
      </button>
    </form>
  );
}

export default EditExpense;
