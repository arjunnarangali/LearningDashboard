import { act } from 'react-test-renderer';
import { login } from '../../data/authRepository';
import { useLoginForm } from '../useLoginForm';
import { renderHook } from '../../test-utils/renderHook';

jest.mock('../../data/authRepository', () => ({ login: jest.fn() }));

const mockedLogin = jest.mocked(login);

describe('useLoginForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('validates input without calling the login service', async () => {
    const { result } = renderHook(() => useLoginForm(jest.fn()));

    await act(async () => result.current.submit());

    expect(result.current.emailError).toBe('Enter a valid email address.');
    expect(result.current.error).toBe(
      'Password must be at least 6 characters.',
    );
    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it('normalizes email and calls success after login', async () => {
    const onSuccess = jest.fn();
    mockedLogin.mockResolvedValueOnce();
    const { result } = renderHook(() => useLoginForm(onSuccess));

    act(() => {
      result.current.changeEmail(' learner@example.com ');
      result.current.changePassword('secret1');
    });
    await act(async () => result.current.submit());

    expect(mockedLogin).toHaveBeenCalledWith('learner@example.com', 'secret1');
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
  });

  it('exposes service failures as an error message', async () => {
    mockedLogin.mockRejectedValueOnce(new Error('Rejected'));
    const { result } = renderHook(() => useLoginForm(jest.fn()));

    act(() => {
      result.current.changeEmail('learner@example.com');
      result.current.changePassword('secret1');
    });
    await act(async () => result.current.submit());

    expect(result.current.error).toBe('Rejected');
  });
});
