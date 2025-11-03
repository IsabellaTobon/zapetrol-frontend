import { useState, useCallback } from 'react';
import { loginAPI, registerAPI, meAPI, type MePayload } from '../lib/api';

export function useAuth() {
  const [user, setUser] = useState<MePayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = useCallback(async () => {
    try {
      const me = await meAPI();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  const doRegister = useCallback(async (input: { name?: string; email: string; password: string }) => {
    setLoading(true); setError(null);
    try {
      const { access_token } = await registerAPI(input);
      localStorage.setItem('access_token', access_token);
      await fetchMe();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Error registrando');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fetchMe]);

  const doLogin = useCallback(async (input: { email: string; password: string }) => {
    setLoading(true); setError(null);
    try {
      const { access_token } = await loginAPI(input);
      localStorage.setItem('access_token', access_token);
      await fetchMe();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Error iniciando sesión');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fetchMe]);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setUser(null);
  }, []);

  return { user, loading, error, doRegister, doLogin, logout, fetchMe };
}
