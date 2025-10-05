"use client"
import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Search, Grid3x3, Download, RotateCw, Trash2, AlertCircle } from 'lucide-react';
import Galaxy from '../components/Galaxy';
// ============================================================================
// TYPES
// ============================================================================

type MaterialCategory =
  | "Structural"
  | "Foam"
  | "Film"
  | "Textile"
  | "Fastener"
  | "Electrical"
  | "Chemical"
  | "Composite"
  | "Polymer"
  | "Other";

type MaterialStatus = "new" | "planned" | "placed" | "archived";
type Effort = "low" | "med" | "high";
type Benefit = "thermal" | "structural" | "storage" | "safety" | "acoustic" | "electrical";

interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  massKg: number;
  qty: number;
  status: MaterialStatus;
  notes?: string;
}

interface Suggestion {
  id: string;
  materialId: string;
  title: string;
  rationale: string;
  effort: Effort;
  benefit: Benefit;
  footprint: { w: number; h: number };
}

interface PlacedItem {
  id: string;
  suggestionId: string;
  materialId: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
  footprint: { w: number; h: number };
}

interface AppState {
  materials: Material[];
  suggestions: Suggestion[];
  toolbox: Suggestion[];
  placed: PlacedItem[];
  ui: {
    showOnboarding: boolean;
    selectedMaterialId?: string;
    selectedPlacedId?: string;
  };
}

// ============================================================================
// SEED DATA & SUGGESTION TEMPLATES
// ============================================================================

const SEED_MATERIALS: Material[] = [
  { id: "m1", name: "Aluminum cube strut", category: "Structural", massKg: 25, qty: 12, status: "new" },
  { id: "m2", name: "Zotek F30 foam", category: "Foam", massKg: 18, qty: 6, status: "new" },
  { id: "m3", name: "Bubble wrap", category: "Film", massKg: 3.2, qty: 10, status: "new" },
  { id: "m4", name: "Carbon fiber panel", category: "Structural", massKg: 12, qty: 8, status: "archived" },
  { id: "m5", name: "Polycarbonate sheet", category: "Film", massKg: 7.5, qty: 15, status: "new" },
  { id: "m6", name: "Titanium bolts", category: "Fastener", massKg: 0.5, qty: 100, status: "new" },
  { id: "m7", name: "Kevlar fabric roll", category: "Textile", massKg: 22, qty: 4, status: "new" },
  { id: "m8", name: "PVC insulation sheet", category: "Polymer", massKg: 9, qty: 14, status: "new" },
  { id: "m9", name: "Copper wiring spool", category: "Electrical", massKg: 30, qty: 3, status: "new" },
  { id: "m10", name: "Stainless steel rod", category: "Structural", massKg: 40, qty: 7, status: "new" },
  { id: "m11", name: "Glass fiber mesh", category: "Composite", massKg: 5.5, qty: 11, status: "archived" },
  { id: "m12", name: "Silicone sealant", category: "Chemical", massKg: 2.5, qty: 25, status: "new" },
  { id: "m13", name: "Lithium battery pack", category: "Electrical", massKg: 15, qty: 9, status: "new" },
  { id: "m14", name: "Acrylic panel", category: "Film", massKg: 6, qty: 13, status: "new" },
  { id: "m15", name: "Epoxy resin barrel", category: "Chemical", massKg: 50, qty: 2, status: "new" },
  { id: "m16", name: "Nylon zip ties", category: "Fastener", massKg: 1.2, qty: 200, status: "new" },
  { id: "m17", name: "Thermal insulation blanket", category: "Foam", massKg: 14, qty: 5, status: "new" },
  { id: "m18", name: "Steel hinge set", category: "Fastener", massKg: 3, qty: 30, status: "archived" },
  { id: "m19", name: "Magnesium alloy plate", category: "Structural", massKg: 28, qty: 6, status: "new" },
  { id: "m20", name: "Ceramic tiles", category: "Composite", massKg: 35, qty: 20, status: "new" }
];

const SUGGESTION_TEMPLATES: Record<MaterialCategory, Suggestion[]> = {
  Structural: [
    { id: "s1", materialId: "", title: "Hydroponic Rack", rationale: "Vertical farming support structure", effort: "med", benefit: "storage", footprint: { w: 2, h: 3 } },
    { id: "s2", materialId: "", title: "Storage Shelf", rationale: "Organize tools and supplies", effort: "low", benefit: "storage", footprint: { w: 3, h: 1 } },
    { id: "s3", materialId: "", title: "Instrument Frame", rationale: "Mount scientific equipment", effort: "med", benefit: "structural", footprint: { w: 2, h: 2 } },
    { id: "s11", materialId: "", title: "Work Bench", rationale: "Durable workspace for repairs and experiments", effort: "high", benefit: "structural", footprint: { w: 3, h: 2 } },
    { id: "s12", materialId: "", title: "Exercise Frame", rationale: "Support structure for crew exercise equipment", effort: "med", benefit: "safety", footprint: { w: 2, h: 2 } },
    { id: "s13", materialId: "", title: "Habitat Divider", rationale: "Repurpose struts to section off living zones", effort: "med", benefit: "acoustic", footprint: { w: 3, h: 1 } }
  ],
  Foam: [
    { id: "s4", materialId: "", title: "Wall Insulation", rationale: "Reduce thermal loss in sleeping quarters", effort: "low", benefit: "thermal", footprint: { w: 3, h: 1 } },
    { id: "s5", materialId: "", title: "Sleeping Mat", rationale: "Comfort and thermal barrier for crew rest", effort: "low", benefit: "thermal", footprint: { w: 2, h: 1 } },
    { id: "s6", materialId: "", title: "Equipment Padding", rationale: "Protect sensitive instruments", effort: "low", benefit: "safety", footprint: { w: 1, h: 1 } },
    { id: "s14", materialId: "", title: "Soundproof Panel", rationale: "Line walls to reduce noise in shared areas", effort: "low", benefit: "acoustic", footprint: { w: 2, h: 2 } },
    { id: "s15", materialId: "", title: "Emergency Float", rationale: "Improvised flotation or cushion for water tanks", effort: "med", benefit: "safety", footprint: { w: 2, h: 1 } }
  ],
  Film: [
    { id: "s7", materialId: "", title: "Drawer Liner", rationale: "Cushion and organize small items", effort: "low", benefit: "storage", footprint: { w: 1, h: 1 } },
    { id: "s8", materialId: "", title: "Temp Insulation", rationale: "Quick thermal barrier for experiments", effort: "low", benefit: "thermal", footprint: { w: 2, h: 1 } },
    { id: "s16", materialId: "", title: "Moisture Barrier", rationale: "Wrap around sensitive electronics", effort: "low", benefit: "safety", footprint: { w: 2, h: 1 } },
    { id: "s17", materialId: "", title: "Light Diffuser", rationale: "Scatter LED light for hydroponic plants", effort: "low", benefit: "structural", footprint: { w: 2, h: 1 } },
    { id: "s18", materialId: "", title: "Storage Bag", rationale: "Convert wrap into resealable pouches", effort: "med", benefit: "storage", footprint: { w: 1, h: 1 } }
  ],
  Textile: [
    { id: "s9", materialId: "", title: "Privacy Curtain", rationale: "Personal space dividers", effort: "low", benefit: "acoustic", footprint: { w: 1, h: 2 } },
    { id: "s19", materialId: "", title: "Rag/Filter Cloth", rationale: "Repurposed as cleaning rags or air filters", effort: "low", benefit: "safety", footprint: { w: 1, h: 1 } },
    { id: "s20", materialId: "", title: "Exercise Mat", rationale: "Folded textiles for workouts", effort: "low", benefit: "safety", footprint: { w: 2, h: 1 } },
    { id: "s21", materialId: "", title: "Thermal Blanket", rationale: "Layered fabric as emergency insulation", effort: "med", benefit: "thermal", footprint: { w: 2, h: 2 } },
    { id: "s22", materialId: "", title: "Acoustic Baffle", rationale: "Hanging cloth to dampen echoes", effort: "med", benefit: "acoustic", footprint: { w: 2, h: 1 } }
  ],
  Fastener: [
    { id: "s27", materialId: "", title: "Tool Mounts", rationale: "Secure tools to walls using bolts/hinges", effort: "low", benefit: "structural", footprint: { w: 1, h: 1 } },
    { id: "s28", materialId: "", title: "Safety Rail", rationale: "Bolt struts together for a secure railing", effort: "med", benefit: "safety", footprint: { w: 3, h: 1 } }
  ],
  Electrical: [
    { id: "s29", materialId: "", title: "Power Extension", rationale: "Repurpose wiring spools for added circuits", effort: "med", benefit: "electrical", footprint: { w: 2, h: 1 } },
    { id: "s30", materialId: "", title: "Battery Backup", rationale: "Lithium pack used as emergency power", effort: "med", benefit: "safety", footprint: { w: 2, h: 2 } }
  ],
  Chemical: [
    { id: "s31", materialId: "", title: "Seal Repairs", rationale: "Sealant used to fix small leaks", effort: "low", benefit: "safety", footprint: { w: 1, h: 1 } },
    { id: "s32", materialId: "", title: "Composite Resin", rationale: "Epoxy resin combined with fibers for panels", effort: "med", benefit: "structural", footprint: { w: 2, h: 2 } }
  ],
  Composite: [
    { id: "s33", materialId: "", title: "Protective Shield", rationale: "Fiber mesh layered for impact protection", effort: "med", benefit: "safety", footprint: { w: 3, h: 1 } },
    { id: "s34", materialId: "", title: "Tile Flooring", rationale: "Ceramic tiles used for flooring in habitat", effort: "high", benefit: "structural", footprint: { w: 3, h: 2 } }
  ],
  Polymer: [
    { id: "s35", materialId: "", title: "Cable Insulation", rationale: "Repurposed PVC sheets to insulate wiring", effort: "low", benefit: "electrical", footprint: { w: 2, h: 1 } },
    { id: "s36", materialId: "", title: "Waterproof Layer", rationale: "Polymer used to waterproof surfaces", effort: "med", benefit: "safety", footprint: { w: 3, h: 1 } }
  ],
  Other: [
    { id: "s10", materialId: "", title: "Custom Solution", rationale: "Adapt material for specific need", effort: "high", benefit: "structural", footprint: { w: 1, h: 1 } },
    { id: "s23", materialId: "", title: "3D Print Feedstock", rationale: "Shred waste to use in additive manufacturing", effort: "high", benefit: "structural", footprint: { w: 1, h: 1 } },
    { id: "s24", materialId: "", title: "Regolith Reinforcement", rationale: "Mix shredded materials into Martian soil bricks", effort: "high", benefit: "structural", footprint: { w: 3, h: 2 } },
    { id: "s25", materialId: "", title: "Prototype Molds", rationale: "Use packaging as molds for casting regolith composites", effort: "med", benefit: "structural", footprint: { w: 2, h: 2 } },
    { id: "s26", materialId: "", title: "Art/Decor", rationale: "Repurpose materials for morale-boosting art projects", effort: "low", benefit: "acoustic", footprint: { w: 1, h: 1 } }
  ]
};

// ============================================================================
// HELPERS
// ============================================================================

const generateSuggestions = (materials: Material[], materialId: string): Suggestion[] => {
  const material = materials.find(m => m.id === materialId);
  if (!material) return [];
  const templates = SUGGESTION_TEMPLATES[material.category] || [];
  return templates.map(t => ({ ...t, materialId, id: `${t.id}-${materialId}` }));
};

const getMetrics = (state: AppState) => {
  const totalMass = state.materials.reduce((sum, m) => m.status !== 'archived' ? sum + m.massKg * m.qty : sum, 0);
  const placedMaterialIds = new Set(state.placed.map(p => p.materialId));
  const reusedMass = state.materials
    .filter(m => placedMaterialIds.has(m.id))
    .reduce((sum, m) => sum + m.massKg * m.qty, 0);
  const reusePercent = totalMass > 0 ? Math.round((reusedMass / totalMass) * 100) : 0;

  const massByCategory: Record<string, number> = {};
  state.materials.forEach(m => {
    if (m.status !== 'archived') {
      massByCategory[m.category] = (massByCategory[m.category] || 0) + m.massKg * m.qty;
    }
  });

  return { totalMass, reusedMass, reusePercent, massByCategory };
};

// ============================================================================
// COLLISION DETECTION
// ============================================================================

const checkCollision = (
  placed: PlacedItem[],
  newItem: { x: number; y: number; footprint: { w: number; h: number } },
  excludeId?: string
): boolean => {
  for (const item of placed) {
    if (item.id === excludeId) continue;

    const x1 = item.x, y1 = item.y, w1 = item.footprint.w, h1 = item.footprint.h;
    const x2 = newItem.x, y2 = newItem.y, w2 = newItem.footprint.w, h2 = newItem.footprint.h;

    if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2) {
      return true;
    }
  }
  return false;
};

// ============================================================================
// STATE MANAGEMENT (SSR-safe)
// ============================================================================

const DEFAULT_STATE: AppState = {
  materials: SEED_MATERIALS,
  suggestions: [],
  toolbox: [],
  placed: [],
  ui: { showOnboarding: true }
};

const useAppState = () => {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const mounted = useRef(false);

  // Hydrate on client
  useEffect(() => {
    mounted.current = true;
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('residence-renovations-state');
        if (stored) {
          setState(JSON.parse(stored));
        } else {
          const hideOnboarding = localStorage.getItem('hide-onboarding') === 'true';
          setState(prev => ({ ...prev, ui: { ...prev.ui, showOnboarding: !hideOnboarding } }));
        }
      }
    } catch (e) {
      console.error('Failed to parse stored state', e);
    }
    return () => { mounted.current = false; };
  }, []);

  // Persist after mount
  useEffect(() => {
    if (!mounted.current) return;
    try {
      localStorage.setItem('residence-renovations-state', JSON.stringify(state));
    } catch {}
  }, [state]);

  const actions = {
    addMaterial: (material: Omit<Material, 'id' | 'status'>) => {
      setState(prev => ({
        ...prev,
        materials: [...prev.materials, { ...material, id: `m${Date.now()}`, status: 'new' }]
      }));
    },

    updateMaterial: (id: string, updates: Partial<Material>) => {
      setState(prev => ({
        ...prev,
        materials: prev.materials.map(m => m.id === id ? { ...m, ...updates } : m)
      }));
    },

    archiveMaterial: (id: string) => {
      setState(prev => ({
        ...prev,
        materials: prev.materials.map(m => m.id === id ? { ...m, status: 'archived' as MaterialStatus } : m)
      }));
    },

    setSelectedMaterial: (id?: string) => {
      setState(prev => {
        const suggestions = id ? generateSuggestions(prev.materials, id) : [];
        return {
          ...prev,
          suggestions,
          ui: { ...prev.ui, selectedMaterialId: id }
        };
      });
    },

    addToToolbox: (suggestion: Suggestion) => {
      setState(prev => {
        if (prev.toolbox.find(s => s.id === suggestion.id)) return prev;
        const material = prev.materials.find(m => m.id === suggestion.materialId);
        if (material && material.status === 'new') {
          return {
            ...prev,
            toolbox: [...prev.toolbox, suggestion],
            materials: prev.materials.map(m => m.id === suggestion.materialId ? { ...m, status: 'planned' as MaterialStatus } : m)
          };
        }
        return { ...prev, toolbox: [...prev.toolbox, suggestion] };
      });
    },

    placeItem: (item: PlacedItem) => {
      setState(prev => {
        const material = prev.materials.find(m => m.id === item.materialId);
        const newMaterials = material && material.status === 'planned'
          ? prev.materials.map(m => m.id === item.materialId ? { ...m, status: 'placed' as MaterialStatus } : m)
          : prev.materials;

        return {
          ...prev,
          placed: [...prev.placed, item],
          materials: newMaterials,
          toolbox: prev.toolbox.filter(s => s.id !== item.suggestionId)
        };
      });
    },

    moveItem: (id: string, x: number, y: number) => {
      setState(prev => ({
        ...prev,
        placed: prev.placed.map(p => p.id === id ? { ...p, x, y } : p)
      }));
    },

    rotateItem: (id: string) => {
      setState(prev => ({
        ...prev,
        placed: prev.placed.map(p => {
          if (p.id === id) {
            const newRotation = ((p.rotation + 90) % 360) as 0 | 90 | 180 | 270;
            const newFootprint = newRotation === 90 || newRotation === 270
              ? { w: p.footprint.h, h: p.footprint.w }
              : p.footprint;
            return { ...p, rotation: newRotation, footprint: newFootprint };
          }
          return p;
        })
      }));
    },

    removeItem: (id: string) => {
      setState(prev => {
        const item = prev.placed.find(p => p.id === id);
        if (!item) return prev;

        const suggestion = [...prev.suggestions, ...SUGGESTION_TEMPLATES[
          prev.materials.find(m => m.id === item.materialId)?.category || 'Other'
        ]].find(s => s.id === item.suggestionId);

        const stillPlaced = prev.placed.filter(p => p.id !== id).some(p => p.materialId === item.materialId);
        const newMaterials = !stillPlaced
          ? prev.materials.map(m => m.id === item.materialId ? { ...m, status: 'planned' as MaterialStatus } : m)
          : prev.materials;

        return {
          ...prev,
          placed: prev.placed.filter(p => p.id !== id),
          toolbox: suggestion ? [...prev.toolbox, suggestion] : prev.toolbox,
          materials: newMaterials
        };
      });
    },

    setSelectedPlaced: (id?: string) => {
      setState(prev => ({ ...prev, ui: { ...prev.ui, selectedPlacedId: id } }));
    },

    hideOnboarding: (dontShowAgain: boolean) => {
      if (dontShowAgain) {
        try { localStorage.setItem('hide-onboarding', 'true'); } catch {}
      }
      setState(prev => ({ ...prev, ui: { ...prev.ui, showOnboarding: false } }));
    },

    exportJSON: () => {
      const data = {
        materials: state.materials,
        placed: state.placed,
        metrics: getMetrics(state)
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'residence-renovations.json';
      a.click();
    },

    // NEW: reset app & clear storage
    resetApp: () => {
      try {
        localStorage.removeItem('residence-renovations-state');
        localStorage.removeItem('hide-onboarding');
      } catch {}
      setState({ ...DEFAULT_STATE, materials: SEED_MATERIALS, ui: { showOnboarding: true } });
    }
  };

  return { state, actions };
};

// ============================================================================
// COMPONENTS
// ============================================================================

const OnboardingModal = ({ onClose }: { onClose: (dontShowAgain: boolean) => void }) => {
  const [dontShow, setDontShow] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#12141A] border border-[#222733] rounded-xl2 shadow-soft max-w-2xl w-full mx-4 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#E7E8EA] mb-2">Residence Renovations: From Cube Frame to Useful Assets</h2>
            <div className="flex items-center gap-2 text-sm text-[#A7ADB7]">
              <span className="px-2 py-0.5 bg-[#FF6A2A]/10 text-[#FF6A2A] rounded">First-Time Badge</span>
            </div>
          </div>
          <button onClick={() => onClose(dontShow)} className="text-[#A7ADB7] hover:text-[#E7E8EA]">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 mb-6 text-[#A7ADB7]">
          <p>You've successfully inflated your Mars habitat. Now the <strong className="text-[#E7E8EA]">3D cube frame, foam packaging, bubble wrap</strong>, and other materials are ready for creative reuse.</p>
          <p>Your goal: <strong className="text-[#E7E8EA]">Log materials → Pick reuse plans → Place them in your habitat layout → Track mass savings</strong>. Every kilogram reused is one less kilogram launched from Earth.</p>
        </div>

        <div className="bg-[#1A1E26] rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-[#E7E8EA] mb-3">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-[#A7ADB7]">
            <li className="flex items-start gap-2">
              <span className="text-[#FF6A2A]">•</span>
              <span><strong>Drag & Drop:</strong> Select a material, add a suggestion to your toolbox, then drag it onto the habitat grid</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF6A2A]">•</span>
              <span><strong>Rotate Items:</strong> Click placed items to rotate (90°) or use the R key</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF6A2A]">•</span>
              <span><strong>Reused %:</strong> Tracks the percentage of total mass that's been repurposed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF6A2A]">•</span>
              <span><strong>Effort vs. Benefit:</strong> Chips guide you toward high-impact, low-effort solutions</span>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-[#A7ADB7] mb-2">
            <span>Progress</span>
            <span>Log ➜ Plan ➜ Place ➜ Optimize</span>
          </div>
          <div className="h-1.5 bg-[#1A1E26] rounded-full overflow-hidden">
            <div className="h-full w-1/4 bg-gradient-to-r from-[#FF6A2A] to-[#FF7F48] rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-[#A7ADB7] cursor-pointer">
            <input type="checkbox" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} className="rounded border-[#222733]" />
            Don't show again
          </label>
          <div className="flex gap-3">
            <button onClick={() => onClose(dontShow)} className="px-4 py-2 text-sm text-[#A7ADB7] hover:text-[#E7E8EA]">
              Skip Tutorial
            </button>
            <button onClick={() => onClose(dontShow)} className="px-6 py-2 bg-[#FF6A2A] hover:bg-[#FF7F48] text-white rounded-lg text-sm font-medium">
              Start Renovation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Header with Clear + Export
const HeaderBar = ({ onExport, onReset }: { onExport: () => void; onReset: () => void }) => (
  <header className="sticky top-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-sm border-b border-[#222733]">
    <div className="max-w-[1600px] mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-[#E7E8EA]">Residence Renovations</h1>
          <span className="px-2 py-0.5 bg-[#1A1E26] text-[#A7ADB7] text-sm rounded">Jezero Base</span>
        </div>

        
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="px-3 py-2 bg-[#1A1E26] hover:bg-[#1A1E26]/70 text-[#E7E8EA] rounded-lg text-sm border border-[#222733]">
            Clear Data
          </button>
          <button onClick={onExport} className="flex items-center gap-2 px-4 py-2 bg-[#FF6A2A] hover:bg-[#FF7F48] text-white rounded-lg text-sm font-medium">
            <Download size={16} />
            Export Plan
          </button>
        </div>
      </div>
    </div>
  </header>
);

const AddMaterialForm = ({ onAdd }: { onAdd: (m: Omit<Material, 'id' | 'status'>) => void }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Structural' as MaterialCategory, massKg: 0, qty: 1, notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.massKg > 0) {
      onAdd(form);
      setForm({ name: '', category: 'Structural', massKg: 0, qty: 1, notes: '' });
      setOpen(false);
    }
  };

  return (
    <div className="bg-[#12141A] border border-[#222733] rounded-lg p-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left">
        <h3 className="text-base font-semibold text-[#E7E8EA]">Add Material</h3>
        <Plus size={16} className={`text-[#FF6A2A] transition-transform ${open ? 'rotate-45' : ''}`} />
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Material name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 bg-[#1A1E26] border border-[#222733] rounded text-sm text-[#E7E8EA] placeholder-[#A7ADB7]"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as MaterialCategory })}
            className="w-full px-3 py-2 bg-[#1A1E26] border border-[#222733] rounded text-sm text-[#E7E8EA]"
          >
            {(["Structural","Foam","Film","Textile","Fastener","Electrical","Chemical","Composite","Polymer","Other"] as MaterialCategory[]).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Mass (kg)"
              value={form.massKg || ''}
              onChange={(e) => setForm({ ...form, massKg: parseFloat(e.target.value) || 0 })}
              className="px-3 py-2 bg-[#1A1E26] border border-[#222733] rounded text-sm text-[#E7E8EA] placeholder-[#A7ADB7]"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: parseInt(e.target.value) || 1 })}
              className="px-3 py-2 bg-[#1A1E26] border border-[#222733] rounded text-sm text-[#E7E8EA] placeholder-[#A7ADB7]"
            />
          </div>
          <input
            type="text"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-3 py-2 bg-[#1A1E26] border border-[#222733] rounded text-sm text-[#E7E8EA] placeholder-[#A7ADB7]"
          />
          <button type="submit" className="w-full py-2 bg-[#FF6A2A] hover:bg-[#FF7F48] text-white rounded text-sm font-medium">
            Add Material
          </button>
        </form>
      )}
    </div>
  );
};

const InventoryTable = ({ materials, selectedId, onSelect, onArchive }: any) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MaterialCategory | 'All'>('All');

  const filtered = materials.filter((m: Material) =>
    m.status !== 'archived' &&
    (filter === 'All' || m.category === filter) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryColor = (cat: MaterialCategory) => {
    const colors: Record<MaterialCategory, string> = {
      Structural: 'bg-blue-500/10 text-blue-400',
      Foam: 'bg-green-500/10 text-green-400',
      Film: 'bg-purple-500/10 text-purple-400',
      Textile: 'bg-yellow-500/10 text-yellow-400',
      Fastener: 'bg-slate-500/10 text-slate-300',
      Electrical: 'bg-cyan-500/10 text-cyan-300',
      Chemical: 'bg-rose-500/10 text-rose-300',
      Composite: 'bg-amber-500/10 text-amber-300',
      Polymer: 'bg-teal-500/10 text-teal-300',
      Other: 'bg-gray-500/10 text-gray-400'
    };
    return colors[cat];
  };

  const getStatusColor = (status: MaterialStatus) => {
    const colors = {
      new: 'text-[#A7ADB7]',
      planned: 'text-[#F6B73C]',
      placed: 'text-[#2BD576]',
      archived: 'text-[#A7ADB7]'
    };
    return colors[status];
  };

  const ALL_CATEGORIES: Array<MaterialCategory | 'All'> = [
    'All','Structural','Foam','Film','Textile','Fastener','Electrical','Chemical','Composite','Polymer','Other'
  ];

  return (
    <div className="bg-[#12141A] border border-[#222733] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#E7E8EA]">Inventory</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-2 top-2 text-[#A7ADB7]" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 bg-[#1A1E26] border border-[#222733] rounded text-sm text-[#E7E8EA] placeholder-[#A7ADB7] w-40"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-2.5 py-1.5 rounded text-sm whitespace-nowrap ${filter === cat ? 'bg-[#FF6A2A] text-white' : 'bg-[#1A1E26] text-[#A7ADB7] hover:text-[#E7E8EA]'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-[330px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-sm text-[#A7ADB7]">No materials found</div>
        ) : (
          filtered.map((m: Material) => (
            <div
              key={m.id}
              className={`p-3 bg-[#1A1E26] rounded border transition-colors ${selectedId === m.id ? 'border-[#FF6A2A]' : 'border-transparent hover:border-[#222733]'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-[#E7E8EA]">{m.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${getCategoryColor(m.category)}`}>
                      {m.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#A7ADB7]">
                    <span>{m.massKg} kg × {m.qty}</span>
                    <span className={getStatusColor(m.status)}>{m.status}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onSelect(m.id)}
                    className="px-2.5 py-1.5 bg-[#FF6A2A] hover:bg-[#FF7F48] text-white rounded text-sm"
                  >
                    Suggest
                  </button>
                  <button
                    onClick={() => onArchive(m.id)}
                    className="px-2.5 py-1.5 bg-[#12141A] hover:bg-[#1A1E26] text-[#A7ADB7] rounded text-sm"
                  >
                    Archive
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Toolbox = ({ items, onDragStart }: any) => {
  if (items.length === 0) {
    return (
      <div className="bg-[#12141A] border border-[#222733] rounded-lg py-4 text-center text-md text-[#A7ADB7]">
        Add suggestions to your toolbox to place them
      </div>
    );
  }

  return (
    <div className="bg-[#12141A] border border-[#222733] rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Grid3x3 size={16} className="text-[#FF6A2A]" />
        <span className="text-sm font-semibold text-[#E7E8EA]">Toolbox ({items.length})</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((item: Suggestion) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            className="flex-shrink-0 px-3 py-2 bg-[#1A1E26] border border-[#222733] rounded cursor-move hover:border-[#FF6A2A] transition-colors"
          >
            <div className="text-sm font-medium text-[#E7E8EA] mb-1">{item.title}</div>
            <div className="text-sm text-[#A7ADB7]">{item.footprint.w}×{item.footprint.h}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GridCanvas = ({ placed, toolbox, onPlace, onMove, onRotate, onRemove, selectedId, onSelect }: any) => {
  const [dragOver, setDragOver] = useState<{ x: number; y: number; item?: Suggestion } | null>(null);
  const [error, setError] = useState<string>('');
  const gridSize = 10;
  const [cellSize, setCellSize] = useState(40);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new (window as any).ResizeObserver((entries: any[]) => {
      const w = entries[0].contentRect.width;
      const target = Math.max(28, Math.floor((w - 8) / gridSize));
      setCellSize(target);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    const item = JSON.parse(e.dataTransfer.getData('suggestion'));
    setDragOver({ x, y, item });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('suggestion'));
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    if (x < 0 || y < 0 || x + item.footprint.w > gridSize || y + item.footprint.h > gridSize) {
      setError('Item must fit within grid bounds');
      setTimeout(() => setError(''), 2000);
      setDragOver(null);
      return;
    }

    const newItem = { x, y, footprint: item.footprint };
    if (checkCollision(placed, newItem)) {
      setError('Cannot place here - space is occupied');
      setTimeout(() => setError(''), 2000);
      setDragOver(null);
      return;
    }

    onPlace({
      id: `p${Date.now()}`,
      suggestionId: item.id,
      materialId: item.materialId,
      x, y,
      rotation: 0,
      footprint: item.footprint
    });

    setDragOver(null);
    setError('');
  };

  const isValidDrop = dragOver && dragOver.item &&
    dragOver.x >= 0 && dragOver.y >= 0 &&
    dragOver.x + dragOver.item.footprint.w <= gridSize &&
    dragOver.y + dragOver.item.footprint.h <= gridSize &&
    !checkCollision(placed, { x: dragOver.x, y: dragOver.y, footprint: dragOver.item.footprint });

  return (
    <div className="bg-[#12141A] border border-[#222733] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-[#E7E8EA]">Habitat Grid (10×10)</h3>
        {error && (
          <div className="flex items-center gap-1 text-sm text-red-400">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>

      <div ref={wrapRef} className="relative bg-[#0A0A0C] rounded-lg overflow-hidden w-full">
        <div
          className="relative mx-auto"
          style={{ width: 10 * cellSize, height: 10 * cellSize }}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(null)}
          onDrop={handleDrop}
        >
          {/* Grid lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: 10 * cellSize, height: 10 * cellSize }}>
            {Array.from({ length: 11 }).map((_, i) => (
              <React.Fragment key={i}>
                <line x1={i * cellSize} y1={0} x2={i * cellSize} y2={10 * cellSize} stroke="#2A3140" strokeWidth="1" />
                <line x1={0} y1={i * cellSize} x2={10 * cellSize} y2={i * cellSize} stroke="#2A3140" strokeWidth="1" />
              </React.Fragment>
            ))}
          </svg>

          {/* Drag preview */}
          {dragOver && dragOver.item && (
            <div
              className={`absolute pointer-events-none border-2 rounded transition-colors ${isValidDrop ? 'bg-[#FF6A2A]/20 border-[#FF6A2A]' : 'bg-red-500/20 border-red-500'}`}
              style={{
                left: dragOver.x * cellSize,
                top: dragOver.y * cellSize,
                width: dragOver.item.footprint.w * cellSize,
                height: dragOver.item.footprint.h * cellSize
              }}
            />
          )}

          {/* Placed items */}
          {placed.map((item: PlacedItem) => (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`absolute cursor-pointer transition-all ${selectedId === item.id ? 'ring-2 ring-[#FF6A2A] z-10' : 'hover:ring-1 hover:ring-[#FF6A2A]/50'}`}
              style={{
                left: item.x * cellSize,
                top: item.y * cellSize,
                width: item.footprint.w * cellSize,
                height: item.footprint.h * cellSize,
                background: 'linear-gradient(135deg, rgba(255,106,42,0.3), rgba(255,106,42,0.15))',
                borderRadius: '4px'
              }}
            >
              {selectedId === item.id && (
                <div className="absolute -top-8 left-0 flex gap-1 bg-[#12141A] border border-[#222733] rounded p-1 shadow-soft">
                  <button onClick={(e) => { e.stopPropagation(); onRotate(item.id); }} className="p-1 hover:bg-[#1A1E26] rounded" title="Rotate">
                    <RotateCw size={12} className="text-[#E7E8EA]" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onRemove(item.id); }} className="p-1 hover:bg-[#1A1E26] rounded" title="Delete">
                    <Trash2 size={12} className="text-red-400" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {placed.length === 0 && toolbox.length === 0 && (
        <div className="mt-3 p-3 bg-[#1A1E26] rounded text-sm text-[#A7ADB7] text-center">
          Select a material ➜ Add a suggestion ➜ Drag here
        </div>
      )}
    </div>
  );
};

const SuggestionPanel = ({ suggestions, materials, selectedMaterialId, onAdd }: any) => {
  if (!selectedMaterialId) {
    return (
      <div className="bg-[#12141A] border border-[#222733] rounded-lg p-6 text-center">
        <div className="text-sm text-[#A7ADB7]">Select a material from inventory to view reuse suggestions</div>
      </div>
    );
  }

  const material = materials.find((m: Material) => m.id === selectedMaterialId);

  const getEffortColor = (effort: Effort) => {
    const colors = { low: 'bg-green-500/10 text-green-400', med: 'bg-yellow-500/10 text-yellow-400', high: 'bg-red-500/10 text-red-400' };
    return colors[effort];
  };

  const getBenefitColor = (benefit: Benefit) => {
    const colors = {
      thermal: 'bg-orange-500/10 text-orange-400',
      structural: 'bg-blue-500/10 text-blue-400',
      storage: 'bg-purple-500/10 text-purple-400',
      safety: 'bg-green-500/10 text-green-400',
      acoustic: 'bg-pink-500/10 text-pink-400',
      electrical: 'bg-cyan-500/10 text-cyan-400'
    };
    return colors[benefit];
  };

  return (
    <div className="bg-[#12141A] border border-[#222733] rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[#E7E8EA] mb-1">Reuse Suggestions</h3>
        {material && <p className="text-sm text-[#A7ADB7]">For: {material.name}</p>}
      </div>

      <div className="space-y-3 max-h-[450px] overflow-y-auto">
        {suggestions.length === 0 ? (
          <div className="text-sm text-[#A7ADB7] text-center py-4">No suggestions available</div>
        ) : (
          suggestions.map((s: Suggestion) => (
            <div key={s.id} className="p-3 bg-[#1A1E26] rounded border border-[#222733] hover:border-[#FF6A2A]/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-[#E7E8EA]">{s.title}</h4>
                <span className="text-sm text-[#A7ADB7]">{s.footprint.w}×{s.footprint.h}</span>
              </div>
              <p className="text-sm text-[#A7ADB7] mb-3">{s.rationale}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${getEffortColor(s.effort)}`} title="Crew effort required">
                    {s.effort} effort
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${getBenefitColor(s.benefit)}`} title="Primary benefit">
                    {s.benefit}
                  </span>
                </div>
                <button
                  onClick={() => onAdd(s)}
                  className="px-3 py-1.5 bg-[#FF6A2A] hover:bg-[#FF7F48] text-white rounded text-sm font-medium"
                >
                  Add to Toolbox
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Split analytics: top-center card
const AnalyticsPanel = ({ metrics }: any) => {
  const { totalMass, reusedMass, reusePercent } = metrics;

  return (
    <div className="bg-[#12141A] border border-[#222733] rounded-lg p-4">
      <h3 className="text-base font-semibold text-[#E7E8EA] mb-4">Analytics</h3>

      <div className="mb-6">
        <div className="text-center mb-2">
          <div className="text-3xl md:text-4xl font-bold text-[#FF6A2A]">{reusePercent}%</div>
          <div className="text-sm text-[#A7ADB7]">Mass Reused</div>
        </div>
        <div className="h-2 bg-[#1A1E26] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#FF6A2A] to-[#2BD576] rounded-full transition-all" style={{ width: `${reusePercent}%` }} />
        </div>
      </div>

      <div className="space-y-3 mb-2">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-[#A7ADB7]">Mass Reused</span>
            <span className="text-[#E7E8EA] font-medium">{reusedMass.toFixed(1)} kg</span>
          </div>
          <div className="h-1.5 bg-[#1A1E26] rounded-full overflow-hidden">
            <div className="h-full bg-[#2BD576] rounded-full" style={{ width: totalMass > 0 ? `${(reusedMass / totalMass) * 100}%` : '0%' }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-[#A7ADB7]">Total Available</span>
            <span className="text-[#E7E8EA] font-medium">{totalMass.toFixed(1)} kg</span>
          </div>
          <div className="h-1.5 bg-[#1A1E26] rounded-full overflow-hidden">
            <div className="h-full bg-[#FF6A2A] rounded-full" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#222733]">
        <p className="text-sm text-[#A7ADB7]">
          <strong className="text-[#E7E8EA]">Assumptions:</strong> Mass counts when first placed item uses material. Launch cost ~$10k/kg.
        </p>
      </div>
    </div>
  );
};

// New: separate Mass by Category card for the right column
const MassByCategoryPanel = ({ massByCategory }: { massByCategory: Record<string, number> }) => (
  <div className="bg-[#12141A] border border-[#222733] rounded-lg p-4">
    <h4 className="text-base font-semibold text-[#E7E8EA] mb-4">Mass by Category</h4>
    <div className="space-y-2">
      {Object.entries(massByCategory).map(([cat, mass]) => (
        <div key={cat} className="flex items-center justify-between text-sm">
          <span className="text-[#A7ADB7]">{cat}</span>
          <span className="text-[#E7E8EA]">{(mass as number).toFixed(1)} kg</span>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// MAIN APP
// ============================================================================

export default function ResidenceRenovations() {
  const { state, actions } = useAppState();
  const metrics = getMetrics(state);
  const [draggedItem, setDraggedItem] = useState<Suggestion | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        actions.setSelectedPlaced(undefined);
      } else if (e.key === 'r' || e.key === 'R') {
        if (state.ui.selectedPlacedId) {
          actions.rotateItem(state.ui.selectedPlacedId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.ui.selectedPlacedId]);

  const handleDragStart = (e: React.DragEvent, item: Suggestion) => {
    e.dataTransfer.setData('suggestion', JSON.stringify(item));
    setDraggedItem(item);
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-[#0A0A0C] text-[#E7E8EA] text-[14px] md:text-[15px] lg:text-[16px]"
      style={{
        backgroundImage:
          "radial-gradient(1200px 500px at 50% -80px, rgba(255,106,42,0.16), transparent), radial-gradient(800px 300px at 30% -60px, rgba(255,106,42,0.08), transparent)",
      }}
    >
      {state.ui.showOnboarding && (
        <OnboardingModal onClose={actions.hideOnboarding} />
      )}

      <HeaderBar onExport={actions.exportJSON} onReset={actions.resetApp} />

      {/* Main */}
      <main className="flex-grow max-w-[1600px] mx-auto px-6 py-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
                  <Galaxy 
                    mouseRepulsion={true}
                    mouseInteraction={true}
                    density={5}
                    glowIntensity={0.1}
                    saturation={0.1}
                    twinkleIntensity={1}
                    rotationSpeed={0.05}
                    hueShift={150}
                  />
                </div>
        <div className="grid grid-cols-1 lg:grid-cols-13 gap-2 z-100">
          {/* Left Column - Inventory */}
          <div className="lg:col-span-4 space-y-2">
            <AddMaterialForm onAdd={actions.addMaterial} />
            <InventoryTable
              materials={state.materials}
              selectedId={state.ui.selectedMaterialId}
              onSelect={actions.setSelectedMaterial}
              onArchive={actions.archiveMaterial}
            />
            <MassByCategoryPanel massByCategory={metrics.massByCategory} />
          </div>

          {/* Center Column - Analytics (top) → Toolbox → Grid */}
          <div className="lg:col-span-5 space-y-2">
            
            <Toolbox items={state.toolbox} onDragStart={handleDragStart} />
            <GridCanvas
              placed={state.placed}
              toolbox={state.toolbox}
              onPlace={actions.placeItem}
              onMove={actions.moveItem}
              onRotate={actions.rotateItem}
              onRemove={actions.removeItem}
              selectedId={state.ui.selectedPlacedId}
              onSelect={actions.setSelectedPlaced}
            />
          </div>

          {/* Right Column - Suggestions (top) → Mass by Category (bottom) */}
          <div className="lg:col-span-4 space-y-2">
            <AnalyticsPanel metrics={metrics} />
            <SuggestionPanel
              suggestions={state.suggestions}
              materials={state.materials}
              selectedMaterialId={state.ui.selectedMaterialId}
              onAdd={actions.addToToolbox}
            />
            
          </div>
        </div>
      </main>

      {/* Footer */}
      
    </div>
  );
}
