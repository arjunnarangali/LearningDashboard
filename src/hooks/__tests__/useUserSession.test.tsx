import React from 'react';
import { UserSessionContext } from '../../state/user-session-context';
import { useUserSession } from '../useUserSession';
import { renderHook } from '../../test-utils/renderHook';

describe('useUserSession', () => {
  it('returns the active email and session actions', () => {
    const value = {
      currentEmail: 'reader@example.com',
      setCurrentEmail: jest.fn(async () => undefined),
      clearCurrentEmail: jest.fn(),
    };
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <UserSessionContext.Provider value={value}>
        {children}
      </UserSessionContext.Provider>
    );

    const { result } = renderHook(useUserSession, { wrapper });
    expect(result.current).toBe(value);
  });

  it('requires UserSessionProvider', () => {
    expect(() => renderHook(useUserSession)).toThrow(
      'useUserSession must be used inside UserSessionProvider',
    );
  });
});
