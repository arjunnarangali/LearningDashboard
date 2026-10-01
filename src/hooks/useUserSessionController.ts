import { useCallback, useMemo, useState } from 'react';
import { userRepository, normalizeUserEmail } from '../data/userRepository';
import { UserSessionContextValue } from '../state/user-session-context';

export function useUserSessionController(): UserSessionContextValue {
  const [currentEmail, setCurrentEmailState] = useState<string | null>(null);

  const setCurrentEmail = useCallback(async (email: string) => {
    const normalizedEmail = normalizeUserEmail(email);
    await userRepository.recordLogin(normalizedEmail);
    setCurrentEmailState(normalizedEmail);
  }, []);

  const clearCurrentEmail = useCallback(() => {
    setCurrentEmailState(null);
  }, []);

  return useMemo(
    () => ({ currentEmail, setCurrentEmail, clearCurrentEmail }),
    [currentEmail, setCurrentEmail, clearCurrentEmail],
  );
}
