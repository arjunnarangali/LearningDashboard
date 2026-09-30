import { useContext } from 'react';
import { NetworkStatusContext } from '../state/network-status-context';

export function useNetworkStatus() {
  const context = useContext(NetworkStatusContext);
  if (!context) {
    throw new Error(
      'useNetworkStatus must be used inside NetworkStatusProvider',
    );
  }
  return context;
}
