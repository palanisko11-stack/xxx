// 3D matematické utility funkce pro vizualizaci města

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Matrix4 {
  data: number[];
}

// Vektorové operace

export const createVector3 = (x: number = 0, y: number = 0, z: number = 0): Vector3 => ({
  x, y, z
});

export const createVector2 = (x: number = 0, y: number = 0): Vector2 => ({
  x, y
});

// Sčítání vektorů
export const addVectors = (a: Vector3, b: Vector3): Vector3 => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z
});

// Odčítání vektorů
export const subtractVectors = (a: Vector3, b: Vector3): Vector3 => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z
});

// Násobení vektoru skalárem
export const multiplyVector = (v: Vector3, scalar: number): Vector3 => ({
  x: v.x * scalar,
  y: v.y * scalar,
  z: v.z * scalar
});

// Skalární součin
export const dotProduct = (a: Vector3, b: Vector3): number => {
  return a.x * b.x + a.y * b.y + a.z * b.z;
};

// Křížový součin
export const crossProduct = (a: Vector3, b: Vector3): Vector3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x
});

// Délka vektoru
export const vectorLength = (v: Vector3): number => {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
};

// Normalizace vektoru
export const normalizeVector = (v: Vector3): Vector3 => {
  const length = vectorLength(v);
  if (length === 0) return { x: 0, y: 0, z: 0 };
  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length
  };
};

// Vzdálenost mezi dvěma body
export const distance = (a: Vector3, b: Vector3): number => {
  return vectorLength(subtractVectors(a, b));
};

// Lineární interpolace
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

// Interpolace vektoru
export const lerpVector = (a: Vector3, b: Vector3, t: number): Vector3 => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  z: lerp(a.z, b.z, t)
});

// Matice operace

export const createIdentityMatrix = (): Matrix4 => ({
  data: [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]
});

// Matice rotace kolem osy X
export const createRotationXMatrix = (angle: number): Matrix4 => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    data: [
      1, 0, 0, 0,
      0, cos, -sin, 0,
      0, sin, cos, 0,
      0, 0, 0, 1
    ]
  };
};

// Matice rotace kolem osy Y
export const createRotationYMatrix = (angle: number): Matrix4 => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    data: [
      cos, 0, sin, 0,
      0, 1, 0, 0,
      -sin, 0, cos, 0,
      0, 0, 0, 1
    ]
  };
};

// Matice rotace kolem osy Z
export const createRotationZMatrix = (angle: number): Matrix4 => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    data: [
      cos, -sin, 0, 0,
      sin, cos, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  };
};

// Matice posunu
export const createTranslationMatrix = (x: number, y: number, z: number): Matrix4 => ({
  data: [
    1, 0, 0, x,
    0, 1, 0, y,
    0, 0, 1, z,
    0, 0, 0, 1
  ]
});

// Matice měřítka
export const createScaleMatrix = (x: number, y: number, z: number): Matrix4 => ({
  data: [
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  ]
});

// Násobení matic
export const multiplyMatrices = (a: Matrix4, b: Matrix4): Matrix4 => {
  const result: number[] = new Array(16).fill(0);
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result[i * 4 + j] += a.data[i * 4 + k] * b.data[k * 4 + j];
      }
    }
  }
  
  return { data: result };
};

// Aplikace matice na vektor
export const applyMatrixToVector = (matrix: Matrix4, vector: Vector3): Vector3 => {
  const x = vector.x * matrix.data[0] + vector.y * matrix.data[4] + vector.z * matrix.data[8] + matrix.data[12];
  const y = vector.x * matrix.data[1] + vector.y * matrix.data[5] + vector.z * matrix.data[9] + matrix.data[13];
  const z = vector.x * matrix.data[2] + vector.y * matrix.data[6] + vector.z * matrix.data[10] + matrix.data[14];
  const w = vector.x * matrix.data[3] + vector.y * matrix.data[7] + vector.z * matrix.data[11] + matrix.data[15];
  
  // Perspektivní dělení
  if (w !== 0) {
    return {
      x: x / w,
      y: y / w,
      z: z / w
    };
  }
  
  return { x, y, z };
};

// Perspektivní projekční matice
export const createPerspectiveMatrix = (
  fov: number,
  aspect: number,
  near: number,
  far: number
): Matrix4 => {
  const f = 1.0 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  
  return {
    data: [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0
    ]
  };
};

// Ortografická projekční matice
export const createOrthographicMatrix = (
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number
): Matrix4 => {
  const rl = 1 / (right - left);
  const tb = 1 / (top - bottom);
  const fn = 1 / (far - near);
  
  return {
    data: [
      2 * rl, 0, 0, -(right + left) * rl,
      0, 2 * tb, 0, -(top + bottom) * tb,
      0, 0, -2 * fn, -(far + near) * fn,
      0, 0, 0, 1
    ]
  };
};

// Pohledová matice (view matrix)
export const createViewMatrix = (
  cameraPosition: Vector3,
  target: Vector3,
  up: Vector3 = { x: 0, y: 1, z: 0 }
): Matrix4 => {
  const zAxis = normalizeVector(subtractVectors(cameraPosition, target));
  const xAxis = normalizeVector(crossProduct(up, zAxis));
  const yAxis = crossProduct(zAxis, xAxis);
  
  const tx = -dotProduct(xAxis, cameraPosition);
  const ty = -dotProduct(yAxis, cameraPosition);
  const tz = -dotProduct(zAxis, cameraPosition);
  
  return {
    data: [
      xAxis.x, yAxis.x, zAxis.x, 0,
      xAxis.y, yAxis.y, zAxis.y, 0,
      xAxis.z, yAxis.z, zAxis.z, 0,
      tx, ty, tz, 1
    ]
  };
};

// Geometrické utility

// Získání normály plochy
export const getFaceNormal = (a: Vector3, b: Vector3, c: Vector3): Vector3 => {
  const ab = subtractVectors(b, a);
  const ac = subtractVectors(c, a);
  return normalizeVector(crossProduct(ab, ac));
};

// Zkontrolování, zda je bod uvnitř trojúhelníku
export const pointInTriangle = (
  point: Vector2,
  a: Vector2,
  b: Vector2,
  c: Vector2
): boolean => {
  const d1 = (point.y - b.y) * (c.x - b.x) - (point.x - b.x) * (c.y - b.y);
  const d2 = (point.y - c.y) * (a.x - c.x) - (point.x - c.x) * (a.y - c.y);
  const d3 = (point.y - a.y) * (b.x - a.x) - (point.x - a.x) * (b.y - a.y);
  
  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
  
  return !(hasNeg && hasPos);
};

// Ray casting utility
export interface Ray {
  origin: Vector3;
  direction: Vector3;
}

export interface RayIntersection {
  point: Vector3;
  distance: number;
  normal: Vector3;
  faceIndex: number;
}

export const createRay = (origin: Vector3, direction: Vector3): Ray => ({
  origin,
  direction: normalizeVector(direction)
});

// Intersekce paprsku s rovinou
export const rayPlaneIntersection = (
  ray: Ray,
  planePoint: Vector3,
  planeNormal: Vector3
): Vector3 | null => {
  const denom = dotProduct(ray.direction, planeNormal);
  
  if (Math.abs(denom) < 0.0001) {
    return null; // Paprsek je rovnoběžný s rovinou
  }
  
  const t = dotProduct(subtractVectors(planePoint, ray.origin), planeNormal) / denom;
  
  if (t >= 0) {
    return addVectors(ray.origin, multiplyVector(ray.direction, t));
  }
  
  return null; // Intersekce je za počátkem paprsku
};

// Intersekce paprsku s kvádrem (AABB - Axis Aligned Bounding Box)
export const rayAABBIntersection = (
  ray: Ray,
  min: Vector3,
  max: Vector3
): RayIntersection | null => {
  let tmin = -Infinity;
  let tmax = Infinity;
  
  // X osa
  const invDirX = 1 / ray.direction.x;
  const t1 = (min.x - ray.origin.x) * invDirX;
  const t2 = (max.x - ray.origin.x) * invDirX;
  tmin = Math.max(tmin, Math.min(t1, t2));
  tmax = Math.min(tmax, Math.max(t1, t2));
  
  // Y osa
  const invDirY = 1 / ray.direction.y;
  const t3 = (min.y - ray.origin.y) * invDirY;
  const t4 = (max.y - ray.origin.y) * invDirY;
  tmin = Math.max(tmin, Math.min(t3, t4));
  tmax = Math.min(tmax, Math.max(t3, t4));
  
  // Z osa
  const invDirZ = 1 / ray.direction.z;
  const t5 = (min.z - ray.origin.z) * invDirZ;
  const t6 = (max.z - ray.origin.z) * invDirZ;
  tmin = Math.max(tmin, Math.min(t5, t6));
  tmax = Math.min(tmax, Math.max(t5, t6));
  
  if (tmax < 0 || tmin > tmax) {
    return null; // Žádná intersekce
  }
  
  const t = tmin >= 0 ? tmin : tmax;
  const intersectionPoint = addVectors(ray.origin, multiplyVector(ray.direction, t));
  
  // Určení normály (která stěna byla zasažena)
  let normal: Vector3 = { x: 0, y: 0, z: 0 };
  const epsilon = 0.001;
  
  if (Math.abs(intersectionPoint.x - min.x) < epsilon) normal = { x: -1, y: 0, z: 0 };
  else if (Math.abs(intersectionPoint.x - max.x) < epsilon) normal = { x: 1, y: 0, z: 0 };
  else if (Math.abs(intersectionPoint.y - min.y) < epsilon) normal = { x: 0, y: -1, z: 0 };
  else if (Math.abs(intersectionPoint.y - max.y) < epsilon) normal = { x: 0, y: 1, z: 0 };
  else if (Math.abs(intersectionPoint.z - min.z) < epsilon) normal = { x: 0, y: 0, z: -1 };
  else if (Math.abs(intersectionPoint.z - max.z) < epsilon) normal = { x: 0, y: 0, z: 1 };
  
  return {
    point: intersectionPoint,
    distance: t,
    normal,
    faceIndex: 0
  };
};

// Barvové utility

// Konverze HEX na RGB
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }
  return { r: 255, g: 255, b: 255 };
};

// Konverze RGB na HEX
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Zesvětlení/ztmavení barvy
export const adjustBrightness = (hex: string, factor: number): string => {
  const { r, g, b } = hexToRgb(hex);
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
  return rgbToHex(newR, newG, newB);
};

// Přidání alfa kanálu k barvě
export const addAlpha = (hex: string, alpha: number): string => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Generování náhodné barvy
export const randomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Interpolace barev
export const interpolateColor = (
  color1: string,
  color2: string,
  factor: number
): string => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  
  const r = Math.round(lerp(c1.r, c2.r, factor));
  const g = Math.round(lerp(c1.g, c2.g, factor));
  const b = Math.round(lerp(c1.b, c2.b, factor));
  
  return rgbToHex(r, g, b);
};

// Easing funkce
export const easeInOutQuad = (t: number): number => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

export const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

export default {
  // Vektorové operace
  createVector3,
  createVector2,
  addVectors,
  subtractVectors,
  multiplyVector,
  dotProduct,
  crossProduct,
  vectorLength,
  normalizeVector,
  distance,
  lerp,
  lerpVector,
  
  // Matice operace
  createIdentityMatrix,
  createRotationXMatrix,
  createRotationYMatrix,
  createRotationZMatrix,
  createTranslationMatrix,
  createScaleMatrix,
  multiplyMatrices,
  applyMatrixToVector,
  createPerspectiveMatrix,
  createOrthographicMatrix,
  createViewMatrix,
  
  // Geometrické utility
  getFaceNormal,
  pointInTriangle,
  
  // Ray casting
  createRay,
  rayPlaneIntersection,
  rayAABBIntersection,
  
  // Barvové utility
  hexToRgb,
  rgbToHex,
  adjustBrightness,
  addAlpha,
  randomColor,
  interpolateColor,
  
  // Easing funkce
  easeInOutQuad,
  easeInOutCubic,
  easeOutElastic
};
