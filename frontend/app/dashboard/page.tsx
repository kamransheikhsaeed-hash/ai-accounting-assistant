"use client";

import { useEffect, useState } from "react";

type RecentExpense = {
  id: number;
  title: string;
  amount: number;
  category?: string;
  expense_date?: string;
};

type DashboardData = {
  user_id: number;
  total_expenses: number;
  total_amount: number;
  category_totals: Record<string, number>;
  recent_expenses: RecentExpense[];
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/dashboard/",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to load dashboard."
          );
        }

        setDashboard(data);
      } catch (err) {
        console.error(err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Could not connect to backend.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  function formatCurrency(amount: number) {
    return "Rs. " + Number(amount).toLocaleString("en-PK");
  }

  function logout() {
    localStorage.removeItem("access_token");
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-slate-600 font-medium">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>

          <h1 className="text-xl font-bold text-slate-900 mb-2">
            Dashboard Error
          </h1>

          <p className="text-red-600 mb-6">
            {error}
          </p>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return null;
  }

  const categories = Object.entries(
    dashboard.category_totals
  );

  const topCategory =
    categories.length > 0
      ? categories.reduce((max, current) =>
          current[1] > max[1] ? current : max
        )
      : null;

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-10">

        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl shadow-sm">
                💰
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  AI Accounting Assistant
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Your financial dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() => {
                window.location.href = "/expenses";
              }}
              className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              + Manage Expenses
            </button>

            <button
              onClick={logout}
              className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Logout
            </button>

          </div>
        </header>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          {/* Total Amount */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Spending
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {formatCurrency(dashboard.total_amount)}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                💰
              </div>
            </div>

          </div>

          {/* Number of Expenses */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Expenses
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {dashboard.total_expenses}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
                🧾
              </div>
            </div>

          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Categories
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {categories.length}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">
                📊
              </div>
            </div>

          </div>

        </section>

        {/* Category + Top Category */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Category Spending */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Spending by Category
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Breakdown of your expenses
                </p>
              </div>

              <span className="text-2xl">📈</span>
            </div>

            {categories.length === 0 ? (
              <p className="text-slate-500">
                No category data available.
              </p>
            ) : (
              <div className="space-y-5">

                {categories.map(([category, amount]) => {

                  const percentage =
                    dashboard.total_amount > 0
                      ? Math.round(
                          (amount /
                            dashboard.total_amount) *
                            100
                        )
                      : 0;

                  return (
                    <div key={category}>

                      <div className="flex justify-between items-center mb-2">

                        <span className="font-medium text-slate-700 capitalize">
                          {category}
                        </span>

                        <span className="font-semibold text-slate-900">
                          {formatCurrency(amount)}
                        </span>

                      </div>

                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                      <p className="text-xs text-slate-400 mt-1">
                        {percentage}% of total spending
                      </p>

                    </div>
                  );
                })}

              </div>
            )}

          </div>

          {/* Top Category */}
          <div className="bg-slate-900 rounded-2xl shadow-sm p-6 text-white">

            <p className="text-slate-400 text-sm font-medium">
              Top Spending Category
            </p>

            {topCategory ? (
              <>
                <div className="text-4xl mt-6 mb-4">
                  🏆
                </div>

                <h2 className="text-2xl font-bold capitalize">
                  {topCategory[0]}
                </h2>

                <p className="text-slate-400 mt-2">
                  {formatCurrency(topCategory[1])}
                </p>

                <div className="mt-6 pt-5 border-t border-slate-700">
                  <p className="text-sm text-slate-400">
                    Keep tracking your spending to better understand where your money goes.
                  </p>
                </div>
              </>
            ) : (
              <p className="text-slate-400 mt-6">
                No spending data available.
              </p>
            )}

          </div>

        </section>

        {/* Recent Expenses */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Expenses
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your latest recorded expenses
              </p>
            </div>

            <button
              onClick={() => {
                window.location.href = "/expenses";
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all →
            </button>

          </div>

          {dashboard.recent_expenses.length === 0 ? (
            <div className="py-10 text-center">
              <div className="text-4xl mb-3">
                🧾
              </div>

              <p className="text-slate-500">
                No expenses found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="py-3 pr-4 text-sm font-semibold text-slate-500">
                      Expense
                    </th>

                    <th className="py-3 pr-4 text-sm font-semibold text-slate-500">
                      Category
                    </th>

                    <th className="py-3 pr-4 text-sm font-semibold text-slate-500">
                      Date
                    </th>

                    <th className="py-3 text-right text-sm font-semibold text-slate-500">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {dashboard.recent_expenses.map((expense) => (

                    <tr
                      key={expense.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
                    >

                      <td className="py-4 pr-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            🧾
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {expense.title}
                            </p>

                            <p className="text-xs text-slate-400">
                              Expense #{expense.id}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="py-4 pr-4">

                        <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold capitalize">
                          {expense.category || "Uncategorized"}
                        </span>

                      </td>

                      <td className="py-4 pr-4 text-sm text-slate-500">
                        {expense.expense_date || "-"}
                      </td>

                      <td className="py-4 text-right font-bold text-red-600">
                        {formatCurrency(expense.amount)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-400 py-8">
          AI Accounting Assistant
        </footer>

      </div>
    </main>
  );
}