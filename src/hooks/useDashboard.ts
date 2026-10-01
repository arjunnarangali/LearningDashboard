import { useCallback, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Course } from '../domain/models';
import { RootStackParamList } from '../navigation/types';
import { useCourses } from './useCourses';
import { useUserSession } from './useUserSession';

type DashboardNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

export function useDashboard(navigation: DashboardNavigation) {
  const { currentEmail, clearCurrentEmail } = useUserSession();
  const { loadCourses, ...courseState } = useCourses();

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const openCourse = useCallback(
    (course: Course) => {
      navigation.navigate('CourseDetails', { courseId: course.id });
    },
    [navigation],
  );

  const retry = useCallback(() => {
    loadCourses();
  }, [loadCourses]);

  const signOut = useCallback(() => {
    clearCurrentEmail();
    navigation.replace('Login');
  }, [clearCurrentEmail, navigation]);

  return {
    ...courseState,
    currentEmail,
    loadCourses,
    openCourse,
    retry,
    signOut,
  };
}
