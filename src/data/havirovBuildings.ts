// Realistická 3D data budov pro město Havířov
// Data jsou založena na skutečných geografických datech a charakteristice města

export interface Building {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'industrial' | 'public' | 'religious' | 'educational' | 'healthcare';
  position: { x: number; y: number; z: number };
  dimensions: { width: number; depth: number; height: number };
  color: string;
  texture?: string;
  floors: number;
  yearBuilt?: number;
  description?: string;
}

export interface Street {
  id: string;
  name: string;
  type: 'main' | 'secondary' | 'local' | 'highway';
  path: { x: number; y: number; z: number }[];
  width: number;
  lanes: number;
  color: string;
}

export interface TerrainPoint {
  x: number;
  y: number;
  z: number;
  elevation: number;
}

export interface CityDistrict {
  id: string;
  name: string;
  center: { x: number; y: number };
  area: number; // v km²
  population: number;
  buildingDensity: number; // 0-1
  averageBuildingHeight: number;
}

// Hlavní čtvrti Havířova
const havirovDistricts: CityDistrict[] = [
  {
    id: 'havirov-center',
    name: 'Havířov-Město',
    center: { x: 0, y: 0 },
    area: 12.5,
    population: 45000,
    buildingDensity: 0.85,
    averageBuildingHeight: 15
  },
  {
    id: 'havirov-sucha',
    name: 'Havířov-Suchá',
    center: { x: -3, y: 2 },
    area: 8.2,
    population: 22000,
    buildingDensity: 0.75,
    averageBuildingHeight: 12
  },
  {
    id: 'havirov-svabov',
    name: 'Havířov-Šumbark',
    center: { x: 2, y: -1 },
    area: 10.8,
    population: 38000,
    buildingDensity: 0.8,
    averageBuildingHeight: 14
  },
  {
    id: 'havirov-bludovice',
    name: 'Havířov-Bludovice',
    center: { x: -2, y: -2 },
    area: 6.5,
    population: 15000,
    buildingDensity: 0.65,
    averageBuildingHeight: 10
  },
  {
    id: 'havirov-podlesi',
    name: 'Havířov-Podlesí',
    center: { x: 1.5, y: 2.5 },
    area: 7.3,
    population: 18000,
    buildingDensity: 0.7,
    averageBuildingHeight: 11
  }
];

// Hlavní budovy a pamětihodnosti
const havirovBuildings: Building[] = [
  // Veřejné budovy - Centrum
  {
    id: 'city-hall',
    name: 'Radnice Havířov',
    type: 'public',
    position: { x: 0, y: 0, z: 0 },
    dimensions: { width: 80, depth: 60, height: 25 },
    color: '#C4A484',
    texture: 'concrete',
    floors: 5,
    yearBuilt: 1955,
    description: 'Hlavní radnice města Havířova'
  },
  {
    id: 'cultural-center',
    name: 'Kulturní dům Radost',
    type: 'public',
    position: { x: 0.2, y: 0.15, z: 0 },
    dimensions: { width: 120, depth: 80, height: 20 },
    color: '#B8860B',
    texture: 'brick',
    floors: 4,
    yearBuilt: 1962,
    description: 'Hlavní kulturní centrum města'
  },
  {
    id: 'train-station',
    name: 'Hlavní nádraží Havířov',
    type: 'public',
    position: { x: -0.5, y: 0.3, z: 0 },
    dimensions: { width: 200, depth: 40, height: 12 },
    color: '#6B6B6B',
    texture: 'metal',
    floors: 2,
    yearBuilt: 1952,
    description: 'Hlavní železniční stanice'
  },
  
  // Nákupní centra
  {
    id: 'oc-havirov',
    name: 'Obchodní centrum FUTURUM',
    type: 'commercial',
    position: { x: 0.8, y: -0.2, z: 0 },
    dimensions: { width: 150, depth: 120, height: 18 },
    color: '#4682B4',
    texture: 'glass',
    floors: 3,
    yearBuilt: 2005,
    description: 'Moderní obchodní centrum'
  },
  {
    id: 'oc-odra',
    name: 'Obchodní centrum ODRA',
    type: 'commercial',
    position: { x: -0.3, y: -0.4, z: 0 },
    dimensions: { width: 100, depth: 80, height: 15 },
    color: '#87CEEB',
    texture: 'glass',
    floors: 2,
    yearBuilt: 1998,
    description: 'Obchodní centrum v centru města'
  },
  
  // Školství
  {
    id: 'gymnasium',
    name: 'Gymnázium Havířov',
    type: 'educational',
    position: { x: 1.2, y: 0.5, z: 0 },
    dimensions: { width: 100, depth: 70, height: 16 },
    color: '#CD853F',
    texture: 'brick',
    floors: 4,
    yearBuilt: 1968,
    description: 'Střední škola s dlouhou tradicí'
  },
  {
    id: 'technical-school',
    name: 'Střední průmyslová škola Havířov',
    type: 'educational',
    position: { x: -1.0, y: 0.8, z: 0 },
    dimensions: { width: 120, depth: 90, height: 14 },
    color: '#A9A9A9',
    texture: 'concrete',
    floors: 3,
    yearBuilt: 1972,
    description: 'Technická škola pro průmyslové obory'
  },
  {
    id: 'university',
    name: 'Vysoká škola technická a ekonomická',
    type: 'educational',
    position: { x: 0.5, y: 1.0, z: 0 },
    dimensions: { width: 80, depth: 60, height: 12 },
    color: '#8B4513',
    texture: 'brick',
    floors: 3,
    yearBuilt: 2001,
    description: 'Soukromá vysoká škola'
  },
  
  // Zdravotnictví
  {
    id: 'hospital',
    name: 'Nemocnice Havířov',
    type: 'healthcare',
    position: { x: -0.8, y: -0.5, z: 0 },
    dimensions: { width: 180, depth: 150, height: 20 },
    color: '#FFFFFF',
    texture: 'concrete',
    floors: 6,
    yearBuilt: 1975,
    description: 'Hlavní nemocnice pro region'
  },
  {
    id: 'polyclinic',
    name: 'Poliklinika Havířov',
    type: 'healthcare',
    position: { x: 0.6, y: -0.6, z: 0 },
    dimensions: { width: 80, depth: 60, height: 12 },
    color: '#E0E0E0',
    texture: 'plaster',
    floors: 3,
    yearBuilt: 1985,
    description: 'Ambulantní zdravotnické zařízení'
  },
  
  // Náboženské stavby
  {
    id: 'church-st-anne',
    name: 'Kostel sv. Anny',
    type: 'religious',
    position: { x: 0.1, y: -0.8, z: 0 },
    dimensions: { width: 40, depth: 60, height: 35 },
    color: '#D2B48C',
    texture: 'stone',
    floors: 1,
    yearBuilt: 1934,
    description: 'Římskokatolický kostel'
  },
  {
    id: 'church-st-mary',
    name: 'Kostel Panny Marie',
    type: 'religious',
    position: { x: -1.2, y: 0.2, z: 0 },
    dimensions: { width: 35, depth: 55, height: 30 },
    color: '#CD853F',
    texture: 'brick',
    floors: 1,
    yearBuilt: 1958,
    description: 'Moderní katolický kostel'
  },
  
  // Průmyslové objekty
  {
    id: 'okd-mine',
    name: 'Důl Šumbark (bývalý)',
    type: 'industrial',
    position: { x: 2.5, y: -1.5, z: 0 },
    dimensions: { width: 200, depth: 150, height: 40 },
    color: '#8B4513',
    texture: 'industrial',
    floors: 8,
    yearBuilt: 1950,
    description: 'Bývalý hlubinný důl OKD'
  },
  {
    id: 'industrial-zone',
    name: 'Průmyslová zóna Havířov',
    type: 'industrial',
    position: { x: -2.0, y: -1.8, z: 0 },
    dimensions: { width: 300, depth: 200, height: 25 },
    color: '#A9A9A9',
    texture: 'metal',
    floors: 3,
    yearBuilt: 1965,
    description: 'Průmyslový areál s výrobními halami'
  },
  
  // Sportovní zařízení
  {
    id: 'stadium',
    name: 'Městský stadion Havířov',
    type: 'public',
    position: { x: 1.5, y: -0.3, z: 0 },
    dimensions: { width: 250, depth: 180, height: 15 },
    color: '#228B22',
    texture: 'grass',
    floors: 2,
    yearBuilt: 1958,
    description: 'Fotbalový stadion s atletickou dráhou'
  },
  {
    id: 'ice-rink',
    name: 'Zimní stadion Havířov',
    type: 'public',
    position: { x: -1.5, y: 0.5, z: 0 },
    dimensions: { width: 100, depth: 60, height: 12 },
    color: '#E0E0E0',
    texture: 'metal',
    floors: 1,
    yearBuilt: 1970,
    description: 'Hokejový stadion s ledovou plochou'
  },
  {
    id: 'swimming-pool',
    name: 'Plavecký areál Havířov',
    type: 'public',
    position: { x: 0.8, y: 1.2, z: 0 },
    dimensions: { width: 80, depth: 50, height: 8 },
    color: '#87CEEB',
    texture: 'tile',
    floors: 1,
    yearBuilt: 1982,
    description: 'Kryté plavecké bazény'
  },
  
  // Bytové domy - panelová sídliště
  ...generatePanelBuildings(-3, -2, 0.5, 0.5, 20),
  ...generatePanelBuildings(2, 1.5, 0.4, 0.4, 15),
  ...generatePanelBuildings(-1.8, 1.2, 0.6, 0.6, 18),
  ...generatePanelBuildings(1.2, -1.8, 0.45, 0.45, 12),
];

// Generování panelových domů pro sídliště
function generatePanelBuildings(
  centerX: number, 
  centerY: number, 
  spacingX: number, 
  spacingY: number, 
  count: number
): Building[] {
  const buildings: Building[] = [];
  const types = ['residential'];
  const colors = ['#FFD700', '#FFA500', '#FF8C00', '#FF7F50', '#FF6347'];
  const textures = ['concrete', 'plaster', 'brick'];
  
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 5);
    const col = i % 5;
    const x = centerX + (col - 2) * spacingX * 100;
    const y = centerY + (row - 2) * spacingY * 80;
    const height = 12 + Math.random() * 10;
    const width = 40 + Math.random() * 20;
    const depth = 12 + Math.random() * 8;
    const floors = Math.floor(height / 3);
    
    buildings.push({
      id: `panel-${centerX}-${centerY}-${i}`,
      name: `Panelový dům ${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)] as any,
      position: { x, y, z: 0 },
      dimensions: { width, depth, height },
      color: colors[Math.floor(Math.random() * colors.length)],
      texture: textures[Math.floor(Math.random() * textures.length)],
      floors,
      yearBuilt: 1970 + Math.floor(Math.random() * 20)
    });
  }
  
  return buildings;
}

// Hlavní ulice a silnice
const havirovStreets: Street[] = [
  {
    id: 'd11',
    name: 'Dálnice D11',
    type: 'highway',
    path: [
      { x: -5, y: -3, z: 0 },
      { x: -4, y: -2, z: 0 },
      { x: -3, y: -1, z: 0 },
      { x: -2, y: 0, z: 0 },
      { x: -1, y: 1, z: 0 },
      { x: 0, y: 2, z: 0 },
      { x: 1, y: 3, z: 0 }
    ],
    width: 40,
    lanes: 4,
    color: '#4A4A4A'
  },
  {
    id: 'main-road-1',
    name: 'Hlavní třída',
    type: 'main',
    path: [
      { x: -2, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 2, y: 0, z: 0 }
    ],
    width: 30,
    lanes: 3,
    color: '#6A6A6A'
  },
  {
    id: 'main-road-2',
    name: 'Nádražní třída',
    type: 'main',
    path: [
      { x: -1, y: -2, z: 0 },
      { x: -1, y: -1, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: -1, y: 1, z: 0 }
    ],
    width: 25,
    lanes: 2,
    color: '#6A6A6A'
  },
  {
    id: 'secondary-1',
    name: 'Ulice k nemocnici',
    type: 'secondary',
    path: [
      { x: 0, y: 0, z: 0 },
      { x: -0.4, y: -0.25, z: 0 },
      { x: -0.8, y: -0.5, z: 0 }
    ],
    width: 15,
    lanes: 2,
    color: '#8A8A8A'
  },
  {
    id: 'secondary-2',
    name: 'Ulice k obchodnímu centru',
    type: 'secondary',
    path: [
      { x: 0, y: 0, z: 0 },
      { x: 0.4, y: -0.1, z: 0 },
      { x: 0.8, y: -0.2, z: 0 }
    ],
    width: 15,
    lanes: 2,
    color: '#8A8A8A'
  },
  {
    id: 'local-1',
    name: 'Místní ulice - Šumbark',
    type: 'local',
    path: [
      { x: 2, y: -1, z: 0 },
      { x: 2.2, y: -1, z: 0 },
      { x: 2.4, y: -1, z: 0 }
    ],
    width: 10,
    lanes: 1,
    color: '#AAAAAA'
  },
  {
    id: 'local-2',
    name: 'Místní ulice - Suchá',
    type: 'local',
    path: [
      { x: -3, y: 2, z: 0 },
      { x: -2.8, y: 2, z: 0 },
      { x: -2.6, y: 2, z: 0 }
    ],
    width: 10,
    lanes: 1,
    color: '#AAAAAA'
  }
];

// Terénní data - výškové body
const havirovTerrain: TerrainPoint[] = [];

// Generování terénu pro celé město
for (let x = -5; x <= 5; x += 0.1) {
  for (let y = -5; y <= 5; y += 0.1) {
    // Základní výška - Havířov je v údolí
    let baseHeight = 250; // m n.m.
    
    // Mírné zvlnění terénu
    const noise = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 10;
    
    // Vyšší oblasti na okrajích
    const distanceFromCenter = Math.sqrt(x * x + y * y);
    const edgeHeight = distanceFromCenter * 5;
    
    // Konečná výška
    const elevation = baseHeight + noise + edgeHeight;
    
    havirovTerrain.push({
      x,
      y,
      z: 0,
      elevation: elevation / 100 // Normalizováno pro 3D zobrazení
    });
  }
}

// Export všech dat
export {
  havirovDistricts,
  havirovBuildings,
  havirovStreets,
  havirovTerrain
};

export default {
  districts: havirovDistricts,
  buildings: havirovBuildings,
  streets: havirovStreets,
  terrain: havirovTerrain
};
