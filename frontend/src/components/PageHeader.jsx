// Shared header for inner citizen pages so every page opens the same way.
export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="border-b border-neutral-200">
      <div className="container-page py-10 sm:py-12">
        {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-xl text-[15px] text-neutral-500">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}
