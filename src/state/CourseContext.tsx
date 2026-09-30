import React, { PropsWithChildren } from 'react';
import { useCourseController } from '../hooks/useCourseController';
import { CourseContext } from './course-context';

export function CourseProvider({ children }: PropsWithChildren) {
  const value = useCourseController();
  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}
