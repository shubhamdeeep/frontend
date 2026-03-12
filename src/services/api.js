/**
 * API client for HRMS Lite backend.
 * Uses relative /api so Vite proxy forwards to backend.
 */
const BASE = "/api";

async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const message =
      typeof err.detail === "string"
        ? err.detail
        : Array.isArray(err.detail)
          ? err.detail.map((d) => d.msg).join(", ")
          : "Request failed";
    throw new Error(message);
  }

  if (res.status === 204) return undefined;
  return res.json();
}

export const api = {
  getEmployees: () => request("/employees"),
  getEmployee: (id) => request(`/employees/${id}`),
  createEmployee: (body) =>
    request("/employees", { method: "POST", body: JSON.stringify(body) }),
  deleteEmployee: (id) => request(`/employees/${id}`, { method: "DELETE" }),

  getAttendance: (params = {}) => {
    const sp = new URLSearchParams();
    if (params.employee_id != null) sp.set("employee_id", String(params.employee_id));
    if (params.from_date) sp.set("from_date", params.from_date);
    if (params.to_date) sp.set("to_date", params.to_date);
    const q = sp.toString();
    return request(`/attendance${q ? `?${q}` : ""}`);
  },
  getAttendanceByEmployee: (employeeId, params = {}) => {
    const sp = new URLSearchParams();
    if (params.from_date) sp.set("from_date", params.from_date);
    if (params.to_date) sp.set("to_date", params.to_date);
    const q = sp.toString();
    return request(`/attendance/by-employee/${employeeId}${q ? `?${q}` : ""}`);
  },
  markAttendance: (body) =>
    request("/attendance", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
