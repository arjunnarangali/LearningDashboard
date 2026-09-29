export type Lesson = {
  id: string;
  title: string;
  completed: boolean;
};

export type Course = {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  lessons: Lesson[];
};

export type CourseLoadResult = {
  courses: Course[];
  source: 'network' | 'cache';
};
