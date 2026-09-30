import { Course, Lesson } from '../domain/models';

function makeLessons(
  courseId: string,
  count: number,
  completedCount: number,
): Lesson[] {
  const titles = [
    'Introduction',
    'Variables & Data Types',
    'Functions',
    'Object-Oriented Programming',
    'Working with Collections',
    'Error Handling',
    'Modules and Packages',
    'Testing Fundamentals',
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: `${courseId}-lesson-${index + 1}`,
    title: titles[index] ?? `Lesson ${index + 1}`,
    // Keep the assignment's first four example lesson statuses intact while
    // preserving the aggregate completion count from the sample course data.
    completed: index < 2 || (index >= 4 && index < completedCount + 2),
  }));
}

export const seedCourses: Course[] = [
  {
    id: '1',
    title: 'Python Programming',
    instructor: 'John Smith',
    progress: 65,
    lessons: makeLessons('1', 20, 13),
  },
  {
    id: '2',
    title: 'Generative AI',
    instructor: 'Sarah Williams',
    progress: 40,
    lessons: makeLessons('2', 16, 6),
  },
  {
    id: '3',
    title: 'Full Stack Development',
    instructor: 'David Brown',
    progress: 25,
    lessons: makeLessons('3', 28, 7),
  },
];
