import React from 'react';
import { CourseContext, CourseContextValue } from '../../state/course-context';
import { useCourses } from '../useCourses';
import { renderHook } from '../../test-utils/renderHook';

const value: CourseContextValue = {
  courses: [],
  source: null,
  loading: false,
  error: null,
  loadCourses: jest.fn(async () => undefined),
  completeLesson: jest.fn(async () => undefined),
};

describe('useCourses', () => {
  it('returns the current course context', () => {
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
    );
    const { result } = renderHook(useCourses, { wrapper });
    expect(result.current).toBe(value);
  });

  it('throws when rendered outside the provider', () => {
    expect(() => renderHook(useCourses)).toThrow(
      'useCourses must be used inside CourseProvider',
    );
  });
});
