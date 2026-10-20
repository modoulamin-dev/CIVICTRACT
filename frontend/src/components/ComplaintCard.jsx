import { Link } from "react-router-dom";
import { CATEGORY_META, timeAgo } from "../utils/meta.js";
import { CategoryIcon, MiniProgress, StatusBadge } from "./StatusBadge.jsx";

// Public complaint card. Opens the Track page, the single place where a citizen
// reads a complaint's full story.
export function ComplaintCard({ complaint }) {
  return (
    <li>
      <Link to={`/track/${complaint.trackingNumber}`} className="card card-link flex h-full flex-col p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <CategoryIcon category={complaint.category} size="sm" />
            <span className="truncate text-[13px] text-neutral-500">{CATEGORY_META[complaint.category].label}</span>
          </div>
          <StatusBadge status={complaint.status} />
        </div>
        <h3 className="mt-3 line-clamp-1 font-medium text-neutral-900">{complaint.title}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-neutral-500">{complaint.description}</p>
        <div className="mt-auto pt-4">
          <MiniProgress status={complaint.status} />
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-neutral-500">
            <span className="truncate">
              {complaint.location.area} · {complaint.department?.name}
            </span>
            <span className="shrink-0">{timeAgo(complaint.createdAt)}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
