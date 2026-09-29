import {useProgressBar} from '../useProgressBar';
import {renderHook} from '../../test-utils/renderHook';

describe('useProgressBar', () => {
  it.each([
    [-15, 0, '0%'],
    [45, 45, '45%'],
    [130, 100, '100%'],
  ])('bounds progress %i to %i%%', (input, expected, fillWidth) => {
    const {result} = renderHook(() => useProgressBar(input));
    expect(result.current).toEqual({boundedProgress: expected, fillWidth});
  });
});
