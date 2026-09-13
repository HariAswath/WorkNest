import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('worknest_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check current session with backend on initial load
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await authApi.getCurrentUser();
        if (response?.data) {
          setUser(response.data);
          localStorage.setItem('worknest_user', JSON.stringify(response.data));
        }
      } catch (err) {
        // If 401 or token expired, clear cached user
        if (err?.statusCode === 401) {
          setUser(null);
          localStorage.removeItem('worknest_user');
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const response = await authApi.login({ email, password });
      const userData = response.data?.user || response.data;
      setUser(userData);
      localStorage.setItem('worknest_user', JSON.stringify(userData));
      return { success: true, data: response.data };
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      return { success: false, error: err.message };
    }
  };

  // Register handler
  const register = async (email, username, password) => {
    setAuthError(null);
    try {
      const response = await authApi.register({ email, username, password });
      return { success: true, data: response.data, message: response.message };
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('worknest_user');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    authError,
    setAuthError,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
