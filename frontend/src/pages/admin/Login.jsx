import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../components/CitizenShell.jsx";

export function AdminLogin() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50/60 px-4">
      <div className="w-full max-w-sm animate-fade">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="card mt-8 p-6 shadow-xs">
          <h1 className="text-lg font-semibold tracking-tight">Staff sign in</h1>
          <p className="mt-1 text-neutral-500">For department and complaints desk staff.</p>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              navigate("/admin");
            }}
          >
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input id="email" type="email" className="input" defaultValue="admin@civictract.gm" />
            </div>
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input id="password" type="password" className="input" defaultValue="CivicTract2026!" />
            </div>
            <button type="submit" className="btn btn-dark w-full">
              Continue
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-[13px] text-neutral-500">
          Not staff?{" "}
          <Link to="/" className="link">
            Go to the public site
          </Link>
        </p>
      </div>
    </main>
  );
}
