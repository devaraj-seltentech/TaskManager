import { getFromStorage, saveToStorage, STORAGE_KEYS } from './storageService';

const generateId = () => `spr-${Date.now()}`;

export const sprintService = {
  getSprints: () => {
    return getFromStorage(STORAGE_KEYS.SPRINTS);
  },

  getSprintById: (id) => {
    const sprints = getFromStorage(STORAGE_KEYS.SPRINTS);
    return sprints.find(s => s.id === id);
  },

  addSprint: (data) => {
    const sprints = getFromStorage(STORAGE_KEYS.SPRINTS);
    const newSprint = {
      ...data,
      id: generateId(),
    };
    sprints.push(newSprint);
    saveToStorage(STORAGE_KEYS.SPRINTS, sprints);
    return newSprint;
  },

  updateSprint: (id, data) => {
    const sprints = getFromStorage(STORAGE_KEYS.SPRINTS);
    const index = sprints.findIndex(s => s.id === id);
    
    if (index === -1) return null;
    
    sprints[index] = { ...sprints[index], ...data };
    saveToStorage(STORAGE_KEYS.SPRINTS, sprints);
    return sprints[index];
  },

  deleteSprint: (id) => {
    const sprints = getFromStorage(STORAGE_KEYS.SPRINTS);
    const filtered = sprints.filter(s => s.id !== id);
    
    if (filtered.length === sprints.length) return false;
    
    saveToStorage(STORAGE_KEYS.SPRINTS, filtered);
    return true;
  },

  completeSprint: (id) => {
    return sprintService.updateSprint(id, { status: 'Completed' });
  },

  getActiveSprints: () => {
    return getFromStorage(STORAGE_KEYS.SPRINTS)
      .filter(s => s.status === 'To Be Start' || s.status === 'In Progress');
  },

  getCompletedSprints: () => {
    return getFromStorage(STORAGE_KEYS.SPRINTS)
      .filter(s => s.status === 'Completed');
  },
};
