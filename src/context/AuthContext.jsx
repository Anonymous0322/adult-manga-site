import React, { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const CURRENT_USER_KEY = 'mangauz_user';
const USERS_KEY = 'mangauz_registered_users';

const parseSafe = (value, fallback) => {
  if (value === null || value === undefined || value === 'null') return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const normalizeUsers = (value) => (Array.isArray(value) ? value : []);

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'ruhiddinov03@gmail.com';
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'Behruz03';
const ADMIN_USERNAME = process.env.REACT_APP_ADMIN_USERNAME || 'darlingohioo';
const FORCE_ADMIN_RESET = process.env.REACT_APP_FORCE_ADMIN === 'true';

const getUsers = () => {
  const parsed = parseSafe(localStorage.getItem(USERS_KEY), []);
  let users = normalizeUsers(parsed);
  if (!Array.isArray(parsed)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  if (FORCE_ADMIN_RESET) {
    users = [];
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const exists = users.some((u) => (u.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase());
    if (!exists) {
      const adminUser = {
        id: Date.now(),
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
        avatar: null,
        level: 1,
        points: 0,
        role: 'admin'
      };
      users = [...users, adminUser];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }

  return users;
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      const parsed = parseSafe(storedUser, null);
      const isDemoAdmin = parsed?.email === 'ruhiddinov03@gmail.com' && parsed?.username === 'Admin';
      if (isDemoAdmin) {
        localStorage.removeItem(CURRENT_USER_KEY);
      } else {
        setUser(parsed);
      }
    }
    getUsers();
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const users = getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!existing) {
      return { success: false, message: 'Invalid email or password' };
    }

    const signedUser = { ...existing };
    delete signedUser.password;
    setUser(signedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(signedUser));
    return { success: true, user: signedUser };
  };

  const register = async (email, password, username) => {
    const users = getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Email already exists' };
    }

    const hasAdmin = users.some((u) => u.role === 'admin');
    const newUser = {
      id: Date.now(),
      email,
      username,
      password,
      avatar: null,
      level: 1,
      points: 0,
      role: hasAdmin ? 'user' : 'admin'
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

    const signedUser = { ...newUser };
    delete signedUser.password;
    setUser(signedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(signedUser));
    return { success: true, user: signedUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(next));

      const users = getUsers();
      const updatedUsers = normalizeUsers(users).map((u) => (u.id === prev.id ? { ...u, ...patch } : u));
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

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
