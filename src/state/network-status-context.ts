import {createContext} from 'react';

export type NetworkStatus = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  isOffline: boolean;
};

export const initialNetworkStatus: NetworkStatus = {
  isConnected: null,
  isInternetReachable: null,
  isOffline: false,
};

export const NetworkStatusContext = createContext<NetworkStatus | null>(null);
