import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const signedIn = await login({ email, password });
      navigate(signedIn.role === "citizen" ? "/me" : "/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page narrow">
      <form className="card form" onSubmit={onSubmit}>
        <h1>Sign in</h1>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit">
          Sign in
        </button>
        <p className="muted">
          Optional citizen account: <Link to="/register">create one</Link>
        </p>
      </form>
    </main>
  );
}
