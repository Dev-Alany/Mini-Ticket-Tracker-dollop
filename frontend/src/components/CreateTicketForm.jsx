import { useState } from "react";
import { api } from "../api";

const INITIAL = { title: "", description: "", status: "open", priority: "medium" };

export function CreateTicketForm({ onCreated }) {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const ticket = await api.createTicket(form);
      setForm(INITIAL);
      onCreated(ticket);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <p className="card-title">🎫 New Ticket</p>
      {error && <div className="error-banner">{error}</div>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Short, descriptive title"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional details…"
          />
        </div>
        <div className="row">
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <button
          id="create-ticket-btn"
          className="btn btn-primary"
          type="submit"
          disabled={loading || !form.title.trim()}
        >
          {loading ? "Creating…" : "Create Ticket"}
        </button>
      </form>
    </div>
  );
}
