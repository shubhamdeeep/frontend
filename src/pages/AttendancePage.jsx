import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import {
  Button,
  Input,
  Select,
  Card,
  Table,
  Badge,
  PageHeader,
  EmptyState,
  ErrorAlert,
  LoadingSpinner,
} from "../components/ui";

const today = () => new Date().toISOString().slice(0, 10);

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    employee_id: "",
    date: today(),
    status: "Present",
  });
  const [filterEmployeeId, setFilterEmployeeId] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const fetchEmployees = useCallback(async () => {
    try {
      const data = await api.getEmployees();
      setEmployees(data.employees || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterEmployeeId) params.employee_id = Number(filterEmployeeId);
      if (filterFrom) params.from_date = filterFrom;
      if (filterTo) params.to_date = filterTo;
      const data = await api.getAttendance(params);
      setRecords(data.records || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterEmployeeId, filterFrom, filterTo]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id) return;
    setError(null);
    try {
      await api.markAttendance({
        employee_id: Number(form.employee_id),
        date: form.date,
        status: form.status,
      });
      setForm((f) => ({ ...f, date: today(), status: "Present" }));
      fetchAttendance();
    } catch (err) {
      setError(err.message);
    }
  };

  const employeeMap = Object.fromEntries(employees.map((e) => [e.id, e]));

  const employeeOptions = employees.map((emp) => ({
    value: String(emp.id),
    label: `${emp.full_name} (${emp.employee_id})`,
  }));

  const filterOptions = employees.map((emp) => ({
    value: String(emp.id),
    label: emp.full_name,
  }));

  return (
    <>
      <PageHeader title="Attendance" />

      <ErrorAlert message={error} onDismiss={() => setError(null)} />

      <Card title="Mark Attendance" className="mb-lg">
        <form onSubmit={handleSubmit}>
          <Select
            label="Employee"
            options={employeeOptions}
            placeholder="Select employee"
            value={form.employee_id}
            onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))}
            required
          />
          <Input
            type="date"
            label="Date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            required
          />
          <Select
            label="Status"
            options={[
              { value: "Present", label: "Present" },
              { value: "Absent", label: "Absent" },
            ]}
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          />
          <Button type="submit" variant="primary">
            Mark
          </Button>
        </form>
      </Card>

      <Card title="Filters" className="mb-lg">
        <div className="form-row">
          <Select
            label="Employee"
            options={[{ value: "", label: "All" }, ...filterOptions]}
            value={filterEmployeeId}
            onChange={(e) => setFilterEmployeeId(e.target.value)}
          />
          <Input
            type="date"
            label="From date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
          />
          <Input
            type="date"
            label="To date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
          />
        </div>
      </Card>

      <Card title="Records">
        {loading ? (
          <LoadingSpinner message="Loading records…" />
        ) : records.length === 0 ? (
          <EmptyState message="No attendance records. Mark attendance above." />
        ) : (
          <Table
            columns={[
              {
                key: "employee",
                header: "Employee",
                render: (row) =>
                  employeeMap[row.employee_id]?.full_name ?? row.employee_id,
              },
              { key: "date", header: "Date" },
              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <Badge
                    variant={row.status === "Present" ? "success" : "danger"}
                  >
                    {row.status}
                  </Badge>
                ),
              },
            ]}
            data={records}
          />
        )}
      </Card>
    </>
  );
}
