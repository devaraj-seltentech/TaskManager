import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { initializeStorage } from '../services/storageService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initializeStorage();
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const loggedInUser = authService.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
