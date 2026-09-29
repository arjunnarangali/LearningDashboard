import React from 'react';
import {act} from 'react-test-renderer';
import {CourseContext, CourseContextValue} from '../../state/course-context';
import {useCourseDetails} from '../useCourseDetails';
import {renderHook} from '../../test-utils/renderHook';

describe('useCourseDetails', () => {
  it('selects the requested course, counts completions, and completes a lesson', async () => {
    const completeLesson = jest.fn(async () => undefined);
    const value: CourseContextValue = {
      courses: [{
        id: 'course-1', title: 'Course', instructor: 'Instructor', progress: 50,
        lessons: [
          {id: 'lesson-1', title: 'First', completed: true},
          {id: 'lesson-2', title: 'Second', completed: false},
        ],
      }],
      source: null,
      loading: false,
      error: null,
      loadCourses: jest.fn(async () => undefined),
      completeLesson,
    };
    const wrapper = ({children}: React.PropsWithChildren) => (
      <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
    );
    const {result} = renderHook(() => useCourseDetails('course-1'), {wrapper});

    expect(result.current.course?.title).toBe('Course');
    expect(result.current.completedLessons).toBe(1);
    await act(async () => result.current.complete('lesson-2'));
    expect(completeLesson).toHaveBeenCalledWith('course-1', 'lesson-2');
    expect(result.current.saveError).toBeNull();
    expect(result.current.savingLesson).toBeNull();
  });

  it('reports persistence failures', async () => {
    const value: CourseContextValue = {
      courses: [], source: null, loading: false, error: null,
      loadCourses: jest.fn(async () => undefined),
      completeLesson: jest.fn(async () => {throw new Error('storage failure');}),
    };
    const wrapper = ({children}: React.PropsWithChildren) => (
      <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
    );
    const {result} = renderHook(() => useCourseDetails('missing'), {wrapper});

    await act(async () => result.current.complete('lesson-1'));
    expect(result.current.saveError).toBe('Could not save your progress. Please try again.');
  });
});
