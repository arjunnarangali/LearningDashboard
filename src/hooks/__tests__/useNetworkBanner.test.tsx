import React from 'react';
import {NetworkStatusContext} from '../../state/network-status-context';
import {useNetworkBanner} from '../useNetworkBanner';
import {renderHook} from '../../test-utils/renderHook';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 24, right: 0, bottom: 0, left: 0}),
}));

describe('useNetworkBanner', () => {
  it('shows the offline banner with a safe-area top inset', () => {
    const wrapper = ({children}: React.PropsWithChildren) => (
      <NetworkStatusContext.Provider value={{
        isConnected: false, isInternetReachable: false, isOffline: true,
      }}>
        {children}
      </NetworkStatusContext.Provider>
    );
    const {result} = renderHook(useNetworkBanner, {wrapper});
    expect(result.current).toEqual({visible: true, paddingTop: 24});
  });

  it('hides the banner when online and preserves minimum top padding', () => {
    const wrapper = ({children}: React.PropsWithChildren) => (
      <NetworkStatusContext.Provider value={{
        isConnected: true, isInternetReachable: true, isOffline: false,
      }}>
        {children}
      </NetworkStatusContext.Provider>
    );
    const {result} = renderHook(useNetworkBanner, {wrapper});
    expect(result.current).toEqual({visible: false, paddingTop: 24});
  });
});
