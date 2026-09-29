import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {useEffect, useState} from 'react';
import {initialNetworkStatus, NetworkStatus} from '../state/network-status-context';

export function toNetworkStatus(state: NetInfoState): NetworkStatus {
  return {
    isConnected: state.isConnected,
    isInternetReachable: state.isInternetReachable,
    isOffline: state.isConnected === false || state.isInternetReachable === false,
  };
}

export function useNetworkMonitor(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(initialNetworkStatus);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setStatus(toNetworkStatus(state));
    });

    return unsubscribe;
  }, []);

  return status;
}
