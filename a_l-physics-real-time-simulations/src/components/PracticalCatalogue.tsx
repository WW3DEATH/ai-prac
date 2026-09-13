import React, { useState } from "react";
import { PracticalItem } from "../types";
import { Search, Filter, Compass, ChevronRight, Sparkles } from "lucide-react";

interface Props {
  practicals: PracticalItem[];
  currentPracticalId: string;
  onSelectPractical: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const PracticalCatalogue: React.FC<Props> = ({
  practicals,
  currentPracticalId,
  onSelectPractical,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(practicals.map((p) => p.category)))];

  const filtered = practicals.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.formula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[85vh] bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Compass className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                All 42 A/L Physics Practicals Catalog
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Interactive simulations covering every prescribed practical in the G.C.E. Advanced Level syllabus
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/50 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by experiment name, formula, or number..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs md:text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Practicals Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((item) => {
            const isSelected = item.id === currentPracticalId;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectPractical(item.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? "bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50"
                    : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] font-semibold">
                      EXP #{item.number}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {item.category}
                    </span>
                  </div>

                  <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
                    {item.title}
                  </h4>

                  <p className="text-[11px] font-mono text-cyan-400/80 line-clamp-1 mb-2">
                    {item.formula}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                  <span className="text-slate-500">
                    {item.controls.length} interactive controls
                  </span>
                  <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center font-medium">
                    Open Lab <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filtered.length} of {practicals.length} practicals</span>
          <span className="text-slate-500">Mouse-driven real-time physics simulation suite</span>
        </div>
      </div>
    </div>
  );
};
