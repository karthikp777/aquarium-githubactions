
import { useState } from "react";

const initialForm = {
  aquariumName: "",
  city: "",
  speciesCount: "",
  entryFee: ""
};

export default function AddAquarium({ onAdd, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setError("");
  }

  function validate() {
    const e = {};

    if (!form.aquariumName.trim()) e.aquariumName = "Name is required.";
    else if (form.aquariumName.trim().length > 100) e.aquariumName = "Maximum 100 characters.";

    if (!form.city.trim()) e.city = "City is required.";
    else if (form.city.trim().length > 100) e.city = "Maximum 100 characters.";

    if (form.speciesCount === "" ||
        !Number.isInteger(Number(form.speciesCount)) ||
        Number(form.speciesCount) < 0) {
      e.speciesCount = "Enter a non-negative whole number.";
    }

    if (form.entryFee === "" ||
        !Number.isFinite(Number(form.entryFee)) ||
        Number(form.entryFee) < 0) {
      e.entryFee = "Enter a non-negative fee.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setError("");

    try {
      await onAdd({
        aquariumName: form.aquariumName.trim(),
        city: form.city.trim(),
        speciesCount: Number(form.speciesCount),
        entryFee: Number(form.entryFee)
      });
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Could not add aquarium.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="content-card form-card">
      <div className="page-heading">
        <div>
          <span className="section-label">NEW RECORD</span>
          <h2>Add Aquarium</h2>
          <p>The ID will be generated automatically.</p>
        </div>
        <span className="form-decoration">🐠</span>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={submit} noValidate>
        <div className="row g-4">
          {[
            { name: "aquariumName", label: "Aquarium Name", placeholder: "Ocean World", type: "text" },
            { name: "city", label: "City", placeholder: "Visakhapatnam", type: "text" },
            { name: "speciesCount", label: "Number of Species", placeholder: "120", type: "number" },
            { name: "entryFee", label: "Entry Fee (₹)", placeholder: "150.00", type: "number" }
          ].map(field => (
            <div className="col-12 col-md-6" key={field.name}>
              <label className="form-label" htmlFor={field.name}>
                {field.label} *
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                min={field.type === "number" ? "0" : undefined}
                step={field.name === "speciesCount" ? "1" : field.name === "entryFee" ? "0.01" : undefined}
                maxLength={field.type === "text" ? 100 : undefined}
                className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={change}
              />
              {errors[field.name] && (
                <div className="invalid-feedback">{errors[field.name]}</div>
              )}
            </div>
          ))}
        </div>

        <p className="form-hint mt-3">* All fields are required.</p>

        <div className="d-flex flex-wrap gap-3 mt-4">
          <button className="btn btn-ocean" disabled={saving}>
            {saving ? "Saving..." : "Save Aquarium"}
          </button>
          <button type="button" className="btn btn-outline-secondary"
            disabled={saving} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-light border"
            disabled={saving} onClick={() => {
              setForm(initialForm);
              setErrors({});
              setError("");
            }}>
            Clear
          </button>
        </div>
      </form>
    </section>
  );
}
