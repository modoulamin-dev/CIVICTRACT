import { useEffect, useState } from "react";
import { createDepartment, listDepartments, updateDepartment } from "../../api/stats.js";
import { categories } from "../../utils/strings.js";
import { useAuth } from "../../context/AuthContext.jsx";

export function Departments() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", categories: [], contactEmail: "", contactPhone: "" });
  const [error, setError] = useState("");

  function reload() {
    return listDepartments().then((data) => setItems(data.items));
  }

  useEffect(() => {
    reload().catch((err) => setError(err.message));
  }, []);

  if (user?.role !== "super_admin") return <p>Super admin only.</p>;

  return (
    <div>
      <h1>Departments</h1>
      {error ? <p className="error">{error}</p> : null}
      <form
        className="card form"
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            await createDepartment(form);
            setForm({ name: "", categories: [], contactEmail: "", contactPhone: "" });
            await reload();
          } catch (err) {
            setError(err.message);
          }
        }}
      >
        <h2>Add department</h2>
        <label>
          Name
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <fieldset>
          <legend>Routing categories</legend>
          {categories.map((item) => (
            <label key={item.value} className="check">
              <input
                type="checkbox"
                checked={form.categories.includes(item.value)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...form.categories, item.value]
                    : form.categories.filter((value) => value !== item.value);
                  setForm({ ...form, categories: next });
                }}
              />
              {item.label}
            </label>
          ))}
        </fieldset>
        <button className="btn btn-primary" type="submit">
          Create
        </button>
      </form>
      {items.map((item) => (
        <article key={item._id} className="card">
          <h3>{item.name}</h3>
          <p className="muted">{item.categories.join(", ") || "No categories"}</p>
          <p>{item.isActive ? "Active" : "Inactive"}</p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={async () => {
              await updateDepartment(item._id, { isActive: !item.isActive });
              await reload();
            }}
          >
            {item.isActive ? "Deactivate" : "Activate"}
          </button>
        </article>
      ))}
    </div>
  );
}
