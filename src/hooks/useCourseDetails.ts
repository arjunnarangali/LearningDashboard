import {useCallback, useMemo, useState} from 'react';
import {useCourses} from './useCourses';

export function useCourseDetails(courseId: string) {
  const {courses, completeLesson} = useCourses();
  const course = useMemo(
    () => courses.find(item => item.id === courseId),
    [courses, courseId],
  );
  const [savingLesson, setSavingLesson] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const complete = useCallback(async (lessonId: string) => {
    setSavingLesson(lessonId);
    setSaveError(null);
    try {
      await completeLesson(courseId, lessonId);
    } catch {
      setSaveError('Could not save your progress. Please try again.');
    } finally {
      setSavingLesson(null);
    }
  }, [completeLesson, courseId]);

  const completedLessons = course?.lessons.filter(lesson => lesson.completed).length ?? 0;

  return {course, completedLessons, savingLesson, saveError, complete};
}
