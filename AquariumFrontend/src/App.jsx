
import { useCallback, useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import AddAquarium from "./pages/AddAquarium";
import AquariumList from "./pages/AquariumList";
import AquariumDetails from "./pages/AquariumDetails";
import "./App.css";

const API = "/api/aquarium";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [aquariums, setAquariums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState(null);

  const loadAquariums = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/displayall`);
      if (!response.ok) throw new Error("Unable to load aquarium records.");

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid server response.");

      setAquariums(data);
    } catch (error) {
      setMessage({ type: "danger", text: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAquariums();
  }, [loadAquariums]);

  function navigate(nextPage) {
    setMessage(null);
    setPage(nextPage);
  }

  async function addAquarium(data) {
    const response = await fetch(`${API}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(await response.text() || "Failed to add aquarium.");

    setMessage({ type: "success", text: "Aquarium added successfully!" });
    await loadAquariums();
    setPage("records");
  }

  async function updateAquarium(id, data) {
    const response = await fetch(`${API}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(await response.text() || "Failed to update aquarium.");

    setMessage({ type: "success", text: `Aquarium #${id} updated successfully!` });
    await loadAquariums();
    setPage("records");
  }

  async function deleteAquarium(id) {
    const response = await fetch(`${API}/delete/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error(await response.text() || "Failed to delete aquarium.");

    setAquariums(old => old.filter(item => item.id !== id));
    setMessage({ type: "success", text: `Aquarium #${id} deleted successfully.` });
  }

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand navbar-dark ocean-nav">
        <div className="container">
          <button className="navbar-brand border-0 bg-transparent"
            onClick={() => navigate("dashboard")}>
            🐠 AquaCare
          </button>
          <div className="navbar-nav ms-auto flex-row">
            {[
              ["dashboard", "Dashboard"],
              ["add", "Add Aquarium"],
              ["records", "Records"]
            ].map(([key, label]) => (
              <button key={key}
                className={`nav-link ${page === key ? "active" : ""}`}
                onClick={() => navigate(key)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="container">
          <span className="hero-label">AQUARIUM MANAGEMENT SYSTEM</span>
          <h1>Explore. Manage. Preserve.</h1>
          <p>Manage aquarium locations, species diversity, and visitor entry fees.</p>
          <button className="btn btn-light rounded-pill px-4 fw-semibold"
            onClick={() => navigate("add")}>
            + Add Aquarium
          </button>
        </div>
      </header>

      <main className="container py-4 py-md-5">
        {message && (
          <div className={`alert alert-${message.type} alert-dismissible`} role="alert">
            {message.text}
            <button type="button" className="btn-close"
              onClick={() => setMessage(null)} aria-label="Close" />
          </div>
        )}

        {page === "dashboard" && (
          <Dashboard aquariums={aquariums} loading={loading}
            onAdd={() => navigate("add")}
            onView={() => navigate("records")} />
        )}

        {page === "add" && (
          <AddAquarium onAdd={addAquarium}
            onCancel={() => navigate("dashboard")} />
        )}

        {page === "records" && (
          <AquariumList aquariums={aquariums} loading={loading}
            onRefresh={loadAquariums}
            onDelete={deleteAquarium}
            onView={id => {
              setSelectedId(id);
              navigate("details");
            }}
            onEdit={id => {
              setSelectedId(id);
              navigate("edit");
            }} />
        )}

        {(page === "details" || page === "edit") && (
          <AquariumDetails
            key={`${page}-${selectedId}`}
            id={selectedId}
            mode={page}
            onBack={() => navigate("records")}
            onUpdate={updateAquarium}
          />
        )}

        <footer className="app-footer">
          AquaCare Aquarium Management · React + Spring Boot
        </footer>
      </main>
    </div>
  );
}
