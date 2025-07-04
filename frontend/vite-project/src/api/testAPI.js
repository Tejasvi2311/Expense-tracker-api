const BASE_URL = "http://localhost:8000/api";

// ---------------------- REGISTER ----------------------
export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Registration failed");
  return await res.json();
}

// ---------------------- LOGIN ----------------------
export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login failed");
  return await res.json(); // returns { access, refresh }
}

// ---------------------- REFRESH TOKEN ----------------------
export async function refreshToken(refreshToken) {
  const res = await fetch(`${BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!res.ok) throw new Error("Token refresh failed");
  return await res.json();
}

// ---------------------- GET EXPENSES ----------------------
export async function getExpenses(token,url = "/expenses/") {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch expenses");
  return await res.json();
}

// ---------------------- ADD EXPENSE ----------------------
export async function addExpense(data, token) {
  const res = await fetch(`${BASE_URL}/expenses/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data, // 'data' should be a FormData instance
  });

  if (!res.ok) throw new Error("Failed to add expense");
  return await res.json();
}

// ---------------------- DELETE EXPENSE ----------------------
export async function deleteExpense(id, token) {
  const res = await fetch(`${BASE_URL}/expenses/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== 204) {
    throw new Error(`Failed to delete expense with id ${id}`);
  }
}

// ---------------------- UPDATE EXPENSE ----------------------
export async function updateExpense(id, data, token) {
  const res = await fetch(`${BASE_URL}/expenses/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data, // FormData
  });

  if (!res.ok) throw new Error("Failed to update expense");
  return await res.json();
}


// ---------------------- MONTHLY REPORT ----------------------
export async function getMonthlyReport(token, month, year) {
  const params = new URLSearchParams();

  if (month) params.append("month", month);
  if (year) params.append("year", year);

  const res = await fetch(`${BASE_URL}/reports/monthly/?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch monthly report");
  return await res.json();
}
