import React, { useRef, useEffect, useState } from "react";
import { PracticalItem } from "../../types";

interface Props {
  practical: PracticalItem;
  controlValues: Record<string, number>;
  onControlChange: (id: string, val: number) => void;
  onRecordReading?: () => void;
}

export const FluidsCapillarySim: React.FC<Props> = ({
  practical,
  controlValues,
  onControlChange,
  onRecordReading,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const isUtube = practical.id === "prac-7";
  const isHares = practical.id === "prac-8";
  const isCapillary = practical.id === "prac-41";
  const isJaegers = practical.id === "prac-42";
  const isPoiseuille = practical.id === "prac-39";
  const isQuill = practical.id === "prac-22";

  // Controls
  const waterColH = controlValues["waterHeightH1"] ?? (controlValues["suctionH"] ?? (controlValues["manometerH"] ?? 22));
  const oilDensity = controlValues["oilDensity"] ?? 800; // kg/m3
  const capRadius = controlValues["tubeRadiusR"] ?? 0.35; // mm
  const pressHead = controlValues["pressureHeadH"] ?? 25; // cm

  useEffect(() => {
    let lastStamp = performance.now();

    const render = (now: number) => {
      const dt = (now - lastStamp) / 1000;
      lastStamp = now;
      timeRef.current += dt;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Dark canvas
      ctx.clearRect(0, 0, width, height);
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#08101e");
      bg.addColorStop(1, "#04070e");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;

      if (isUtube) {
        // --- 7. U-TUBE RELATIVE DENSITY ---
        // h_water * d_water = h_oil * d_oil => h_oil = h_water * (1000 / d_oil)
        const d_water = 1000;
        const h_water = waterColH;
        const h_oil = (h_water * d_water) / oilDensity;

        const uX = centerX - 60;
        const uW = 120;
        const uBottomY = 280;
        const limbW = 26;

        // Draw U-tube glass
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Left limb
        ctx.moveTo(uX, 70);
        ctx.lineTo(uX, uBottomY);
        ctx.lineTo(uX + uW, uBottomY);
        ctx.lineTo(uX + uW, 70);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(uX + limbW, 70);
        ctx.lineTo(uX + limbW, uBottomY - limbW);
        ctx.lineTo(uX + uW - limbW, uBottomY - limbW);
        ctx.lineTo(uX + uW - limbW, 70);
        ctx.stroke();

        // Common interface line (zero level)
        const interfaceY = uBottomY - 40;
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = "rgba(244, 63, 94, 0.6)";
        ctx.beginPath();
        ctx.moveTo(uX - 25, interfaceY);
        ctx.lineTo(uX + uW + 25, interfaceY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Water column (Right limb)
        const waterTopY = interfaceY - h_water * 3.5;
        ctx.fillStyle = "rgba(56, 189, 248, 0.6)";
        ctx.fillRect(uX + uW - limbW + 2, waterTopY, limbW - 4, uBottomY - waterTopY - 2);
        // Bottom bend water
        ctx.fillRect(uX + limbW, uBottomY - limbW, uW - 2 * limbW, limbW - 2);

        // Oil column (Left limb)
        const oilTopY = interfaceY - h_oil * 3.5;
        ctx.fillStyle = "rgba(234, 179, 8, 0.65)";
        ctx.fillRect(uX + 2, oilTopY, limbW - 4, interfaceY - oilTopY);

        // Water in left limb below interface
        ctx.fillStyle = "rgba(56, 189, 248, 0.6)";
        ctx.fillRect(uX + 2, interfaceY, limbW - 4, uBottomY - interfaceY - 2);

        // Meniscus curves
        ctx.strokeStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(uX + uW - limbW / 2, waterTopY - 2, limbW / 2 - 2, 0, Math.PI);
        ctx.stroke();

        ctx.strokeStyle = "#eab308";
        ctx.beginPath();
        ctx.arc(uX + limbW / 2, oilTopY - 2, limbW / 2 - 2, 0, Math.PI);
        ctx.stroke();

        // HUD
        ctx.fillStyle = "#f8fafc";
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.fillText(`Water Column Height (hw): ${h_water.toFixed(1)} cm`, 24, 30);
        ctx.fillText(`Liquid Density (d_oil): ${oilDensity} kg/m³`, 24, 52);
        ctx.fillStyle = "#eab308";
        ctx.fillText(`Liquid Column Height (hl): ${h_oil.toFixed(1)} cm`, 24, 74);
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 15px 'JetBrains Mono', monospace";
        ctx.fillText(`Relative Density = hw / hl = ${(h_water / h_oil).toFixed(3)} (d_oil = ${(1000 * h_water / h_oil).toFixed(0)} kg/m³)`, 24, 102);

      } else if (isJaegers) {
        // --- 42. JAEGER'S METHOD FOR SURFACE TENSION ---
        // Bubbles form at orifice of capillary tube in beaker of water
        const beakerX = width / 2 + 30;
        const beakerY = 120;
        const beakerW = 160;
        const beakerH = 170;

        // Beaker with water
        ctx.fillStyle = "rgba(56, 189, 248, 0.18)";
        ctx.fillRect(beakerX, beakerY + 30, beakerW, beakerH - 30);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 3;
        ctx.strokeRect(beakerX, beakerY, beakerW, beakerH);

        // Capillary tube dipping in beaker
        const capX = beakerX + beakerW / 2;
        const capDipY = beakerY + 110;
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(capX, 50);
        ctx.lineTo(capX, capDipY);
        ctx.stroke();

        // Bubble growth animation at capillary orifice
        const bubbleCycle = (timeRef.current * 1.8) % 1; // 0 to 1
        const bubbleR = 4 + bubbleCycle * 14;
        const bubbleY = capDipY + bubbleR;

        // Hemispherical bubble at tip
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.beginPath();
        ctx.arc(capX, bubbleY, bubbleR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Detached rising bubbles
        if (bubbleCycle > 0.85) {
          const rise = (timeRef.current * 50) % 70;
          ctx.beginPath();
          ctx.arc(capX + 4, capDipY - rise, 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Manometer on left side
        const manX = 140;
        const manY = 100;
        const manW = 60;
        const manH = 180;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 3;
        ctx.strokeRect(manX, manY, 20, manH);
        ctx.strokeRect(manX + 40, manY, 20, manH);

        // Manometer difference (h)
        const manDiffPx = 35 + bubbleCycle * 25;
        ctx.fillStyle = "rgba(244, 63, 94, 0.7)";
        ctx.fillRect(manX + 2, manY + 80 + manDiffPx / 2, 16, manH - 82 - manDiffPx / 2);
        ctx.fillRect(manX + 42, manY + 80 - manDiffPx / 2, 16, manH - 82 + manDiffPx / 2);

        // HUD
        const h_manometer = 12.4 + bubbleCycle * 2.8;
        const h_depth = 4.2;
        const T = 0.072; // N/m
        ctx.fillStyle = "#f8fafc";
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.fillText(`Manometer Reading (h): ${h_manometer.toFixed(1)} cm`, 24, 30);
        ctx.fillText(`Orifice Immersion Depth (h1): ${h_depth.toFixed(1)} cm`, 24, 52);
        ctx.fillText(`Capillary Orifice Radius (r): 0.28 mm`, 24, 74);
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 15px 'JetBrains Mono', monospace";
        ctx.fillText(`Calculated Surface Tension T = ${(T * 1000).toFixed(1)} mN/m (0.072 N/m)`, 24, 102);

      } else {
        // --- 41. CAPILLARY RISE METHOD ---
        // T = (r * h * d * g) / 2
        const hRiseCm = 4.8;
        const beakerX = width / 2 - 100;
        const beakerY = 150;
        const beakerW = 200;
        const beakerH = 140;

        // Beaker with clear water
        ctx.fillStyle = "rgba(56, 189, 248, 0.2)";
        ctx.fillRect(beakerX, beakerY + 30, beakerW, beakerH - 30);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 3;
        ctx.strokeRect(beakerX, beakerY, beakerW, beakerH);

        // Capillary Tube
        const capX = width / 2;
        const tubeW = 16;
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(capX - tubeW / 2, 60, tubeW, 200);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(capX - tubeW / 2, 60, tubeW, 200);

        // Capillary liquid column rising above beaker level
        const waterSurfaceY = beakerY + 30;
        const meniscusY = waterSurfaceY - hRiseCm * 15;
        ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
        ctx.fillRect(capX - tubeW / 2 + 2, meniscusY, tubeW - 4, waterSurfaceY - meniscusY + 70);

        // Concave Meniscus
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(capX, meniscusY - 2, tubeW / 2 - 2, 0, Math.PI);
        ctx.stroke();

        // Travelling microscope pointer indicator
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(capX + 30, meniscusY);
        ctx.lineTo(capX + 12, meniscusY);
        ctx.stroke();

        ctx.fillStyle = "#f59e0b";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText("Microscope Crosshair", capX + 35, meniscusY + 4);

        // HUD
        ctx.fillStyle = "#f8fafc";
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.fillText(`Capillary Bore Radius (r): ${capRadius.toFixed(2)} mm`, 24, 30);
        ctx.fillText(`Meniscus Height (h): ${hRiseCm.toFixed(2)} cm`, 24, 52);
        ctx.fillText(`Liquid Density (ρ): 1000 kg/m³`, 24, 74);
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 15px 'JetBrains Mono', monospace";
        const T = (capRadius * 1e-3 * (hRiseCm * 1e-2) * 1000 * 9.81) / 2;
        ctx.fillText(`Surface Tension T = ${(T * 1000).toFixed(1)} mN/m (${T.toFixed(3)} N/m)`, 24, 102);
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isUtube, isJaegers, isCapillary, waterColH, oilDensity, capRadius, pressHead]);

  // Mouse drag handler on canvas
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (isUtube) {
      const h = 10 + ratio * 25;
      onControlChange("waterHeightH1", Number(h.toFixed(1)));
    } else if (isCapillary) {
      const r = 0.15 + ratio * 0.5;
      onControlChange("tubeRadiusR", Number(r.toFixed(2)));
    } else {
      const p = 10 + ratio * 30;
      onControlChange("pressureHeadH", Number(p.toFixed(1)));
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950/70 shadow-2xl backdrop-blur-md">
        <canvas
          ref={canvasRef}
          width={760}
          height={380}
          className="w-full h-auto cursor-ew-resize select-none touch-none block"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 text-[11px] font-mono text-cyan-400 backdrop-blur-md pointer-events-none flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Drag mouse horizontally to adjust height / liquid column
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isUtube) onControlChange("oilDensity", oilDensity === 800 ? 880 : 800);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-200 transition-all flex items-center gap-1.5"
          >
            Switch Test Liquid ({oilDensity === 800 ? "Kerosene 800" : "Olive Oil 880"})
          </button>
        </div>

        {onRecordReading && (
          <button
            onClick={onRecordReading}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
          >
            <span className="text-sm">+</span> Record Reading
          </button>
        )}
      </div>
    </div>
  );
};
