# HRMS Lite — Frontend

This document describes the frontend of HRMS Lite: its structure, tech stack, reusable components, and how it is built for clarity, consistency, and maintainability.

---

## Overview

The frontend is a single-page application (SPA) built with **React** and **Vite**. It provides:

- **Employees** — List all employees, add new employees (Employee ID, Full Name, Email, Department), and delete employees with a confirmation dialog.
- **Attendance** — Mark attendance (date + Present/Absent) for an employee, view all attendance records, and filter by employee and date range.

The UI is designed to feel production-ready: reusable components, consistent spacing and typography, clear loading and error states, empty states when there is no data, and a light/dark theme with persisted preference. All API communication goes through a single API client module that uses the backend’s REST endpoints.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Component-based UI, hooks for state and effects. |
| **Vite** | Fast dev server, optimized production build, minimal config. |
| **React Router 7** | Client-side routing (Employees and Attendance pages). |
| **Vanilla CSS** | Global design tokens (CSS variables) and component styles; no UI framework dependency. |

The frontend is written in **JavaScript** (`.jsx` / `.js`). No TypeScript is used.

---

## Folder Structure

```
frontend/
├── public/                 # Static assets (if any)
├── src/
│   ├── components/         # Reusable UI building blocks
│   │   └── ui/             # Primitive and layout components
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Select.jsx
│   │       ├── FormField.jsx
│   │       ├── Card.jsx
│   │       ├── Table.jsx
│   │       ├── Badge.jsx
│   │       ├── PageHeader.jsx
│   │       ├── EmptyState.jsx
│   │       ├── ErrorAlert.jsx
│   │       ├── LoadingSpinner.jsx
│   │       ├── ConfirmModal.jsx
│   │       ├── ThemeToggle.jsx
│   │       └── index.js    # Barrel export for components
│   ├── contexts/
│   │   └── ThemeContext.jsx   # Theme state (light/dark) and persistence
│   ├── pages/
│   │   ├── EmployeesPage.jsx   # Employee list, add form, delete
│   │   └── AttendancePage.jsx  # Mark attendance, filters, records table
│   ├── services/
│   │   └── api.js             # API client (fetch wrapper, all backend calls)
│   ├── App.jsx                # Router, layout, header, theme provider
│   ├── main.jsx                # React entry point
│   └── index.css               # Global tokens, layout, component styles
├── index.html
├── package.json
├── vite.config.js
└── README.md                  # This file
```

---

## Reusable UI Components

All shared UI lives under `src/components/ui/`. Pages use these components only; they do not define their own buttons, inputs, or cards. This keeps the UI consistent and makes future changes (e.g. design system updates) easier.

| Component | Purpose |
|-----------|---------|
| **Button** | Actions with variants: `primary`, `secondary`, `danger`, `ghost`. Sizes: `sm`, `md`, `lg`. Supports `disabled`, `type`, and ref. |
| **Input** | Text, email, or date input. Optional `label`, `error`, and `required`. Wraps with `FormField` when label/error are used. |
| **Select** | Dropdown with `options` array or children. Optional `label`, `error`, `placeholder`. Uses `FormField` when needed. |
| **FormField** | Wrapper for any form control: label, required asterisk, error message. Used internally by `Input` and `Select` or directly for custom controls. |
| **Card** | Section container with optional `title`. Used for forms, tables, and filter sections. |
| **Table** | Declarative table: pass `columns` (key, header, optional `render`) and `data`. Handles empty state via `emptyMessage`. |
| **Badge** | Status pill with `variant`: `success`, `danger`, `neutral` (e.g. Present/Absent in attendance). |
| **PageHeader** | Page title and optional right-side action (e.g. “Add Employee” button). |
| **EmptyState** | Message and optional action when a list or section has no data. |
| **ErrorAlert** | Inline error message with optional dismiss (×). Used for API or validation errors. |
| **LoadingSpinner** | Centred spinner with optional message. Used while fetching lists or data. |
| **ConfirmModal** | Confirm/cancel dialog (replaces `window.confirm`). Used for delete confirmation; supports Escape and backdrop click to cancel. |
| **ThemeToggle** | Button to switch between light and dark theme. Uses `useTheme()` from `ThemeContext`. |

Components are exported from `src/components/ui/index.js`, so pages can import multiple components in one line:

```javascript
import { Button, Card, Table, PageHeader } from "../components/ui";
```

---

## Theme (Light / Dark Mode)

- **Default theme:** Light. First-time visitors see the light theme.
- **Persistence:** The chosen theme is stored in `localStorage` under the key `hrms-theme` (`"light"` or `"dark"`).
- **Implementation:** `ThemeContext` holds theme state and applies it by setting `data-theme="light"` or `data-theme="dark"` on `<html>`. CSS variables in `index.css` are defined for both values so all components (backgrounds, text, borders, buttons, etc.) adapt automatically.
- **Toggle:** The header includes a theme toggle (☀️ / 🌙). Clicking it switches the theme and updates `localStorage`.
- **No flash:** A small inline script in `index.html` runs before React and sets `data-theme` from `localStorage` (or `"light"`) so the correct theme is applied on first paint.

---

## API Integration

- **Single client:** All backend calls go through `src/services/api.js`.
- **Base URL:** Requests use the path `/api/...`. In development, Vite’s proxy (see `vite.config.js`) forwards `/api` to the backend at `http://127.0.0.1:8000`.
- **Methods:** The `api` object exposes methods such as `getEmployees()`, `createEmployee()`, `deleteEmployee()`, `getAttendance()`, `markAttendance()`, etc. Each method returns a Promise and throws on non-2xx responses with a clear error message.
- **No global state library:** Pages use React `useState` and `useEffect` (and optional `useCallback`) to fetch data and handle loading/error states. No Redux or other global store is used.

---

## Running the Frontend

### Development

```bash
npm install
npm run dev
```

Runs the dev server at http://localhost:5173 with hot reload. Ensure the backend is running so API calls succeed (see project root `README.md`).

### Production build

```bash
npm run build
```

Output goes to `dist/`. Serve the contents of `dist/` with any static file server. For production, configure the server so `/api` is proxied to the backend or use full URLs for the API.

### Preview production build locally

```bash
npm run preview
```

Serves the `dist/` build locally so you can test the production bundle.

---

## Code Quality Notes

- **Separation of concerns:** Pages handle page-level state and API calls; they do not implement low-level UI (buttons, inputs, tables). UI is delegated to reusable components.
- **Consistent patterns:** Form fields use the same props (`label`, `error`, `required`) where applicable. Buttons use `variant` and `size`. Tables use a declarative `columns` + `data` API.
- **Accessibility:** Form controls use `aria-invalid`, `aria-describedby`, and error message IDs where relevant. Modals and alerts use appropriate roles and keyboard behaviour (Escape to close). Theme toggle has `aria-label` and `title`.
- **User feedback:** Loading, empty, and error states are explicit (e.g. `LoadingSpinner`, `EmptyState`, `ErrorAlert`). Destructive actions use `ConfirmModal` instead of `window.confirm`.
- **Single source of styles:** All shared styling lives in `index.css` with CSS variables. Theme switching is done by changing `data-theme`; no duplicate theme logic in components.

For backend architecture and API design, see the project root **README.md** and **backend/ARCHITECTURE.md**.
