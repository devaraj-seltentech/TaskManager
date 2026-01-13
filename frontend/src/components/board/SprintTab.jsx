import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SprintStatusBadge, PriorityBadge } from '../../components/common/Badges';
import { Avatar } from '../../components/common/Avatar';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { TaskFormModal } from './TaskFormModal';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar,
  Layers,
  Play,
  User
} from 'lucide-react';
import { toast } from 'sonner';

export const SprintTab = () => {
  const { 
    getActiveSprints, 
    addSprint, 
    updateSprint, 
    deleteSprint,
    getTasksBySprint,
    addTask,
    updateTask,
    deleteTask,
    employees
  } = useApp();

  const [isSprintFormOpen, setIsSprintFormOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState(null);
  const [deleteSprintConfirm, setDeleteSprintConfirm] = useState(null);
  const [startSprintConfirm, setStartSprintConfirm] = useState(null);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFormSprintId, setTaskFormSprintId] = useState(null);
  const [deleteTaskConfirm, setDeleteTaskConfirm] = useState(null);

  const activeSprints = getActiveSprints();

  const handleAddSprint = () => {
    setEditingSprint(null);
    setIsSprintFormOpen(true);
  };

  const handleEditSprint = (sprint) => {
    setEditingSprint(sprint);
    setIsSprintFormOpen(true);
  };

  const handleDeleteSprint = (sprint) => {
    setDeleteSprintConfirm(sprint);
  };

  const confirmDeleteSprint = () => {
    if (deleteSprintConfirm) {
      deleteSprint(deleteSprintConfirm.id);
      toast.success('Sprint deleted successfully');
      setDeleteSprintConfirm(null);
    }
  };

  const handleStartSprint = (sprint) => {
    setStartSprintConfirm(sprint);
  };

  const confirmStartSprint = () => {
    if (!startSprintConfirm) return;
    updateSprint(startSprintConfirm.id, { status: 'In Progress' });
    toast.success('Sprint started');
    setStartSprintConfirm(null);
  };

  const handleAddTask = (sprintId) => {
    setEditingTask(null);
    setTaskFormSprintId(sprintId);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskFormSprintId(task.sprintId);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = (task) => {
    setDeleteTaskConfirm(task);
  };

  const confirmDeleteTask = () => {
    if (deleteTaskConfirm) {
      deleteTask(deleteTaskConfirm.id);
      toast.success('Task deleted successfully');
      setDeleteTaskConfirm(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Active Sprints</h2>
          <p className="text-sm text-muted-foreground">Manage sprints and their tasks</p>
        </div>
        <Button onClick={handleAddSprint}>
          <Plus className="w-4 h-4 mr-2" />
          Create Sprint
        </Button>
      </div>

      {/* Sprint List */}
      {activeSprints.length > 0 ? (
        <div className="space-y-6">
          {activeSprints.map((sprint) => (
            <SprintBox
              key={sprint.id}
              sprint={sprint}
              tasks={getTasksBySprint(sprint.id)}
              employees={employees}
              onEditSprint={handleEditSprint}
              onDeleteSprint={handleDeleteSprint}
              onStartSprint={handleStartSprint}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Layers className="empty-state-icon" />}
          title="No active sprints"
          description="Create your first sprint to start organizing tasks"
          action={
            <Button onClick={handleAddSprint}>
              <Plus className="w-4 h-4 mr-2" />
              Create Sprint
            </Button>
          }
        />
      )}

      {/* Sprint Form Modal */}
      <SprintFormModal
        isOpen={isSprintFormOpen}
        onClose={() => setIsSprintFormOpen(false)}
        sprint={editingSprint}
        onSave={(data) => {
          if (editingSprint) {
            updateSprint(editingSprint.id, data);
            toast.success('Sprint updated successfully');
          } else {
            addSprint(data);
            toast.success('Sprint created successfully');
          }
          setIsSprintFormOpen(false);
        }}
      />

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        task={editingTask}
        sprintId={taskFormSprintId || ''}
        employees={employees}
        onSave={(data) => {
          if (editingTask) {
            updateTask(editingTask.id, data);
            toast.success('Task updated successfully');
          } else {
            addTask(data);
            toast.success('Task created successfully');
          }
          setIsTaskFormOpen(false);
        }}
      />

      {/* Delete Sprint Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteSprintConfirm}
        onClose={() => setDeleteSprintConfirm(null)}
        onConfirm={confirmDeleteSprint}
        title="Delete Sprint"
        message={`Are you sure you want to delete "${deleteSprintConfirm?.name}"? All tasks in this sprint will remain but won't be associated with any sprint.`}
        confirmText="Delete"
      />

      {/* Start Sprint Confirmation */}
      <ConfirmDialog
        isOpen={!!startSprintConfirm}
        onClose={() => setStartSprintConfirm(null)}
        onConfirm={confirmStartSprint}
        title="Start Sprint"
        message={`Are you sure you want to start "${startSprintConfirm?.name}"?`}
        confirmText="Start"
      />

      {/* Delete Task Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTaskConfirm}
        onClose={() => setDeleteTaskConfirm(null)}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTaskConfirm?.title}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
};

// Sprint Box Component

const SprintBox = ({
  sprint,
  tasks,
  employees,
  onEditSprint,
  onDeleteSprint,
  onStartSprint,
  onAddTask,
  onEditTask,
  onDeleteTask,
  formatDate,
}) => {
  const getEmployeeName = (id) => {
    if (!id) return 'Unassigned';
    const emp = employees.find(e => e.id === id);
    return emp?.name || 'Unknown';
  };

  return (
    <div className="sprint-box">
      {/* Sprint Header */}
      <div className="sprint-box-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          <div>
            <h3 className="font-semibold text-foreground">{sprint.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}</span>
            </div>
          </div>
          <div className="mt-2 sm:mt-0">
            <SprintStatusBadge status={sprint.status} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {sprint.status === 'To Be Start' && (
            <Button
              variant="outline"
              onClick={() => onStartSprint(sprint)}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Sprint
            </Button>
          )}
          <button
            onClick={() => onEditSprint(sprint)}
            className="p-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            title="Edit Sprint"
            aria-label="Edit Sprint"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteSprint(sprint)}
            className="p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            title="Delete Sprint"
            aria-label="Delete Sprint"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-2 px-4 w-12">
                #
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-2 px-4 w-24">
                Task No
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-2 px-4">
                Task
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-2 px-4 w-20">
                Points
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-2 px-4 w-40">
                Assignee
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-2 px-4 w-28">
                Priority
              </th>
              <th className="!text-center text-xs font-medium text-muted-foreground uppercase tracking-wider py-2 px-4 w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-2 px-4 text-sm text-muted-foreground">{index + 1}</td>
                <td className="py-2 px-4">
                  <span className="text-sm font-mono text-primary">{task.taskNo}</span>
                </td>
                <td className="py-2 px-4">
                  <p className="text-sm font-medium text-foreground">{task.title}</p>
                </td>
                <td className="py-2 px-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-secondary text-xs font-medium">
                    {task.storyPoints}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    {task.assignee ? (
                      <Avatar name={getEmployeeName(task.assignee)} size="sm" />
                    ) : (
                      <span
                        className="w-6 h-6 rounded-full bg-muted flex items-center justify-center"
                        title="Unassigned"
                        aria-label="Unassigned"
                      >
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                      </span>
                    )}
                    <span className="text-sm">{getEmployeeName(task.assignee)}</span>
                  </div>
                </td>
                <td className="py-2 px-4">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="py-2 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1.5 rounded text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                      title="Edit"
                      aria-label="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task)}
                      className="p-1.5 rounded text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/* Add Task Row */}
            <tr>
              <td colSpan={7} className="py-2 px-4">
                <button
                  onClick={() => onAddTask(sprint.id)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sprint Form Modal

const SprintFormModal = ({
  isOpen,
  onClose,
  sprint,
  onSave,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const defaultFormData = {
    name: '',
    startDate: today,
    endDate: today,
    description: '',
    status: 'To Be Start',
  };

  const [formData, setFormData] = useState(defaultFormData);

  React.useEffect(() => {
    if (sprint) {
      setFormData({ ...defaultFormData, ...sprint });
    } else {
      setFormData(defaultFormData);
    }
  }, [sprint, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sprint ? 'Edit Sprint' : 'Create Sprint'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Sprint Name *
          </label>
          <Input
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Sprint 1 - Feature Development"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Start Date *
            </label>
            <Input
              type="date"
              value={formData.startDate || ''}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              End Date *
            </label>
            <Input
              type="date"
              value={formData.endDate || ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
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
            placeholder="Sprint goals and objectives..."
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[160px] resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Status
          </label>
          <select
            value={formData.status || 'To Be Start'}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="To Be Start">To Be Start</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {sprint ? 'Update' : 'Create'} Sprint
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SprintTab;

