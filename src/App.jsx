import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ui/ThemeToggle";
import EmployeesPage from "./pages/EmployeesPage";
import AttendancePage from "./pages/AttendancePage";


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app">
          <header className="header">
            <h1 className="logo">HRMS Lite</h1>
            <nav className="nav">
              <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                Employees
              </NavLink>
              <NavLink to="/attendance" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                Attendance
              </NavLink>
              <ThemeToggle />
            </nav>
          </header>
          <main className="main">
            <Routes>
              <Route path="/" element={<EmployeesPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
