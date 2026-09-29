import {useCallback, useState} from 'react';
import {login} from '../data/authRepository';

export function useLoginForm(onSuccess: () => void) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const changeEmail = useCallback((value: string) => {
    setEmail(value);
    setEmailError(null);
  }, []);

  const changePassword = useCallback((value: string) => {
    setPassword(value);
    setError(null);
  }, []);

  const submit = useCallback(async () => {
    if (loading) {
      return;
    }

    const normalizedEmail = email.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    setEmailError(validEmail ? null : 'Enter a valid email address.');
    setError(null);

    if (!validEmail || password.length < 6) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
      }
      return;
    }

    setLoading(true);
    try {
      await login(normalizedEmail, password);
      onSuccess();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  }, [email, loading, onSuccess, password]);

  return {email, password, loading, error, emailError, changeEmail, changePassword, submit};
}
