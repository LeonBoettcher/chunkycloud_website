export const canvasSizeToDimensions = (
  canvasSize: string,
): { width: number; height: number } => {
  const [width, height] = canvasSize.split("x").map(Number);
  if (isNaN(width) || isNaN(height)) {
    throw new Error(`Invalid canvas size: ${canvasSize}`);
  }
  return { width, height };
};

export function cleanSceneDescription(sceneDescription: unknown) {
  // not needed for rendering, remove for privacy
  removePathFromObject(sceneDescription, "world");
  removePathFromObject(sceneDescription, "actors.skin");
  removePathFromObject(sceneDescription, "sky.skymap");
  replacePathInObjectIfExists(sceneDescription, "sky.skybox", [
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  // not needed for rendering, can be large
  // actually, this is needed to calculate octree origin; remove once the octree origin is stored in the scene description
  // removePathFromObject(sceneDescription, "chunkList");
}

function removePathFromObject(object: unknown, path: string) {
  if (object == null) {
    return;
  }
  const [first, ...rest] = path.split(".");
  if (Array.isArray(object)) {
    for (const item of object) {
      removePathFromObject(item, rest.join("."));
    }
  } else if (typeof object === "object") {
    if (rest.length === 0) {
      delete object[first];
    } else {
      removePathFromObject(object[first], rest.join("."));
    }
  }
}

function replacePathInObjectIfExists(
  object: unknown,
  path: string,
  newValue: unknown,
) {
  if (object == null) {
    return;
  }
  const [first, ...rest] = path.split(".");
  if (Array.isArray(object)) {
    for (const item of object) {
      replacePathInObjectIfExists(item, rest.join("."), newValue);
    }
  } else if (typeof object === "object") {
    if (rest.length === 0) {
      if (object.hasOwnProperty(first)) {
        object[first] = newValue;
      }
    } else {
      replacePathInObjectIfExists(object[first], rest.join("."), newValue);
    }
  }
}
