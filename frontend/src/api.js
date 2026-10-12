const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getTickets: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
    ).toString();
    return request(`/tickets/${qs ? `?${qs}` : ""}`);
  },

  createTicket: (payload) =>
    request("/tickets/", { method: "POST", body: JSON.stringify(payload) }),

  updateTicket: (id, payload) =>
    request(`/tickets/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),

  getStats: () => request("/tickets/stats"),
};
