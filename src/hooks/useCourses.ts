import {useContext} from 'react';
import {CourseContext} from '../state/course-context';

export function useCourses() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used inside CourseProvider');
  }
  return context;
}
