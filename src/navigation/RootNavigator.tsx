import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CourseDetailsScreen } from '../screens/CourseDetailsScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: '#F6F7FB' },
        headerShadowVisible: false,
        headerTintColor: '#20253A',
        contentStyle: { backgroundColor: '#F6F7FB' },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'My learning' }}
      />
      <Stack.Screen
        name="CourseDetails"
        component={CourseDetailsScreen}
        options={{ title: 'Course details' }}
      />
    </Stack.Navigator>
  );
}
