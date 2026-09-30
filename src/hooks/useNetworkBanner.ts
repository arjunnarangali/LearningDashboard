import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStatus } from './useNetworkStatus';

export function useNetworkBanner() {
  const { isOffline } = useNetworkStatus();
  const insets = useSafeAreaInsets();

  return { visible: isOffline, paddingTop: Math.max(insets.top, 10) };
}
