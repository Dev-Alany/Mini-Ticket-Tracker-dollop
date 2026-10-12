import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { TicketItem } from "./TicketItem";

const LIMIT = 10;

export function TicketList({ refreshSignal, onStatsNeedRefresh, addToast }) {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTickets({
        status: statusFilter || undefined,
        page,
        limit: LIMIT,
      });
      setTickets(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page, refreshSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  function handleFilterChange(e) {
    setStatusFilter(e.target.value);
    setPage(1);
  }

  function handleUpdated(updated) {
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    onStatsNeedRefresh();
    addToast(`Ticket #${updated.id} updated`);
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <div className="filter-bar">
        <label htmlFor="status-filter">Filter:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={handleFilterChange}
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <div className="filter-spacer" />
        <span className="total-label">
          {loading ? "" : `${total} ticket${total !== 1 ? "s" : ""}`}
        </span>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="empty-state">
          <div className="spinner" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          No tickets found. Create one to get started.
        </div>
      ) : (
        <div className="ticket-list">
          {tickets.map((t) => (
            <TicketItem key={t.id} ticket={t} onUpdated={handleUpdated} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            id="prev-page-btn"
            className="page-btn"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`page-btn ${p === page ? "active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            id="next-page-btn"
            className="page-btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
