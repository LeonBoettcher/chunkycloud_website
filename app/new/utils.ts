export const canvasSizeToDimensions = (
  canvasSize: string,
): { width: number; height: number } => {
  const [width, height] = canvasSize.split("x").map(Number);
  if (isNaN(width) || isNaN(height)) {
    throw new Error(`Invalid canvas size: ${canvasSize}`);
  }
  return { width, height };
};
