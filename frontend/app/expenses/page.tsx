"use client";

import { FormEvent, useEffect, useState } from "react";

type Expense = {
  id: number;
  user_id: number;
  title: string;
  amount: number;
  category: string;
  expense_date: string;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadExpenses() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/expenses/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not load expenses");
      }

      setExpenses(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load expenses"
      );
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  function resetForm() {
    setTitle("");
    setAmount("");
    setCategory("");
    setExpenseDate("");
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    const expenseData = {
      title,
      amount: Number(amount),
      category,
      expense_date: expenseDate,
    };

    try {
      const url = editingId
        ? `http://127.0.0.1:8000/expenses/${editingId}`
        : "http://127.0.0.1:8000/expenses/";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Request failed");
      }

      setMessage(
        editingId
          ? "Expense updated successfully"
          : "Expense added successfully"
      );

      resetForm();
      await loadExpenses();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  function startEdit(expense: Expense) {
    setEditingId(expense.id);
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setExpenseDate(expense.expense_date);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteExpense(id: number) {
    const token = localStorage.getItem("access_token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/expenses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Delete failed");
      }

      setMessage("Expense deleted successfully");

      await loadExpenses();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not delete expense"
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Expense Management
            </h1>

            <p className="text-slate-500 mt-1">
              Add, edit and manage your expenses
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              className="px-5 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800"
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                window.location.href = "/";
              }}
              className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-8">

          <h2 className="text-xl font-bold mb-5">
            {editingId ? "Edit Expense" : "Add Expense"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Laptop"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="85000"
                min="0"
                step="0.01"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Electronics"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Expense Date
              </label>

              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2 flex gap-3">

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Expense"
                  : "Add Expense"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

          {message && (
            <div className="mt-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Your Expenses
          </h2>

          {expenses.length === 0 ? (
            <p className="text-slate-500">
              No expenses found.
            </p>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3 pr-4">Title</th>
                    <th className="py-3 pr-4">Category</th>
                    <th className="py-3 pr-4">Amount</th>
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b"
                    >
                      <td className="py-4 pr-4">
                        {expense.title}
                      </td>

                      <td className="py-4 pr-4">
                        {expense.category}
                      </td>

                      <td className="py-4 pr-4">
                        Rs. {expense.amount.toLocaleString()}
                      </td>

                      <td className="py-4 pr-4">
                        {expense.expense_date}
                      </td>

                      <td className="py-4">
                        <div className="flex gap-2">

                          <button
                            onClick={() => startEdit(expense)}
                            className="px-3 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </main>
  );
}