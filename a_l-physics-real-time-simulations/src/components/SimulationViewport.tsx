import React from "react";
import { PracticalItem } from "../types";
import { VernierMicrometerSim } from "./simulations/VernierMicrometerSim";
import { MechanicsForcesSim } from "./simulations/MechanicsForcesSim";
import { PendulumSpringSim } from "./simulations/PendulumSpringSim";
import { SonometerSoundSim } from "./simulations/SonometerSoundSim";
import { OpticsBenchSim } from "./simulations/OpticsBenchSim";
import { ElectricityElectronicsSim } from "./simulations/ElectricityElectronicsSim";
import { FluidsCapillarySim } from "./simulations/FluidsCapillarySim";
import { SpectrometerPrismSim } from "./simulations/SpectrometerPrismSim";
import { HeatThermalSim } from "./simulations/HeatThermalSim";
import { TravellingMicroscopeSim } from "./simulations/TravellingMicroscopeSim";
import { Sliders, RotateCcw, BookOpen, AlertCircle, Sparkles } from "lucide-react";

interface Props {
  practical: PracticalItem;
  controlValues: Record<string, number>;
  onControlChange: (id: string, val: number) => void;
  onResetControls: () => void;
  onRecordReading?: () => void;
  onAskAIAboutStep?: (step: string) => void;
}

export const SimulationViewport: React.FC<Props> = ({
  practical,
  controlValues,
  onControlChange,
  onResetControls,
  onRecordReading,
  onAskAIAboutStep,
}) => {
  // Determine which simulation component to render
  const renderSimulationCanvas = () => {
    const id = practical.id;

    if (id === "prac-1" || id === "prac-2" || id === "prac-3") {
      return (
        <VernierMicrometerSim
          practical={practical}
          controlValues={controlValues}
          onControlChange={onControlChange}
          onRecordReading={onRecordReading}
        />
      );
    }
    if (id === "prac-4" || id === "prac-16") {
      return (
        <TravellingMicroscopeSim
          practical={practical}
          controlValues={controlValues}
          onControlChange={onControlChange}
          onRecordReading={onRecordReading}
        />
      );
    }
    if (id === "prac-5" || id === "prac-6" || id === "prac-38") {
      return (
        <MechanicsForcesSim
          practical={practical}
          controlValues={controlValues}
          onControlChange={onControlChange}
          onRecordReading={onRecordReading}
        />
      );
    }
    if (id === "prac-10" || id === "prac-11") {
      return (
        <PendulumSpringSim
          practical={practical}
          controlValues={controlValues}
          onControlChange={onControlChange}
          onRecordReading={onRecordReading}
        />
      );
    }
    if (id === "prac-12" || id === "prac-13" || id === "prac-14" || id === "prac-15") {
      return (
        <SonometerSoundSim
          practical={practical}
          controlValues={controlValues}
          onControlChange={onControlChange}
          onRecordReading={onRecordReading}
        />
      );
    }
    if (id === "prac-17" || id === "prac-18" || id === "prac-19" || id === "prac-20") {
      return (
        <SpectrometerPrismSim
          practical={practical}
          controlValues={controlValues}
          onControlChange={onControlChange}
          onRecordReading={onRecordReading}
        />
      );
    }
    if (id === "prac-21-1" || id === "prac-21-2") {
      return (
        <OpticsBenchSim
          practical={practical}
          controlValues={controlValues}
          onControlChange={onControlChange}
          onRecordReading={onRecordReading}
        />
      );
    }
    if (
      id === "prac-23" ||
      id === "prac-24" ||
      id === "prac-25" ||
      id === "prac-26" ||
      id === "prac-27" ||
      id === "prac-28" ||
      id === "prac-29" ||
      id === "prac-30"
    ) {
      return (
        <HeatThermalSim
          practical={practical}
          controlValues={controlValues}
          onControlChange={onControlChange}
          onRecordReading={onRecordReading}
        />
      );
    }
    if (
      id === "prac-7" ||
      id === "prac-8" ||
      id === "prac-9" ||
      id === "prac-22" ||
      id === "prac-39" ||
      id === "prac-40" ||
      id === "prac-41" ||
      id === "prac-42"
    ) {
      return (
        <FluidsCapillarySim
          practical={practical}
          controlValues={controlValues}
          onControlChange={onControlChange}
          onRecordReading={onRecordReading}
        />
      );
    }
    // Default: Electricity and Electronics (prac-31 to prac-37)
    return (
      <ElectricityElectronicsSim
        practical={practical}
        controlValues={controlValues}
        onControlChange={onControlChange}
        onRecordReading={onRecordReading}
      />
    );
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Simulation Stage Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[11px] font-semibold">
              EXPERIMENT #{practical.number}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/50 text-slate-300 font-medium text-[11px]">
              {practical.category}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {practical.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetControls}
            className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            title="Reset controls to default values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Controls</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {renderSimulationCanvas()}

      {/* Mouse Sliders & Interactive Controls Panel */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Mouse & Precision Fine Tuning Controls
          </div>
          <span className="text-[11px] text-slate-400">
            {practical.controls.length} interactive parameter{practical.controls.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {practical.controls.map((ctl) => {
            const currentVal = controlValues[ctl.id] ?? ctl.defaultValue;
            return (
              <div
                key={ctl.id}
                className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/70 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor={ctl.id} className="text-xs font-medium text-slate-200">
                    {ctl.label}
                  </label>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50">
                    {typeof currentVal === "number" ? currentVal.toFixed(ctl.step < 0.1 ? 2 : 1) : currentVal}{" "}
                    <span className="text-[10px] text-cyan-300/70 font-normal">{ctl.unit}</span>
                  </span>
                </div>

                <input
                  id={ctl.id}
                  type="range"
                  min={ctl.min}
                  max={ctl.max}
                  step={ctl.step}
                  value={currentVal}
                  onChange={(e) => onControlChange(ctl.id, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                />

                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>
                    {ctl.min} {ctl.unit}
                  </span>
                  <span>
                    {ctl.max} {ctl.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theory, Formula, and Essential Precautions Accordion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Core Formula Card */}
        <div className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              Governing Equation
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/30 text-center font-mono font-bold text-cyan-300 text-sm md:text-base my-2">
              {practical.formula}
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mt-2">
            Derived directly from G.C.E. A/L Physics syllabus principles.
          </p>
        </div>

        {/* Essential Precautions */}
        <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-950/15 backdrop-blur-xl lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 font-mono uppercase tracking-wider mb-2">
              <AlertCircle className="w-4 h-4" />
              Syllabus Precautions & Sources of Error
            </div>
            <ul className="space-y-1.5 mt-2">
              {practical.precautions.map((prec, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{prec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 pt-2 border-t border-amber-500/10 flex items-center justify-between text-[11px] text-amber-400/80">
            <span>Frequently tested in A/L Structured Essay Paper</span>
            {onAskAIAboutStep && (
              <button
                onClick={() =>
                  onAskAIAboutStep(
                    `Explain the key precautions and practical exam tricks for "${practical.title}" (${practical.formula})`
                  )
                }
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                Ask AI Assistant
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
