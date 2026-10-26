
import { useEffect, useState } from "react";

const API = "/api/aquarium";
const fields = [
  { name: "aquariumName", label: "Aquarium Name", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "speciesCount", label: "Species Count", type: "number" },
  { name: "entryFee", label: "Entry Fee (₹)", type: "number" }
];

export default function AquariumDetails({ id, mode, onBack, onUpdate }) {
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState({
    aquariumName: "", city: "", speciesCount: "", entryFee: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let active = true;

    async function load() {
      if (id == null) {
        setError("No aquarium ID selected.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API}/${id}`);
        if (!response.ok) {
          throw new Error(response.status === 404
            ? "Aquarium not found."
            : "Unable to retrieve aquarium.");
        }

        const data = await response.json();
        if (!active) return;

        setRecord(data);
        setForm({
          aquariumName: data.aquariumName ?? "",
          city: data.city ?? "",
          speciesCount: String(data.speciesCount ?? ""),
          entryFee: String(data.entryFee ?? "")
        });
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [id]);

  function change(e) {
    setForm(previous => ({ ...previous, [e.target.name]: e.target.value }));
    setErrors(previous => ({ ...previous, [e.target.name]: "" }));
  }

  function validate() {
    const next = {};

    if (!form.aquariumName.trim()) next.aquariumName = "Name is required.";
    else if (form.aquariumName.trim().length > 100) {
      next.aquariumName = "Maximum 100 characters.";
    }

    if (!form.city.trim()) next.city = "City is required.";
    else if (form.city.trim().length > 100) {
      next.city = "Maximum 100 characters.";
    }

    if (form.speciesCount === "" ||
        !Number.isInteger(Number(form.speciesCount)) ||
        Number(form.speciesCount) < 0) {
      next.speciesCount = "Enter a non-negative whole number.";
    }

    if (form.entryFee === "" ||
        !Number.isFinite(Number(form.entryFee)) ||
        Number(form.entryFee) < 0) {
      next.entryFee = "Enter a non-negative fee.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setError("");

    try {
      await onUpdate(id, {
        aquariumName: form.aquariumName.trim(),
        city: form.city.trim(),
        speciesCount: Number(form.speciesCount),
        entryFee: Number(form.entryFee)
      });
    } catch (err) {
      setError(err.message || "Unable to update aquarium.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="content-card loading-state">
        <div className="spinner-border text-info" role="status" />
        <p>Loading aquarium details...</p>
      </div>
    );
  }

  if (error && !record) {
    return (
      <section className="content-card">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-outline-secondary" onClick={onBack}>
          Back to Records
        </button>
      </section>
    );
  }

  if (mode === "details") {
    return (
      <section className="content-card">
        <span className="section-label">AQUARIUM DETAILS</span>
        <h2 className="mt-2">{record.aquariumName}</h2>
        <p className="text-secondary">Record ID: #{record.id}</p>

        <div className="row g-3 mt-3">
          <div className="col-12 col-md-6">
            <div className="detail-item">
              <span>City</span><strong>{record.city}</strong>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="detail-item">
              <span>Species Count</span><strong>{record.speciesCount}</strong>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="detail-item">
              <span>Entry Fee</span>
              <strong>₹{Number(record.entryFee).toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <button className="btn btn-outline-secondary mt-4" onClick={onBack}>
          Back to Records
        </button>
      </section>
    );
  }

  return (
    <section className="content-card form-card">
      <span className="section-label">EDIT RECORD</span>
      <h2 className="mt-2">Update Aquarium #{id}</h2>
      <p className="text-secondary mb-4">
        Change the fields below. The existing ID will remain unchanged.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={submit} noValidate>
        <div className="row g-4">
          {fields.map(field => (
            <div className="col-12 col-md-6" key={field.name}>
              <label className="form-label" htmlFor={field.name}>
                {field.label} *
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                min={field.type === "number" ? 0 : undefined}
                step={field.name === "speciesCount" ? 1 :
                  field.name === "entryFee" ? "0.01" : undefined}
                maxLength={field.type === "text" ? 100 : undefined}
                className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                value={form[field.name]}
                onChange={change}
              />
              {errors[field.name] && (
                <div className="invalid-feedback">{errors[field.name]}</div>
              )}
            </div>
          ))}
        </div>

        <div className="d-flex gap-3 mt-4">
          <button className="btn btn-ocean" disabled={saving}>
            {saving ? "Updating..." : "Save Changes"}
          </button>
          <button type="button" className="btn btn-outline-secondary"
            disabled={saving} onClick={onBack}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
