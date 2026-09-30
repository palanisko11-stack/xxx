// Typové definice pro 3D vizualizaci Havířova

declare module '*.tsx' {
  import React from 'react';
  const component: React.ComponentType<any>;
  export default component;
}

// Rozsířená typová definice pro CanvasRenderingContext2D
declare interface CanvasRenderingContext2D {
  // Podpora pro zaoblené konce čar
  lineCap: 'butt' | 'round' | 'square';
  lineJoin: 'round' | 'bevel' | 'miter';
  
  // Podpora pro stínování
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

// Typy pro 3D geometrii
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface BoundingBox {
  min: Vector3;
  max: Vector3;
}

export interface Camera {
  position: Vector3;
  target: Vector3;
  up: Vector3;
  fov: number;
  near: number;
  far: number;
}

export interface Light {
  position: Vector3;
  color: string;
  intensity: number;
  type: 'point' | 'directional' | 'ambient';
}

// Typy pro materiály
export interface Material {
  color: string;
  texture?: string;
  shininess?: number;
  transparency?: number;
  reflectivity?: number;
}

// Typy pro textury
export interface Texture {
  url: string;
  loaded: boolean;
  image: HTMLImageElement | null;
}

// Typy pro animace
export interface Animation {
  duration: number;
  easing: (t: number) => number;
  onComplete?: () => void;
}

// Typy pro interakci
export interface InteractionEvent {
  type: 'click' | 'hover' | 'drag' | 'zoom';
  target: string;
  position: Vector2;
  timestamp: number;
}

// Typy pro vrstvy
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  objects: string[];
}

// Typy pro export/import dat
export interface CityDataExport {
  version: string;
  timestamp: string;
  buildings: any[];
  streets: any[];
  terrain: any[];
  districts: any[];
  metadata: {
    name: string;
    description: string;
    author: string;
  };
}
