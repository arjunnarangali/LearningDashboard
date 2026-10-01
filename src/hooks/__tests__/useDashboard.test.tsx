import React from 'react';
import { act } from 'react-test-renderer';
import { CourseContext, CourseContextValue } from '../../state/course-context';
import { UserSessionContext } from '../../state/user-session-context';
import { useDashboard } from '../useDashboard';
import { renderHook } from '../../test-utils/renderHook';

describe('useDashboard', () => {
  it('loads courses on mount and exposes navigation and retry actions', () => {
    const loadCourses = jest.fn(async () => undefined);
    const navigate = jest.fn();
    const navigation = { navigate } as never;
    const value: CourseContextValue = {
      courses: [
        {
          id: 'course-1',
          title: 'Course',
          instructor: 'Instructor',
          progress: 0,
          lessons: [],
        },
      ],
      source: null,
      loading: false,
      error: null,
      loadCourses,
      completeLesson: jest.fn(async () => undefined),
    };
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <UserSessionContext.Provider
        value={{
          currentEmail: 'reader@example.com',
          setCurrentEmail: jest.fn(async () => undefined),
          clearCurrentEmail: jest.fn(),
        }}
      >
        <CourseContext.Provider value={value}>
          {children}
        </CourseContext.Provider>
      </UserSessionContext.Provider>
    );
    const { result } = renderHook(() => useDashboard(navigation), { wrapper });

    expect(loadCourses).toHaveBeenCalledTimes(1);
    act(() => result.current.openCourse(value.courses[0]));
    expect(navigate).toHaveBeenCalledWith('CourseDetails', {
      courseId: 'course-1',
    });
    act(() => result.current.retry());
    expect(loadCourses).toHaveBeenCalledTimes(2);
  });
});
