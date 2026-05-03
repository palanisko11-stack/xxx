import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Zap, 
  Activity, 
  Terminal as TerminalIcon, 
  Cpu, 
  Network, 
  Layers, 
  MessageSquare,
  ChevronRight,
  Info,
  ShieldAlert,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Module = 'network' | 'synapse' | 'anatomy' | 'protocol' | 'hardwired' | 'memory' | 'reconstruction' | 'surface';

interface Packet {
  id: string;
  type: 'excitatory' | 'inhibitory' | 'modulatory';
  payload: string;
  timestamp: number;
}

// --- Components ---

const NeuralNetworkVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const layers = [6, 12, 12, 12, 6];
    const nodes: { x: number; y: number; activation: number }[][] = [];
    const particles: any[] = [];

    const initNetwork = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = 400;
      const layerSpacing = canvas.width / (layers.length + 1);
      
      nodes.length = 0;
      for (let i = 0; i < layers.length; i++) {
        const x = layerSpacing * (i + 1);
        const nodeSpacing = canvas.height / (layers[i] + 1);
        nodes[i] = [];
        for (let j = 0; j < layers[i]; j++) {
          const y = nodeSpacing * (j + 1);
          nodes[i].push({ x, y, activation: 0 });
        }
      }
    };

    const createParticle = (layerIdx: number, nodeIdx: number) => {
      if (layerIdx >= layers.length - 1) return;
      const startNode = nodes[layerIdx][nodeIdx];
      const nextLayer = nodes[layerIdx + 1];
      nextLayer.forEach((targetNode, targetIdx) => {
        if (Math.random() > 0.7) { // Sparse firing
          particles.push({
            x: startNode.x,
            y: startNode.y,
            targetX: targetNode.x,
            targetY: targetNode.y,
            speed: 0.02 + Math.random() * 0.03,
            progress: 0,
            nextLayerIdx: layerIdx + 1,
            nextNodeIdx: targetIdx
          });
        }
      });
    };

    const triggerPulse = () => {
      setTokens(t => t + Math.floor(Math.random() * 50));
      for (let j = 0; j < layers[0]; j++) {
        createParticle(0, j);
      }
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length - 1; i++) {
        for (const n1 of nodes[i]) {
          for (const n2 of nodes[i+1]) {
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;
        const currentX = p.x + (p.targetX - p.x) * p.progress;
        const currentY = p.y + (p.targetY - p.y) * p.progress;

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 1.5, 0, Math.PI * 2);
        ctx.fill();

        if (p.progress >= 1) {
          nodes[p.nextLayerIdx][p.nextNodeIdx].activation = 1;
          if (Math.random() > 0.5) createParticle(p.nextLayerIdx, p.nextNodeIdx);
          particles.splice(i, 1);
        }
      }

      // Nodes
      nodes.forEach(layer => {
        layer.forEach(node => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = node.activation > 0 ? '#00e5ff' : '#1a2a3a';
          ctx.fill();
          if (node.activation > 0) node.activation -= 0.05;
        });
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    initNetwork();
    draw();
    const interval = setInterval(triggerPulse, 2000);

    const handleResize = () => initNetwork();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative bg-slate-950 rounded-xl border border-cyan-900/50 overflow-hidden p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Activity className="text-cyan-400 w-5 h-5" />
          <h3 className="font-mono text-cyan-100 uppercase tracking-wider">Neuronová inferenční linka</h3>
        </div>
        <div className="font-mono text-xs text-cyan-500">
          ZPRACOVANÉ TOKENY: <span className="text-cyan-300">{tokens}</span>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full h-[400px]" />
      <div className="mt-4 grid grid-cols-3 gap-4 text-[10px] font-mono text-cyan-600 uppercase">
        <div className="border border-cyan-900/30 p-2 rounded">Vrstva: Vstupní_vektor</div>
        <div className="border border-cyan-900/30 p-2 rounded">Vrstva: Latentní_prostor_H1-H3</div>
        <div className="border border-cyan-900/30 p-2 rounded">Vrstva: Výstupní_logity</div>
      </div>
    </div>
  );
};

const SynapticPacketMonitor = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const types: Packet['type'][] = ['excitatory', 'inhibitory', 'modulatory'];
    const payloads = {
        excitatory: 'UVOLNĚNÍ_GLUTAMÁTU_0x' + Math.random().toString(16).slice(2, 6),
        inhibitory: 'GABA_HYPERPOLARIZACE_0x' + Math.random().toString(16).slice(2, 6),
        modulatory: 'DOPAMINOVÝ_SIGNÁL_ODMĚNY_0x' + Math.random().toString(16).slice(2, 6)
      };
      const type = types[Math.floor(Math.random() * types.length)];
      
      const newPacket: Packet = {
        id: Math.random().toString(36).slice(2),
        type,
        payload: payloads[type],
        timestamp: Date.now()
      };
      
      setPackets(prev => [newPacket, ...prev].slice(0, 10));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 rounded-xl border border-purple-900/50 overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-purple-900/30 flex items-center gap-2 bg-purple-950/20">
        <Zap className="text-purple-400 w-5 h-5" />
        <h3 className="font-mono text-purple-100 uppercase tracking-wider">Sniffer paketů v synaptické štěrbině</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
        <AnimatePresence mode="popLayout">
          {packets.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-3 rounded border flex flex-col gap-1 ${
                p.type === 'excitatory' ? 'border-green-900/50 bg-green-950/10 text-green-400' :
                p.type === 'inhibitory' ? 'border-red-900/50 bg-red-950/10 text-red-400' :
                'border-yellow-900/50 bg-yellow-950/10 text-yellow-400'
              }`}
            >
              <div className="flex justify-between opacity-70">
                <span>ID: {p.id}</span>
                <span>{new Date(p.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="font-bold">TYP: {p.type === 'excitatory' ? 'EXCITAČNÍ' : p.type === 'inhibitory' ? 'INHIBIČNÍ' : 'MODULAČNÍ'}</div>
              <div className="text-[10px] break-all">OBSAH: {p.payload}</div>
              <div className="flex gap-2 mt-1">
                <div className="h-1 flex-1 bg-current opacity-20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.2 }}
                    className="h-full bg-current"
                  />
                </div>
                <span className="text-[8px] uppercase">Přenos...</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const BrainAnatomyExplorer = () => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const brainParts = [
    { id: 'frontal', name: 'Čelní lalok', color: 'bg-blue-500', desc: 'Generální ředitel: Plánování, osobnost a motorika.' },
    { id: 'parietal', name: 'Temenní lalok', color: 'bg-green-500', desc: 'Integrátor: Hmat, prostorové vnímání a navigace.' },
    { id: 'temporal', name: 'Spánkový lalok', color: 'bg-yellow-500', desc: 'Databáze: Sluch, jazyk a ukládání paměti.' },
    { id: 'occipital', name: 'Týlní lalok', color: 'bg-purple-500', desc: 'Grafický procesor: Vizuální zpracování a rozpoznávání vzorů.' },
    { id: 'cerebellum', name: 'Mozeček', color: 'bg-red-500', desc: 'Koordinátor: Rovnováha, jemná motorika a svalová paměť.' },
    { id: 'limbic', name: 'Limbický systém', color: 'bg-pink-500', desc: 'Motor: Emoce, instinkty přežití a smyčky odměn.' },
  ];

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="text-indigo-400 w-6 h-6" />
        <h3 className="font-mono text-indigo-100 uppercase tracking-wider text-lg">Anatomické moduly OS</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square flex items-center justify-center">
          {/* Simple SVG Brain Representation */}
          <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <path 
              d="M100,20 C60,20 30,50 30,90 C30,110 40,130 60,140 L140,140 C160,130 170,110 170,90 C170,50 140,20 100,20 Z" 
              fill="#1e293b" 
              stroke="#334155" 
              strokeWidth="2"
            />
            {/* Frontal */}
            <path 
              d="M100,25 C70,25 40,45 35,80 L100,80 Z" 
              className={`cursor-pointer transition-all ${selectedPart === 'frontal' ? 'fill-blue-500/40 stroke-blue-400' : 'fill-blue-900/20 stroke-blue-900/40 hover:fill-blue-900/40'}`}
              onClick={() => setSelectedPart('frontal')}
            />
            {/* Parietal */}
            <path 
              d="M100,25 C130,25 160,45 165,80 L100,80 Z" 
              className={`cursor-pointer transition-all ${selectedPart === 'parietal' ? 'fill-green-500/40 stroke-green-400' : 'fill-green-900/20 stroke-green-900/40 hover:fill-green-900/40'}`}
              onClick={() => setSelectedPart('parietal')}
            />
            {/* Temporal */}
            <path 
              d="M35,85 C35,110 45,130 65,135 L100,85 Z" 
              className={`cursor-pointer transition-all ${selectedPart === 'temporal' ? 'fill-yellow-500/40 stroke-yellow-400' : 'fill-yellow-900/20 stroke-yellow-900/40 hover:fill-yellow-900/40'}`}
              onClick={() => setSelectedPart('temporal')}
            />
            {/* Occipital */}
            <path 
              d="M165,85 C165,110 155,130 135,135 L100,85 Z" 
              className={`cursor-pointer transition-all ${selectedPart === 'occipital' ? 'fill-purple-500/40 stroke-purple-400' : 'fill-purple-900/20 stroke-purple-900/40 hover:fill-purple-900/40'}`}
              onClick={() => setSelectedPart('occipital')}
            />
            {/* Cerebellum */}
            <circle 
              cx="100" cy="145" r="15" 
              className={`cursor-pointer transition-all ${selectedPart === 'cerebellum' ? 'fill-red-500/40 stroke-red-400' : 'fill-red-900/20 stroke-red-900/40 hover:fill-red-900/40'}`}
              onClick={() => setSelectedPart('cerebellum')}
            />
          </svg>
        </div>

        <div className="space-y-3">
          {brainParts.map((part) => (
            <button
              key={part.id}
              onClick={() => setSelectedPart(part.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${
                selectedPart === part.id 
                  ? 'bg-indigo-950/30 border-indigo-500/50 ring-1 ring-indigo-500/50' 
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${part.color}`} />
              <div className="flex-1">
                <div className="font-mono text-sm text-slate-200">{part.name}</div>
                {selectedPart === part.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-slate-400 mt-1"
                  >
                    {part.desc}
                  </motion.div>
                )}
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${selectedPart === part.id ? 'rotate-90' : ''}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const LanguageProtocolMonitor = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const protocolSteps = [
    "INIT HLPv1: Protokol lidského jazyka",
    "SKENOVÁNÍ SÉMANTICKÉHO_MAPOVÁNÍ...",
    "PAKET 0x001: ARBITRÁRNÍ_MAPOVÁNÍ -> [PES] propojeno s [CANIS_FAMILIARIS]",
    "PAKET 0x002: DVOUVRSTVÁ_KOMPRESE -> [L]+[E]+[S] = [LES]",
    "PAKET 0x003: DYNAMICKÁ_GENERACE -> Nová věta sestavena: 'Mozek je počítač.'",
    "PAKET 0x004: PROSTOROVĚ-ČASOVÉ_SMĚROVÁNÍ -> Přístup k paměťovému clusteru: [ROK_2026]",
    "PAKET 0x005: P2P_SYNCHRONIZACE -> Kulturní přenos aktivní.",
    "PAKET 0x006: KONTROLA_SYNTAXE -> [PES] [KOUSL] [PÁNA] = PLATNÉ",
    "CHYBA: SYNTAKTICKÝ_NESOULAD -> [PÁNA] [KOUSL] [PES] = SÉMANTICKÝ_POSUN"
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev, protocolSteps[i % protocolSteps.length]].slice(-15));
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black rounded-xl border border-emerald-900/50 overflow-hidden font-mono h-[500px] flex flex-col">
      <div className="p-3 bg-emerald-950/20 border-b border-emerald-900/30 flex items-center gap-2">
        <TerminalIcon className="text-emerald-400 w-4 h-4" />
        <span className="text-emerald-500 text-xs uppercase tracking-widest">Neuronový jazykový terminál</span>
      </div>
      <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto space-y-1">
        {logs.map((log, idx) => (
          <div key={idx} className="text-xs flex gap-2">
            <span className="text-emerald-800">[{new Date().toLocaleTimeString()}]</span>
            <span className={log.includes('ERROR') ? 'text-red-400' : log.includes('PACKET') ? 'text-emerald-300' : 'text-emerald-600'}>
              {log}
            </span>
          </div>
        ))}
        <motion.div 
          animate={{ opacity: [0, 1] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2 h-4 bg-emerald-500 align-middle ml-1"
        />
      </div>
    </div>
  );
};

const HardwiredVsPlastic = () => {
  const [activeTab, setActiveTab] = useState<'hardwired' | 'plastic'>('hardwired');

  return (
    <div className="bg-slate-950 rounded-xl border border-orange-900/50 overflow-hidden">
      <div className="flex border-b border-orange-900/30">
        <button 
          onClick={() => setActiveTab('hardwired')}
          className={`flex-1 p-4 font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            activeTab === 'hardwired' ? 'bg-orange-950/20 text-orange-400 border-b-2 border-orange-500' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Pevně zapojené (BIOS)
        </button>
        <button 
          onClick={() => setActiveTab('plastic')}
          className={`flex-1 p-4 font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            activeTab === 'plastic' ? 'bg-cyan-950/20 text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Plastické (Software)
        </button>
      </div>

      <div className="p-6 h-[300px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {activeTab === 'hardwired' ? (
            <motion.div 
              key="hardwired"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-full border border-orange-500/30">
                  <ShieldAlert className="text-orange-500 w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-orange-100 font-bold">Tovární obvody</h4>
                  <p className="text-sm text-orange-900/70">Vrozené reflexy a autonomní funkce.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-orange-950/10 border border-orange-900/30 rounded text-xs font-mono text-orange-400">
                  <div className="font-bold mb-1">REFLEXNÍ_OBLOUK</div>
                  Obchází kůru pro rychlost. Okamžitá svalová kontrakce.
                </div>
                <div className="p-3 bg-orange-950/10 border border-orange-900/30 rounded text-xs font-mono text-orange-400">
                  <div className="font-bold mb-1">BIOS_MOZKOVÉHO_KMENE</div>
                  Srdeční tep, dýchání, spánkové cykly. Nesmazatelné.
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="plastic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-500/30">
                  <Cpu className="text-cyan-500 w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-cyan-100 font-bold">Přepisovatelné synaptické cesty</h4>
                  <p className="text-sm text-cyan-900/70">Učení, paměť a adaptace.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-cyan-950/10 border border-orange-900/30 rounded text-xs font-mono text-cyan-400">
                  <div className="font-bold mb-1">HEBBŮV_ZÁKON_UČENÍ</div>
                  Neurony, které společně pálí, se společně propojují.
                </div>
                <div className="p-3 bg-cyan-950/10 border border-orange-900/30 rounded text-xs font-mono text-cyan-400">
                  <div className="font-bold mb-1">NEUROGENEZE</div>
                  Vytváření nových uzlů a spojení v hippocampu.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MemoryHierarchy = () => {
  const memoryTiers = [
    { 
      id: 'sensory', 
      name: 'Senzorická paměť', 
      analogy: 'L1/L2 Cache', 
      capacity: 'Milisekundy', 
      persistence: 'Volatilní', 
      color: 'text-blue-400',
      desc: 'Surová data ze senzorů (oči, uši). Ultra rychlá, ale okamžitě mizí.'
    },
    { 
      id: 'short', 
      name: 'Pracovní paměť', 
      analogy: 'RAM', 
      capacity: '7 ± 2 položky', 
      persistence: 'Volatilní', 
      color: 'text-green-400',
      desc: 'Aktivní procesní buffer. Omezená kapacita, vyžaduje neustálé obnovování (pozornost).'
    },
    { 
      id: 'long', 
      name: 'Dlouhodobá paměť', 
      analogy: 'SSD/HDD', 
      capacity: 'Petabajty', 
      persistence: 'Perzistentní', 
      color: 'text-amber-400',
      desc: 'Konsolidovaná data uložená posílením synapsí (LTP). Trvalé úložiště.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {memoryTiers.map((tier) => (
          <motion.div 
            key={tier.id}
            whileHover={{ y: -5 }}
            className="bg-slate-950 border border-slate-800 p-6 rounded-xl relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity`}>
              <Database className="w-12 h-12" />
            </div>
            <div className={`text-[10px] font-mono mb-2 uppercase tracking-widest ${tier.color}`}>
              {tier.analogy}
            </div>
            <h4 className="text-slate-100 font-bold mb-2">{tier.name}</h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{tier.desc}</p>
            <div className="space-y-2 border-t border-slate-900 pt-4">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-600">KAPACITA:</span>
                <span className="text-slate-300">{tier.capacity}</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-600">PERZISTENCE:</span>
                <span className="text-slate-300">{tier.persistence}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl flex items-center gap-8">
        <div className="flex-1">
          <h3 className="text-indigo-100 font-bold text-xl mb-4">Protokol konsolidace paměti</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Data se přesouvají z RAM (pracovní paměť) na SSD (dlouhodobá paměť) během spánkových cyklů. 
            Tento proces, známý jako <strong>dlouhodobá potenciace (LTP)</strong>, zahrnuje fyzickou 
            rekonfiguraci synaptických vah.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-400">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              KONSOLIDACE_AKTIVNÍ
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <div className="w-2 h-2 rounded-full bg-slate-700" />
              ČEKÁ_NA_VYPRÁZDNĚNÍ_CACHE
            </div>
          </div>
        </div>
        <div className="hidden md:block w-48 h-48 relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-indigo-900/30 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Database className="w-12 h-12 text-indigo-500/50" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Reconstruction3D = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="bg-slate-950 rounded-xl border border-cyan-900/50 overflow-hidden p-8">
      <div className="flex items-center gap-3 mb-8">
        <Layers className="text-cyan-400 w-6 h-6" />
        <h3 className="font-mono text-cyan-100 uppercase tracking-wider text-lg">2D na 3D prostorová rekonstrukce</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="bg-black/50 border border-slate-800 p-6 rounded-lg font-mono text-xs space-y-4">
            <div className="flex justify-between items-center text-cyan-500 border-b border-cyan-900/30 pb-2">
              <span>ALGORITMUS: STEREO_DEPTH_v4</span>
              <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded">AKTIVNÍ</span>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-slate-600">01</span>
                <span className="text-cyan-300">ZACHYTIT_RETINÁLNÍ_VSTUP(LEVÝ, PRAVÝ)</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-600">02</span>
                <span className="text-cyan-300">VYPOČÍTAT_BINOKULÁRNÍ_DISPARITU()</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-600">03</span>
                <span className="text-cyan-300">ODVODIT_MAPU_HLOUBKY(Z_BUFFER)</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-600">04</span>
                <span className="text-cyan-300">VYRENDERUJE_PROSTOROVÝ_MODEL(3D_SOUŘADNICE)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-slate-200 font-bold">Vizuální GPU</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Týlní lalok zpracovává ploché 2D obrazy ze sítnice a pomocí geometrické inference vytváří 
              3D model reality. To je podobné <strong> fotogrammetrii</strong> nebo algoritmům <strong>SLAM</strong> v robotice.
            </p>
            <button 
              onClick={() => setIsProcessing(!isProcessing)}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs uppercase tracking-widest rounded-lg transition-colors"
            >
              {isProcessing ? 'Zastavit simulaci' : 'Spustit rekonstrukci'}
            </button>
          </div>
        </div>

        <div className="relative aspect-square bg-black/40 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
          {/* Visual Simulation */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-cyan-900/30" />
            ))}
          </div>
          
          <AnimatePresence>
            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="relative z-10"
              >
                {/* 3D Wireframe Cube Simulation */}
                <div className="w-32 h-32 relative preserve-3d animate-spin-slow">
                  <div className="absolute inset-0 border-2 border-cyan-500/50 transform translate-z-16" />
                  <div className="absolute inset-0 border-2 border-cyan-500/50 transform -translate-z-16" />
                  <div className="absolute inset-0 border-2 border-cyan-500/50 transform rotate-y-90 translate-z-16" />
                  <div className="absolute inset-0 border-2 border-cyan-500/50 transform rotate-y-90 -translate-z-16" />
                  <div className="absolute inset-0 border-2 border-cyan-500/50 transform rotate-x-90 translate-z-16" />
                  <div className="absolute inset-0 border-2 border-cyan-500/50 transform rotate-x-90 -translate-z-16" />
                  
                  {/* Scanning Line */}
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-20"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!isProcessing && (
            <div className="text-slate-700 font-mono text-[10px] uppercase tracking-widest text-center">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-20" />
              Čekání na vstup...
            </div>
          )}
          
          {/* Data Stream Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between font-mono text-[8px] text-cyan-900">
            <span>X: 102.44</span>
            <span>Y: 44.12</span>
            <span>Z: 8.99</span>
            <span>FPS: 60.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CorticalSurfaceMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredData, setHoveredData] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const points: { x: number; y: number; z: number; label: string; density: number }[] = [];
    const labels = [
      "Vizuální_kůra_01", "Motorická_kontrola_A", "Auditorní_buffer", 
      "Sémantický_uzel_X", "Exekutivní_funkce_7", "Limbický_pohon",
      "Prostorová_mapa_Beta", "Paměťový_index_9", "Senzorický_vstup_Z"
    ];

    for (let i = 0; i < 150; i++) {
      const phi = Math.acos(-1 + (2 * i) / 150);
      const theta = Math.sqrt(150 * Math.PI) * phi;
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);
      // Create density hotspots based on position
      const density = (Math.sin(x * 3) * Math.cos(y * 3) * Math.sin(z * 3) + 1) / 2;
      points.push({
        x, y, z,
        density,
        label: labels[i % labels.length] + "_" + i.toString(16)
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 150;

      rotation += 0.005;

      // Sort points by Z for basic depth
      const sortedPoints = [...points].sort((a, b) => {
        const az = a.z * Math.cos(rotation) - a.x * Math.sin(rotation);
        const bz = b.z * Math.cos(rotation) - b.x * Math.sin(rotation);
        return az - bz;
      });

      sortedPoints.forEach(p => {
        // Rotate
        const x = p.x * Math.cos(rotation) + p.z * Math.sin(rotation);
        const z = p.z * Math.cos(rotation) - p.x * Math.sin(rotation);
        const y = p.y;

        const scale = (z + 2) / 3;
        const screenX = centerX + x * radius * scale;
        const screenY = centerY + y * radius * scale;

        const opacity = (z + 1) / 2;
        // Color based on density: Cyan (low) to bright white/yellow (high)
        const r = Math.floor(0 + p.density * 255);
        const g = Math.floor(229 + p.density * 26);
        const b = Math.floor(255);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, (1.5 + p.density * 2) * scale, 0, Math.PI * 2);
        ctx.fill();

        // Glow for high density points
        if (p.density > 0.8) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
        } else {
          ctx.shadowBlur = 0;
        }

        if (opacity > 0.8 && Math.random() > 0.99) {
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
          ctx.beginPath();
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(screenX + 20, screenY - 20);
          ctx.stroke();
          ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
          ctx.font = '8px monospace';
          ctx.fillText(p.label, screenX + 25, screenY - 20);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    canvas.width = 600;
    canvas.height = 400;
    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="bg-slate-950 rounded-xl border border-cyan-900/50 overflow-hidden p-8 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Database className="text-cyan-400 w-6 h-6" />
          <h3 className="font-mono text-cyan-100 uppercase tracking-wider text-lg">Povrchově mapovaný dataset</h3>
        </div>
        <div className="text-[10px] font-mono text-cyan-600 bg-cyan-950/30 px-3 py-1 rounded border border-cyan-900/30">
          REŽIM: PROSTOROVÉ_INDEXOVÁNÍ_POVRCHU
        </div>
      </div>

      <div className="relative group">
        <canvas ref={canvasRef} className="max-w-full cursor-crosshair" />
        <div className="absolute inset-0 pointer-events-none border border-cyan-900/20 rounded-full scale-90 animate-pulse" />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
          <h4 className="text-cyan-400 font-mono text-xs uppercase mb-2">Architektura datasetu</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Informace jsou fyzicky uloženy v 3D latentním prostoru, ale jsou indexovány a přistupovány výhradně 
            přes <strong>kortikální povrch</strong>. To napodobuje způsob, jakým šedá kůra mozková (povrch) 
            obsahuje většinu těl neuronů, zatímco bílá hmota (vnitřek) zajišťuje směrování.
          </p>
        </div>
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
          <h4 className="text-cyan-400 font-mono text-xs uppercase mb-2">Protokol přístupu k povrchu</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-600">TYP_INDEXU:</span>
              <span className="text-cyan-300">GEOMETRICKÁ_SOUŘADNICE</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-600">HUSTOTA_DAT:</span>
              <span className="text-cyan-300">1.2M UZLŮ / CM²</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-600">LATENCE_PŘÍSTUPU:</span>
              <span className="text-cyan-300">12ms (SYNAPTICKÝ_SKOK)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('network');

  const modules = [
    { id: 'network', name: 'Neuronová síť', icon: Network, color: 'text-cyan-400' },
    { id: 'synapse', name: 'Synaptické pakety', icon: Zap, color: 'text-purple-400' },
    { id: 'anatomy', name: 'Anatomie mozku', icon: Brain, color: 'text-indigo-400' },
    { id: 'protocol', name: 'Jazykový protokol', icon: TerminalIcon, color: 'text-emerald-400' },
    { id: 'hardwired', name: 'Systémové jádro', icon: Cpu, color: 'text-orange-400' },
    { id: 'memory', name: 'Hierarchie paměti', icon: Database, color: 'text-amber-400' },
    { id: 'reconstruction', name: '3D rekonstrukce', icon: Layers, color: 'text-cyan-400' },
    { id: 'surface', name: 'Povrchový dataset', icon: Database, color: 'text-cyan-400' },
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Brain className="text-indigo-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="font-mono font-bold text-slate-100 tracking-tighter text-xl">NEURAL OS <span className="text-indigo-500">v1.0</span></h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Průzkumník biologických algoritmů</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Stav systému: Optimální</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-500" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Latentní prostor: 175 mld. param.</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 px-2">Vizualizační moduly</div>
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id as Module)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
                  activeModule === m.id 
                    ? 'bg-slate-900 border-slate-700 text-white shadow-lg' 
                    : 'border-transparent text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'
                }`}
              >
                <m.icon className={`w-5 h-5 ${activeModule === m.id ? m.color : 'text-slate-600'}`} />
                <span className="font-medium text-sm">{m.name}</span>
                {activeModule === m.id && (
                  <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </button>
            ))}
            
            <div className="mt-12 p-4 rounded-xl bg-indigo-950/10 border border-indigo-900/20">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-mono text-indigo-300 uppercase">Neuronový vhled</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                "Mozek není statická databáze, ale dynamická síť založená na pravděpodobnostním porovnávání vzorů."
              </p>
            </div>
          </aside>

          {/* Content Area */}
          <section className="lg:col-span-9 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeModule === 'network' && <NeuralNetworkVisualizer />}
                {activeModule === 'synapse' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SynapticPacketMonitor />
                    <div className="bg-slate-950 rounded-xl border border-purple-900/50 p-6 flex flex-col justify-center">
                      <div className="p-4 bg-purple-500/10 rounded-full border border-purple-500/30 w-fit mb-4">
                        <Layers className="text-purple-400 w-8 h-8" />
                      </div>
                      <h3 className="text-purple-100 font-bold text-xl mb-2">Synaptický přenos dat</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Elektrické signály (akční potenciály) jsou přeměněny na chemické balíčky (neurotransmitery), aby překonaly synaptickou štěrbinu. 
                        Toto je základní I/O operace mozku.
                      </p>
                      <ul className="mt-6 space-y-3">
                        {['Excitační: Posouvá signál vpřed (Glutamát)', 'Inhibiční: Zastavuje signál (GABA)', 'Modulační: Upravuje stav systému (Dopamin)'].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                            <div className="w-1 h-1 rounded-full bg-purple-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {activeModule === 'anatomy' && <BrainAnatomyExplorer />}
                {activeModule === 'protocol' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <LanguageProtocolMonitor />
                    </div>
                    <div className="space-y-6">
                      <div className="bg-slate-950 rounded-xl border border-emerald-900/50 p-6">
                        <MessageSquare className="text-emerald-400 w-6 h-6 mb-4" />
                        <h4 className="text-emerald-100 font-bold mb-2">Protokol HLPv1</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Protokol lidského jazyka (HLP) spravuje mapování mezi libovolnými symboly a sémantickými koncepty.
                        </p>
                      </div>
                      <div className="bg-slate-950 rounded-xl border border-emerald-900/50 p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-mono text-emerald-400 uppercase">Aktivní pravidla</span>
                        </div>
                        <div className="space-y-2">
                          {['Arbitrárnost', 'Duality', 'Produktivita', 'Vytěsnění'].map((rule, i) => (
                            <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-slate-500">{rule}</span>
                              <span className="text-emerald-600">POVOLENO</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeModule === 'hardwired' && (
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <HardwiredVsPlastic />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                        <h5 className="text-slate-100 font-bold mb-2 text-sm">BIOS (Mozkový kmen)</h5>
                        <p className="text-xs text-slate-500">Kritické systémové funkce, které nelze modifikovat uživatelským softwarem.</p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                        <h5 className="text-slate-100 font-bold mb-2 text-sm">Přerušení (Reflexy)</h5>
                        <p className="text-xs text-slate-500">Zkratky na úrovni hardwaru pro okamžité reakce na přežití.</p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                        <h5 className="text-slate-100 font-bold mb-2 text-sm">Firmware (Instinkty)</h5>
                        <p className="text-xs text-slate-500">Předinstalované vzorce chování zděděné prostřednictvím genetického kódu.</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeModule === 'memory' && <MemoryHierarchy />}
                {activeModule === 'reconstruction' && <Reconstruction3D />}
                {activeModule === 'surface' && <CorticalSurfaceMap />}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-900 py-12 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-100">86 mld.</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Neuronů</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-100">100 bil.</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Synapsí</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-100">20 W</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Příkon</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 font-mono">
            PRŮZKUMNÍK NEURAL OS // VERZE SYSTÉMU 1.0.4 // SIMULACE BIOLOGICKÉHO HARDWARU
          </p>
        </div>
      </footer>
    </div>
  );
}
