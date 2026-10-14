import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ecoverse_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('ecoverse_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('[AuthContext] Token validation failed:', err.message);
          logout();
        }
      } else {
        // Auto demo-login as Citizen for immediate zero-friction evaluation
        try {
          const res = await authAPI.demoLogin('citizen');
          if (res.data.success) {
            localStorage.setItem('ecoverse_token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
          }
        } catch {
          // Ignore fallback error
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      localStorage.setItem('ecoverse_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.data.success) {
      localStorage.setItem('ecoverse_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const demoLogin = async (role, department = null) => {
    try {
      const res = await authAPI.demoLogin(role, department);
      if (res.data.success) {
        localStorage.setItem('ecoverse_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
      }
    } catch (err) {
      console.error('[AuthContext] Demo login failed:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('ecoverse_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
