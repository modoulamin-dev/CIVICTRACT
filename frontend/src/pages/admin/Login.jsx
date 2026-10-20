import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, Inbox, Siren } from "lucide-react";
import { Logo } from "../../components/CitizenShell.jsx";

export function AdminLogin() {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-brand-950 p-12 text-white lg:flex lg:flex-col">
        <div className="flag-stripe absolute inset-x-0 top-0 h-1" aria-hidden="true" />
        <div className="dot-grid absolute inset-0 opacity-40 invert" aria-hidden="true" />
        <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-brand-500/30 blur-3xl" aria-hidden="true" />
        <div className="absolute top-20 -left-20 size-72 rounded-full bg-sky-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <Logo inverted />
        </div>
        <div className="relative my-auto max-w-md">
          <h2 className="text-4xl leading-tight font-extrabold tracking-tight">Every complaint, routed and visible.</h2>
          <p className="mt-4 text-lg text-brand-100/80">The workspace for departments to receive, prioritise and respond to citizens.</p>
          <ul className="mt-10 space-y-4">
            {[
              [Inbox, "Reports arrive already routed to your office"],
              [Siren, "Urgent and overdue cases rise to the top"],
              [Building2, "Every update you post is shown to the public"],
            ].map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-3 text-brand-50">
                <span className="grid size-9 place-items-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex flex-col bg-white px-4 py-8 sm:px-12">
        <Link to="/" className="inline-flex items-center gap-2 self-start text-sm font-semibold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="size-4" aria-hidden="true" /> Public site
        </Link>
        <div className="m-auto w-full max-w-sm py-12">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="mt-8 text-2xl font-extrabold tracking-tight lg:mt-0">Staff sign in</h1>
          <p className="mt-1 text-slate-500">For department and complaints desk staff.</p>
          <form
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              navigate("/admin");
            }}
          >
            <div>
              <label htmlFor="email" className="field-label">
                Work email
              </label>
              <input id="email" type="email" className="input" defaultValue="admin@civictract.gm" />
            </div>
            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input id="password" type="password" className="input" defaultValue="CivicTract2026!" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full">
              Sign in <ArrowRight className="size-5" aria-hidden="true" />
            </button>
          </form>
          <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500 ring-1 ring-slate-100">
            Demo mode: the details are filled in for you.
          </p>
        </div>
      </section>
    </main>
  );
}
