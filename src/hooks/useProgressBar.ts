export function useProgressBar(progress: number) {
  const boundedProgress = Math.max(0, Math.min(100, progress));
  return {
    boundedProgress,
    fillWidth: `${boundedProgress}%` as `${number}%`,
  };
}
