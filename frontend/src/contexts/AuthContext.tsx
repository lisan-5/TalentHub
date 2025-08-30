import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuthToken, TOKEN_KEY } from '../lib/api';
import { ApiUser, User, mapUser } from '../types';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUserFromToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthToken(token);
    try {
      const res = await api.get<{ user: ApiUser }>('/user');
      // backend may return user directly or wrapped
      const apiUser: ApiUser = (res.data as any).user ?? (res.data as any);
      setUser(mapUser(apiUser as ApiUser));
    } catch (err) {
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUserFromToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data.token ?? res.data.access_token ?? res.data?.data?.token;
    const apiUser = res.data.user ?? res.data?.user ?? res.data?.data?.user;
    if (!token) throw new Error('No token returned from login');
    setAuthToken(token);
    if (apiUser) setUser(mapUser(apiUser));
    else await loadUserFromToken();
  }

  async function register(name: string, email: string, password: string, role: string = 'applicant') {
    const res = await api.post('/auth/register', { name, email, password, role });
    const token = res.data.token ?? res.data.access_token ?? res.data?.data?.token;
    const apiUser = res.data.user ?? res.data?.user ?? res.data?.data?.user;
    if (!token) throw new Error('No token returned from register');
    setAuthToken(token);
    if (apiUser) setUser(mapUser(apiUser));
    else await loadUserFromToken();
  }

  function logout() {
    setAuthToken(null);
    setUser(null);
  }

  async function refreshUser() {
    await loadUserFromToken();
  }

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      r => r,
      err => {
        if (err?.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
