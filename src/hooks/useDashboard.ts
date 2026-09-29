import {useCallback, useEffect} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Course} from '../domain/models';
import {RootStackParamList} from '../navigation/types';
import {useCourses} from './useCourses';

type DashboardNavigation = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export function useDashboard(navigation: DashboardNavigation) {
  const {loadCourses, ...courseState} = useCourses();

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const openCourse = useCallback((course: Course) => {
    navigation.navigate('CourseDetails', {courseId: course.id});
  }, [navigation]);

  const retry = useCallback(() => {
    loadCourses();
  }, [loadCourses]);

  return {...courseState, loadCourses, openCourse, retry};
}
