
import { useState } from "react";

export default function AquariumList({
  aquariums, loading, onRefresh, onDelete, onView, onEdit
}) {
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  async function remove(item) {
    if (!window.confirm(`Delete "${item.aquariumName}"?`)) return;

    setDeleting(item.id);
    setError("");

    try {
      await onDelete(item.id);
    } catch (err) {
      setError(err.message || "Unable to delete aquarium.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <section className="content-card">
      <div className="page-heading">
        <div>
          <span className="section-label">YOUR COLLECTION</span>
          <h2>Aquarium Records</h2>
          <p>View, update, and delete aquarium records.</p>
        </div>
        <button className="btn btn-outline-info" onClick={onRefresh} disabled={loading}>
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner-border text-info" role="status" />
          <p>Loading records...</p>
        </div>
      ) : aquariums.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🐠</div>
          <h4>No aquarium records found</h4>
          <p>Add an aquarium to see it here.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table aquarium-table align-middle">
            <thead>
              <tr>
                <th>ID</th><th>Aquarium</th><th>City</th>
                <th>Species</th><th>Fee</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {aquariums.map(item => (
                <tr key={item.id}>
                  <td><span className="id-badge">#{item.id}</span></td>
                  <td className="fw-semibold">{item.aquariumName}</td>
                  <td>{item.city}</td>
                  <td>{item.speciesCount}</td>
                  <td>₹{Number(item.entryFee).toFixed(2)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-info"
                        onClick={() => onView(item.id)}>View</button>
                      <button className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(item.id)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger"
                        disabled={deleting === item.id}
                        onClick={() => remove(item)}>
                        {deleting === item.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
