import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready'

  // Restore the session from the cookie on every page load/refresh.
  useEffect(() => {
    let cancelled = false;
    api
      .get('/users/me')
      .then((res) => !cancelled && setUser(res.data.user))
      .catch(() => {})
      .finally(() => !cancelled && setStatus('ready'));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const register = useCallback(async (values) => {
    const res = await api.post('/auth/register', values);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const login = useCallback(async (values) => {
    const res = await api.post('/auth/login', values);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (values) => {
    const res = await api.patch('/users/me', values);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const value = useMemo(
    () => ({ user, status, register, login, logout, updateProfile }),
    [user, status, register, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
