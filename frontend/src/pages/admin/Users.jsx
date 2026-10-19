import { useEffect, useState } from "react";
import { createStaff, listDepartments, listStaff, updateStaff } from "../../api/stats.js";
import { useAuth } from "../../context/AuthContext.jsx";

export function Users() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    department: "",
  });
  const [error, setError] = useState("");

  async function reload() {
    const [users, deps] = await Promise.all([listStaff(), listDepartments()]);
    setItems(users.items);
    setDepartments(deps.items);
  }

  useEffect(() => {
    reload().catch((err) => setError(err.message));
  }, []);

  if (user?.role !== "super_admin") return <p>Super admin only.</p>;

  return (
    <div>
      <h1>Staff accounts</h1>
      {error ? <p className="error">{error}</p> : null}
      <form
        className="card form"
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            await createStaff(form);
            setForm({ name: "", email: "", password: "", role: "staff", department: "" });
            await reload();
          } catch (err) {
            setError(err.message);
          }
        }}
      >
        <h2>Create staff</h2>
        <label>
          Name
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          Email
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <label>
          Role
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="staff">Staff</option>
            <option value="super_admin">Super admin</option>
          </select>
        </label>
        <label>
          Department
          <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
            <option value="">None</option>
            {departments.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn-primary" type="submit">
          Create
        </button>
      </form>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>{item.department?.name || "—"}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={async () => {
                      await updateStaff(item._id, { isActive: !item.isActive });
                      await reload();
                    }}
                  >
                    {item.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
