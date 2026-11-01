import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          // Token expired or invalid
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data) {
      const authData = res.data;
      setToken(authData.token);
      localStorage.setItem('token', authData.token);
      
      const userData = {
        id: authData.id,
        fullName: authData.fullName,
        email: authData.email,
        role: authData.role,
        avatarUrl: authData.avatarUrl
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Login failed: invalid response structure');
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data) {
      const authData = res.data;
      setToken(authData.token);
      localStorage.setItem('token', authData.token);

      const userData = {
        id: authData.id,
        fullName: authData.fullName,
        email: authData.email,
        role: authData.role,
        avatarUrl: authData.avatarUrl
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isStudent = user?.role === 'STUDENT';
  const isOrganizer = user?.role === 'ORGANIZER';
  const isAdmin = user?.role === 'COLLEGE_ADMIN';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isStudent,
      isOrganizer,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
