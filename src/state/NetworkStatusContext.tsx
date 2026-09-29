import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type NetworkStatus = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  isOffline: boolean;
};

const initialStatus: NetworkStatus = {
  isConnected: null,
  isInternetReachable: null,
  isOffline: false,
};

const NetworkStatusContext = createContext<NetworkStatus | null>(null);

function toNetworkStatus(state: NetInfoState): NetworkStatus {
  return {
    isConnected: state.isConnected,
    isInternetReachable: state.isInternetReachable,
    isOffline: state.isConnected === false || state.isInternetReachable === false,
  };
}

export function NetworkStatusProvider({children}: PropsWithChildren) {
  const [status, setStatus] = useState<NetworkStatus>(initialStatus);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setStatus(toNetworkStatus(state));
    });

    return unsubscribe;
  }, []);

  const value = useMemo(() => status, [status]);

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export function useNetworkStatus(): NetworkStatus {
  const context = useContext(NetworkStatusContext);
  if (!context) {
    throw new Error('useNetworkStatus must be used inside NetworkStatusProvider');
  }
  return context;
}
