import { useState, useEffect, useCallback } from "react";
import { api } from "./api";
import { StatsBar } from "./components/StatsBar";
import { CreateTicketForm } from "./components/CreateTicketForm";
import { TicketList } from "./components/TicketList";
import { Toast } from "./components/Toast";
import { useToast } from "./hooks/useToast";

export default function App() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const { toasts, addToast } = useToast();

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await api.getStats();
      setStats(data);
    } catch {
      // non-fatal
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  function handleTicketCreated(ticket) {
    addToast(`Ticket "${ticket.title}" created`);
    setRefreshSignal((n) => n + 1);
    fetchStats();
  }

  function handleStatsNeedRefresh() {
    fetchStats();
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-brand">
          <div className="header-icon">🎫</div>
          <h1>Mini <span>Ticket</span> Tracker</h1>
        </div>
      </header>

      <StatsBar stats={stats} loading={statsLoading} />

      <div className="main-grid">
        <aside>
          <CreateTicketForm onCreated={handleTicketCreated} />
        </aside>

        <main>
          <TicketList
            refreshSignal={refreshSignal}
            onStatsNeedRefresh={handleStatsNeedRefresh}
            addToast={addToast}
          />
        </main>
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}
