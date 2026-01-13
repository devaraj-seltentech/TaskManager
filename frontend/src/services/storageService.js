// Storage keys
export const STORAGE_KEYS = {
  USERS: 'taskflow_users',
  EMPLOYEES: 'taskflow_employees',
  SPRINTS: 'taskflow_sprints',
  TASKS: 'taskflow_tasks',
  CURRENT_USER: 'taskflow_current_user',
};

// Initialize storage with data from data.json if not exists
export const initializeStorage = async () => {
  const data = await import('../data/data.json');
  
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(data.employees));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SPRINTS)) {
    localStorage.setItem(STORAGE_KEYS.SPRINTS, JSON.stringify(data.sprints));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
  }
};

// Generic storage functions
export const getFromStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getCurrentUserFromStorage = () => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUserInStorage = (user) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};
