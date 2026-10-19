import { request } from "./client.js";

function withQuery(path, params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, value]) => value))
  ).toString();
  return request(`${path}${query ? `?${query}` : ""}`);
}

export function statsSummary(params) {
  return withQuery("/admin/stats/summary", params);
}

export function statsByArea(params) {
  return withQuery("/admin/stats/by-area", params);
}

export function statsByCategory(params) {
  return withQuery("/admin/stats/by-category", params);
}

export function statsResolution(params) {
  return withQuery("/admin/stats/resolution-time", params);
}

export function listDepartments() {
  return request("/admin/departments");
}

export function publicDepartments() {
  return request("/departments");
}

export function createDepartment(body) {
  return request("/admin/departments", { method: "POST", body: JSON.stringify(body) });
}

export function updateDepartment(id, body) {
  return request(`/admin/departments/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}

export function listStaff() {
  return request("/admin/users");
}

export function createStaff(body) {
  return request("/admin/users", { method: "POST", body: JSON.stringify(body) });
}

export function updateStaff(id, body) {
  return request(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}
