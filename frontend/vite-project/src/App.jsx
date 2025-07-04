import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseList from "./components/ExpenseList";
import MonthlyReport from "./components/MonthlyReport";
import AuthForm from "./components/AuthForm";

const tabs = [
  { label: "➕ Add", id: "add" },
  { label: "💸 View", id: "view" },
  { label: "📋 Report", id: "report" },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  const [selectedTab, setSelectedTab] = useState("add");
  const [refreshExpenses, setRefreshExpenses] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  const backgroundStyle = {
    backgroundColor: "#DFDBE5",
    backgroundImage: `url("image.png")`,
    backgroundRepeat: "repeat",
    backgroundAttachment: "fixed",
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <AuthForm onLogin={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={backgroundStyle}>
      <header className="max-w-3xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">📊 Expense Tracker</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      <div className="max-w-3xl mx-auto bg-white p-4 rounded-xl shadow">
        {/* Tab Buttons */}
        <div className="flex justify-between border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 py-2 text-sm font-semibold transition-all ${
                selectedTab === tab.id
                  ? "border-b-4 border-indigo-600 text-indigo-700"
                  : "text-gray-500 hover:text-indigo-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md">
              {selectedTab === "add" && (
                <AddExpenseForm
                  onAdd={() => setRefreshExpenses(!refreshExpenses)}
                />
              )}
              {selectedTab === "view" && (
                <ExpenseList
                  refreshTrigger={refreshExpenses}
                  onLogout={handleLogout}
                />
              )}
              {selectedTab === "report" && <MonthlyReport />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
