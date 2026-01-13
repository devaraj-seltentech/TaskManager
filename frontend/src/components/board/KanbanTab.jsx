import React, { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApp } from '../../contexts/AppContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { TaskFormModal } from './TaskFormModal';
import { 
  Plus, 
  Search,
  Calendar,
  CheckCircle2,
  Hash,
  ChevronDown,
  ChevronUp,
  ChevronsUp,
  User
} from 'lucide-react';
import { toast } from 'sonner';

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

const COLUMNS = [
  { id: 'To Do', title: 'To Do', color: 'border-t-muted-foreground/30' },
  { id: 'In Progress', title: 'In Progress', color: 'border-t-primary' },
  { id: 'In Code Review', title: 'In Code Review', color: 'border-t-purple-500' },
  { id: 'In QA', title: 'In QA', color: 'border-t-orange-500' },
  { id: 'Ready to Deployment', title: 'Ready to Deployment', color: 'border-t-teal-500' },
  { id: 'Done', title: 'Done', color: 'border-t-green-500' },
];

export const KanbanTab = () => {
  const {
    employees,
    getActiveSprints,
    getTasksBySprint,
    addTask,
    updateTask,
    updateTaskStatus,
    completeSprint,
  } = useApp();

  const inProgressSprints = useMemo(
    () => getActiveSprints().filter((s) => s.status === 'In Progress'),
    [getActiveSprints]
  );

  const [selectedSprintId, setSelectedSprintId] = useState(inProgressSprints[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [addingToColumn, setAddingToColumn] = useState('To Do');
  const [completeSprintConfirm, setCompleteSprintConfirm] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    if (!selectedSprintId && inProgressSprints[0]?.id) {
      setSelectedSprintId(inProgressSprints[0].id);
    }
  }, [inProgressSprints, selectedSprintId]);

  const selectedSprint = useMemo(
    () => inProgressSprints.find((s) => s.id === selectedSprintId) || null,
    [inProgressSprints, selectedSprintId]
  );

  const tasksForSprint = useMemo(() => {
    if (!selectedSprintId) return [];
    return getTasksBySprint(selectedSprintId);
  }, [getTasksBySprint, selectedSprintId]);

  const filteredTasks = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return tasksForSprint.filter((t) => {
      const matchesSearch =
        !q ||
        (t.title || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        (t.taskNo || '').toLowerCase().includes(q);

      const matchesAssignee =
        filterAssignee === 'all'
          ? true
          : filterAssignee === 'unassigned'
            ? !t.assignee
            : String(t.assignee) === String(filterAssignee);

      const matchesPriority = filterPriority === 'all' ? true : t.priority === filterPriority;

      return matchesSearch && matchesAssignee && matchesPriority;
    });
  }, [filterAssignee, filterPriority, searchTerm, tasksForSprint]);

  const hasActiveFilters =
    searchTerm.trim().length > 0 || filterAssignee !== 'all' || filterPriority !== 'all';

  const tasksByColumn = useMemo(() => {
    const grouped = Object.fromEntries(COLUMNS.map((c) => [c.id, []]));
    for (const task of filteredTasks) {
      const status = COLUMNS.some((c) => c.id === task.status) ? task.status : 'To Do';
      grouped[status].push(task);
    }
    return grouped;
  }, [filteredTasks]);

  const getEmployeeName = (id) => {
    if (!id) return 'Unassigned';
    const emp = employees.find((e) => e.id === id);
    return emp?.name || 'Unknown';
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleAddTask = (columnId) => {
    if (!selectedSprintId) {
      toast.error('Select an active sprint first');
      return;
    }
    setEditingTask(null);
    setAddingToColumn(columnId);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setAddingToColumn(task.status || 'To Do');
    setIsTaskFormOpen(true);
  };

  const handleDragStart = (event) => {
    const task = tasksForSprint.find((t) => t.id === event.active?.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!active?.id || !over?.id) return;
    if (active.id === over.id) return;

    const draggedTask = tasksForSprint.find((t) => t.id === active.id);
    if (!draggedTask) return;

    const overTask = tasksForSprint.find((t) => t.id === over.id);
    const nextStatus = overTask?.status || (COLUMNS.some((c) => c.id === over.id) ? over.id : null);
    if (!nextStatus) return;

    if (draggedTask.status !== nextStatus) {
      updateTaskStatus(draggedTask.id, nextStatus);
      const title = draggedTask.title || 'Task';
      toast.success(`${title} is moved to ${nextStatus}`);
    }
  };

  const handleCompleteSprint = () => {
    if (!selectedSprint) return;
    completeSprint(selectedSprint.id);
    toast.success('Sprint completed');
    setCompleteSprintConfirm(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (inProgressSprints.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">No in progress sprints available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"
          >
            {inProgressSprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {selectedSprint && (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
              <Calendar className="w-4 h-4" />
              {formatDate(selectedSprint.startDate)} - {formatDate(selectedSprint.endDate)}
            </span>
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => setCompleteSprintConfirm(true)}
          className="gap-2 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
        >
          <CheckCircle2 className="w-4 h-4" />
          Complete Sprint
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks…"
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Priorities</option>
            <option value="Very High">Very High</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Least">Least</option>
          </select>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={() => {
                setSearchTerm('');
                setFilterAssignee('all');
                setFilterPriority('all');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 pb-4">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id]}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              getEmployeeName={getEmployeeName}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} getEmployeeName={getEmployeeName} isDragging />}
        </DragOverlay>
      </DndContext>

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        task={editingTask}
        sprintId={selectedSprintId}
        defaultStatus={addingToColumn || 'To Do'}
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

      {/* Complete Sprint Confirmation */}
      <ConfirmDialog
        isOpen={completeSprintConfirm}
        onClose={() => setCompleteSprintConfirm(false)}
        onConfirm={handleCompleteSprint}
        title="Complete Sprint"
        message={
          selectedSprint
            ? `Are you sure you want to complete "${selectedSprint.name}"? This will move the sprint to history.`
            : 'Are you sure you want to complete this sprint?'
        }
        confirmText="Complete"
        variant="warning"
      />
    </div>
  );
};

// Kanban Column Component
const KanbanColumn = ({
  column,
  tasks,
  onAddTask,
  onEditTask,
  getEmployeeName,
}) => {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column border-t-4 ${column.color}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground text-sm">{column.title}</h3>
          <span className="w-5 h-5 rounded-full bg-muted text-xs flex items-center justify-center text-muted-foreground">
            {tasks.length}
          </span>
        </div>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[200px]">
          {tasks.map(task => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              getEmployeeName={getEmployeeName}
            />
          ))}
        </div>
      </SortableContext>

      <button
        onClick={() => onAddTask(column.id)}
        className="w-full mt-2 py-2 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary hover:bg-card rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Task
      </button>
    </div>
  );
};

// Sortable Task Card

const SortableTaskCard = ({
  task,
  onEdit,
  getEmployeeName,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(task)}
    >
      <TaskCard task={task} getEmployeeName={getEmployeeName} isDragging={isDragging} />
    </div>
  );
};

// Task Card Component

const TaskCard = ({ task, getEmployeeName, isDragging }) => {
  const { Icon, text, colorClass } = getPriorityIndicator(task.priority);

  return (
    <div className={`task-card ${isDragging ? 'opacity-50 rotate-2' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-foreground line-clamp-2">{task.title}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {task.taskNo}
          </span>
          <span className="w-5 h-5 rounded bg-muted text-xs flex items-center justify-center text-muted-foreground">
            {task.storyPoints}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center"
            title={task.priority}
            aria-label={task.priority}
          >
            {Icon ? (
              <Icon className={`w-4 h-4 ${colorClass}`} strokeWidth={2.75} />
            ) : (
              <span className={`text-sm font-bold leading-none ${colorClass}`}>{text}</span>
            )}
          </span>
          {task.assignee ? (
            <Avatar name={getEmployeeName(task.assignee)} size="sm" />
          ) : (
            <span
              className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"
              title="Unassigned"
              aria-label="Unassigned"
            >
              <User className="w-4 h-4 text-muted-foreground" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};



