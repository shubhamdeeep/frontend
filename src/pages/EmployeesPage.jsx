import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import {
  Button,
  Input,
  Card,
  Table,
  PageHeader,
  EmptyState,
  ErrorAlert,
  LoadingSpinner,
  ConfirmModal,
} from "../components/ui";

const INITIAL_FORM = {
  employee_id: "",
  full_name: "",
  email: "",
  department: "",
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEmployees();
      setEmployees(data.employees || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.createEmployee({
        employee_id: form.employee_id.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
      });
      setForm(INITIAL_FORM);
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setError(null);
    try {
      await api.deleteEmployee(deleteTarget.id);
      setDeleteTarget(null);
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateField = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  if (loading) {
    return <LoadingSpinner message="Loading employees…" />;
  }

  return (
    <>
      <PageHeader
        title="Employees"
        action={
          <Button
            variant={showForm ? "secondary" : "primary"}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "Add Employee"}
          </Button>
        }
      />

      <ErrorAlert message={error} onDismiss={() => setError(null)} />

      {showForm && (
        <Card title="New Employee" className="mb-lg">
          <form onSubmit={handleSubmit}>
            <Input
              label="Employee ID"
              value={form.employee_id}
              onChange={updateField("employee_id")}
              required
            />
            <Input
              label="Full Name"
              value={form.full_name}
              onChange={updateField("full_name")}
              required
            />
            <Input
              type="email"
              label="Email"
              value={form.email}
              onChange={updateField("email")}
              required
            />
            <Input
              label="Department"
              value={form.department}
              onChange={updateField("department")}
              required
            />
            <Button type="submit" variant="primary">
              Save
            </Button>
          </form>
        </Card>
      )}

      <Card>
        {employees.length === 0 ? (
          <EmptyState message="No employees yet. Add one using the button above." />
        ) : (
          <Table
            columns={[
              { key: "employee_id", header: "ID" },
              { key: "full_name", header: "Name" },
              { key: "email", header: "Email" },
              { key: "department", header: "Department" },
              {
                key: "actions",
                header: "",
                render: (row) => (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteTarget(row)}
                  >
                    Delete
                  </Button>
                ),
              },
            ]}
            data={employees}
          />
        )}
      </Card>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete employee"
        message="This will remove the employee and all their attendance records. This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
