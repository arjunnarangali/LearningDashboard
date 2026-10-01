import { createContext } from 'react';

export type UserSessionContextValue = {
  currentEmail: string | null;
  setCurrentEmail: (email: string) => Promise<void>;
  clearCurrentEmail: () => void;
};

export const UserSessionContext = createContext<UserSessionContextValue | null>(
  null,
);
