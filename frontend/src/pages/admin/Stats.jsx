import { useEffect, useState } from "react";
import { statsByArea, statsByCategory, statsResolution, statsSummary } from "../../api/stats.js";
import { categoryLabel } from "../../utils/strings.js";

function Bar({ value, max }) {
  const width = max ? Math.max(6, Math.round((value / max) * 100)) : 0;
  return (
    <div className="bar-track" aria-hidden="true">
      <div className="bar-fill" style={{ width: `${width}%` }} />
    </div>
  );
}

export function Stats() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [summary, setSummary] = useState(null);
  const [areas, setAreas] = useState([]);
  const [cats, setCats] = useState([]);
  const [resolution, setResolution] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = { from, to };
    Promise.all([statsSummary(params), statsByArea(params), statsByCategory(params), statsResolution(params)])
      .then(([s, a, c, r]) => {
        setSummary(s);
        setAreas(a.items);
        setCats(c.items);
        setResolution(r);
      })
      .catch((err) => setError(err.message));
  }, [from, to]);

  const areaMax = Math.max(0, ...areas.map((item) => item.count));
  const catMax = Math.max(0, ...cats.map((item) => item.count));

  return (
    <div>
      <h1>Statistics</h1>
      <div className="filters">
        <label>
          From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <p>
        Average resolution time:{" "}
        <strong>{resolution?.averageResolutionHours ?? "—"} hours</strong> ({resolution?.resolvedCount || 0} resolved)
      </p>
      <section className="card">
        <h2>By status</h2>
        {Object.entries(summary?.byStatus || {}).map(([key, value]) => (
          <p key={key}>
            {key}: {value}
          </p>
        ))}
      </section>
      <section className="card">
        <h2>By category</h2>
        {cats.map((item) => (
          <div key={item.category} className="bar-row">
            <span>
              {categoryLabel(item.category)} ({item.count})
              {item.averageResolutionHours != null ? ` · ${item.averageResolutionHours}h avg` : ""}
            </span>
            <Bar value={item.count} max={catMax} />
          </div>
        ))}
      </section>
      <section className="card">
        <h2>By area</h2>
        {areas.map((item) => (
          <div key={`${item.region}-${item.area}`} className="bar-row">
            <span>
              {item.area}, {item.region} ({item.count}, {item.open} open)
            </span>
            <Bar value={item.count} max={areaMax} />
          </div>
        ))}
      </section>
    </div>
  );
}
