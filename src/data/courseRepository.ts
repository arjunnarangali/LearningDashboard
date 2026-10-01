import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Course, CourseLoadResult } from '../domain/models';
import { normalizeUserEmail } from './userRepository';
import { seedCourses } from './seedCourses';

const LEGACY_CACHE_KEY = '@learning-dashboard/courses-v1';
const LEGACY_OWNER_KEY = '@learning-dashboard/courses-v1-owner';
const CACHE_PREFIX = '@learning-dashboard/courses-v2:';

function cacheKeyForUser(email: string): string {
  return `${CACHE_PREFIX}${encodeURIComponent(normalizeUserEmail(email))}`;
}

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

async function parseCourses(
  serialized: string | null,
): Promise<Course[] | null> {
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

async function readCache(email: string): Promise<Course[] | null> {
  const serialized = await AsyncStorage.getItem(cacheKeyForUser(email));
  return parseCourses(serialized);
}

function initialCourses(): Course[] {
  return seedCourses.map(course => ({
    ...course,
    lessons: course.lessons.map(lesson => ({ ...lesson })),
  }));
}

async function migrateLegacyCache(email: string): Promise<Course[] | null> {
  const migrationOwner = await AsyncStorage.getItem(LEGACY_OWNER_KEY);
  if (migrationOwner && migrationOwner !== email) {
    return null;
  }

  const legacyCourses = await parseCourses(
    await AsyncStorage.getItem(LEGACY_CACHE_KEY),
  );
  if (!legacyCourses) {
    return null;
  }

  if (!migrationOwner) {
    await AsyncStorage.setItem(LEGACY_OWNER_KEY, email);
  }
  await AsyncStorage.setItem(
    cacheKeyForUser(email),
    JSON.stringify(legacyCourses),
  );
  await AsyncStorage.removeItem(LEGACY_CACHE_KEY);
  return legacyCourses;
}

export const courseRepository = {
  async loadCourses(email: string): Promise<CourseLoadResult> {
    const normalizedEmail = normalizeUserEmail(email);
    const connection = await NetInfo.fetch();
    const cached =
      (await readCache(normalizedEmail)) ??
      (await migrateLegacyCache(normalizedEmail));

    if (isConnected(connection)) {
      try {
        const remoteCourses = await fetchMockCourses();
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
        await AsyncStorage.setItem(
          cacheKeyForUser(normalizedEmail),
          JSON.stringify(courses),
        );
        return { courses, source: 'network' };
      } catch {
        // Fall through to the last successful local snapshot.
      }
    }

    if (cached) {
      return { courses: cached, source: 'cache' };
    }

    const defaults = initialCourses();
    await AsyncStorage.setItem(
      cacheKeyForUser(normalizedEmail),
      JSON.stringify(defaults),
    );
    return { courses: defaults, source: 'cache' };
  },

  async saveCourses(email: string, courses: Course[]): Promise<void> {
    await AsyncStorage.setItem(cacheKeyForUser(email), JSON.stringify(courses));
  },
};
