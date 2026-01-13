import React, { useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SprintStatusBadge, StatusBadge, PriorityBadge } from '../../components/common/Badges';
import { Avatar } from '../../components/common/Avatar';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Pencil, 
  Trash2, 
  Calendar,
  Eye,
  History,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export const HistoryTab = () => {
  const { 
    getCompletedSprints, 
    updateSprint, 
    deleteSprint,
    getTasksBySprint,
    employees
  } = useApp();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingTasks, setViewingTasks] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const completedSprints = getCompletedSprints();

  const hasActiveFilters = searchTerm.trim().length > 0;

  const filteredSprints = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return completedSprints.filter((sprint) => {
      const matchesSearch = !q || (sprint.name || '').toLowerCase().includes(q);

      return matchesSearch;
    });
  }, [completedSprints, searchTerm]);

  const handleEdit = (sprint) => {
    setEditingSprint(sprint);
    setIsEditOpen(true);
  };

  const handleDelete = (sprint) => {
    setDeleteConfirm(sprint);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteSprint(deleteConfirm.id);
      toast.success('Sprint deleted from history');
      setDeleteConfirm(null);
    }
  };

  const handleViewTasks = (sprint) => {
    setViewingTasks(sprint);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getEmployeeName = (id) => {
    if (!id) return 'Unassigned';
    const emp = employees.find(e => e.id === id);
    return emp?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Sprint History</h2>
        <p className="text-sm text-muted-foreground">View completed sprints and their tasks</p>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search sprints…"
          className="h-9 w-full max-w-md"
        />

        <div className="flex items-center gap-2 flex-wrap">
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => {
                setSearchTerm('');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* History List */}
      {filteredSprints.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="data-table min-w-[900px]">
            <thead>
              <tr>
                <th>Sprint Name</th>
                <th>Duration</th>
                <th>Status</th>
                <th className="!text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSprints.map((sprint) => {
                const tasks = getTasksBySprint(sprint.id);
                return (
                  <tr key={sprint.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{sprint.name}</p>
                        <span className="text-sm text-muted-foreground">• {tasks.length} tasks</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}</span>
                      </div>
                    </td>
                    <td>
                      <SprintStatusBadge status={sprint.status} />
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewTasks(sprint)}
                          className="p-2 rounded-lg text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                          title="View Tasks"
                          aria-label="View Tasks"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(sprint)}
                          className="p-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Edit"
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sprint)}
                          className="p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Delete"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={<History className="empty-state-icon" />}
          title="No completed sprints"
          description={hasActiveFilters ? 'No sprints match your filters' : 'Completed sprints will appear here'}
        />
      )}

      {/* Edit Sprint Modal */}
      {editingSprint && (
        <EditSprintModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          sprint={editingSprint}
          onSave={(data) => {
            updateSprint(editingSprint.id, data);
            toast.success('Sprint updated successfully');
            setIsEditOpen(false);
          }}
        />
      )}

      {/* View Tasks Modal */}
      {viewingTasks && (
        <ViewTasksModal
          isOpen={!!viewingTasks}
          onClose={() => {
            setViewingTasks(null);
            setSelectedTask(null);
          }}
          sprint={viewingTasks}
          tasks={getTasksBySprint(viewingTasks.id)}
          employees={employees}
          onViewTask={setSelectedTask}
          getEmployeeName={getEmployeeName}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          getEmployeeName={getEmployeeName}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Sprint"
        message={`Are you sure you want to delete "${deleteConfirm?.name}" from history?`}
        confirmText="Delete"
      />
    </div>
  );
};

// Edit Sprint Modal

const EditSprintModal = ({
  isOpen,
  onClose,
  sprint,
  onSave,
}) => {
  const defaultFormData = {
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    status: 'Completed',
  };

  const [formData, setFormData] = useState(sprint || defaultFormData);

  React.useEffect(() => {
    setFormData(sprint || defaultFormData);
  }, [sprint]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Sprint" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Sprint Name
          </label>
          <Input
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Start Date
            </label>
            <Input
              type="date"
              value={formData.startDate || ''}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              End Date
            </label>
            <Input
              type="date"
              value={formData.endDate || ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[160px] resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Update Sprint
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// View Tasks Modal

const ViewTasksModal = ({
  isOpen,
  onClose,
  sprint,
  tasks,
  onViewTask,
  getEmployeeName,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={sprint.name} size="75vw">
      <div className="space-y-4 min-h-[70vh]">
        <p className="text-sm text-muted-foreground">{sprint.description}</p>
        
        {tasks.length > 0 ? (
          <div className="divide-y divide-border border border-border rounded-lg overflow-hidden max-h-[60vh] overflow-y-auto">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onViewTask(task)}
                className="flex items-center justify-between p-3 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-primary">{task.taskNo}</span>
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <Avatar name={getEmployeeName(task.assignee)} size="sm" />
                          <span className="text-xs text-muted-foreground">
                            {getEmployeeName(task.assignee)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No tasks in this sprint</p>
        )}
      </div>
    </Modal>
  );
};

// Task Detail Modal (Read Only)

const TaskDetailModal = ({
  isOpen,
  onClose,
  task,
  getEmployeeName,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.taskNo} size="md">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
          {task.description && (
            <p className="text-muted-foreground mt-2">{task.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <StatusBadge status={task.status} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Priority</p>
            <PriorityBadge priority={task.priority} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Assignee</p>
            <div className="flex items-center gap-2">
              {task.assignee && <Avatar name={getEmployeeName(task.assignee)} size="sm" />}
              <span className="text-sm">{getEmployeeName(task.assignee)}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">QA Owner</p>
            <div className="flex items-center gap-2">
              {task.qaOwner && <Avatar name={getEmployeeName(task.qaOwner)} size="sm" />}
              <span className="text-sm">{getEmployeeName(task.qaOwner)}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Story Points</p>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-secondary text-sm font-medium">
              {task.storyPoints}
            </span>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default HistoryTab;

