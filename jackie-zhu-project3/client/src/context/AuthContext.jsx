import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  const checkLogin = useCallback(async () => {
    try {
      const data = await apiClient('/api/user/isLoggedIn');
      setUser(data.loggedIn ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const login = useCallback(async ({ username, password }) => {
    const data = await apiClient('/api/user/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async ({ username, password }) => {
    const data = await apiClient('/api/user/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await apiClient('/api/user/logout', {
      method: 'POST'
    });

    setUser(null);
  }, []);

  const value = useMemo(
      () => ({
        user,
        authLoading,
        isLoggedIn: Boolean(user),
        login,
        register,
        logout,
        checkLogin
      }),
      [user, authLoading, login, register, logout, checkLogin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}