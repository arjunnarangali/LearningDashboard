import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Course, CourseLoadResult } from '../domain/models';
import { seedCourses } from './seedCourses';

const CACHE_KEY = '@learning-dashboard/courses-v1';

function isConnected(
  state: Awaited<ReturnType<typeof NetInfo.fetch>>,
): boolean {
  return state.isConnected !== false && state.isInternetReachable !== false;
}

async function fetchMockCourses(): Promise<Course[]> {
  // This is the mock API boundary. Replace this function with an HTTP client
  // when a backend is available; screens continue to use the repository.
  await new Promise<void>(resolve => setTimeout(resolve, 350));
  return seedCourses;
}

async function readCache(): Promise<Course[] | null> {
  const serialized = await AsyncStorage.getItem(CACHE_KEY);
  if (!serialized) {
    return null;
  }

  try {
    const courses: unknown = JSON.parse(serialized);
    return Array.isArray(courses) ? (courses as Course[]) : null;
  } catch {
    return null;
  }
}

export const courseRepository = {
  async loadCourses(): Promise<CourseLoadResult> {
    const connection = await NetInfo.fetch();

    if (isConnected(connection)) {
      try {
        const remoteCourses = await fetchMockCourses();
        const cached = await readCache();
        // Retain locally completed lesson state across app restarts while the
        // API is mocked and has no endpoint to accept progress mutations.
        const cachedById = new Map(cached?.map(course => [course.id, course]));
        const courses = remoteCourses.map(remoteCourse => {
          const savedCourse = cachedById.get(remoteCourse.id);
          return savedCourse
            ? {
                ...remoteCourse,
                progress: savedCourse.progress,
                lessons: savedCourse.lessons,
              }
            : remoteCourse;
        });
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(courses));
        return { courses, source: 'network' };
      } catch {
        // Fall through to the last successful local snapshot.
      }
    }

    const cached = await readCache();
    if (cached) {
      return { courses: cached, source: 'cache' };
    }

    throw new Error(
      connection.isConnected === false ||
      connection.isInternetReachable === false
        ? 'You are offline and no saved courses are available yet.'
        : 'Courses could not be loaded. Please try again.',
    );
  },

  async saveCourses(courses: Course[]): Promise<void> {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(courses));
  },
};
