// Konstanty pro 3D vizualizaci Havířova

// Barvy
export const COLORS = {
  // Primární barvy
  PRIMARY: '#3498db',
  SECONDARY: '#2ecc71',
  ACCENT: '#e74c3c',
  
  // Barvy pro typy budov
  BUILDING: {
    RESIDENTIAL: '#FFD700',
    COMMERCIAL: '#4682B4',
    INDUSTRIAL: '#8B4513',
    PUBLIC: '#C4A484',
    RELIGIOUS: '#D2B48C',
    EDUCATIONAL: '#CD853F',
    HEALTHCARE: '#FFFFFF'
  },
  
  // Barvy pro ulice
  STREET: {
    HIGHWAY: '#4A4A4A',
    MAIN: '#6A6A6A',
    SECONDARY: '#8A8A8A',
    LOCAL: '#AAAAAA'
  },
  
  // Barvy pro terén
  TERRAIN: {
    LOW: '#228B22',
    MEDIUM: '#32CD32',
    HIGH: '#9ACD32',
    VERY_HIGH: '#ADFF2F'
  },
  
  // Barvy UI
  UI: {
    BACKGROUND: 'rgba(255, 255, 255, 0.95)',
    TEXT: '#2c3e50',
    TEXT_SECONDARY: '#7f8c8d',
    BORDER: '#bdc3c7',
    SHADOW: 'rgba(0, 0, 0, 0.1)',
    OVERLAY: 'rgba(0, 0, 0, 0.5)'
  },
  
  // Barvy pro stavy
  STATUS: {
    SUCCESS: '#27ae60',
    WARNING: '#f39c12',
    ERROR: '#e74c3c',
    INFO: '#3498db'
  }
};

// Nastavení kamery
export const CAMERA = {
  DEFAULT_POSITION: { x: 0, y: 0, z: 5 },
  DEFAULT_ROTATION: { x: -0.3, y: 0, z: 0 },
  DEFAULT_ZOOM: 1,
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 3,
  MOVE_SPEED: 0.5,
  ROTATE_SPEED: 0.1
};

// Nastavení renderování
export const RENDER = {
  FPS: 60,
  ANTI_ALIASING: true,
  SHADOWS: true,
  TEXTURE_QUALITY: 'high',
  MAX_DRAW_DISTANCE: 1000
};

// Nastavení osvětlení
export const LIGHTING = {
  AMBIENT: { color: '#ffffff', intensity: 0.4 },
  DIRECTIONAL: { 
    color: '#ffffff', 
    intensity: 0.8,
    direction: { x: 0.5, y: -1, z: -0.5 }
  },
  POINT_LIGHTS: [
    { position: { x: 0, y: 0, z: 10 }, color: '#ffffff', intensity: 1.0 },
    { position: { x: -5, y: -5, z: 5 }, color: '#ffccaa', intensity: 0.5 },
    { position: { x: 5, y: 5, z: 5 }, color: '#aaccff', intensity: 0.5 }
  ]
};

// Nastavení materiálů
export const MATERIALS = {
  CONCRETE: { color: '#C0C0C0', shininess: 0.1, texture: 'concrete' },
  BRICK: { color: '#CD853F', shininess: 0.2, texture: 'brick' },
  METAL: { color: '#A9A9A9', shininess: 0.8, texture: 'metal' },
  GLASS: { color: '#87CEEB', shininess: 0.9, transparency: 0.7, texture: 'glass' },
  STONE: { color: '#D2B48C', shininess: 0.1, texture: 'stone' },
  PLASTER: { color: '#F5F5DC', shininess: 0.2, texture: 'plaster' },
  GRASS: { color: '#228B22', shininess: 0.05, texture: 'grass' },
  TILE: { color: '#E0E0E0', shininess: 0.3, texture: 'tile' },
  WOOD: { color: '#8B4513', shininess: 0.2, texture: 'wood' }
};

// Nastavení vrstev
export const LAYERS = {
  TERRAIN: { id: 'terrain', name: 'Terén', visible: true, opacity: 1 },
  STREETS: { id: 'streets', name: 'Ulice', visible: true, opacity: 1 },
  BUILDINGS: { id: 'buildings', name: 'Budovy', visible: true, opacity: 1 },
  DISTRICTS: { id: 'districts', name: 'Čtvrti', visible: false, opacity: 0.7 },
  LABELS: { id: 'labels', name: 'Popisky', visible: true, opacity: 1 }
};

// Nastavení interakce
export const INTERACTION = {
  DRAG_SENSITIVITY: 0.01,
  ZOOM_SENSITIVITY: 0.1,
  CLICK_TOLERANCE: 20, // pixelů
  DOUBLE_CLICK_TIME: 300, // ms
  HOVER_DELAY: 100 // ms
};

// Nastavení dat
export const DATA = {
  MAX_BUILDINGS: 10000,
  MAX_STREETS: 1000,
  MAX_TERRAIN_POINTS: 100000,
  LOAD_CHUNK_SIZE: 1000
};

// Nastavení UI
export const UI = {
  ANIMATION_DURATION: 300, // ms
  TRANSITION_DURATION: 200, // ms
  MODAL_Z_INDEX: 1000,
  TOOLTIP_DELAY: 500, // ms
  SIDEBAR_WIDTH: 250, // px
  HEADER_HEIGHT: 60 // px
};

// Nastavení pro export/import
export const EXPORT = {
  VERSION: '1.0.0',
  FORMAT: 'json',
  COMPRESSION: true,
  MAX_FILE_SIZE: 10 // MB
};

// Texty a lokalizace
export const TEXT = {
  APP_NAME: '3D Vizualizace Havířova',
  APP_DESCRIPTION: 'Realistická 3D data města s interaktivní vizualizací',
  LOADING: 'Načítání...',
  ERROR: 'Chyba',
  NO_DATA: 'Žádná data k zobrazení',
  BUILDING: 'Budova',
  STREET: 'Ulice',
  DISTRICT: 'Čtvrť',
  HEIGHT: 'Výška',
  WIDTH: 'Šířka',
  DEPTH: 'Hloubka',
  FLOORS: 'Patra',
  YEAR_BUILT: 'Rok výstavby',
  TYPE: 'Typ',
  POPULATION: 'Obyvatel',
  AREA: 'Rozloha',
  DENSITY: 'Hustota zástavby'
};

// Klávesové zkratky
export const SHORTCUTS = {
  CAMERA: {
    MOVE_FORWARD: ['w', 'W', 'ArrowUp'],
    MOVE_BACKWARD: ['s', 'S', 'ArrowDown'],
    MOVE_LEFT: ['a', 'A', 'ArrowLeft'],
    MOVE_RIGHT: ['d', 'D', 'ArrowRight'],
    MOVE_UP: ['q', 'Q', 'PageUp'],
    MOVE_DOWN: ['e', 'E', 'PageDown'],
    RESET: ['r', 'R', 'Home'],
    ZOOM_IN: ['+', '='],
    ZOOM_OUT: ['-', '_']
  },
  VIEW: {
    TOGGLE_BUILDINGS: ['b', 'B'],
    TOGGLE_STREETS: ['u', 'U'],
    TOGGLE_TERRAIN: ['t', 'T'],
    TOGGLE_DISTRICTS: ['d', 'D'],
    TOGGLE_LABELS: ['l', 'L'],
    CYCLE_COLOR_MODE: ['c', 'C']
  }
};

export default {
  COLORS,
  CAMERA,
  RENDER,
  LIGHTING,
  MATERIALS,
  LAYERS,
  INTERACTION,
  DATA,
  UI,
  EXPORT,
  TEXT,
  SHORTCUTS
};
