
export default function Dashboard({ aquariums, loading, onAdd, onView }) {
  const totalSpecies = aquariums.reduce(
    (sum, a) => sum + (Number(a.speciesCount) || 0), 0
  );
  const averageFee = aquariums.length
    ? aquariums.reduce((sum, a) => sum + (Number(a.entryFee) || 0), 0) / aquariums.length
    : 0;

  const stats = [
    { icon: "🐠", label: "Total Aquariums", value: aquariums.length },
    { icon: "🌊", label: "Total Species", value: totalSpecies },
    { icon: "🎟️", label: "Average Entry Fee", value: `₹${averageFee.toFixed(2)}` }
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="section-label">OVERVIEW</span>
          <h2>Welcome to AquaCare</h2>
          <p>Your aquarium management dashboard.</p>
        </div>
        <button className="btn btn-ocean" onClick={onAdd}>+ Add Aquarium</button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner-border text-info" />
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            {stats.map(stat => (
              <div className="col-12 col-md-4" key={stat.label}>
                <div className="stat-card">
                  <span className="stat-icon">{stat.icon}</span>
                  <p>{stat.label}</p>
                  <h3>{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <section className="content-card">
            <div className="page-heading">
              <div>
                <span className="section-label">YOUR COLLECTION</span>
                <h3>Registered Aquariums</h3>
              </div>
              <button className="btn btn-outline-info" onClick={onView}>
                View All
              </button>
            </div>

            {aquariums.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🐟</div>
                <h4>No aquariums yet</h4>
                <p>Add your first aquarium to get started.</p>
                <button className="btn btn-ocean" onClick={onAdd}>
                  Add First Aquarium
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table aquarium-table align-middle">
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>City</th><th>Species</th><th>Fee</th></tr>
                  </thead>
                  <tbody>
                    {aquariums.slice(0, 5).map(a => (
                      <tr key={a.id}>
                        <td>#{a.id}</td>
                        <td>{a.aquariumName}</td>
                        <td>{a.city}</td>
                        <td>{a.speciesCount}</td>
                        <td>₹{Number(a.entryFee).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
