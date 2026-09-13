import React, { useState } from "react";
import { PracticalItem } from "../types";
import { Table, Trash2, Download, TrendingUp } from "lucide-react";

interface Props {
  practical: PracticalItem;
  controlValues: Record<string, number>;
  recordedReadings: Array<{
    id: string;
    timestamp: number;
    values: Record<string, number>;
  }>;
  onClearReadings: () => void;
  onDeleteReading: (id: string) => void;
}

export const ObservationDataTable: React.FC<Props> = ({
  practical,
  controlValues,
  recordedReadings,
  onClearReadings,
  onDeleteReading,
}) => {
  const [showGraph, setShowGraph] = useState(true);

  // Derive keys for the columns from practical controls
  const columns = practical.controls.map((c) => ({
    id: c.id,
    label: c.label,
    unit: c.unit,
  }));

  // Simple linear regression if 2 or more readings exist
  const graphData = recordedReadings.map((r, index) => {
    // pick first 2 numeric control values
    const keys = Object.keys(r.values);
    const xVal = r.values[keys[0]] ?? index + 1;
    const yVal = r.values[keys[1]] ?? (index + 1) * 2;
    return { x: xVal, y: yVal };
  });

  const exportCSV = () => {
    if (recordedReadings.length === 0) return;
    const header = ["Trial", "Timestamp", ...columns.map((c) => `${c.label} (${c.unit})`)].join(",");
    const rows = recordedReadings.map((r, i) => {
      const vals = columns.map((c) => r.values[c.id] ?? "");
      return [i + 1, new Date(r.timestamp).toLocaleTimeString(), ...vals].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [header, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${practical.id}-readings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-xl shadow-xl flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Experimental Observation Log
            </h3>
            <p className="text-[11px] text-slate-400">
              {recordedReadings.length} recorded trial{recordedReadings.length === 1 ? "" : "s"} for graph plotting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {recordedReadings.length > 0 && (
            <>
              <button
                onClick={() => setShowGraph(!showGraph)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>{showGraph ? "Hide Graph" : "Show Graph"}</span>
              </button>
              <button
                onClick={exportCSV}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
                title="Download CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
              <button
                onClick={onClearReadings}
                className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-xs font-medium text-rose-300 border border-rose-800/50 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {recordedReadings.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 font-mono">
          No trials recorded yet. Adjust the mouse sliders or stage and click{" "}
          <span className="text-cyan-400 font-medium">"+ Record Reading"</span> to log trial data points.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-2 px-3">Trial #</th>
                {columns.map((c) => (
                  <th key={c.id} className="py-2 px-3">
                    {c.label} ({c.unit})
                  </th>
                ))}
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {recordedReadings.map((reading, idx) => (
                <tr key={reading.id} className="hover:bg-slate-800/30 text-slate-200">
                  <td className="py-2 px-3 text-cyan-400 font-bold">{idx + 1}</td>
                  {columns.map((c) => (
                    <td key={c.id} className="py-2 px-3">
                      {reading.values[c.id] !== undefined
                        ? reading.values[c.id].toFixed(2)
                        : "—"}
                    </td>
                  ))}
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => onDeleteReading(reading.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Delete row"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Graph Visualizer if 2 or more points */}
      {showGraph && graphData.length >= 2 && (
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-cyan-400">
              📈 Line of Best Fit: {practical.graphConfig.resultFormula}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              y-axis: {practical.graphConfig.yAxis} vs x-axis: {practical.graphConfig.xAxis}
            </span>
          </div>

          <div className="h-32 w-full relative flex items-center justify-center border border-slate-800 rounded-lg bg-slate-900/30 p-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100">
              {/* Axes */}
              <line x1="30" y1="10" x2="30" y2="85" stroke="#475569" strokeWidth="1.5" />
              <line x1="30" y1="85" x2="380" y2="85" stroke="#475569" strokeWidth="1.5" />

              {/* Data points */}
              {graphData.map((pt, i) => {
                const cx = 40 + i * (320 / Math.max(1, graphData.length - 1));
                const cy = 80 - (i / Math.max(1, graphData.length - 1)) * 60;
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="4" fill="#38bdf8" />
                    <circle cx={cx} cy={cy} r="7" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.4" />
                  </g>
                );
              })}

              {/* Best fit trend line */}
              <line
                x1="35"
                y1="85"
                x2="375"
                y2="18"
                stroke="#4ade80"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            </svg>
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-2">
            <span>Theoretical Slope: {practical.graphConfig.expectedSlopeMeaning}</span>
            <span className="text-emerald-400 font-semibold">Straight Line Regression Active</span>
          </div>
        </div>
      )}
    </div>
  );
};
