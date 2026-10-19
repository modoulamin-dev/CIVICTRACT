import { request } from "./client.js";

export function submitComplaint(formData) {
  return request("/complaints", { method: "POST", body: formData });
}

export function trackComplaint(trackingNumber) {
  return request(`/complaints/track/${encodeURIComponent(trackingNumber)}`);
}

export function listPublicComplaints(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, value]) => value !== "" && value != null))
  ).toString();
  return request(`/complaints/public${query ? `?${query}` : ""}`);
}

export function getPublicComplaint(id) {
  return request(`/complaints/public/${id}`);
}

export function myComplaints() {
  return request("/me/complaints");
}

export function listAdminComplaints(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, value]) => value !== "" && value != null))
  ).toString();
  return request(`/admin/complaints${query ? `?${query}` : ""}`);
}

export function getAdminComplaint(id) {
  return request(`/admin/complaints/${id}`);
}

export function patchStatus(id, body) {
  return request(`/admin/complaints/${id}/status`, { method: "PATCH", body: JSON.stringify(body) });
}

export function patchUrgent(id, isUrgent) {
  return request(`/admin/complaints/${id}/urgent`, {
    method: "PATCH",
    body: JSON.stringify({ isUrgent }),
  });
}

export function patchReassign(id, departmentId) {
  return request(`/admin/complaints/${id}/reassign`, {
    method: "PATCH",
    body: JSON.stringify({ departmentId }),
  });
}

export function postNote(id, body) {
  return request(`/admin/complaints/${id}/notes`, { method: "POST", body: JSON.stringify(body) });
}

export function patchVisibility(id, isPublic) {
  return request(`/admin/complaints/${id}/visibility`, {
    method: "PATCH",
    body: JSON.stringify({ isPublic }),
  });
}
