import React from 'react';
import {NetworkStatusContext} from '../../state/network-status-context';
import {useNetworkStatus} from '../useNetworkStatus';
import {renderHook} from '../../test-utils/renderHook';

describe('useNetworkStatus', () => {
  it('returns the shared network state', () => {
    const status = {isConnected: false, isInternetReachable: false, isOffline: true};
    const wrapper = ({children}: React.PropsWithChildren) => (
      <NetworkStatusContext.Provider value={status}>{children}</NetworkStatusContext.Provider>
    );
    const {result} = renderHook(useNetworkStatus, {wrapper});
    expect(result.current).toEqual(status);
  });

  it('requires NetworkStatusProvider', () => {
    expect(() => renderHook(useNetworkStatus)).toThrow(
      'useNetworkStatus must be used inside NetworkStatusProvider',
    );
  });
});
