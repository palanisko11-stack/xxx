import React, { useState } from 'react';
import CityVisualizer from './components/3d/CityVisualizer';
import { havirovBuildings, havirovDistricts, Building, CityDistrict } from './data/havirovBuildings';
import { motion, AnimatePresence } from 'motion/react';

const HavirovApp: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [activeTab, setActiveTab] = useState<'city' | 'stats' | 'info'>('city');

  // Statistiky města
  const cityStats = {
    name: 'Havířov',
    population: 70500,
    area: 32.15, // km²
    elevation: 250, // m n.m.
    founded: 1955,
    districts: havirovDistricts.length,
    buildings: havirovBuildings.length,
    density: 2192, // obyvatel/km²
    nickname: 'Město zelené uhlí'
  };

  // Typy budov a jejich počty
  const buildingTypeStats = havirovBuildings.reduce((acc, building) => {
    acc[building.type] = (acc[building.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Průměrná výška budov podle typu
  const avgHeightByType = havirovBuildings.reduce((acc, building) => {
    if (!acc[building.type]) {
      acc[building.type] = { total: 0, count: 0 };
    }
    acc[building.type].total += building.dimensions.height;
    acc[building.type].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  Object.keys(avgHeightByType).forEach(type => {
    avgHeightByType[type].total = avgHeightByType[type].total / avgHeightByType[type].count;
  });

  // Nejvyšší budovy
  const tallestBuildings = [...havirovBuildings]
    .sort((a, b) => b.dimensions.height - a.dimensions.height)
    .slice(0, 5);

  // Nejstarší a nejnovější budovy
  const buildingsWithYear = havirovBuildings.filter(b => b.yearBuilt);
  const oldestBuilding = buildingsWithYear.length > 0 ? 
    [...buildingsWithYear].sort((a, b) => (a.yearBuilt || 0) - (b.yearBuilt || 0))[0] : null;
  const newestBuilding = buildingsWithYear.length > 0 ?
    [...buildingsWithYear].sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0))[0] : null;

  const handleBuildingClick = (building: Building) => {
    setSelectedBuilding(building);
    setActiveTab('city');
  };

  const handleDistrictClick = (district: CityDistrict) => {
    setSelectedDistrict(district);
    setActiveTab('city');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          color: '#2c3e50',
          margin: 0,
          fontSize: '2.5em',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <span>🏙️</span>
          3D Vizualizace Havířova
        </h1>
        <p style={{
          color: '#7f8c8d',
          margin: '10px 0 0 0',
          fontSize: '1.1em'
        }}>
          Realistická 3D data města s interaktivní vizualizací
        </p>
      </header>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('city')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'city' ? '#3498db' : '#ecf0f1',
            color: activeTab === 'city' ? 'white' : '#2c3e50',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'city' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          3D Město
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'stats' ? '#3498db' : '#ecf0f1',
            color: activeTab === 'stats' ? 'white' : '#2c3e50',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'stats' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          Statistiky
        </button>
        <button
          onClick={() => setActiveTab('info')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'info' ? '#3498db' : '#ecf0f1',
            color: activeTab === 'info' ? 'white' : '#2c3e50',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'info' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          Informace
        </button>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'city' && (
          <motion.div
            key="city"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <CityVisualizer
                width={window.innerWidth - 60}
                height={window.innerHeight - 300}
                showBuildings={true}
                showStreets={true}
                showTerrain={true}
                showDistricts={false}
                showLabels={true}
                buildingColorMode="realistic"
                onBuildingClick={handleBuildingClick}
                onDistrictClick={handleDistrictClick}
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h2 style={{ color: '#2c3e50', marginTop: 0 }}>Statistiky města Havířov</h2>
            
            {/* Základní statistiky */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2em', marginBottom: '5px' }}>👥</div>
                <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{cityStats.population.toLocaleString()}</div>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Obyvatel</div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                padding: '20px',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2em', marginBottom: '5px' }}>📏</div>
                <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{cityStats.area} km²</div>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Rozloha</div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                padding: '20px',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2em', marginBottom: '5px' }}>🏘️</div>
                <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{cityStats.districts}</div>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Čtvrti</div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                padding: '20px',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2em', marginBottom: '5px' }}>🏗️</div>
                <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{cityStats.buildings}</div>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Budov</div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                padding: '20px',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2em', marginBottom: '5px' }}>📊</div>
                <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{cityStats.density}</div>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>ob/km²</div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                padding: '20px',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2em', marginBottom: '5px' }}>🎯</div>
                <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{cityStats.elevation}m</div>
                <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Nadmořská výška</div>
              </div>
            </div>

            {/* Typy budov */}
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#2c3e50', marginTop: 0 }}>Typy budov</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px'
              }}>
                {Object.entries(buildingTypeStats).map(([type, count]) => (
                  <div key={type} style={{
                    background: 'white',
                    padding: '15px',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '1.5em',
                      marginBottom: '5px',
                      color: '#3498db'
                    }}>
                      {getTypeIcon(type)}
                    </div>
                    <div style={{
                      fontSize: '1.2em',
                      fontWeight: 'bold',
                      color: '#2c3e50'
                    }}>
                      {count}
                    </div>
                    <div style={{
                      fontSize: '0.85em',
                      color: '#7f8c8d'
                    }}>
                      {getTypeName(type)}
                    </div>
                    <div style={{
                      fontSize: '0.75em',
                      color: '#95a5a6',
                      marginTop: '5px'
                    }}>
                      Prům. výška: {avgHeightByType[type]?.total.toFixed(1)}m
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nejvyšší budovy */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h3 style={{ color: '#2c3e50', marginTop: 0 }}>Nejvyšší budovy</h3>
                <ol style={{ paddingLeft: '20px' }}>
                  {tallestBuildings.map((building, index) => (
                    <li key={building.id} style={{
                      marginBottom: '10px',
                      padding: '8px',
                      background: index === 0 ? '#fff3cd' : 'white',
                      borderRadius: '4px'
                    }}>
                      <strong>{building.name}</strong> - {building.dimensions.height}m
                      <div style={{ fontSize: '0.85em', color: '#7f8c8d' }}>
                        {building.type} • {building.floors} pater
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h3 style={{ color: '#2c3e50', marginTop: 0 }}>Historické mezníky</h3>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontWeight: 'bold' }}>Nejstarší budova:</div>
                  {oldestBuilding ? (
                    <div style={{ padding: '8px', background: 'white', borderRadius: '4px' }}>
                      <strong>{oldestBuilding.name}</strong>
                      <div style={{ fontSize: '0.85em', color: '#7f8c8d' }}>
                        {oldestBuilding.yearBuilt} • {oldestBuilding.type}
                      </div>
                    </div>
                  ) : (
                    <div>Nenalezeno</div>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Nejnovější budova:</div>
                  {newestBuilding ? (
                    <div style={{ padding: '8px', background: 'white', borderRadius: '4px' }}>
                      <strong>{newestBuilding.name}</strong>
                      <div style={{ fontSize: '0.85em', color: '#7f8c8d' }}>
                        {newestBuilding.yearBuilt} • {newestBuilding.type}
                      </div>
                    </div>
                  ) : (
                    <div>Nenalezeno</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'info' && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h2 style={{ color: '#2c3e50', marginTop: 0 }}>O městě Havířov</h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <h3>Základní informace</h3>
                <p style={{ lineHeight: '1.6', color: '#34495e' }}>
                  Havířov je statutární město v Moravskoslezském kraji, které vzniklo v roce 1955 
                  sloučením několika obcí. Město je známé svou průmyslovou historií, zejména těžbou 
                  černého uhlí, která významně ovlivnila jeho rozvoj.
                </p>
                <p style={{ lineHeight: '1.6', color: '#34495e' }}>
                  Dnes je Havířov moderním městem s bohatou historií, rozvinutou infrastrukturou 
                  a příjemným životním prostředím. Město se nachází v údolí řeky Lučiny a je obklopeno 
                  zelenými kopci Beskyd.
                </p>
              </div>
              
              <div>
                <h3>Geografická poloha</h3>
                <p style={{ lineHeight: '1.6', color: '#34495e' }}>
                  <strong>Souřadnice:</strong> 49°46′N 18°25′E<br />
                  <strong>Nadmořská výška:</strong> {cityStats.elevation} m<br />
                  <strong>Rozloha:</strong> {cityStats.area} km²<br />
                  <strong>Okres:</strong> Karviná<br />
                  <strong>Kraj:</strong> Moravskoslezský
                </p>
                <p style={{ lineHeight: '1.6', color: '#34495e' }}>
                  Havířov sousedí s městy: Ostrava, Karviná, Orlová, Český Těšín a polským městem 
                  Cieszyn.
                </p>
              </div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3>Historie</h3>
              <p style={{ lineHeight: '1.6', color: '#34495e' }}>
                Historie Havířova sahá až do 13. století, kdy na jeho území vznikly první osady. 
                Moderní dějiny města jsou však spojeny především s průmyslovou revolucí a těžbou 
                uhlí v 19. a 20. století.
              </p>
              <ul style={{ lineHeight: '1.8', color: '#34495e' }}>
                <li><strong>1955:</strong> Vznik města Havířova sloučením obcí</li>
                <li><strong>1960:</strong> Havířov získává statut města</li>
                <li><strong>1970-1980:</strong> Rozvoj panelové výstavby</li>
                <li><strong>1990:</strong> Restrukturalizace průmyslu po sametové revoluci</li>
                <li><strong>2000:</strong> Modernizace města a rozvoj služeb</li>
              </ul>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h3>Zajímavosti</h3>
                <ul style={{ lineHeight: '1.8', color: '#34495e', paddingLeft: '20px' }}>
                  <li>Havířov je 6. největší město v kraji</li>
                  <li>Město má vlastní letiště</li>
                  <li>Nachází se zde největší nákupní centrum v regionu</li>
                  <li>Havířov má bohatou sportovní tradici</li>
                </ul>
              </div>
              
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h3>Památky a zajímavá místa</h3>
                <ul style={{ lineHeight: '1.8', color: '#34495e', paddingLeft: '20px' }}>
                  <li>Kostel sv. Anny</li>
                  <li>Kostel Panny Marie</li>
                  <li>Kulturní dům Radost</li>
                  <li>Městský stadion</li>
                  <li>Zimní stadion</li>
                  <li>Bývalý důl Šumbark</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer style={{
        marginTop: '20px',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '0.9em'
      }}>
        <p>3D Vizualizace Havířova | Realistická data města | {new Date().getFullYear()}</p>
      </footer>

      {/* Selected Building Modal */}
      <AnimatePresence>
        {selectedBuilding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setSelectedBuilding(null)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '8px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ color: '#2c3e50', marginTop: 0 }}>{selectedBuilding.name}</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Typ:</div>
                  <div>{getTypeName(selectedBuilding.type)}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Výška:</div>
                  <div>{selectedBuilding.dimensions.height}m</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Šířka:</div>
                  <div>{selectedBuilding.dimensions.width}m</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Hloubka:</div>
                  <div>{selectedBuilding.dimensions.depth}m</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Patra:</div>
                  <div>{selectedBuilding.floors}</div>
                </div>
                {selectedBuilding.yearBuilt && (
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Rok výstavby:</div>
                    <div>{selectedBuilding.yearBuilt}</div>
                  </div>
                )}
              </div>
              {selectedBuilding.description && (
                <div style={{
                  background: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '6px',
                  marginBottom: '20px'
                }}>
                  <strong>Popis:</strong>
                  <p style={{ margin: '10px 0 0 0' }}>{selectedBuilding.description}</p>
                </div>
              )}
              <button
                onClick={() => setSelectedBuilding(null)}
                style={{
                  padding: '10px 20px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1em'
                }}
              >
                Zavřít
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected District Modal */}
      <AnimatePresence>
        {selectedDistrict && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setSelectedDistrict(null)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '8px',
                maxWidth: '500px',
                width: '90%'
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ color: '#2c3e50', marginTop: 0 }}>{selectedDistrict.name}</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Rozloha:</div>
                  <div>{selectedDistrict.area} km²</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Obyvatel:</div>
                  <div>{selectedDistrict.population.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Hustota zástavby:</div>
                  <div>{(selectedDistrict.buildingDensity * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Prům. výška budov:</div>
                  <div>{selectedDistrict.averageBuildingHeight}m</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDistrict(null)}
                style={{
                  padding: '10px 20px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1em'
                }}
              >
                Zavřít
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Pomocné funkce
function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    residential: '🏠',
    commercial: '🏪',
    industrial: '🏭',
    public: '🏛️',
    religious: '⛪',
    educational: '🎓',
    healthcare: '🏥'
  };
  return icons[type] || '🏗️';
}

function getTypeName(type: string): string {
  const names: Record<string, string> = {
    residential: 'Bytové domy',
    commercial: 'Obchodní',
    industrial: 'Průmyslové',
    public: 'Veřejné budovy',
    religious: 'Náboženské',
    educational: 'Vzdělávací',
    healthcare: 'Zdravotnická'
  };
  return names[type] || type;
}

export default HavirovApp;
