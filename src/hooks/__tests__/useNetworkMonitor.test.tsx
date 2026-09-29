import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {act} from 'react-test-renderer';
import {useNetworkMonitor} from '../useNetworkMonitor';
import {renderHook} from '../../test-utils/renderHook';

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {addEventListener: jest.fn()},
}));

describe('useNetworkMonitor', () => {
  beforeEach(() => jest.clearAllMocks());

  it('tracks connection and internet-reachability events and unsubscribes', () => {
    let onChange: ((state: NetInfoState) => void) | undefined;
    const unsubscribe = jest.fn();
    jest.mocked(NetInfo.addEventListener).mockImplementation(listener => {
      onChange = listener;
      return unsubscribe;
    });

    const {result, unmount} = renderHook(useNetworkMonitor);
    expect(result.current.isOffline).toBe(false);

    act(() => onChange?.({isConnected: true, isInternetReachable: false} as NetInfoState));
    expect(result.current.isOffline).toBe(true);

    act(() => onChange?.({isConnected: true, isInternetReachable: true} as NetInfoState));
    expect(result.current.isOffline).toBe(false);

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
