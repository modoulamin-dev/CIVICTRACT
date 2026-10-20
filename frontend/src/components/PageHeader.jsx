// Shared header band for inner citizen pages so every page opens the same way.
export function PageHeader({ eyebrow, title, children, narrow = false }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="dot-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      <div
        className="absolute -top-24 -right-24 size-72 rounded-full bg-brand-200/40 blur-3xl"
        aria-hidden="true"
      />
      <div className={`relative mx-auto px-4 py-10 sm:px-6 sm:py-14 ${narrow ? "max-w-3xl" : "max-w-6xl"}`}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        {children ? <div className="mt-3 max-w-2xl text-lg text-slate-600">{children}</div> : null}
      </div>
    </section>
  );
}
