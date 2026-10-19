import { useState } from "react";
import { submitComplaint } from "../../api/complaints.js";
import { MapPicker } from "../../components/MapPicker.jsx";
import { compressImage } from "../../utils/compressImage.js";
import { categories, regions } from "../../utils/strings.js";

const STEPS = ["Problem", "Location", "Photo & contact"];

export function ReportComplaint() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    category: "roads",
    description: "",
    region: "Kanifing",
    area: "",
    landmark: "",
    phone: "",
    email: "",
    reporterName: "",
  });
  const [coords, setCoords] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [geoMessage, setGeoMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      if (coords) {
        data.append("lat", String(coords.lat));
        data.append("lng", String(coords.lng));
      }
      if (photo) {
        const compressed = await compressImage(photo);
        data.append("photo", compressed);
      }
      const created = await submitComplaint(data);
      setResult(created);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function copyNumber() {
    navigator.clipboard?.writeText(result.trackingNumber);
  }

  if (result) {
    return (
      <main className="page narrow">
        <section className="card">
          <h1>Complaint received</h1>
          <p>Keep this tracking number. Anyone can use it to follow progress.</p>
          <p className="tracking">{result.trackingNumber}</p>
          <div className="actions">
            <button type="button" className="btn btn-primary" onClick={copyNumber}>
              Copy number
            </button>
            <a className="btn btn-ghost" href={`/track/${result.trackingNumber}`}>
              Track now
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page narrow">
      <h1>Report a problem</h1>
      <p className="muted">You do not need an account. Three short steps.</p>
      <ol className="stepper">
        {STEPS.map((label, index) => (
          <li key={label} className={index === step ? "active" : index < step ? "done" : ""}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>
      <form className="card form" onSubmit={onSubmit}>
        {step === 0 ? (
          <>
            <label>
              Category
              <select value={form.category} onChange={(e) => update("category", e.target.value)}>
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              What happened?
              <textarea
                required
                minLength={10}
                maxLength={2000}
                rows={6}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe the problem in plain language."
              />
            </label>
          </>
        ) : null}
        {step === 1 ? (
          <>
            <label>
              Region
              <select value={form.region} onChange={(e) => update("region", e.target.value)}>
                {regions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Area or town
              <input required value={form.area} onChange={(e) => update("area", e.target.value)} />
            </label>
            <label>
              Landmark
              <input
                value={form.landmark}
                onChange={(e) => update("landmark", e.target.value)}
                placeholder="Market, school, junction…"
              />
            </label>
            <MapPicker
              coords={coords}
              onChange={(next, message) => {
                if (next) setCoords(next);
                setGeoMessage(message || "");
              }}
            />
            {geoMessage ? <p className="muted">{geoMessage}</p> : null}
          </>
        ) : null}
        {step === 2 ? (
          <>
            <label>
              Photo (optional, JPEG/PNG/WebP, 5 MB max)
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              />
            </label>
            <label>
              Your name (optional, not shown publicly)
              <input value={form.reporterName} onChange={(e) => update("reporterName", e.target.value)} />
            </label>
            <label>
              Phone (optional, not shown publicly)
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </label>
            <label>
              Email (optional, not shown publicly)
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </label>
          </>
        ) : null}
        {error ? <p className="error">{error}</p> : null}
        <div className="actions">
          {step > 0 ? (
            <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          ) : null}
          {step < 2 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (step === 0 && form.description.trim().length < 10) {
                  setError("Please write at least 10 characters.");
                  return;
                }
                if (step === 1 && !form.area.trim()) {
                  setError("Please add an area or town.");
                  return;
                }
                setError("");
                setStep((s) => s + 1);
              }}
            >
              Continue
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Sending…" : "Submit complaint"}
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
