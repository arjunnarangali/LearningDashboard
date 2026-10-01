import AsyncStorage from '@react-native-async-storage/async-storage';
import { userRepository } from '../userRepository';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const storage = jest.mocked(AsyncStorage);

describe('userRepository', () => {
  beforeEach(() => jest.clearAllMocks());

  it('normalizes email and creates an active registry record on first login', async () => {
    storage.getItem.mockResolvedValueOnce(null);
    storage.setItem.mockResolvedValueOnce();

    const user = await userRepository.recordLogin('  Reader@Example.com ');

    expect(user.email).toBe('reader@example.com');
    expect(user.status).toBe('active');
    expect(user.loginCount).toBe(1);
    expect(user.firstLoginAt).toBe(user.lastLoginAt);
    expect(storage.setItem).toHaveBeenCalledWith(
      '@learning-dashboard/user-registry-v1',
      JSON.stringify({ [user.email]: user }),
    );
  });

  it('increments login status for an existing email record', async () => {
    const previous = {
      email: 'reader@example.com',
      status: 'active' as const,
      firstLoginAt: '2026-01-01T00:00:00.000Z',
      lastLoginAt: '2026-01-02T00:00:00.000Z',
      loginCount: 2,
    };
    storage.getItem.mockResolvedValueOnce(
      JSON.stringify({ [previous.email]: previous }),
    );
    storage.setItem.mockResolvedValueOnce();

    const user = await userRepository.recordLogin('READER@example.com');

    expect(user.firstLoginAt).toBe(previous.firstLoginAt);
    expect(user.loginCount).toBe(3);
    expect(user.lastLoginAt).not.toBe(previous.lastLoginAt);
  });
});
