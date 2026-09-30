import { useCallback, useMemo, useState } from 'react';
import { courseRepository } from '../data/courseRepository';
import { Course } from '../domain/models';
import { calculateProgress } from '../domain/progress';
import { CourseContextValue } from '../state/course-context';

export function useCourseController(): CourseContextValue {
  const [courses, setCourses] = useState<Course[]>([]);
  const [source, setSource] = useState<CourseContextValue['source']>(null);
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
        loadError instanceof Error
          ? loadError.message
          : 'Courses could not be loaded.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const completeLesson = useCallback(
    async (courseId: string, lessonId: string) => {
      const updatedCourses = courses.map(course => {
        if (course.id !== courseId) {
          return course;
        }

        const lessons = course.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson,
        );
        return { ...course, lessons, progress: calculateProgress(lessons) };
      });
      await courseRepository.saveCourses(updatedCourses);
      setCourses(updatedCourses);
    },
    [courses],
  );

  return useMemo(
    () => ({ courses, source, loading, error, loadCourses, completeLesson }),
    [courses, source, loading, error, loadCourses, completeLesson],
  );
}
