# 3D Vizualizace Havířova

Realistická 3D vizualizace města Havířov s interaktivní mapou, podrobnými daty budov, ulic a terénu.

## 🚀 Rychlý start

### Instalace

```bash
npm install
```

### Spuštění vývojového serveru

```bash
npm run dev
```

Aplikace bude dostupná na `http://localhost:3000`

### Build pro produkci

```bash
npm run build
```

Výstup bude v adresáři `dist/`.

## 📁 Struktura projektu

```
palanisko11-stack__xxx/
├── src/
│   ├── HavirovApp.tsx          # Hlavní aplikace
│   ├── main.tsx               # Vstupní bod
│   ├── index.css              # Globální styly
│   ├── components/
│   │   └── 3d/
│   │       ├── CityVisualizer.tsx  # 3D vizualizační komponenta
│   │       └── index.ts
│   ├── data/
│   │   ├── havirovBuildings.ts  # Data budov, ulic, terénu
│   │   └── index.ts
│   ├── utils/
│   │   ├── 3dMath.ts           # 3D matematické funkce
│   │   └── index.ts
│   ├── types/
│   │   └── havirov.d.ts        # Typové definice
│   └── constants.ts            # Konstanty aplikace
├── dist/                      # Build výstup
├── package.json
├── vite.config.ts
└── README_HAVIROV.md
```

## 🎯 Funkce

### 3D Vizualizace
- **Interaktivní kamera**: Otáčení, zoom, posun myší a klávesnicí
- **Realistická data**: Více než 100 budov, 7 ulic, podrobný terén
- **Různé zobrazení**: Volba barevného režimu (realistický, podle typu, podle výšky, náhodný)
- **Vrstvy**: Zapínání/vypínání budov, ulic, terénu, čtvrti a popisků

### Data města Havířova
- **Čtvrti**: Havířov-Město, Suchá, Šumbark, Bludovice, Podlesí
- **Budovy**: Radnice, kostely, školy, nemocnice, obchodní centra, průmyslové objekty
- **Ulice**: Dálnice D11, hlavní třídy, místní ulice
- **Terén**: Výškové body s realistickým modelováním

### Statistiky
- Základní statistiky města (počet obyvatel, rozloha, hustota)
- Statistiky budov podle typu
- Nejvyšší, nejstarší a nejnovější budovy

### Informace
- Historie města
- Geografická poloha
- Zajímavá místa a památky

## 🎮 Ovládání

### Myš
- **Levé tlačítko + tah**: Otáčení kamery
- **Kolečko**: Zoom
- **Kliknutí na budovu**: Zobrazení detailů

### Klávesnice
- **W/S**: Pohyb vpřed/vzad
- **A/D**: Pohyb vlevo/vpravo
- **Šipky nahoru/dolů**: Pohyb nahoru/dolů
- **Q/E**: Rotace kolem osy Z
- **R**: Reset pohledu

## 📊 Data

### Čtvrti
| Název | Rozloha (km²) | Obyvatel | Hustota zástavby | Prům. výška budov |
|-------|---------------|----------|------------------|-------------------|
| Havířov-Město | 12.5 | 45,000 | 85% | 15m |
| Havířov-Suchá | 8.2 | 22,000 | 75% | 12m |
| Havířov-Šumbark | 10.8 | 38,000 | 80% | 14m |
| Havířov-Bludovice | 6.5 | 15,000 | 65% | 10m |
| Havířov-Podlesí | 7.3 | 18,000 | 70% | 11m |

### Typy budov
- **Bytové domy** (residential): Panelové sídliště
- **Obchodní** (commercial): Nákupní centra, obchody
- **Průmyslové** (industrial): Továrny, doly
- **Veřejné** (public): Radnice, kulturní domy, stadiony
- **Náboženské** (religious): Kostely
- **Vzdělávací** (educational): Školky, školy, vysoké školy
- **Zdravotnická** (healthcare): Nemocnice, polikliniky

## 🛠️ Technologie

- **React 19**: UI framework
- **TypeScript**: Typová bezpečnost
- **Vite**: Build tool
- **Canvas API**: 3D renderování
- **Motion**: Animace
- **Tailwind CSS**: Styly

## 📝 API

### CityVisualizer Props

```typescript
interface CityVisualizerProps {
  width?: number;           // Šířka plátna
  height?: number;          // Výška plátna
  showBuildings?: boolean;  // Zobrazit budovy
  showStreets?: boolean;    // Zobrazit ulice
  showTerrain?: boolean;    // Zobrazit terén
  showDistricts?: boolean;  // Zobrazit čtvrti
  showLabels?: boolean;     // Zobrazit popisky
  buildingColorMode?: 'realistic' | 'type' | 'height' | 'random'; // Režim barev
  onBuildingClick?: (building: Building) => void;  // Událost kliknutí na budovu
  onDistrictClick?: (district: CityDistrict) => void; // Událost kliknutí na čtvrť
}
```

### Data Structures

```typescript
// Budova
interface Building {
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

// Ulice
interface Street {
  id: string;
  name: string;
  type: 'main' | 'secondary' | 'local' | 'highway';
  path: { x: number; y: number; z: number }[];
  width: number;
  lanes: number;
  color: string;
}

// Čtvrť
interface CityDistrict {
  id: string;
  name: string;
  center: { x: number; y: number };
  area: number;
  population: number;
  buildingDensity: number;
  averageBuildingHeight: number;
}

// Terénní bod
interface TerrainPoint {
  x: number;
  y: number;
  z: number;
  elevation: number;
}
```

## 🎨 Customizace

### Přidání nové budovy

```typescript
// V souboru src/data/havirovBuildings.ts
const newBuilding: Building = {
  id: 'new-building',
  name: 'Nová budova',
  type: 'residential',
  position: { x: 1, y: 1, z: 0 },
  dimensions: { width: 50, depth: 30, height: 15 },
  color: '#FFD700',
  texture: 'brick',
  floors: 5,
  yearBuilt: 2024,
  description: 'Popis nové budovy'
};

// Přidat do pole havirovBuildings
havirovBuildings.push(newBuilding);
```

### Přidání nové ulice

```typescript
const newStreet: Street = {
  id: 'new-street',
  name: 'Nová ulice',
  type: 'secondary',
  path: [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 }
  ],
  width: 15,
  lanes: 2,
  color: '#8A8A8A'
};

// Přidat do pole havirovStreets
havirovStreets.push(newStreet);
```

## 📈 Výkon

- **Počet budov**: 100+ (včetně generovaných panelových domů)
- **Počet ulic**: 7 hlavní ulic + dálnice
- **Počet terénních bodů**: 10,000+
- **FPS**: 60+ (závisí na výkonu zařízení)
- **Velikost buildu**: ~360 KB (komprimováno: ~113 KB)

## 🔧 Řešení problémů

### Bílá obrazovka
- Zkontrolujte, zda je nainstalován Node.js
- Spusťte `npm install`
- Zkontrolujte konzoli pro chyby

### Nízký FPS
- Snižte počet zobrazených budov
- Vypněte terén a ulice
- Použijte nižší rozlišení

### Chyby TypeScript
- Spusťte `npx tsc --noEmit` pro zobrazení chyb
- Zkontrolujte typové definice

## 📚 Zdroje

- **Geografická data**: Založeno na veřejně dostupných datech města Havířov
- **Historická data**: Wikipedia, oficiální stránky města
- **3D algoritmy**: Vlastní implementace perspektivní projekce

## 🎯 Budoucí vylepšení

- [ ] WebGL renderování pro lepší výkon
- [ ] 3D modely budov s texturami
- [ ] Import/export dat ve formátu GeoJSON
- [ ] Podpora dalších měst
- [ ] Mobilní optimalizace
- [ ] VR podpora
- [ ] Real-time data (doprava, počasí)

## 📄 Licence

MIT License

## 🙏 Přispěvatelé

- palanisko11-stack: Hlavní vývojář

---

Vytvořeno s ❤️ pro město Havířov
