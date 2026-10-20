import { Link } from "react-router-dom";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import { CATEGORY_META, timeAgo } from "../utils/meta.js";
import { CategoryIcon, MiniProgress, StatusBadge } from "./StatusBadge.jsx";

// Public complaint card. Opens the Track page, the single place where a citizen
// reads a complaint's full story.
export function ComplaintCard({ complaint, index = 0 }) {
  const category = CATEGORY_META[complaint.category];
  return (
    <li className="animate-rise" style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}>
      <Link
        to={`/track/${complaint.trackingNumber}`}
        className="card card-hover group relative flex h-full flex-col overflow-hidden p-5"
      >
        <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${category.accent}`} aria-hidden="true" />
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <CategoryIcon category={complaint.category} />
            <div>
              <p className="text-sm font-semibold text-slate-800">{category.label}</p>
              <p className="text-xs text-slate-500">{timeAgo(complaint.createdAt)}</p>
            </div>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <h3 className="mt-4 line-clamp-2 text-base font-bold text-slate-900 group-hover:text-brand-700">
          {complaint.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">{complaint.description}</p>

        <div className="mt-auto pt-5">
          <MiniProgress status={complaint.status} />
          <div className="mt-4 flex flex-col gap-1.5 border-t border-slate-100 pt-4 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span className="truncate">
                {complaint.location.area}, {complaint.location.region}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <Building2 className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span className="truncate">{complaint.department?.name}</span>
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-slate-600">
              {complaint.trackingNumber}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-brand-700 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              View <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
