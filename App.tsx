import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {CourseProvider} from './src/state/CourseContext';
import {NetworkStatusProvider} from './src/state/NetworkStatusContext';
import {NetworkStatusBanner} from './src/components/NetworkStatusBanner';
import {RootNavigator} from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NetworkStatusProvider>
        <CourseProvider>
          <NetworkStatusBanner />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </CourseProvider>
      </NetworkStatusProvider>
    </SafeAreaProvider>
  );
}
