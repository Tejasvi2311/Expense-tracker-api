import { useState } from "react";
import { registerUser, loginUser } from "../api/testAPI";

function AuthForm({ onLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isRegistering) {
        const res = await registerUser(form);
        if (res.username) {
          setMessage("Registered successfully. You can now login.");
          setIsRegistering(false);
        } else {
          setMessage("Registration failed.");
        }
      } else {
        const res = await loginUser({
          username: form.username,
          password: form.password,
        });

        if (res.access && res.refresh) {
          localStorage.setItem("accessToken", res.access);
          localStorage.setItem("refreshToken", res.refresh);
          setMessage("Login successful!");
          if (onLogin) onLogin();
        } else {
          setMessage("Invalid login credentials.");
        }
      }
    } catch (err) {
      console.error("Auth error:", err.message);
      setMessage(" An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-100 to-indigo-300 items-center justify-center p-10">
        <div className="max-w-md text-indigo-800">
          <h2 className="text-3xl font-bold mb-4">Welcome to Expense Tracker </h2>
          <p className="text-lg mb-4">
            Track, analyze, and manage your expenses in real-time. Generate monthly reports, attach receipts, and take control of your spending like a pro!
          </p>
          <ul className="list-disc list-inside text-md space-y-1">
            <li>➕ Add expenses with descriptions and receipts</li>
            <li>📋 View and edit your past transactions</li>
            <li>📊 Download monthly report PDFs</li>
            <li>🔒 Secure and fast login/logout</li>
          </ul>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-sm p-6 rounded-xl shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
            {isRegistering ? "Register" : "Login"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-2 border rounded"
              required
            />

            {isRegistering && (
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded"
                required
              />
            )}

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              {loading ? "Please wait..." : isRegistering ? "Register" : "Login"}
            </button>

            <p
              className="text-sm text-center text-indigo-500 cursor-pointer"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setMessage("");
              }}
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </p>

            {message && (
              <p
                className={`text-center text-sm ${
                  message.includes("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
