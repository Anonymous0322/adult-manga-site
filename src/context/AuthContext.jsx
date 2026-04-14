import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../utils/api';

export const AuthContext = createContext();

const CURRENT_USER_KEY = 'mangauz_user';
const TOKEN_KEY = 'mangauz_token';

const parseSafe = (value, fallback) => {
  if (value === null || value === undefined || value === 'null') return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const extractErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = parseSafe(localStorage.getItem(CURRENT_USER_KEY), null);
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const persistSession = (payload) => {
    const userData = payload?.user || null;
    const token = payload?.token || '';

    if (!userData || !token) {
      throw new Error('Invalid auth response from server');
    }

    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, token);

    return { success: true, user: userData };
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      return persistSession(response.data);
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, 'Invalid email or password')
      };
    }
  };

  const register = async (email, password, username) => {
    try {
      const response = await authApi.register(email, password, username);
      return persistSession(response.data);
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, 'Registration failed')
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const updateProfile = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isAdmin = () => Boolean(user && user.role === 'admin');

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
