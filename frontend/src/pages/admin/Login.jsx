import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@civictract.gm");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const signedIn = await login({ email, password });
      if (!["staff", "super_admin"].includes(signedIn.role)) {
        setError("This account is not a staff account.");
        return;
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page narrow">
      <form className="card form" onSubmit={onSubmit}>
        <h1>Staff sign in</h1>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit">
          Enter dashboard
        </button>
      </form>
    </main>
  );
}
