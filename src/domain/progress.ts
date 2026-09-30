import { Lesson } from './models';

export function calculateProgress(lessons: Lesson[]): number {
  if (lessons.length === 0) {
    return 0;
  }

  const completedCount = lessons.filter(lesson => lesson.completed).length;
  return Math.round((completedCount / lessons.length) * 100);
}
