import { createContext } from 'react';
import { Course, CourseLoadResult } from '../domain/models';

export type CourseContextValue = {
  courses: Course[];
  source: CourseLoadResult['source'] | null;
  loading: boolean;
  error: string | null;
  loadCourses: () => Promise<void>;
  completeLesson: (courseId: string, lessonId: string) => Promise<void>;
};

export const CourseContext = createContext<CourseContextValue | null>(null);
