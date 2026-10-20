import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleAlert,
  Copy,
  ImagePlus,
  LocateFixed,
  Lock,
  MapPin,
  Search,
  Send,
  X,
} from "lucide-react";
import { departments, submitComplaint } from "../../data/mock.js";
import { CategoryIcon } from "../../components/StatusBadge.jsx";
import { CATEGORY_META } from "../../utils/meta.js";
import { regions } from "../../utils/strings.js";

const STEPS = [
  { title: "What is the problem?", short: "Problem" },
  { title: "Where is it?", short: "Location" },
  { title: "Photo and contact", short: "Details" },
];

function Stepper({ step }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Form progress">
      {STEPS.map((item, index) => {
        const done = index < step;
        const active = index === step;
        return (
          <li key={item.short} className="flex flex-1 items-center gap-2" aria-current={active ? "step" : undefined}>
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                done
                  ? "bg-brand-600 text-white"
                  : active
                    ? "bg-white text-brand-700 shadow-[0_0_0_2px_var(--color-brand-500)]"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {done ? <Check className="size-4" strokeWidth={3} /> : index + 1}
            </span>
            <span className={`hidden text-sm font-semibold sm:block ${active || done ? "text-slate-900" : "text-slate-400"}`}>
              {item.short}
            </span>
            {index < STEPS.length - 1 ? (
              <span className={`h-0.5 flex-1 rounded-full ${done ? "bg-brand-500" : "bg-slate-200"}`} aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function Summary({ form }) {
  const category = CATEGORY_META[form.category];
  const department = departments.find((d) => d.categories.includes(form.category));
  return (
    <div className="card p-6">
      <p className="text-sm font-bold text-slate-900">Your report so far</p>
      <dl className="mt-4 space-y-4 text-sm">
        <div className="flex items-center gap-3">
          {form.category ? <CategoryIcon category={form.category} size="sm" /> : <span className="size-8 rounded-lg bg-slate-100" />}
          <div>
            <dt className="text-xs text-slate-500">Problem</dt>
            <dd className="font-semibold text-slate-800">{category?.label || "Not chosen yet"}</dd>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-500">
            <MapPin className="size-4" aria-hidden="true" />
          </span>
          <div>
            <dt className="text-xs text-slate-500">Location</dt>
            <dd className="font-semibold text-slate-800">{form.area ? `${form.area}, ${form.region}` : "Not given yet"}</dd>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <Building2 className="size-4" aria-hidden="true" />
          </span>
          <div>
            <dt className="text-xs text-slate-500">Will be sent to</dt>
            <dd className="font-semibold text-slate-800">{department?.name || "Chosen from the problem type"}</dd>
          </div>
        </div>
      </dl>
      <div className="mt-6 flex gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-100">
        <Lock className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
        <p>No account needed. Your name and phone are only seen by the department, never shown publicly.</p>
      </div>
    </div>
  );
}

function Confirmation({ result }) {
  const [copied, setCopied] = useState(false);
  return (
    <main className="relative flex-1 overflow-hidden bg-white">
      <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-xl px-4 py-14 text-center sm:py-20">
        <span className="relative mx-auto grid size-20 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-200 opacity-50 [animation-iteration-count:2]" />
          <span className="relative grid size-20 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-900/30">
            <Check className="size-10" strokeWidth={3} />
          </span>
        </span>
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight sm:text-4xl">Complaint sent</h1>
        <p className="mt-3 text-lg text-slate-600">Thank you. The responsible office has received your report.</p>

        <div className="card mt-10 overflow-hidden text-left">
          <div className="border-b border-dashed border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-500">Your tracking number</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="font-mono text-2xl font-bold tracking-wider text-slate-900 sm:text-3xl">{result.trackingNumber}</p>
              <button
                type="button"
                className="btn btn-secondary px-3"
                onClick={() => {
                  navigator.clipboard?.writeText(result.trackingNumber);
                  setCopied(true);
                }}
              >
                {copied ? <Check className="size-4 text-brand-600" /> : <Copy className="size-4" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-50/70 p-6">
            <CategoryIcon category={result.category} />
            <div>
              <p className="text-sm text-slate-500">Sent to</p>
              <p className="font-bold text-slate-900">{result.department.name}</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Save this number or take a screenshot. Anyone with it can follow the progress.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to={`/track/${result.trackingNumber}`} className="btn btn-primary btn-lg">
            <Search className="size-5" aria-hidden="true" /> Track this complaint
          </Link>
          <Link to="/" className="btn btn-secondary btn-lg">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

export function ReportComplaint() {
  const [params] = useSearchParams();
  const initialCategory = CATEGORY_META[params.get("category")] ? params.get("category") : "";
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    category: initialCategory,
    description: "",
    region: "Kanifing",
    area: "",
    landmark: "",
    reporterName: "",
    phone: "",
  });
  const [coords, setCoords] = useState(null);
  const [geoMessage, setGeoMessage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function next() {
    if (step === 0 && !form.category) return setError("Choose the type of problem.");
    if (step === 0 && form.description.trim().length < 10) return setError("Describe the problem in at least 10 characters.");
    if (step === 1 && !form.area.trim()) return setError("Enter the town or area.");
    setError("");
    setStep((s) => s + 1);
  }

  function useLocation() {
    if (!navigator.geolocation) return setGeoMessage("This browser cannot share a location.");
    setGeoMessage("Finding your location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoMessage("");
      },
      () => setGeoMessage("Could not get your location. The town and a landmark are enough.")
    );
  }

  function onSubmit(event) {
    event.preventDefault();
    setResult(submitComplaint({ ...form, photoUrl: photo || undefined }));
    window.scrollTo(0, 0);
  }

  if (result) return <Confirmation result={result} />;

  return (
    <main className="flex-1">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:py-14">
        <div>
          <p className="eyebrow">Report a problem</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{STEPS[step].title}</h1>
          <div className="mt-8">
            <Stepper step={step} />
          </div>

          <form className="card mt-8 p-5 sm:p-8" onSubmit={onSubmit} noValidate>
            {error ? (
              <p role="alert" className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 ring-1 ring-red-200">
                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {error}
              </p>
            ) : null}

            <div key={step} className="animate-rise space-y-6">
              {step === 0 ? (
                <>
                  <fieldset>
                    <legend className="field-label">Type of problem</legend>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      {Object.entries(CATEGORY_META).map(([value, meta]) => {
                        const selected = form.category === value;
                        return (
                          <label
                            key={value}
                            className={`relative flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                              selected
                                ? "border-brand-500 bg-brand-50/50 ring-4 ring-brand-500/10"
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="category"
                              value={value}
                              checked={selected}
                              onChange={(e) => update("category", e.target.value)}
                              className="sr-only"
                            />
                            <CategoryIcon category={value} />
                            <span className="min-w-0">
                              <span className="block font-semibold text-slate-900">{meta.label}</span>
                              <span className="block text-sm text-slate-500">{meta.hint}</span>
                            </span>
                            {selected ? (
                              <span className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-brand-600 text-white">
                                <Check className="size-3" strokeWidth={3} />
                              </span>
                            ) : null}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                  <div>
                    <label htmlFor="description" className="field-label">
                      Describe the problem
                    </label>
                    <span className="field-hint">What is wrong and how long has it been like this?</span>
                    <textarea
                      id="description"
                      rows={5}
                      maxLength={2000}
                      className="input resize-none"
                      placeholder="e.g. A water pipe burst this morning near the market and the road is flooding."
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                    <p className="mt-1.5 text-right text-xs text-slate-400">{form.description.length} / 2000</p>
                  </div>
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="region" className="field-label">
                        Region
                      </label>
                      <select id="region" className="input" value={form.region} onChange={(e) => update("region", e.target.value)}>
                        {regions.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="area" className="field-label">
                        Town or area
                      </label>
                      <input
                        id="area"
                        className="input"
                        placeholder="e.g. Serrekunda"
                        value={form.area}
                        onChange={(e) => update("area", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="landmark" className="field-label">
                      Nearby landmark <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <span className="field-hint">A market, school, mosque or junction people know</span>
                    <input id="landmark" className="input" value={form.landmark} onChange={(e) => update("landmark", e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-dashed border-sky-200 bg-sky-50/50 p-5 sm:flex-row sm:items-center">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-600">
                      <LocateFixed className="size-5" aria-hidden="true" />
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{coords ? "Exact location added" : "Add your exact location"}</p>
                      <p className="text-sm text-slate-600">
                        {coords
                          ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
                          : geoMessage || "Optional. Helps the crew find the exact spot."}
                      </p>
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={useLocation}>
                      {coords ? "Update" : "Use my location"}
                    </button>
                  </div>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <div>
                    <p className="field-label">
                      Photo <span className="font-normal text-slate-400">(optional)</span>
                    </p>
                    {photo ? (
                      <div className="relative overflow-hidden rounded-xl border border-slate-200">
                        <img src={photo} alt="Selected" className="max-h-72 w-full object-cover" />
                        <button
                          type="button"
                          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow backdrop-blur hover:bg-white"
                          aria-label="Remove photo"
                          onClick={() => setPhoto(null)}
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="photo"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center transition hover:border-brand-300 hover:bg-brand-50/30"
                      >
                        <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-card ring-1 ring-slate-100">
                          <ImagePlus className="size-6" aria-hidden="true" />
                        </span>
                        <span className="mt-3 font-semibold text-slate-900">Add a photo</span>
                        <span className="mt-1 text-sm text-slate-500">Take one now or choose from your gallery</span>
                      </label>
                    )}
                    <input
                      id="photo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setPhoto(file ? URL.createObjectURL(file) : null);
                      }}
                    />
                  </div>
                  <div className="border-t border-slate-100 pt-6">
                    <p className="font-bold text-slate-900">Contact details (optional)</p>
                    <p className="mt-1 text-sm text-slate-500">In case the department needs to ask you something.</p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="field-label">
                        Name
                      </label>
                      <input id="name" className="input" value={form.reporterName} onChange={(e) => update("reporterName", e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor="phone" className="field-label">
                        Phone number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="input"
                        placeholder="+220"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
              {step > 0 ? (
                <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft className="size-4" aria-hidden="true" /> Back
                </button>
              ) : (
                <span />
              )}
              {step < STEPS.length - 1 ? (
                <button type="button" className="btn btn-primary btn-lg" onClick={next}>
                  Continue <ArrowRight className="size-5" aria-hidden="true" />
                </button>
              ) : (
                <button type="submit" className="btn btn-primary btn-lg">
                  <Send className="size-5" aria-hidden="true" /> Send complaint
                </button>
              )}
            </div>
          </form>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Summary form={form} />
        </aside>
      </div>
    </main>
  );
}
