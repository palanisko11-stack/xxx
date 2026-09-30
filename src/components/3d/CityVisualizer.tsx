import React, { useRef, useEffect, useState } from 'react';
import { havirovBuildings, havirovStreets, havirovTerrain, havirovDistricts, Building, Street, TerrainPoint, CityDistrict } from '../../data/havirovBuildings';

interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

interface CityVisualizerProps {
  width?: number;
  height?: number;
  showBuildings?: boolean;
  showStreets?: boolean;
  showTerrain?: boolean;
  showDistricts?: boolean;
  showLabels?: boolean;
  buildingColorMode?: 'realistic' | 'type' | 'height' | 'random';
  onBuildingClick?: (building: Building) => void;
  onDistrictClick?: (district: CityDistrict) => void;
}

const CityVisualizer: React.FC<CityVisualizerProps> = ({
  width = 1200,
  height = 800,
  showBuildings: initialShowBuildings = true,
  showStreets: initialShowStreets = true,
  showTerrain: initialShowTerrain = true,
  showDistricts: initialShowDistricts = false,
  showLabels: initialShowLabels = true,
  buildingColorMode: initialBuildingColorMode = 'realistic',
  onBuildingClick,
  onDistrictClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [camera, setCamera] = useState<CameraPosition>({ x: 0, y: 0, z: 5 });
  const [rotation, setRotation] = useState({ x: -0.3, y: 0, z: 0 });
  const [zoom, setZoom] = useState(1);
  const [hoveredBuilding, setHoveredBuilding] = useState<Building | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [animationFrameId, setAnimationFrameId] = useState<number | null>(null);
  
  // Lokální stavy pro ovládací panel
  const [localShowBuildings, setLocalShowBuildings] = useState(initialShowBuildings);
  const [localShowStreets, setLocalShowStreets] = useState(initialShowStreets);
  const [localShowTerrain, setLocalShowTerrain] = useState(initialShowTerrain);
  const [localShowDistricts, setLocalShowDistricts] = useState(initialShowDistricts);
  const [localShowLabels, setLocalShowLabels] = useState(initialShowLabels);
  const [localBuildingColorMode, setLocalBuildingColorMode] = useState<CityVisualizerProps['buildingColorMode']>(initialBuildingColorMode);

  // Barvy podle typu budovy
  const typeColors: Record<string, string> = {
    residential: '#FFD700',
    commercial: '#4682B4',
    industrial: '#8B4513',
    public: '#C4A484',
    religious: '#D2B48C',
    educational: '#CD853F',
    healthcare: '#FFFFFF'
  };

  // Barvy podle výšky
  const getHeightColor = (height: number): string => {
    if (height < 10) return '#A0A0A0';
    if (height < 20) return '#8080FF';
    if (height < 30) return '#6060FF';
    if (height < 40) return '#4040FF';
    return '#2020FF';
  };

  // Generování náhodné barvy
  const getRandomColor = (seed: string): string => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = (hash % 360) / 360;
    const s = 0.7 + (hash % 30) / 100;
    const l = 0.5 + (hash % 20) / 100;
    return `hsl(${h * 360}, ${s * 100}%, ${l * 100}%)`;
  };

  // Získání barvy budovy podle režimu
  const getBuildingColor = (building: Building): string => {
    switch (localBuildingColorMode) {
      case 'type':
        return typeColors[building.type] || '#CCCCCC';
      case 'height':
        return getHeightColor(building.dimensions.height);
      case 'random':
        return getRandomColor(building.id);
      case 'realistic':
      default:
        return building.color || '#CCCCCC';
    }
  };

  // Projekce 3D na 2D
  const project3D = (x: number, y: number, z: number, ctx: CanvasRenderingContext2D): { px: number; py: number; pz: number; visible: boolean } => {
    // Aplikace rotace
    let rx = x;
    let ry = y;
    let rz = z;
    
    // Rotace kolem osy X
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const ryNew = ry * cosX - rz * sinX;
    const rzNew = ry * sinX + rz * cosX;
    ry = ryNew;
    rz = rzNew;
    
    // Rotace kolem osy Y
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    const rxNew = rx * cosY + rz * sinY;
    const rzNew2 = -rx * sinY + rz * cosY;
    rx = rxNew;
    rz = rzNew2;
    
    // Rotace kolem osy Z
    const cosZ = Math.cos(rotation.z);
    const sinZ = Math.sin(rotation.z);
    const rxNew2 = rx * cosZ - ry * sinZ;
    const ryNew2 = rx * sinZ + ry * cosZ;
    rx = rxNew2;
    ry = ryNew2;
    
    // Posun kamery
    rx -= camera.x;
    ry -= camera.y;
    rz -= camera.z;
    
    // Perspektivní projekce
    const distance = 5;
    const factor = distance / (distance + rz);
    
    const px = rx * factor * zoom + width / 2;
    const py = ry * factor * zoom + height / 2;
    const pz = rz;
    
    // Kontrola viditelnosti (před kamerou)
    const visible = rz > -distance;
    
    return { px, py, pz, visible };
  };

  // Vykreslení budovy
  const drawBuilding = (ctx: CanvasRenderingContext2D, building: Building) => {
    const { x, y, z } = building.position;
    const { width: w, depth: d, height: h } = building.dimensions;
    
    const color = getBuildingColor(building);
    
    // 8 vrcholů kvádru
    const vertices = [
      // Přední stěna (dole)
      { x: x - w/2, y: y - d/2, z: z },
      { x: x + w/2, y: y - d/2, z: z },
      // Přední stěna (nahoře)
      { x: x - w/2, y: y - d/2, z: z + h },
      { x: x + w/2, y: y - d/2, z: z + h },
      // Zadní stěna (dole)
      { x: x - w/2, y: y + d/2, z: z },
      { x: x + w/2, y: y + d/2, z: z },
      // Zadní stěna (nahoře)
      { x: x - w/2, y: y + d/2, z: z + h },
      { x: x + w/2, y: y + d/2, z: z + h },
    ];
    
    // Projekce všech vrcholů
    const projected = vertices.map(v => project3D(v.x, v.y, v.z, ctx));
    
    // Zkontroluj, zda je budova viditelná
    const visible = projected.some(p => p.visible);
    if (!visible) return null;
    
    // Vykreslení stěn (jako polygonů)
    const faces = [
      // Přední stěna
      [0, 1, 3, 2],
      // Zadní stěna
      [4, 6, 7, 5],
      // Levá stěna
      [0, 2, 6, 4],
      // Pravá stěna
      [1, 5, 7, 3],
      // Horní stěna
      [2, 3, 7, 6],
      // Dolní stěna
      [0, 4, 5, 1]
    ];
    
    // Seřazení faceů podle hloubky (z-buffer)
    const sortedFaces = [...faces].sort((a, b) => {
      const aZ = projected[a[0]].pz;
      const bZ = projected[b[0]].pz;
      return bZ - aZ; // Vzdálenější se kreslí dříve
    });
    
    // Vykreslení každé stěny
    sortedFaces.forEach(face => {
      const points = face.map(idx => projected[idx]);
      
      // Zkontroluj, zda je face viditelný
      if (!points.every(p => p.visible)) return;
      
      ctx.beginPath();
      ctx.moveTo(points[0].px, points[0].py);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].px, points[i].py);
      }
      ctx.closePath();
      
      // Stínování podle hloubky
      const avgZ = points.reduce((sum, p) => sum + p.pz, 0) / points.length;
      const shade = Math.min(1, Math.max(0, (avgZ + 10) / 20));
      const shadedColor = adjustAlpha(color, shade * 0.8 + 0.2);
      
      ctx.fillStyle = shadedColor;
      ctx.fill();
      
      // Ohraničení
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });
    
    // Vykreslení popisku (pokud je povoleno)
    if (localShowLabels && building.name) {
      const center = projected[0];
      if (center.visible) {
        ctx.font = '10px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(building.name, center.px, center.py - 5);
      }
    }
    
    return {
      building,
      screenPosition: { x: projected[0].px, y: projected[0].py },
      visible: true
    };
  };

  // Vykreslení ulice
  const drawStreet = (ctx: CanvasRenderingContext2D, street: Street) => {
    if (street.path.length < 2) return;
    
    ctx.beginPath();
    
    let firstVisible = true;
    street.path.forEach((point, index) => {
      const projected = project3D(point.x, point.y, point.z, ctx);
      
      if (projected.visible) {
        if (firstVisible) {
          ctx.moveTo(projected.px, projected.py);
          firstVisible = false;
        } else {
          ctx.lineTo(projected.px, projected.py);
        }
      } else {
        firstVisible = true;
      }
    });
    
    ctx.strokeStyle = street.color;
    ctx.lineWidth = street.width * 0.1 * zoom;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Popisek ulice
    if (localShowLabels && street.name) {
      const middleIndex = Math.floor(street.path.length / 2);
      const middlePoint = street.path[middleIndex];
      const projected = project3D(middlePoint.x, middlePoint.y, middlePoint.z, ctx);
      
      if (projected.visible) {
        ctx.font = '9px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(street.name, projected.px, projected.py - 3);
      }
    }
  };

  // Vykreslení terénu
  const drawTerrain = (ctx: CanvasRenderingContext2D) => {
    // Vytvoření gridu pro terén
    const gridSize = 20;
    const step = 0.5;
    
    for (let x = -gridSize; x <= gridSize; x += step) {
      for (let y = -gridSize; y <= gridSize; y += step) {
        // Nalezení výšky v terénních datech
        const terrainPoint = havirovTerrain.find(
          p => Math.abs(p.x - x) < 0.1 && Math.abs(p.y - y) < 0.1
        );
        
        const z = terrainPoint ? terrainPoint.elevation : 0;
        
        const projected = project3D(x, y, z, ctx);
        
        if (projected.visible) {
          // Barva terénu podle výšky
          const height = z * 100; // Převod zpět na metry
          let color;
          if (height < 255) color = '#228B22'; // Zelená - nížiny
          else if (height < 270) color = '#32CD32';
          else if (height < 285) color = '#9ACD32';
          else color = '#ADFF2F'; // Světlejší zelená - vyše
          
          ctx.fillStyle = color;
          ctx.fillRect(projected.px - 1, projected.py - 1, 2, 2);
        }
      }
    }
  };

  // Vykreslení čtvrti
  const drawDistrict = (ctx: CanvasRenderingContext2D, district: CityDistrict) => {
    const { x, y } = district.center;
    const size = Math.sqrt(district.area) * 2;
    
    // Vykreslení kruhu představujícího čtvrť
    const projected = project3D(x, y, 0, ctx);
    
    if (projected.visible) {
      ctx.beginPath();
      ctx.arc(projected.px, projected.py, size * 10 * zoom, 0, Math.PI * 2);
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Popisek čtvrti
      if (localShowLabels) {
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#FF0000';
        ctx.textAlign = 'center';
        ctx.fillText(district.name, projected.px, projected.py - 15);
      }
    }
  };

  // Úprava alfa kanálu barvy
  const adjustAlpha = (color: string, alpha: number): string => {
    // Konverze hex na RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Hlavní vykreslovací funkce
  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Vyčištění plátna
    ctx.clearRect(0, 0, width, height);
    
    // Nastavení pozadí
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB'); // Světle modrá - obloha
    gradient.addColorStop(1, '#E0F7FF'); // Ještě světlejší modrá
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Vykreslení terénu (jako první)
    if (localShowTerrain) {
      drawTerrain(ctx);
    }
    
    // Vykreslení ulic
    if (localShowStreets) {
      havirovStreets.forEach(street => drawStreet(ctx, street));
    }
    
    // Vykreslení budov
    const buildingResults: any[] = [];
    if (localShowBuildings) {
      havirovBuildings.forEach(building => {
        const result = drawBuilding(ctx, building);
        if (result) {
          buildingResults.push(result);
        }
      });
    }
    
    // Vykreslení čtvrti
    if (localShowDistricts) {
      havirovDistricts.forEach(district => drawDistrict(ctx, district));
    }
    
    // Vykreslení označené budovy
    if (hoveredBuilding) {
      const projected = project3D(
        hoveredBuilding.position.x,
        hoveredBuilding.position.y,
        hoveredBuilding.position.z,
        ctx
      );
      
      if (projected.visible) {
        ctx.beginPath();
        ctx.arc(projected.px, projected.py, 10, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFFF00';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Vykreslení tooltipu
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(projected.px + 15, projected.py - 20, 200, 60);
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(projected.px + 15, projected.py - 20, 200, 60);
        
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.fillText(hoveredBuilding.name, projected.px + 20, projected.py - 5);
        ctx.font = '10px Arial';
        ctx.fillText(`Výška: ${hoveredBuilding.dimensions.height}m`, projected.px + 20, projected.py + 10);
        ctx.fillText(`Typ: ${hoveredBuilding.type}`, projected.px + 20, projected.py + 25);
      }
    }
    
    // Vykreslení informací o kamerě
    ctx.font = '10px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.fillText(`Pozice: (${camera.x.toFixed(1)}, ${camera.y.toFixed(1)}, ${camera.z.toFixed(1)})`, 10, 20);
    ctx.fillText(`Rotace: (${(rotation.x * 180 / Math.PI).toFixed(1)}°, ${(rotation.y * 180 / Math.PI).toFixed(1)}°, ${(rotation.z * 180 / Math.PI).toFixed(1)}°)`, 10, 35);
    ctx.fillText(`Zoom: ${(zoom * 100).toFixed(0)}%`, 10, 50);
    ctx.fillText(`Budov: ${havirovBuildings.length}`, 10, 65);
    ctx.fillText(`Ulic: ${havirovStreets.length}`, 10, 80);
  };

  // Animace
  useEffect(() => {
    const animate = () => {
      drawScene();
      setAnimationFrameId(requestAnimationFrame(animate));
    };
    
    const frameId = requestAnimationFrame(animate);
    setAnimationFrameId(frameId);
    
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [camera, rotation, zoom, localBuildingColorMode, localShowBuildings, localShowStreets, localShowTerrain, localShowDistricts, localShowLabels]);

  // Ovládání myši
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      
      setRotation(prev => ({
        ...prev,
        y: prev.y + dx * 0.01,
        x: prev.x + dy * 0.01
      }));
      
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.min(Math.max(prev * delta, 0.1), 3));
    };
    
    const handleMouseLeave = () => {
      setHoveredBuilding(null);
    };
    
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDragging, lastMousePos, rotation]);

  // Detekce kliknutí na budovu
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Získání 3D pozice z 2D souřadnic
      // Jednoduchá detekce - zkontrolujeme všechny budovy
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      havirovBuildings.forEach(building => {
        const { x, y, z } = building.position;
        const projected = project3D(x, y, z, ctx);
        
        if (projected.visible) {
          const distance = Math.sqrt(
            Math.pow(mouseX - projected.px, 2) + 
            Math.pow(mouseY - projected.py, 2)
          );
          
          if (distance < 20) {
            setSelectedBuilding(building);
            if (onBuildingClick) {
              onBuildingClick(building);
            }
          }
        }
      });
    };
    
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [onBuildingClick]);

  // Klávesové ovládání
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const moveSpeed = 0.5;
      const rotateSpeed = 0.1;
      
      switch (e.key) {
        case 'w':
          setCamera(prev => ({ ...prev, z: prev.z - moveSpeed }));
          break;
        case 's':
          setCamera(prev => ({ ...prev, z: prev.z + moveSpeed }));
          break;
        case 'a':
          setCamera(prev => ({ ...prev, x: prev.x - moveSpeed }));
          break;
        case 'd':
          setCamera(prev => ({ ...prev, x: prev.x + moveSpeed }));
          break;
        case 'ArrowUp':
          setCamera(prev => ({ ...prev, y: prev.y - moveSpeed }));
          break;
        case 'ArrowDown':
          setCamera(prev => ({ ...prev, y: prev.y + moveSpeed }));
          break;
        case 'q':
          setRotation(prev => ({ ...prev, z: prev.z - rotateSpeed }));
          break;
        case 'e':
          setRotation(prev => ({ ...prev, z: prev.z + rotateSpeed }));
          break;
        case 'r':
          // Reset kamery
          setCamera({ x: 0, y: 0, z: 5 });
          setRotation({ x: -0.3, y: 0, z: 0 });
          setZoom(1);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ 
          background: 'linear-gradient(to bottom, #87CEEB, #E0F7FF)',
          cursor: isDragging ? 'grabbing' : 'grab',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      
      {/* Ovládací panel */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '10px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '12px', marginBottom: '5px' }}>
          <strong>Ovládání:</strong>
        </div>
        <div style={{ fontSize: '10px', color: '#666' }}>
          <div>W/S: Pohyb vpřed/vzad</div>
          <div>A/D: Pohyb vlevo/vpravo</div>
          <div>Šipky: Pohyb nahoru/dolů</div>
          <div>Q/E: Rotace</div>
          <div>R: Reset pohledu</div>
          <div>Myš: Otáčení</div>
          <div>Kolečko: Zoom</div>
        </div>
      </div>
      
      {/* Panel s informacemi o vybrané budově */}
      {selectedBuilding && (
        <div style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '15px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          maxWidth: '300px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
            {selectedBuilding.name}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <div><strong>Typ:</strong> {selectedBuilding.type}</div>
            <div><strong>Výška:</strong> {selectedBuilding.dimensions.height}m</div>
            <div><strong>Šířka:</strong> {selectedBuilding.dimensions.width}m</div>
            <div><strong>Hloubka:</strong> {selectedBuilding.dimensions.depth}m</div>
            <div><strong>Patra:</strong> {selectedBuilding.floors}</div>
            {selectedBuilding.yearBuilt && (
              <div><strong>Rok výstavby:</strong> {selectedBuilding.yearBuilt}</div>
            )}
            {selectedBuilding.description && (
              <div style={{ marginTop: '5px', fontStyle: 'italic' }}>
                {selectedBuilding.description}
              </div>
            )}
          </div>
          <button
            onClick={() => setSelectedBuilding(null)}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              background: '#ccc',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Zavřít
          </button>
        </div>
      )}
      
      {/* Panel s nastavením zobrazení */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '10px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '12px', marginBottom: '5px' }}>
          <strong>Zobrazení:</strong>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '10px', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={localShowBuildings}
              onChange={(e) => setLocalShowBuildings(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Budovy
          </label>
          <label style={{ fontSize: '10px', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={localShowStreets}
              onChange={(e) => setLocalShowStreets(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Ulice
          </label>
          <label style={{ fontSize: '10px', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={localShowTerrain}
              onChange={(e) => setLocalShowTerrain(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Terén
          </label>
          <label style={{ fontSize: '10px', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={localShowDistricts}
              onChange={(e) => setLocalShowDistricts(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Čtvrti
          </label>
          <label style={{ fontSize: '10px', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={localShowLabels}
              onChange={(e) => setLocalShowLabels(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Popisky
          </label>
        </div>
        <div style={{ marginTop: '10px' }}>
          <select
            value={localBuildingColorMode}
            onChange={(e) => setLocalBuildingColorMode(e.target.value as 'realistic' | 'type' | 'height' | 'random')}
            style={{ fontSize: '10px', padding: '3px' }}
          >
            <option value="realistic">Realistické</option>
            <option value="type">Podle typu</option>
            <option value="height">Podle výšky</option>
            <option value="random">Náhodné</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Export typů
export type { CityVisualizerProps };

export default CityVisualizer;
