import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {courseRepository} from '../data/courseRepository';
import {Course, CourseLoadResult} from '../domain/models';
import {calculateProgress} from '../domain/progress';

type CourseContextValue = {
  courses: Course[];
  source: CourseLoadResult['source'] | null;
  loading: boolean;
  error: string | null;
  loadCourses: () => Promise<void>;
  completeLesson: (courseId: string, lessonId: string) => Promise<void>;
};

const CourseContext = createContext<CourseContextValue | null>(null);

export function CourseProvider({children}: PropsWithChildren) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [source, setSource] = useState<CourseLoadResult['source'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseRepository.loadCourses();
      setCourses(result.courses);
      setSource(result.source);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Courses could not be loaded.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const completeLesson = useCallback(async (courseId: string, lessonId: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id !== courseId) {
        return course;
      }

      const lessons = course.lessons.map(lesson =>
        lesson.id === lessonId ? {...lesson, completed: true} : lesson,
      );
      return {...course, lessons, progress: calculateProgress(lessons)};
    });
    await courseRepository.saveCourses(updatedCourses);
    setCourses(updatedCourses);
  }, [courses]);

  const value = useMemo(
    () => ({courses, source, loading, error, loadCourses, completeLesson}),
    [courses, source, loading, error, loadCourses, completeLesson],
  );

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourses(): CourseContextValue {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used inside CourseProvider');
  }
  return context;
}
