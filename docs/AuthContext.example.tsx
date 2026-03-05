import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { authApi, profilesApi } from '@/lib/api';

export type UserRole = 'affiliate' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  profileId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithTokens: (tokens: { accessToken: string; refreshToken: string }, userData?: { email?: string; role?: string; fullName?: string; id?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  const clearStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    restoreSession(token).finally(() => setIsLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleSessionInvalid = () => {
      clearStorage();
      setUser(null);
    };

    window.addEventListener('auth:session-invalid', handleSessionInvalid);
    return () => window.removeEventListener('auth:session-invalid', handleSessionInvalid);
  }, []);

  const restoreSession = async (_token: string) => {
    try {
      const { data } = await profilesApi.getMe();
      const storedRole = localStorage.getItem('userRole') as UserRole | null;
      const storedEmail = localStorage.getItem('userEmail') || '';
      setUser({
        id: data.userId || data.id,
        name: data.fullName || storedEmail.split('@')[0] || 'Usuário',
        email: data.email || storedEmail,
        role: storedRole || 'affiliate',
        avatar: data.avatarUrl || undefined,
        profileId: data.id,
      });
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) {
        clearStorage();
        setUser(null);
        return;
      }
      console.warn('[Auth] Failed to restore session, keeping tokens');
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    // Se o seu client retorna { data: { accessToken, ... } }, use response.data; se retorna direto o body, use response.
    const data = response.data ?? response;

    const accessToken = data.accessToken ?? data.access_token;
    const refreshToken = data.refreshToken ?? data.refresh_token;
    if (!accessToken || !refreshToken) {
      console.error('[Auth] Login: tokens não vieram na resposta. Resposta:', data);
      throw new Error('Resposta de login inválida: tokens não recebidos');
    }

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userEmail', data.user?.email ?? email);

    const role: UserRole = data.user?.role === 'admin' ? 'admin' : 'affiliate';
    localStorage.setItem('userRole', role);

    // Usuário já vem na resposta do login — definir de imediato (não depende de getMe)
    setUser({
      id: data.user?.id ?? 'unknown',
      name: data.user?.fullName ?? email.split('@')[0] ?? 'Usuário',
      email: data.user?.email ?? email,
      role,
    });

    // Opcional: enriquecer com perfil (avatar, profileId); se falhar, mantém o user já setado
    try {
      const { data: profile } = await profilesApi.getMe();
      const profileRole: UserRole = (profile as { user?: { role?: string } })?.user?.role === 'admin' ? 'admin' : role;
      if (profileRole !== role) localStorage.setItem('userRole', profileRole);
      setUser({
        id: (profile as { userId?: string }).userId || (profile as { id?: string }).id || data.user?.id ?? 'unknown',
        name: (profile as { fullName?: string }).fullName ?? data.user?.fullName ?? email.split('@')[0] ?? 'Usuário',
        email: (profile as { email?: string }).email ?? data.user?.email ?? email,
        role: profileRole,
        avatar: (profile as { avatarUrl?: string }).avatarUrl,
        profileId: (profile as { id?: string }).id,
      });
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) {
        clearStorage();
        setUser(null);
        throw error;
      }
      // Erro não é de auth — user já está setado acima; não desloga
    }
  };

  const loginWithTokens = async (
    tokens: { accessToken: string; refreshToken: string },
    userData?: { email?: string; role?: string; fullName?: string; id?: string }
  ) => {
    const accessToken = tokens.accessToken ?? (tokens as { access_token?: string }).access_token;
    const refreshToken = tokens.refreshToken ?? (tokens as { refresh_token?: string }).refresh_token;
    if (!accessToken || !refreshToken) {
      console.error('[Auth] loginWithTokens: tokens inválidos', tokens);
      throw new Error('Tokens de acesso/refresh são obrigatórios');
    }

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    if (userData?.email) localStorage.setItem('userEmail', userData.email);

    const role: UserRole = userData?.role === 'admin' ? 'admin' : 'affiliate';
    localStorage.setItem('userRole', role);

    // Definir user de imediato a partir de userData (ex.: após registro)
    setUser({
      id: userData?.id ?? 'unknown',
      name: userData?.fullName ?? userData?.email?.split('@')[0] ?? 'Usuário',
      email: userData?.email ?? '',
      role,
    });

    try {
      const { data: profile } = await profilesApi.getMe();
      setUser({
        id: (profile as { userId?: string }).userId || (profile as { id?: string }).id || userData?.id ?? 'unknown',
        name: (profile as { fullName?: string }).fullName || userData?.fullName || userData?.email?.split('@')[0] ?? 'Usuário',
        email: (profile as { email?: string }).email || userData?.email ?? '',
        role,
        avatar: (profile as { avatarUrl?: string }).avatarUrl,
        profileId: (profile as { id?: string }).id,
      });
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) {
        clearStorage();
        setUser(null);
        throw error;
      }
      // Fallback: user já foi setado acima com userData
    }
  };

  const logout = () => {
    clearStorage();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, loginWithTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
