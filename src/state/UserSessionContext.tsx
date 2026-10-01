import React, { PropsWithChildren } from 'react';
import { useUserSessionController } from '../hooks/useUserSessionController';
import { UserSessionContext } from './user-session-context';

export function UserSessionProvider({ children }: PropsWithChildren) {
  const value = useUserSessionController();
  return (
    <UserSessionContext.Provider value={value}>
      {children}
    </UserSessionContext.Provider>
  );
}
