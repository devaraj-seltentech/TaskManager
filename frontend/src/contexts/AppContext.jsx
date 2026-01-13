import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employeeService';
import { sprintService } from '../services/sprintService';
import { taskService } from '../services/taskService';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);

  const refreshEmployees = useCallback(() => {
    setEmployees(employeeService.getEmployees());
  }, []);

  const refreshSprints = useCallback(() => {
    setSprints(sprintService.getSprints());
  }, []);

  const refreshTasks = useCallback(() => {
    setTasks(taskService.getTasks());
  }, []);

  useEffect(() => {
    refreshEmployees();
    refreshSprints();
    refreshTasks();
  }, [refreshEmployees, refreshSprints, refreshTasks]);

  // Employee operations
  const addEmployee = (data) => {
    const newEmployee = employeeService.addEmployee(data);
    refreshEmployees();
    return newEmployee;
  };

  const updateEmployee = (id, data) => {
    const updated = employeeService.updateEmployee(id, data);
    refreshEmployees();
    return updated;
  };

  const deleteEmployee = (id) => {
    const result = employeeService.deleteEmployee(id);
    refreshEmployees();
    return result;
  };

  const getEmployeeById = (id) => employees.find(e => e.id === id);

  // Sprint operations
  const addSprint = (data) => {
    const newSprint = sprintService.addSprint(data);
    refreshSprints();
    return newSprint;
  };

  const updateSprint = (id, data) => {
    const updated = sprintService.updateSprint(id, data);
    refreshSprints();
    return updated;
  };

  const deleteSprint = (id) => {
    const result = sprintService.deleteSprint(id);
    refreshSprints();
    return result;
  };

  const completeSprint = (id) => {
    const updated = sprintService.completeSprint(id);
    refreshSprints();
    return updated;
  };

  const getSprintById = (id) => sprints.find(s => s.id === id);

  const getActiveSprints = () => sprints.filter(s => s.status === 'To Be Start' || s.status === 'In Progress');

  const getCompletedSprints = () => sprints.filter(s => s.status === 'Completed');

  // Task operations
  const addTask = (data) => {
    const newTask = taskService.addTask(data);
    refreshTasks();
    return newTask;
  };

  const updateTask = (id, data) => {
    const updated = taskService.updateTask(id, data);
    refreshTasks();
    return updated;
  };

  const deleteTask = (id) => {
    const result = taskService.deleteTask(id);
    refreshTasks();
    return result;
  };

  const updateTaskStatus = (id, status) => {
    const updated = taskService.updateTaskStatus(id, status);
    refreshTasks();
    return updated;
  };

  const getTaskById = (id) => tasks.find(t => t.id === id);

  const getTasksBySprint = (sprintId) => tasks.filter(t => t.sprintId === sprintId);

  return (
    <AppContext.Provider
      value={{
        employees,
        refreshEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeById,
        sprints,
        refreshSprints,
        addSprint,
        updateSprint,
        deleteSprint,
        completeSprint,
        getSprintById,
        getActiveSprints,
        getCompletedSprints,
        tasks,
        refreshTasks,
        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        getTaskById,
        getTasksBySprint,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
