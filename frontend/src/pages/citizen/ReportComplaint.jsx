import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Copy, ImagePlus, LocateFixed, X } from "lucide-react";
import { departments, submitComplaint } from "../../data/mock.js";
import { CategoryIcon } from "../../components/StatusBadge.jsx";
import { CATEGORY_META } from "../../utils/meta.js";
import { regions } from "../../utils/strings.js";

const STEPS = ["Problem", "Location", "Details"];
const TITLES = ["What is the problem?", "Where is it?", "Photo and contact"];

function Steps({ step }) {
  return (
    <ol className="grid grid-cols-3 gap-2" aria-label="Form progress">
      {STEPS.map((label, index) => (
        <li key={label} aria-current={index === step ? "step" : undefined}>
          <div className={`h-1 rounded-full ${index <= step ? "bg-neutral-900" : "bg-neutral-200"}`} />
          <p className={`mt-2 text-xs ${index <= step ? "font-medium text-neutral-900" : "text-neutral-400"}`}>
            {index + 1}. {label}
          </p>
        </li>
      ))}
    </ol>
  );
}

function Summary({ form }) {
  const department = departments.find((d) => d.categories.includes(form.category));
  const rows = [
    ["Problem", CATEGORY_META[form.category]?.label],
    ["Location", form.area ? `${form.area}, ${form.region}` : null],
    ["Sent to", department?.name],
  ];
  return (
    <div className="card">
      <p className="border-b border-neutral-200 px-4 py-3 font-medium">Summary</p>
      <dl className="divide-y divide-neutral-100 px-4">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-2.5 text-[13px]">
            <dt className="text-neutral-500">{label}</dt>
            <dd className={`text-right ${value ? "font-medium text-neutral-900" : "text-neutral-400"}`}>{value || "—"}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-neutral-200 bg-neutral-50/70 px-4 py-3 text-xs leading-5 text-neutral-500">
        No account needed. Contact details are only seen by the office, never shown publicly.
      </p>
    </div>
  );
}

function Confirmation({ result }) {
  const [copied, setCopied] = useState(false);
  return (
    <main className="container-page flex-1 py-16 sm:py-24">
      <div className="mx-auto max-w-md animate-fade">
        <span className="grid size-9 place-items-center rounded-full bg-brand-600 text-white">
          <Check className="size-4" strokeWidth={2.5} />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Complaint sent</h1>
        <p className="mt-1.5 text-neutral-500">The responsible office has received your report.</p>

        <div className="card mt-8">
          <div className="p-4">
            <p className="text-[13px] text-neutral-500">Tracking number</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="font-mono text-xl font-medium tracking-wide">{result.trackingNumber}</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  navigator.clipboard?.writeText(result.trackingNumber);
                  setCopied(true);
                }}
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-neutral-200 p-4">
            <CategoryIcon category={result.category} />
            <div>
              <p className="text-[13px] text-neutral-500">Sent to</p>
              <p className="font-medium">{result.department.name}</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[13px] text-neutral-500">Save this number. Anyone with it can follow the progress.</p>

        <div className="mt-8 flex gap-2">
          <Link to={`/track/${result.trackingNumber}`} className="btn btn-primary">
            Track this complaint
          </Link>
          <Link to="/" className="btn btn-secondary">
            Done
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
    <main className="container-page flex-1 py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="max-w-2xl">
          <p className="kicker">Report a problem</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{TITLES[step]}</h1>
          <div className="mt-6">
            <Steps step={step} />
          </div>

          <form className="mt-8" onSubmit={onSubmit} noValidate>
            {error ? (
              <p role="alert" className="mb-6 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
                <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
                {error}
              </p>
            ) : null}

            <div key={step} className="animate-fade space-y-6">
              {step === 0 ? (
                <>
                  <fieldset>
                    <legend className="label">Type of problem</legend>
                    <div className="card divide-y divide-neutral-200 overflow-hidden">
                      {Object.entries(CATEGORY_META).map(([value, meta]) => {
                        const selected = form.category === value;
                        return (
                          <label
                            key={value}
                            className={`flex cursor-pointer items-center gap-3 px-3.5 py-3 transition-colors ${
                              selected ? "bg-neutral-50" : "hover:bg-neutral-50/60"
                            }`}
                          >
                            <input
                              type="radio"
                              name="category"
                              value={value}
                              checked={selected}
                              onChange={(e) => update("category", e.target.value)}
                              className="size-4 accent-neutral-900"
                            />
                            <CategoryIcon category={value} size="sm" />
                            <span className="min-w-0">
                              <span className="block font-medium">{meta.label}</span>
                              <span className="block text-[13px] text-neutral-500">{meta.hint}</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                  <div>
                    <label htmlFor="description" className="label">
                      Description
                    </label>
                    <span className="hint">What is wrong and how long has it been like this?</span>
                    <textarea
                      id="description"
                      rows={4}
                      maxLength={2000}
                      className="input resize-none"
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                  </div>
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="region" className="label">
                        Region
                      </label>
                      <select id="region" className="input" value={form.region} onChange={(e) => update("region", e.target.value)}>
                        {regions.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="area" className="label">
                        Town or area
                      </label>
                      <input id="area" className="input" placeholder="Serrekunda" value={form.area} onChange={(e) => update("area", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="landmark" className="label">
                      Landmark <span className="font-normal text-neutral-400">Optional</span>
                    </label>
                    <input
                      id="landmark"
                      className="input"
                      placeholder="Market, school, mosque or junction"
                      value={form.landmark}
                      onChange={(e) => update("landmark", e.target.value)}
                    />
                  </div>
                  <div className="card flex items-center gap-3 p-3.5">
                    <LocateFixed className="size-4 shrink-0 text-neutral-500" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{coords ? "Exact location added" : "Exact location"}</p>
                      <p className="text-[13px] text-neutral-500">
                        {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : geoMessage || "Optional. Helps the crew find the spot."}
                      </p>
                    </div>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={useLocation}>
                      {coords ? "Update" : "Use my location"}
                    </button>
                  </div>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <div>
                    <p className="label">
                      Photo <span className="font-normal text-neutral-400">Optional</span>
                    </p>
                    {photo ? (
                      <div className="relative overflow-hidden rounded-lg border border-neutral-200">
                        <img src={photo} alt="Selected" className="max-h-64 w-full object-cover" />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm absolute top-2 right-2 px-2"
                          aria-label="Remove photo"
                          onClick={() => setPhoto(null)}
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="photo"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 px-6 py-8 text-center transition-colors hover:bg-neutral-50"
                      >
                        <ImagePlus className="size-5 text-neutral-400" aria-hidden="true" />
                        <span className="mt-2 font-medium">Add a photo</span>
                        <span className="text-[13px] text-neutral-500">Take one now or choose from your gallery</span>
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="label">
                        Name <span className="font-normal text-neutral-400">Optional</span>
                      </label>
                      <input id="name" className="input" value={form.reporterName} onChange={(e) => update("reporterName", e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor="phone" className="label">
                        Phone <span className="font-normal text-neutral-400">Optional</span>
                      </label>
                      <input id="phone" type="tel" className="input" placeholder="+220" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-5">
              {step > 0 ? (
                <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft className="size-4" aria-hidden="true" /> Back
                </button>
              ) : (
                <span />
              )}
              {step < STEPS.length - 1 ? (
                <button type="button" className="btn btn-primary" onClick={next}>
                  Continue <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  Send complaint
                </button>
              )}
            </div>
          </form>
        </div>

        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <Summary form={form} />
        </aside>
      </div>
    </main>
  );
}
