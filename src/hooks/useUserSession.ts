import { useContext } from 'react';
import { UserSessionContext } from '../state/user-session-context';

export function useUserSession() {
  const context = useContext(UserSessionContext);
  if (!context) {
    throw new Error('useUserSession must be used inside UserSessionProvider');
  }
  return context;
}
