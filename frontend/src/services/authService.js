import { 
  getFromStorage, 
  getCurrentUserFromStorage, 
  setCurrentUserInStorage, 
  clearCurrentUser,
  STORAGE_KEYS 
} from './storageService';

export const authService = {
  login: (email, password) => {
    const users = getFromStorage(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUserInStorage(userWithoutPassword);
      return userWithoutPassword;
    }
    return null;
  },

  logout: () => {
    clearCurrentUser();
  },

  getCurrentUser: () => {
    return getCurrentUserFromStorage();
  },

  isAuthenticated: () => {
    return getCurrentUserFromStorage() !== null;
  },
};
