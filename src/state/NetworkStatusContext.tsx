import React, {PropsWithChildren} from 'react';
import {useNetworkMonitor} from '../hooks/useNetworkMonitor';
import {NetworkStatusContext} from './network-status-context';

export function NetworkStatusProvider({children}: PropsWithChildren) {
  const status = useNetworkMonitor();
  return (
    <NetworkStatusContext.Provider value={status}>
      {children}
    </NetworkStatusContext.Provider>
  );
}
