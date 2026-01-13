import { getFromStorage, saveToStorage, STORAGE_KEYS } from './storageService';

const generateId = () => `task-${Date.now()}`;

const generateTaskNo = () => {
  const tasks = getFromStorage(STORAGE_KEYS.TASKS) || [];
  const maxNo = tasks.reduce((max, task) => {
    const taskNo = typeof task?.taskNo === 'string' ? task.taskNo : '';
    const match = taskNo.match(/^(?:TF|ST)-(\d+)$/);
    if (!match) return max;
    const num = parseInt(match[1], 10);
    if (Number.isNaN(num)) return max;
    return num > max ? num : max;
  }, 0);

  return `ST-${(maxNo + 1).toString().padStart(3, '0')}`;
};

export const taskService = {
  getTasks: () => {
    return getFromStorage(STORAGE_KEYS.TASKS);
  },

  getTaskById: (id) => {
    const tasks = getFromStorage(STORAGE_KEYS.TASKS);
    return tasks.find(t => t.id === id);
  },

  getTasksBySprint: (sprintId) => {
    const tasks = getFromStorage(STORAGE_KEYS.TASKS);
    return tasks.filter(t => t.sprintId === sprintId);
  },

  getTasksByStatus: (status) => {
    const tasks = getFromStorage(STORAGE_KEYS.TASKS);
    return tasks.filter(t => t.status === status);
  },

  getTasksByAssignee: (assigneeId) => {
    const tasks = getFromStorage(STORAGE_KEYS.TASKS);
    return tasks.filter(t => t.assignee === assigneeId);
  },

  addTask: (data) => {
    const tasks = getFromStorage(STORAGE_KEYS.TASKS);
    const newTask = {
      ...data,
      id: generateId(),
      taskNo: generateTaskNo(),
    };
    tasks.push(newTask);
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
    return newTask;
  },

  updateTask: (id, data) => {
    const tasks = getFromStorage(STORAGE_KEYS.TASKS);
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    tasks[index] = { ...tasks[index], ...data };
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
    return tasks[index];
  },

  deleteTask: (id) => {
    const tasks = getFromStorage(STORAGE_KEYS.TASKS);
    const filtered = tasks.filter(t => t.id !== id);
    
    if (filtered.length === tasks.length) return false;
    
    saveToStorage(STORAGE_KEYS.TASKS, filtered);
    return true;
  },

  updateTaskStatus: (id, status) => {
    return taskService.updateTask(id, { status });
  },

  getTasksForKanban: (sprintId) => {
    const tasks = taskService.getTasksBySprint(sprintId);
    const columns = {
      'To Do': [],
      'In Progress': [],
      'In Code Review': [],
      'In QA': [],
      'Ready to Deployment': [],
      'Done': [],
    };
    
    tasks.forEach(task => {
      if (columns[task.status]) {
        columns[task.status].push(task);
      }
    });
    
    return columns;
  },
};
