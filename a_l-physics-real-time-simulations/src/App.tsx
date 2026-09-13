import React, { useState, useEffect, useMemo } from "react";
import { PRACTICALS_DATA } from "./data/practicals";
import { PracticalItem } from "./types";
import { HomePage } from "./components/HomePage";
import { SimulationViewport } from "./components/SimulationViewport";
import { ObservationDataTable } from "./components/ObservationDataTable";
import { AIAssistantChat } from "./components/AIAssistantChat";
import {
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  Atom,
  Check,
  ChevronDown,
  Layers,
  ArrowLeft,
  Home,
  Sliders,
} from "lucide-react";

export default function App() {
  const [viewMode, setViewMode] = useState<"home" | "lab">("home");
  const [currentPracticalId, setCurrentPracticalId] = useState<string>("prac-1");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [controlValues, setControlValues] = useState<Record<string, number>>({});
  const [readings, setReadings] = useState<
    Array<{ id: string; timestamp: number; values: Record<string, number> }>
  >([]);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string | undefined>(undefined);

  const categories = [
    "All",
    "Mechanics & Matter",
    "Hydrostatics & Fluids",
    "Oscillations & Waves",
    "Geometrical Optics",
    "Thermal Physics",
    "Electricity & Electronics",
  ];

  const currentPractical = useMemo(() => {
    return (
      PRACTICALS_DATA.find((p) => p.id === currentPracticalId) || PRACTICALS_DATA[0]
    );
  }, [currentPracticalId]);

  // Filtered practicals list for the lab workbench
  const visiblePracticals = useMemo(() => {
    return PRACTICALS_DATA.filter((p) => {
      const matchCat =
        selectedCategory === "All" || p.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.number.toLowerCase().includes(query) ||
        p.formula.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Initialize control values whenever practical changes
  useEffect(() => {
    const defaults: Record<string, number> = {};
    currentPractical.controls.forEach((c) => {
      defaults[c.id] = c.defaultValue;
    });
    setControlValues(defaults);
    setReadings([]); // clear trial readings on practical switch
  }, [currentPracticalId]);

  const handleControlChange = (id: string, val: number) => {
    setControlValues((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const handleResetControls = () => {
    const defaults: Record<string, number> = {};
    currentPractical.controls.forEach((c) => {
      defaults[c.id] = c.defaultValue;
    });
    setControlValues(defaults);
  };

  const handleRecordReading = () => {
    const newEntry = {
      id: `reading-${Date.now()}`,
      timestamp: Date.now(),
      values: { ...controlValues },
    };
    setReadings((prev) => [...prev, newEntry]);
  };

  const handleClearReadings = () => {
    setReadings([]);
  };

  const handleDeleteReading = (id: string) => {
    setReadings((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAskAIAboutStep = (query: string) => {
    setAiInitialQuery(query);
    setIsAIChatOpen(true);
  };

  const handleSelectPractical = (id: string) => {
    setCurrentPracticalId(id);
    setViewMode("lab");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenAITutor = (query?: string) => {
    if (query) setAiInitialQuery(query);
    setIsAIChatOpen(true);
  };

  // Carousel navigator
  const currentIndex = PRACTICALS_DATA.findIndex((p) => p.id === currentPracticalId);
  const prevPractical = currentIndex > 0 ? PRACTICALS_DATA[currentIndex - 1] : null;
  const nextPractical =
    currentIndex < PRACTICALS_DATA.length - 1 ? PRACTICALS_DATA[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden font-sans">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[25%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[150px]" />
        <div className="absolute top-[40%] right-[5%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[160px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      {/* Global Navigation Header (Unified across Home & Lab) */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setViewMode("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Atom className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                    PHYSICS LAB
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-semibold">
                    42 PRACTICALS
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden md:block">
                  G.C.E. Advanced Level Real-Time Simulations
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs: Home & Workbench */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => {
                setViewMode("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                viewMode === "home"
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                setViewMode("lab");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                viewMode === "lab"
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Workbench</span>
            </button>
          </div>

          {/* Direct 1-Click Dropdown Practical Selector (Works anywhere!) */}
          <div className="relative flex-1 max-w-xs hidden lg:block">
            <select
              value={currentPracticalId}
              onChange={(e) => handleSelectPractical(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer hover:bg-slate-850 transition-colors"
            >
              {categories.map((cat) => {
                const groupPracticals =
                  cat === "All"
                    ? []
                    : PRACTICALS_DATA.filter((p) => p.category === cat);
                if (cat === "All" || groupPracticals.length === 0) return null;
                return (
                  <optgroup
                    key={cat}
                    label={`── ${cat.toUpperCase()} ──`}
                    className="bg-slate-900 text-cyan-400 font-bold"
                  >
                    {groupPracticals.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                        className="bg-slate-950 text-slate-100 font-normal"
                      >
                        #{p.number} — {p.title}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* AI Tutor Button */}
          <button
            onClick={() => handleOpenAITutor()}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Ask AI Tutor</span>
            <span className="sm:hidden">AI Tutor</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {viewMode === "home" ? (
        <HomePage
          practicals={PRACTICALS_DATA}
          onSelectPractical={handleSelectPractical}
          onEnterLab={() => {
            setViewMode("lab");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onOpenAITutor={handleOpenAITutor}
        />
      ) : (
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-6">
          {/* Back to Home & Sequential Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setViewMode("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                title="Return to Home Page"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <div className="h-4 w-px bg-slate-800 hidden sm:block" />

              <span className="text-xs font-mono text-cyan-400 hidden sm:inline font-semibold">
                EXP #{currentPractical.number}
              </span>
              <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                {currentPractical.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {prevPractical && (
                <button
                  onClick={() => setCurrentPracticalId(prevPractical.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Prev</span>
                </button>
              )}

              <span className="text-[11px] font-mono text-slate-400 px-1">
                {currentIndex + 1} / 42
              </span>

              {nextPractical && (
                <button
                  onClick={() => setCurrentPracticalId(nextPractical.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span className="hidden md:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Simple Practical Selector Strip */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-xl space-y-3 shadow-xl">
            {/* Top Row: Category Tabs & Instant Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/25 font-semibold"
                        : "bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full md:w-64 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search practicals..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Row: 1-Click Horizontal Carousel of Practicals */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none pt-1">
              {visiblePracticals.map((p) => {
                const isSelected = p.id === currentPracticalId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCurrentPracticalId(p.id)}
                    className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-2 shrink-0 border ${
                      isSelected
                        ? "bg-cyan-950/70 border-cyan-400 text-white font-bold ring-1 ring-cyan-400 shadow-md shadow-cyan-500/10"
                        : "bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-cyan-400 text-slate-950 font-bold"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      #{p.number}
                    </span>
                    <span className="max-w-[170px] truncate text-left">{p.title}</span>
                    {isSelected && <Check className="w-3 h-3 text-cyan-400 ml-0.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Interactive Simulation Stage */}
          <SimulationViewport
            practical={currentPractical}
            controlValues={controlValues}
            onControlChange={handleControlChange}
            onResetControls={handleResetControls}
            onRecordReading={handleRecordReading}
            onAskAIAboutStep={handleAskAIAboutStep}
          />

          {/* Observation Data Table & Linear Regression Plot */}
          <ObservationDataTable
            practical={currentPractical}
            controlValues={controlValues}
            recordedReadings={readings}
            onClearReadings={handleClearReadings}
            onDeleteReading={handleDeleteReading}
          />

          {/* All 42 Practicals Grid Browser */}
          <section className="pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  All 42 Prescribed Practical Cards
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Showing {visiblePracticals.length} practicals
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {visiblePracticals.map((p) => {
                const isCurrent = p.id === currentPracticalId;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setCurrentPracticalId(p.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                      isCurrent
                        ? "bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400"
                        : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] font-semibold">
                          EXP #{p.number}
                        </span>
                        <span className="text-[10px] text-slate-500">{p.category}</span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
                        {p.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                        {p.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-cyan-400/80 truncate max-w-[180px]">
                        {p.formula}
                      </span>
                      <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center font-medium">
                        Simulate <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {/* AI Lab Assistant Drawer */}
      <AIAssistantChat
        practical={currentPractical}
        currentReadings={controlValues}
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        initialQuery={aiInitialQuery}
      />
    </div>
  );
}
