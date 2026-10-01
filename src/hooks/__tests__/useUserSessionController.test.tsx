import { act } from 'react-test-renderer';
import { userRepository } from '../../data/userRepository';
import { useUserSessionController } from '../useUserSessionController';
import { renderHook } from '../../test-utils/renderHook';

jest.mock('../../data/userRepository', () => ({
  normalizeUserEmail: (email: string) => email.trim().toLowerCase(),
  userRepository: { recordLogin: jest.fn() },
}));

const mockedUsers = jest.mocked(userRepository);

describe('useUserSessionController', () => {
  beforeEach(() => jest.clearAllMocks());

  it('records and activates a normalized email, then clears the active user', async () => {
    mockedUsers.recordLogin.mockResolvedValueOnce({
      email: 'reader@example.com',
      status: 'active',
      firstLoginAt: '2026-01-01T00:00:00.000Z',
      lastLoginAt: '2026-01-01T00:00:00.000Z',
      loginCount: 1,
    });
    const { result } = renderHook(useUserSessionController);

    await act(async () =>
      result.current.setCurrentEmail(' Reader@Example.com '),
    );

    expect(mockedUsers.recordLogin).toHaveBeenCalledWith('reader@example.com');
    expect(result.current.currentEmail).toBe('reader@example.com');

    act(() => result.current.clearCurrentEmail());
    expect(result.current.currentEmail).toBeNull();
  });
});
