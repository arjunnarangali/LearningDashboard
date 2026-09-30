import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNetworkBanner } from '../hooks/useNetworkBanner';

export function NetworkStatusBanner() {
  const { visible, paddingTop } = useNetworkBanner();

  if (!visible) {
    return null;
  }

  return (
    <View accessibilityRole="alert" style={[styles.banner, { paddingTop }]}>
      <Text style={styles.title}>You’re offline</Text>
      <Text style={styles.message}>
        Some features may be unavailable. Cached courses are available offline.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF3D9',
    paddingHorizontal: 18,
    paddingBottom: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E9D7AD',
  },
  title: { fontSize: 13, fontWeight: '800', color: '#704800' },
  message: { fontSize: 12, color: '#8A5A00', marginTop: 2 },
});
