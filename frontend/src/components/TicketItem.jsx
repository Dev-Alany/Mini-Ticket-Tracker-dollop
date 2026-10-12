import { useState } from "react";
import { api } from "../api";
import { Badge } from "./Badge";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function TicketItem({ ticket, onUpdated }) {
  const [updating, setUpdating] = useState(false);

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      const updated = await api.updateTicket(ticket.id, { status: newStatus });
      onUpdated(updated);
    } catch {
      // silently revert — parent still holds old value
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="ticket-item" id={`ticket-${ticket.id}`}>
      <div>
        <div className="ticket-header">
          <div>
            <p className="ticket-title">{ticket.title}</p>
            {ticket.description && (
              <p className="ticket-desc">{ticket.description}</p>
            )}
          </div>
        </div>
        <div className="ticket-meta">
          <Badge value={ticket.status} />
          <Badge value={ticket.priority} />
          <span className="ticket-date">{formatDate(ticket.created_at)}</span>
        </div>
      </div>
      <div className="ticket-actions">
        <select
          id={`status-select-${ticket.id}`}
          className="status-select"
          value={ticket.status}
          onChange={handleStatusChange}
          disabled={updating}
          aria-label="Change ticket status"
          title="Change status"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
          #{ticket.id}
        </span>
      </div>
    </div>
  );
}
