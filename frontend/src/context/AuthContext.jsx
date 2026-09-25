import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('packsmart_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Restore session on application startup
  useEffect(() => {
    async function restoreSession() {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('packsmart_token') : null;
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const user = await api.getMe();
        setCurrentUser(user);
        localStorage.setItem('packsmart_user', JSON.stringify(user));
      } catch (err) {
        console.warn('Session restoration failed or token expired:', err.message);
        localStorage.removeItem('packsmart_token');
        localStorage.removeItem('packsmart_user');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res?.access_token) {
      localStorage.setItem('packsmart_token', res.access_token);
      localStorage.setItem('packsmart_user', JSON.stringify(res.user));
      setCurrentUser(res.user);
    }
    return res;
  };

  const signup = async (name, email, password, role = 'user', organization = '') => {
    const res = await api.signup(name, email, password, role, organization);
    if (res?.access_token) {
      localStorage.setItem('packsmart_token', res.access_token);
      localStorage.setItem('packsmart_user', JSON.stringify(res.user));
      setCurrentUser(res.user);
    }
    return res;
  };

  const googleLogin = async (idToken) => {
    const res = await api.googleLogin(idToken);
    if (res?.access_token) {
      localStorage.setItem('packsmart_token', res.access_token);
      localStorage.setItem('packsmart_user', JSON.stringify(res.user));
      setCurrentUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('packsmart_token');
      localStorage.removeItem('packsmart_user');
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    signup,
    googleLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
