import { calculateProgress } from './progress';
import { Lesson } from './models';

const lesson = (id: string, completed: boolean): Lesson => ({
  id,
  title: id,
  completed,
});

describe('calculateProgress', () => {
  it('rounds completed lessons to the nearest whole percentage', () => {
    expect(
      calculateProgress([
        lesson('one', true),
        lesson('two', false),
        lesson('three', true),
      ]),
    ).toBe(67);
  });

  it('returns zero for an empty course and 100 when all lessons are complete', () => {
    expect(calculateProgress([])).toBe(0);
    expect(calculateProgress([lesson('one', true), lesson('two', true)])).toBe(
      100,
    );
  });
});
