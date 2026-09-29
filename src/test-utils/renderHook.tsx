import React, {ComponentType, PropsWithChildren, ReactNode} from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';

type RenderHookOptions = {
  wrapper?: ComponentType<PropsWithChildren>;
};

export function renderHook<Result>(callback: () => Result, options: RenderHookOptions = {}) {
  const result = {current: undefined as Result};
  let unmountRenderer: () => void = () => {};

  function Probe() {
    result.current = callback();
    return null;
  }

  const content: ReactNode = <Probe />;
  const tree = options.wrapper
    ? React.createElement(options.wrapper, null, content)
    : content;

  act(() => {
    const renderer = ReactTestRenderer.create(tree);
    unmountRenderer = () => {
      act(() => renderer.unmount());
    };
  });

  return {result, unmount: unmountRenderer};
}
