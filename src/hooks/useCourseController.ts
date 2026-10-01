import { useCallback, useMemo, useState } from 'react';
import { courseRepository } from '../data/courseRepository';
import { Course } from '../domain/models';
import { calculateProgress } from '../domain/progress';
import { CourseContextValue } from '../state/course-context';
import { useUserSession } from './useUserSession';

export function useCourseController(): CourseContextValue {
  const { currentEmail } = useUserSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesEmail, setCoursesEmail] = useState<string | null>(null);
  const [source, setSource] = useState<CourseContextValue['source']>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!currentEmail) {
        throw new Error('Sign in to load your courses.');
      }
      const result = await courseRepository.loadCourses(currentEmail);
      setCourses(result.courses);
      setCoursesEmail(currentEmail);
      setSource(result.source);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Courses could not be loaded.',
      );
    } finally {
      setLoading(false);
    }
  }, [currentEmail]);

  const completeLesson = useCallback(
    async (courseId: string, lessonId: string) => {
      if (!currentEmail) {
        throw new Error('Sign in to save your progress.');
      }
      const currentCourses = coursesEmail === currentEmail ? courses : [];
      const updatedCourses = currentCourses.map(course => {
        if (course.id !== courseId) {
          return course;
        }

        const lessons = course.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson,
        );
        return { ...course, lessons, progress: calculateProgress(lessons) };
      });
      await courseRepository.saveCourses(currentEmail, updatedCourses);
      setCourses(updatedCourses);
      setCoursesEmail(currentEmail);
    },
    [courses, coursesEmail, currentEmail],
  );

  return useMemo(
    () => ({
      courses: coursesEmail === currentEmail ? courses : [],
      source: coursesEmail === currentEmail ? source : null,
      loading,
      error,
      loadCourses,
      completeLesson,
    }),
    [
      courses,
      coursesEmail,
      currentEmail,
      source,
      loading,
      error,
      loadCourses,
      completeLesson,
    ],
  );
}
