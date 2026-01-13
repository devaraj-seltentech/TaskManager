import { getFromStorage, saveToStorage, STORAGE_KEYS } from './storageService';

const generateId = () => `emp-${Date.now()}`;

export const employeeService = {
  getEmployees: () => {
    return getFromStorage(STORAGE_KEYS.EMPLOYEES);
  },

  getEmployeeById: (id) => {
    const employees = getFromStorage(STORAGE_KEYS.EMPLOYEES);
    return employees.find(e => e.id === id);
  },

  addEmployee: (data) => {
    const employees = getFromStorage(STORAGE_KEYS.EMPLOYEES);
    const newEmployee = {
      ...data,
      id: generateId(),
    };
    employees.push(newEmployee);
    saveToStorage(STORAGE_KEYS.EMPLOYEES, employees);
    return newEmployee;
  },

  updateEmployee: (id, data) => {
    const employees = getFromStorage(STORAGE_KEYS.EMPLOYEES);
    const index = employees.findIndex(e => e.id === id);
    
    if (index === -1) return null;
    
    employees[index] = { ...employees[index], ...data };
    saveToStorage(STORAGE_KEYS.EMPLOYEES, employees);
    return employees[index];
  },

  deleteEmployee: (id) => {
    const employees = getFromStorage(STORAGE_KEYS.EMPLOYEES);
    const filtered = employees.filter(e => e.id !== id);
    
    if (filtered.length === employees.length) return false;
    
    saveToStorage(STORAGE_KEYS.EMPLOYEES, filtered);
    return true;
  },

  getActiveEmployees: () => {
    return getFromStorage(STORAGE_KEYS.EMPLOYEES)
      .filter(e => e.status === 'Active');
  },
};
