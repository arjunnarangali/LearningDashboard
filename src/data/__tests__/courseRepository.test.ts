import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { courseRepository } from '../courseRepository';
import { seedCourses } from '../seedCourses';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: { fetch: jest.fn() },
}));

const storage = jest.mocked(AsyncStorage);
const netInfo = jest.mocked(NetInfo);
const persisted = new Map<string, string>();

describe('courseRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    persisted.clear();
    storage.getItem.mockImplementation(async key => persisted.get(key) ?? null);
    storage.setItem.mockImplementation(async (key, value) => {
      persisted.set(key, value);
    });
    storage.removeItem.mockImplementation(async key => {
      persisted.delete(key);
    });
    netInfo.fetch.mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
    } as Awaited<ReturnType<typeof NetInfo.fetch>>);
  });

  it('starts each new email at default progress and keeps progress isolated per email', async () => {
    const firstLogin = await courseRepository.loadCourses(
      '  Alice@Example.com ',
    );
    expect(firstLogin.courses.map(course => course.progress)).toEqual([
      65, 40, 25,
    ]);

    const aliceProgress = firstLogin.courses.map((course, index) =>
      index === 0
        ? {
            ...course,
            progress: 70,
            lessons: course.lessons.map((lesson, lessonIndex) =>
              lessonIndex === 2 ? { ...lesson, completed: true } : lesson,
            ),
          }
        : course,
    );
    await courseRepository.saveCourses('alice@example.com', aliceProgress);

    const bob = await courseRepository.loadCourses('bob@example.com');
    const aliceAgain = await courseRepository.loadCourses('ALICE@example.com');

    expect(bob.courses[0].progress).toBe(65);
    expect(bob.courses[0].lessons[2].completed).toBe(false);
    expect(aliceAgain.courses[0].progress).toBe(70);
    expect(aliceAgain.courses[0].lessons[2].completed).toBe(true);
  });

  it('assigns the old shared cache to the first email that logs in after upgrade', async () => {
    const previousProgress = seedCourses.map(course => ({
      ...course,
      progress: 10,
    }));
    persisted.set(
      '@learning-dashboard/courses-v1',
      JSON.stringify(previousProgress),
    );

    const migrated = await courseRepository.loadCourses('first@example.com');

    expect(migrated.courses[0].progress).toBe(10);
    expect(persisted.has('@learning-dashboard/courses-v1')).toBe(false);
    expect(
      persisted.has('@learning-dashboard/courses-v2:first%40example.com'),
    ).toBe(true);

    // Even if the legacy entry remains after an interrupted cleanup, it must
    // never be copied to another user's progress key.
    persisted.set(
      '@learning-dashboard/courses-v1',
      JSON.stringify(previousProgress),
    );
    const anotherUser = await courseRepository.loadCourses(
      'another@example.com',
    );
    expect(anotherUser.courses[0].progress).toBe(65);
    expect(
      persisted.has('@learning-dashboard/courses-v2:another%40example.com'),
    ).toBe(true);
  });
});
