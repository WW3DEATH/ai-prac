import React, { useRef, useEffect, useState } from "react";
import { PracticalItem } from "../../types";

interface Props {
  practical: PracticalItem;
  controlValues: Record<string, number>;
  onControlChange: (id: string, val: number) => void;
  onRecordReading?: () => void;
}

export const TravellingMicroscopeSim: React.FC<Props> = ({
  practical,
  controlValues,
  onControlChange,
  onRecordReading,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Position in cm
  const vertPosCm = controlValues["verticalPos"] ?? 4.25; // cm
  const focusPlane = controlValues["focusPlane"] ?? 1; // 1: bottom mark, 2: apparent image, 3: lycopodium powder on top

  // Glass slab dimensions
  const realThicknessCm = 2.40; // cm
  const glassN = 1.50; // Crown glass
  const apparentThicknessCm = realThicknessCm / glassN; // 1.60 cm
  const apparentShiftCm = realThicknessCm - apparentThicknessCm; // 0.80 cm

  // Target focal positions:
  // R1: bottom cross mark on paper = 2.00 cm
  // R2: apparent image through slab = 2.00 + apparentShiftCm = 2.80 cm
  // R3: lycopodium powder on top surface = 2.00 + realThicknessCm = 4.40 cm
  const targetR1 = 2.00;
  const targetR2 = 2.80;
  const targetR3 = 4.40;

  // Closeness to each focal plane
  const blurR1 = Math.abs(vertPosCm - targetR1);
  const blurR2 = Math.abs(vertPosCm - targetR2);
  const blurR3 = Math.abs(vertPosCm - targetR3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dark sleek optical laboratory background
    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#0a0f1d");
    bg.addColorStop(1, "#04060d");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = "rgba(148, 163, 184, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // --- LEFT HALF: TRAVELLING MICROSCOPE APPARATUS ---
    const baseStandX = 120;
    const baseStandY = height - 60;

    // Heavy Cast-iron base
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(baseStandX - 80, baseStandY, 200, 30);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.strokeRect(baseStandX - 80, baseStandY, 200, 30);

    // Levelling screws
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(baseStandX - 70, baseStandY + 30, 16, 12);
    ctx.fillRect(baseStandX + 100, baseStandY + 30, 16, 12);

    // Stage with paper cross mark & glass slab
    const stageX = baseStandX - 40;
    const stageY = baseStandY - 45;
    ctx.fillStyle = "#334155";
    ctx.fillRect(stageX - 10, stageY, 140, 16);

    // Paper on stage
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(stageX, stageY - 4, 120, 4);

    // Glass Slab resting on paper
    const slabW = 90;
    const slabH = realThicknessCm * 18; // scaled px
    const slabX = stageX + 15;
    const slabY = stageY - 4 - slabH;

    ctx.fillStyle = "rgba(56, 189, 248, 0.28)";
    ctx.fillRect(slabX, slabY, slabW, slabH);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(slabX, slabY, slabW, slabH);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillText("Glass Slab", slabX + 14, slabY + slabH / 2 + 3);

    // Vertical Main Pillar / Scale
    const pillarX = baseStandX + 130;
    const pillarY = 50;
    const pillarH = 260;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(pillarX, pillarY, 28, pillarH);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.strokeRect(pillarX, pillarY, 28, pillarH);

    // Main millimeter scale graduations on pillar (0 to 10 cm)
    ctx.strokeStyle = "#e2e8f0";
    ctx.fillStyle = "#94a3b8";
    ctx.font = "8px 'JetBrains Mono', monospace";
    for (let cm = 0; cm <= 10; cm++) {
      const py = pillarY + pillarH - cm * 24;
      ctx.beginPath();
      ctx.moveTo(pillarX, py);
      ctx.lineTo(pillarX + 12, py);
      ctx.stroke();
      if (cm % 2 === 0) {
        ctx.fillText(`${cm}`, pillarX + 14, py + 3);
      }
    }

    // Microscope Tube and Carriage Carrier
    const carriageY = pillarY + pillarH - vertPosCm * 24;

    // Carrier bracket
    ctx.fillStyle = "#334155";
    ctx.fillRect(pillarX - 10, carriageY - 18, 48, 36);
    ctx.strokeStyle = "#0ea5e9";
    ctx.lineWidth = 2;
    ctx.strokeRect(pillarX - 10, carriageY - 18, 48, 36);

    // Microscope Tube
    const tubeX = slabX + slabW / 2;
    ctx.fillStyle = "#475569";
    ctx.fillRect(tubeX - 10, carriageY - 70, 20, 110);
    ctx.strokeStyle = "#94a3b8";
    ctx.strokeRect(tubeX - 10, carriageY - 70, 20, 110);

    // Objective lens cone
    ctx.beginPath();
    ctx.moveTo(tubeX - 10, carriageY + 40);
    ctx.lineTo(tubeX - 5, carriageY + 60);
    ctx.lineTo(tubeX + 5, carriageY + 60);
    ctx.lineTo(tubeX + 10, carriageY + 40);
    ctx.closePath();
    ctx.fillStyle = "#64748b";
    ctx.fill();

    // Eyepiece lens at top
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(tubeX - 14, carriageY - 82, 28, 14);

    // Rack and pinion thumbwheel
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(pillarX + 42, carriageY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fbbf24";
    ctx.stroke();

    // --- RIGHT HALF: CIRCULAR EYEPIECE FIELD OF VIEW (Magnified Crosshairs) ---
    const eyeX = width - 180;
    const eyeY = 160;
    const eyeR = 95;

    // Circular ocular field
    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.stroke();

    // In focus items inside eyepiece based on vertPosCm:
    // 1. Bottom ink mark (at R1 = 2.00 cm)
    if (blurR1 < 0.45) {
      const alpha = Math.max(0, 1 - blurR1 / 0.45);
      const blurPx = blurR1 * 12;
      ctx.save();
      ctx.filter = `blur(${blurPx}px)`;
      ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      // Cross mark '+' on paper
      ctx.moveTo(eyeX - 45, eyeY);
      ctx.lineTo(eyeX + 45, eyeY);
      ctx.moveTo(eyeX, eyeY - 45);
      ctx.lineTo(eyeX, eyeY + 45);
      ctx.stroke();
      ctx.restore();
    }

    // 2. Apparent elevated image through glass (at R2 = 2.80 cm)
    if (blurR2 < 0.45) {
      const alpha = Math.max(0, 1 - blurR2 / 0.45);
      const blurPx = blurR2 * 10;
      ctx.save();
      ctx.filter = `blur(${blurPx}px)`;
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(eyeX - 45, eyeY);
      ctx.lineTo(eyeX + 45, eyeY);
      ctx.moveTo(eyeX, eyeY - 45);
      ctx.lineTo(eyeX, eyeY + 45);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Lycopodium powder on top surface (at R3 = 4.40 cm)
    if (blurR3 < 0.45) {
      const alpha = Math.max(0, 1 - blurR3 / 0.45);
      const blurPx = blurR3 * 8;
      ctx.save();
      ctx.filter = `blur(${blurPx}px)`;
      ctx.fillStyle = `rgba(250, 204, 21, ${alpha})`;
      for (let i = 0; i < 24; i++) {
        const px = eyeX - 50 + ((i * 37) % 100);
        const py = eyeY - 50 + ((i * 53) % 100);
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Eyepiece Crosswires (Permanently sharp in focal plane of eyepiece)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(eyeX - eyeR, eyeY);
    ctx.lineTo(eyeX + eyeR, eyeY);
    ctx.moveTo(eyeX, eyeY - eyeR);
    ctx.lineTo(eyeX, eyeY + eyeR);
    ctx.stroke();

    // Label for ocular view
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("EYEPIECE CROSSHAIR VIEW", eyeX - 70, eyeY + eyeR + 25);

    // Coincidence Status in Ocular View
    let statusMsg = "Out of focus (rotate fine wheel)";
    let statusColor = "#64748b";
    if (blurR1 < 0.05) {
      statusMsg = "✓ R1 IN SHARP FOCUS (Bottom Ink Mark)";
      statusColor = "#f43f5e";
    } else if (blurR2 < 0.05) {
      statusMsg = "✓ R2 IN SHARP FOCUS (Apparent Image)";
      statusColor = "#38bdf8";
    } else if (blurR3 < 0.05) {
      statusMsg = "✓ R3 IN SHARP FOCUS (Lycopodium Powder)";
      statusColor = "#facc15";
    }

    ctx.fillStyle = statusColor;
    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.fillText(statusMsg, eyeX - 110, eyeY - eyeR - 15);

    // HUD Readout
    ctx.fillStyle = "#f8fafc";
    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.fillText(`Vertical Microscope Position: ${vertPosCm.toFixed(2)} cm (${(vertPosCm * 10).toFixed(1)} mm)`, 24, 30);
    ctx.fillText(`R1 (Bottom Mark on Paper): ${targetR1.toFixed(2)} cm`, 24, 52);
    ctx.fillText(`R2 (Apparent Image through Slab): ${targetR2.toFixed(2)} cm`, 24, 74);
    ctx.fillText(`R3 (Lycopodium Powder on Top): ${targetR3.toFixed(2)} cm`, 24, 96);
    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 15px 'JetBrains Mono', monospace";
    const realD = targetR3 - targetR1;
    const appD = targetR3 - targetR2;
    ctx.fillText(`Refractive Index n = (R3 - R1) / (R3 - R2) = ${realD.toFixed(2)} / ${appD.toFixed(2)} = ${(realD / appD).toFixed(3)}`, 24, 124);

  }, [vertPosCm, blurR1, blurR2, blurR3, targetR1, targetR2, targetR3, realThicknessCm, apparentShiftCm]);

  // Mouse drag handler on canvas
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    // Vertical drag: top = 5.5cm, bottom = 1.5cm
    const pos = 5.5 - ratio * 4.0;
    onControlChange("verticalPos", Number(pos.toFixed(2)));
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950/70 shadow-2xl backdrop-blur-md">
        <canvas
          ref={canvasRef}
          width={760}
          height={380}
          className="w-full h-auto cursor-ns-resize select-none touch-none block"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 text-[11px] font-mono text-cyan-400 backdrop-blur-md pointer-events-none flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Drag mouse vertically to focus microscope rack & pinion
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onControlChange("verticalPos", targetR1)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-rose-300 transition-all flex items-center gap-1"
          >
            🎯 Snap to R1 (2.00 cm)
          </button>
          <button
            onClick={() => onControlChange("verticalPos", targetR2)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-cyan-300 transition-all flex items-center gap-1"
          >
            🎯 Snap to R2 (2.80 cm)
          </button>
          <button
            onClick={() => onControlChange("verticalPos", targetR3)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-amber-300 transition-all flex items-center gap-1"
          >
            🎯 Snap to R3 (4.40 cm)
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
