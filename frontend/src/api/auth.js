import { request } from "./client.js";

export function login(body) {
  return request("/auth/login", { method: "POST", body: JSON.stringify(body) });
}

export function register(body) {
  return request("/auth/register", { method: "POST", body: JSON.stringify(body) });
}

export function fetchMe() {
  return request("/auth/me");
}
