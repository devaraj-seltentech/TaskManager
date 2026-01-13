import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Avatar } from '../components/common/Avatar';
import { StatusBadge, PriorityBadge } from '../components/common/Badges';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/ui/button';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2, 
  Calendar,
  CheckCircle2,
  Clock,
  ListTodo,
  Sigma
} from 'lucide-react';

const EmployeeDetail = () => {
  const { id } = useParams();
  const { getEmployeeById, tasks, sprints } = useApp();
  
  const employee = id ? getEmployeeById(id) : undefined;
  
  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <EmptyState
          title="Employee not found"
          description="The employee you're looking for doesn't exist."
          action={
            <Link to="/employees">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Employees
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const assignedTasks = tasks.filter(t => t.assignee === employee.id);
  const todoTasks = assignedTasks.filter(t => t.status === 'To Do').length;
  const inProgressTasks = assignedTasks.filter(t => 
    t.status === 'In Progress' || t.status === 'In Code Review' || t.status === 'In QA'
  ).length;
  const doneTasks = assignedTasks.filter(t => t.status === 'Done' || t.status === 'Ready to Deployment').length;
  const totalStoryPoints = assignedTasks.reduce((sum, t) => sum + t.storyPoints, 0);

  const getSprint = (sprintId) => sprints.find(s => s.id === sprintId);

  const [selectedSprintId, setSelectedSprintId] = useState('all');

  const sortedSprints = useMemo(() => {
    return [...sprints].sort((a, b) => {
      const aDate = new Date(a.startDate).getTime();
      const bDate = new Date(b.startDate).getTime();
      return aDate - bDate;
    });
  }, [sprints]);

  const filteredAssignedTasks = useMemo(() => {
    if (selectedSprintId === 'all') return assignedTasks;
    return assignedTasks.filter((t) => t.sprintId === selectedSprintId);
  }, [assignedTasks, selectedSprintId]);

  const monthlyPerformanceData = useMemo(() => {
    const completedTasks = assignedTasks.filter(
      (t) => t.status === 'Done' || t.status === 'Ready to Deployment'
    );

    const pointsByMonth = new Map();

    completedTasks.forEach((task) => {
      const sprint = getSprint(task.sprintId);
      const dateStr = sprint?.endDate || sprint?.startDate;
      if (!dateStr) return;

      const date = new Date(dateStr);
      if (Number.isNaN(date.getTime())) return;

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const storyPoints = Number(task.storyPoints) || 0;
      pointsByMonth.set(monthKey, (pointsByMonth.get(monthKey) || 0) + storyPoints);
    });

    const entries = Array.from(pointsByMonth.entries()).sort(([a], [b]) => a.localeCompare(b));
    if (entries.length === 0) return [];

    const parseMonthKey = (key) => {
      const [y, m] = key.split('-');
      return new Date(Number(y), Number(m) - 1, 1);
    };

    const formatMonthLabel = (date) =>
      date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    const first = parseMonthKey(entries[0][0]);
    const last = parseMonthKey(entries[entries.length - 1][0]);

    const allMonths = [];
    const cursor = new Date(first);
    while (cursor <= last) {
      const monthKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
      allMonths.push({
        monthKey,
        month: formatMonthLabel(cursor),
        points: pointsByMonth.get(monthKey) || 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return allMonths;
  }, [assignedTasks, sprints]);

  const availableMonthKeys = useMemo(
    () => monthlyPerformanceData.map((d) => d.monthKey),
    [monthlyPerformanceData]
  );

  const [sixMonthEndKey, setSixMonthEndKey] = useState(() => {
    if (availableMonthKeys.length === 0) return 'all';
    return availableMonthKeys[availableMonthKeys.length - 1];
  });

  const sixMonthData = useMemo(() => {
    if (monthlyPerformanceData.length === 0) return [];

    const endKey = sixMonthEndKey === 'all'
      ? monthlyPerformanceData[monthlyPerformanceData.length - 1].monthKey
      : sixMonthEndKey;

    const endIndex = monthlyPerformanceData.findIndex((d) => d.monthKey === endKey);
    if (endIndex === -1) return monthlyPerformanceData.slice(-6);

    const startIndex = Math.max(0, endIndex - 5);
    return monthlyPerformanceData.slice(startIndex, endIndex + 1);
  }, [monthlyPerformanceData, sixMonthEndKey]);

  return (
    <div>
      {/* Back Button */}
      <Link
        to="/employees"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Employees
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Profile Card */}
        <div className="lg:col-span-1 flex">
          <div className="bg-card rounded-xl border border-border p-6 h-full w-full">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar name={employee.name} size="lg" className="mb-4" />
              <h2 className="text-xl font-semibold text-foreground">{employee.name}</h2>
              <p className="text-muted-foreground">{employee.role}</p>
              <span
                className={`mt-2 status-badge ${
                  employee.status === 'Active' ? 'status-badge-done' : 'status-badge-todo'
                }`}
              >
                {employee.status}
              </span>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>{employee.role}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span>{employee.department}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Joined {new Date(employee.joiningDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Stats & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <ListTodo className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{todoTasks}</p>
              <p className="text-sm text-muted-foreground">To Do</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-status-progress flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{inProgressTasks}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-status-done flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-sprint-completed" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{doneTasks}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{assignedTasks.length}</p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Sigma className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalStoryPoints}</p>
              <p className="text-sm text-muted-foreground">Story Points</p>
            </div>
          </div>

          {/* Monthly Performance */}
          <div className="bg-card rounded-xl border border-border">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">Monthly Performance</h3>
                <p className="text-sm text-muted-foreground">Completed story points (6-month view)</p>
              </div>

              {availableMonthKeys.length > 0 && (
                <select
                  value={sixMonthEndKey}
                  onChange={(e) => setSixMonthEndKey(e.target.value)}
                  className="h-9 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {monthlyPerformanceData.map((m) => (
                    <option key={m.monthKey} value={m.monthKey}>
                      End: {m.month}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {sixMonthData.length > 0 ? (
              <div className="p-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sixMonthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--popover-foreground))',
                        borderRadius: '12px',
                      }}
                      labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                      formatter={(value) => [value, 'Story Points']}
                    />
                    <Bar dataKey="points" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No completed story points yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assigned Tasks (Full Width) */}
      <div className="mt-6 bg-card rounded-xl border border-border">
        <div className="px-4 py-3 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="font-semibold text-foreground">Assigned Tasks</h3>

          <select
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"
          >
            <option value="all">All Sprints</option>
            {sortedSprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {filteredAssignedTasks.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredAssignedTasks.map((task, index) => {
              const sprint = getSprint(task.sprintId);
              return (
                <div key={task.id} className="px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground break-words">
                        <span className="text-sm font-mono text-muted-foreground mr-2">{index + 1}.</span>
                        {task.title}
                      </p>
                      <p className="text-sm text-muted-foreground break-words">
                        {task.taskNo} • {sprint?.name || 'No Sprint'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">No tasks for this sprint</div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;
