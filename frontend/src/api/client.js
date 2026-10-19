const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export async function request(path, options = {}) {
  const token = localStorage.getItem("civictract_token");
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(`${API}${path}`, { ...options, headers });
  } catch {
    const error = new Error("Could not reach CivicTract. Check your connection and try again.");
    error.status = 0;
    throw error;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    error.errors = data.errors || [];
    throw error;
  }
  return data;
}
