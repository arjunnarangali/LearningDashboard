import { act } from 'react-test-renderer';
import { courseRepository } from '../../data/courseRepository';
import { Course } from '../../domain/models';
import { useCourseController } from '../useCourseController';
import { renderHook } from '../../test-utils/renderHook';

jest.mock('../../data/courseRepository', () => ({
  courseRepository: { loadCourses: jest.fn(), saveCourses: jest.fn() },
}));

const mockRepository = jest.mocked(courseRepository);
const sampleCourse: Course = {
  id: 'course-1',
  title: 'Course',
  instructor: 'Instructor',
  progress: 0,
  lessons: [
    { id: 'lesson-1', title: 'First', completed: false },
    { id: 'lesson-2', title: 'Second', completed: true },
  ],
};

describe('useCourseController', () => {
  beforeEach(() => jest.clearAllMocks());

  it('loads courses and reports network source', async () => {
    mockRepository.loadCourses.mockResolvedValueOnce({
      courses: [sampleCourse],
      source: 'network',
    });
    const { result } = renderHook(useCourseController);

    await act(async () => result.current.loadCourses());

    expect(result.current.courses).toEqual([sampleCourse]);
    expect(result.current.source).toBe('network');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('exposes load errors and persists lesson progress changes', async () => {
    mockRepository.loadCourses.mockResolvedValueOnce({
      courses: [sampleCourse],
      source: 'cache',
    });
    const { result } = renderHook(useCourseController);
    await act(async () => result.current.loadCourses());
    mockRepository.saveCourses.mockResolvedValueOnce();

    await act(async () =>
      result.current.completeLesson('course-1', 'lesson-1'),
    );

    expect(result.current.courses[0].lessons[0].completed).toBe(true);
    expect(result.current.courses[0].progress).toBe(100);
    expect(mockRepository.saveCourses).toHaveBeenCalledWith(
      result.current.courses,
    );

    mockRepository.loadCourses.mockRejectedValueOnce(new Error('Unavailable'));
    await act(async () => result.current.loadCourses());
    expect(result.current.error).toBe('Unavailable');
  });
});
