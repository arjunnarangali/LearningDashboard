import React from 'react';
import {StyleSheet, View} from 'react-native';

export function ProgressBar({progress}: {progress: number}) {
  const boundedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{min: 0, max: 100, now: boundedProgress}}
      style={styles.track}>
      <View style={[styles.fill, {width: `${boundedProgress}%`}]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {height: 7, borderRadius: 8, backgroundColor: '#E7E9F2', overflow: 'hidden'},
  fill: {height: '100%', borderRadius: 8, backgroundColor: '#5B5CE2'},
});
