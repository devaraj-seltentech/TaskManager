import React, { useMemo, useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ChevronDown, ChevronUp, ChevronsUp } from 'lucide-react';

const getPriorityIndicator = (priority) => {
  switch (priority) {
    case 'Least':
      return { Icon: ChevronDown, colorClass: 'text-yellow-500' };
    case 'Medium':
      return { text: '=', colorClass: 'text-blue-500' };
    case 'High':
      return { Icon: ChevronUp, colorClass: 'text-orange-500' };
    case 'Very High':
      return { Icon: ChevronsUp, colorClass: 'text-red-500' };
    default:
      return { text: '–', colorClass: 'text-muted-foreground' };
  }
};

export const TaskFormModal = ({
  isOpen,
  onClose,
  task,
  sprintId,
  employees,
  onSave,
  defaultStatus = 'To Do',
}) => {
  const defaultFormData = useMemo(
    () => ({
      title: '',
      description: '',
      status: defaultStatus,
      assignee: null,
      qaOwner: null,
      storyPoints: 1,
      priority: 'Medium',
      sprintId: sprintId,
    }),
    [defaultStatus, sprintId]
  );

  const [formData, setFormData] = useState(defaultFormData);

  React.useEffect(() => {
    if (task) {
      setFormData({ ...defaultFormData, ...task, sprintId });
    } else {
      setFormData(defaultFormData);
    }
  }, [task, sprintId, isOpen, defaultFormData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const statuses = [
    'To Do',
    'In Progress',
    'In Code Review',
    'In QA',
    'Ready to Deployment',
    'Done',
  ];

  const priorities = ['Least', 'Medium', 'High', 'Very High'];

  const selectedPriority = formData.priority || 'Medium';
  const { Icon: PriorityIcon, text: priorityText, colorClass: priorityColorClass } =
    getPriorityIndicator(selectedPriority);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Add Task'}
      size="75vw"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch lg:min-h-[60vh]">
          {/* Left (70%) */}
          <div className="lg:col-span-7 flex flex-col gap-4 h-full min-h-0">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Task Name *
              </label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Implement user authentication"
                required
              />
            </div>

            <div className="flex flex-col flex-1 min-h-0">
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task details and requirements..."
                className="w-full flex-1 min-h-[220px] lg:min-h-0 px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>

          {/* Right (30%) */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-full min-h-0">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Status
              </label>
              <select
                value={formData.status || defaultStatus}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Priority
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {PriorityIcon ? (
                    <PriorityIcon className={`w-4 h-4 ${priorityColorClass}`} strokeWidth={2.75} />
                  ) : (
                    <span className={`text-sm font-bold leading-none ${priorityColorClass}`}>{priorityText}</span>
                  )}
                </span>
                <select
                  value={selectedPriority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Assignee
              </label>
              <select
                value={formData.assignee || ''}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Unassigned</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                QA Owner
              </label>
              <select
                value={formData.qaOwner || ''}
                onChange={(e) => setFormData({ ...formData, qaOwner: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">None</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Story Points
              </label>
              <Input
                type="number"
                min={1}
                max={21}
                value={formData.storyPoints || 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storyPoints: parseInt(e.target.value, 10) || 1,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="h-9 px-4">
            Cancel
          </Button>
          <Button type="submit" className="h-9 px-4">
            {task ? 'Update' : 'Add'} Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
