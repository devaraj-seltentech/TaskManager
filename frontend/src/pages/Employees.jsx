import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Avatar } from '../components/common/Avatar';
import { EmptyState } from '../components/common/EmptyState';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Users,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';

const Employees = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const query = searchQuery.toLowerCase();
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        e.email.toLowerCase().includes(query) ||
        e.role.toLowerCase().includes(query) ||
        e.department.toLowerCase().includes(query)
    );
  }, [employees, searchQuery]);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDelete = (employee) => {
    setDeleteConfirm(employee);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteEmployee(deleteConfirm.id);
      toast.success('Employee deleted successfully');
      setDeleteConfirm(null);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      {filteredEmployees.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="data-table min-w-[900px]">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th className="!text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <Link
                      to={`/employees/${employee.id}`}
                      className="flex items-center gap-3 text-primary hover:text-primary/90 transition-colors"
                    >
                      <Avatar name={employee.name} size="sm" />
                      <span className="font-medium underline-offset-4 hover:underline">{employee.name}</span>
                    </Link>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        {employee.phone}
                      </div>
                    </div>
                  </td>
                  <td>{employee.role}</td>
                  <td>{employee.department}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        employee.status === 'Active'
                          ? 'status-badge-done'
                          : 'status-badge-todo'
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="p-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                        title="Edit"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee)}
                        className="p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                        title="Delete"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={<Users className="empty-state-icon" />}
          title="No employees found"
          description={
            searchQuery
              ? 'Try adjusting your search query'
              : 'Add your first team member to get started'
          }
          action={
            !searchQuery && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            )
          }
        />
      )}

      {/* Employee Form Modal */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        employee={editingEmployee}
        onSave={(data) => {
          if (editingEmployee) {
            updateEmployee(editingEmployee.id, data);
            toast.success('Employee updated successfully');
          } else {
            addEmployee(data);
            toast.success('Employee added successfully');
          }
          closeForm();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
};

// Employee Form Modal Component
const EmployeeFormModal = ({
  isOpen,
  onClose,
  employee,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: 'Active',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  React.useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        status: 'Active',
        joiningDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [employee, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? 'Edit Employee' : 'Add Employee'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Full Name *
            </label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@taskflow.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Phone *
            </label>
            <Input
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="9876543210"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Role *
            </label>
            <Input
              value={formData.role || ''}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Frontend Developer"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Department *
            </label>
            <select
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="" disabled>
                Select department
              </option>
              <option value="Technical">Technical</option>
              <option value="Non Technical">Non Technical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Status
            </label>
            <select
              value={formData.status || 'Active'}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Joining Date
            </label>
            <Input
              type="date"
              value={formData.joiningDate || ''}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="sm:flex-1">
            Cancel
          </Button>
          <Button type="submit" className="sm:flex-1">
            {employee ? 'Update' : 'Add'} Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Employees;
