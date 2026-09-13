import React, { useState, useRef, useEffect } from "react";
import { PracticalItem } from "../../types";

interface Props {
  practical: PracticalItem;
  controlValues: Record<string, number>;
  onControlChange: (id: string, val: number) => void;
  onRecordReading?: () => void;
}

export const VernierMicrometerSim: React.FC<Props> = ({
  practical,
  controlValues,
  onControlChange,
  onRecordReading,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isSpherometer = practical.id === "prac-3";
  const isScrewGauge = practical.id === "prac-2";
  const [isDragging, setIsDragging] = useState(false);

  // Values based on controls
  const aperture = controlValues["jawPosition"] ?? (controlValues["spindleGap"] ?? (controlValues["sagittaH"] ?? 20));
  const zeroError = controlValues["zeroError"] ?? 0;
  const mode = controlValues["mode"] ?? 0;

  // Render on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background - dark sleek laboratory canvas
    ctx.clearRect(0, 0, width, height);
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#0f172a");
    bgGrad.addColorStop(1, "#090d16");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle grid
    ctx.strokeStyle = "rgba(148, 163, 184, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (isSpherometer) {
      // SPHEROMETER DRAWING
      const centerX = width / 2;
      const centerY = height / 2 + 10;
      const sagitta = controlValues["sagittaH"] ?? 1.84;
      const a = controlValues["legDistance"] ?? 42;
      const R = (a * a) / (6 * sagitta) + sagitta / 2;

      // Curved surface
      ctx.beginPath();
      ctx.arc(centerX, centerY + 280 - sagitta * 12, 300, Math.PI * 1.25, Math.PI * 1.75);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Spherometer Frame (Disc and legs)
      const legSpan = a * 2.8;
      // Fixed legs
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(centerX - legSpan / 2 - 4, centerY - 60, 8, 80);
      ctx.fillRect(centerX + legSpan / 2 - 4, centerY - 60, 8, 80);

      // Central screw
      ctx.fillStyle = "#f59e0b";
      const screwDrop = 60 + sagitta * 15;
      ctx.fillRect(centerX - 5, centerY - 100, 10, screwDrop);

      // Circular circular scale disc
      ctx.save();
      ctx.translate(centerX, centerY - 100);
      ctx.fillStyle = "rgba(30, 41, 59, 0.9)";
      ctx.beginPath();
      ctx.ellipse(0, 0, 90, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Disc divisions
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      for (let i = 0; i < 30; i++) {
        const ang = (i / 30) * Math.PI * 2;
        const x1 = Math.cos(ang) * 75;
        const y1 = Math.sin(ang) * 18;
        const x2 = Math.cos(ang) * 88;
        const y2 = Math.sin(ang) * 22;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();

      // Vertical pitch scale
      ctx.fillStyle = "#64748b";
      ctx.fillRect(centerX + 70, centerY - 140, 16, 120);
      ctx.strokeStyle = "#e2e8f0";
      for (let mm = -5; mm <= 5; mm++) {
        const py = centerY - 80 + mm * 8;
        ctx.beginPath();
        ctx.moveTo(centerX + 70, py);
        ctx.lineTo(centerX + (mm % 5 === 0 ? 84 : 76), py);
        ctx.stroke();
      }

      // Readout HUD
      ctx.fillStyle = "#38bdf8";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillText(`Elevation (h): ${sagitta.toFixed(2)} mm`, 24, 35);
      ctx.fillText(`Leg spacing (a): ${a.toFixed(1)} mm`, 24, 60);
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 16px 'JetBrains Mono', monospace";
      ctx.fillText(`Radius of Curvature R = ${R.toFixed(1)} mm (${(R / 10).toFixed(2)} cm)`, 24, 90);

    } else if (isScrewGauge) {
      // MICROMETER SCREW GAUGE
      const startX = 80;
      const startY = height / 2 - 20;
      const gapMm = controlValues["spindleGap"] ?? 3.42;
      const pxPerMm = 12;

      // U-frame
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 26;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(startX + 130, startY + 60, 90, Math.PI * 0.9, Math.PI * 0.1, true);
      ctx.stroke();

      // Anvil (left fixed)
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(startX + 60, startY - 14, 20, 28);

      // Specimen between anvil and spindle (e.g. wire / sphere)
      if (gapMm > 0.05) {
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(startX + 80 + (gapMm * pxPerMm) / 2, startY, (gapMm * pxPerMm) / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Spindle (movable cylinder)
      const spindleX = startX + 80 + gapMm * pxPerMm;
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(spindleX, startY - 14, 180 - gapMm * pxPerMm, 28);

      // Main Sleeve (barrel with pitch scale)
      const barrelX = startX + 260;
      ctx.fillStyle = "#334155";
      ctx.fillRect(barrelX, startY - 18, 110, 36);

      // Baseline and millimeter graduations
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(barrelX, startY);
      ctx.lineTo(barrelX + 105, startY);
      ctx.stroke();

      // Millimeter marks (top: 0,1,2,3, bottom: 0.5mm offsets)
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#94a3b8";
      for (let mm = 0; mm <= 8; mm++) {
        const mx = barrelX + mm * 10;
        ctx.beginPath();
        ctx.moveTo(mx, startY - 10);
        ctx.lineTo(mx, startY);
        ctx.stroke();
        if (mm % 2 === 0) {
          ctx.fillText(`${mm}`, mx - 3, startY - 13);
        }
        // half mm on bottom
        if (mm < 8) {
          ctx.beginPath();
          ctx.moveTo(mx + 5, startY);
          ctx.lineTo(mx + 5, startY + 8);
          ctx.stroke();
        }
      }

      // Thimble (rotating circular drum)
      const thimblePos = barrelX + (gapMm * 10);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(thimblePos, startY - 26, 75, 52);
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 2;
      ctx.strokeRect(thimblePos, startY - 26, 75, 52);

      // Circular scale ticks
      const circularDiv = Math.round((gapMm % 0.5) / 0.01);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "10px 'JetBrains Mono', monospace";
      for (let d = -4; d <= 4; d++) {
        const markDiv = (circularDiv + d + 50) % 50;
        const my = startY - d * 5;
        ctx.beginPath();
        ctx.moveTo(thimblePos, my);
        ctx.lineTo(thimblePos + 10, my);
        ctx.stroke();
        if (markDiv % 5 === 0) {
          ctx.fillText(`${markDiv}`, thimblePos + 12, my + 3);
        }
      }

      // Ratchet
      ctx.fillStyle = "#475569";
      ctx.fillRect(thimblePos + 75, startY - 12, 30, 24);

      // Magnified Loupe window
      ctx.save();
      const loupeX = width - 140;
      const loupeY = 90;
      ctx.beginPath();
      ctx.arc(loupeX, loupeY, 65, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#38bdf8";
      ctx.stroke();

      // Loupe text
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("HIGH-PRECISION LOUPE", loupeX - 58, loupeY - 40);
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`PSR: ${Math.floor(gapMm * 2) * 0.5} mm`, loupeX - 45, loupeY - 15);
      ctx.fillText(`HSR: ${circularDiv} divs`, loupeX - 45, loupeY + 5);
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      const total = gapMm - zeroError;
      ctx.fillText(`${total.toFixed(2)} mm`, loupeX - 35, loupeY + 30);
      ctx.restore();

      // Live Readout overlay
      ctx.fillStyle = "#f8fafc";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillText(`Observed Gap: ${gapMm.toFixed(2)} mm`, 24, 35);
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`Zero Error: ${(zeroError >= 0 ? "+" : "") + zeroError.toFixed(2)} mm`, 24, 58);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`Corrected Value: ${(gapMm - zeroError).toFixed(2)} mm`, 24, 82);

    } else {
      // VERNIER CALLIPERS
      const pxPerMm = 4.2;
      const zeroMmX = 140;
      const beamY = height / 2 - 35;
      const jawGap = aperture;

      // Fixed Main Beam
      ctx.fillStyle = "#334155";
      ctx.fillRect(30, beamY, width - 60, 48);

      // Main scale graduations (0 to 12 cm)
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#94a3b8";

      for (let mm = 0; mm <= 120; mm++) {
        const mx = zeroMmX + mm * pxPerMm;
        if (mx > width - 50) break;
        const isCm = mm % 10 === 0;
        const isHalfCm = mm % 5 === 0;
        const tickH = isCm ? 18 : isHalfCm ? 12 : 7;

        ctx.beginPath();
        ctx.moveTo(mx, beamY + 48);
        ctx.lineTo(mx, beamY + 48 - tickH);
        ctx.stroke();

        if (isCm) {
          ctx.fillText(`${mm / 10}`, mx - 3, beamY + 22);
        }
      }

      // Fixed Left Jaw
      ctx.fillStyle = "#475569";
      // Lower outside jaw
      ctx.beginPath();
      ctx.moveTo(zeroMmX - 35, beamY);
      ctx.lineTo(zeroMmX, beamY);
      ctx.lineTo(zeroMmX, beamY + 160);
      ctx.lineTo(zeroMmX - 22, beamY + 160);
      ctx.lineTo(zeroMmX - 35, beamY + 70);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#64748b";
      ctx.stroke();

      // Upper inside jaw (fixed)
      ctx.beginPath();
      ctx.moveTo(zeroMmX - 25, beamY);
      ctx.lineTo(zeroMmX, beamY);
      ctx.lineTo(zeroMmX, beamY - 60);
      ctx.lineTo(zeroMmX - 18, beamY - 60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Movable Vernier Slider & Jaws
      const sliderX = zeroMmX + jawGap * pxPerMm;
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(sliderX - 8, beamY - 4, 110, 56);
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(sliderX - 8, beamY - 4, 110, 56);

      // Movable lower jaw
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.moveTo(sliderX, beamY);
      ctx.lineTo(sliderX + 35, beamY);
      ctx.lineTo(sliderX + 35, beamY + 70);
      ctx.lineTo(sliderX + 22, beamY + 160);
      ctx.lineTo(sliderX, beamY + 160);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Movable upper jaw
      ctx.beginPath();
      ctx.moveTo(sliderX, beamY);
      ctx.lineTo(sliderX + 22, beamY);
      ctx.lineTo(sliderX + 18, beamY - 60);
      ctx.lineTo(sliderX, beamY - 60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Vernier Scale ticks on slider (10 divisions = 9 mm => each = 0.9 mm)
      ctx.strokeStyle = "#38bdf8";
      ctx.fillStyle = "#38bdf8";
      ctx.font = "9px 'JetBrains Mono', monospace";
      for (let v = 0; v <= 10; v++) {
        const vx = sliderX + v * (pxPerMm * 0.9);
        const tickH = v % 5 === 0 ? 14 : 9;
        ctx.beginPath();
        ctx.moveTo(vx, beamY);
        ctx.lineTo(vx, beamY + tickH);
        ctx.stroke();
        if (v === 0 || v === 5 || v === 10) {
          ctx.fillText(`${v}`, vx - 3, beamY + tickH + 10);
        }
      }

      // Measured Object in jaw
      if (jawGap > 1) {
        ctx.fillStyle = "rgba(245, 158, 11, 0.7)";
        ctx.strokeStyle = "#f59e0b";
        ctx.fillRect(zeroMmX, beamY + 60, jawGap * pxPerMm, 60);
        ctx.strokeRect(zeroMmX, beamY + 60, jawGap * pxPerMm, 60);

        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillText(`d = ${jawGap.toFixed(1)} mm`, zeroMmX + (jawGap * pxPerMm) / 2 - 35, beamY + 95);
      }

      // Live Readout overlay
      const msr = Math.floor(jawGap);
      const vsr = Math.round(((jawGap - msr) * 10));
      const corrected = jawGap - zeroError;

      ctx.fillStyle = "#38bdf8";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillText(`Main Scale Reading (MSR): ${msr} mm`, 24, 35);
      ctx.fillText(`Vernier Coincidence (VSR): ${vsr} div (${(vsr * 0.1).toFixed(1)} mm)`, 24, 58);
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 15px 'JetBrains Mono', monospace";
      ctx.fillText(`Corrected Total: ${corrected.toFixed(1)} mm (${(corrected / 10).toFixed(2)} cm)`, 24, 85);
    }
  }, [practical.id, aperture, zeroError, mode, isSpherometer, isScrewGauge, controlValues]);

  // Mouse drag handler on canvas
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clientX / rect.width));

    if (isSpherometer) {
      const val = 0.1 + ratio * 4.9;
      onControlChange("sagittaH", Number(val.toFixed(2)));
    } else if (isScrewGauge) {
      const val = ratio * 15;
      onControlChange("spindleGap", Number(val.toFixed(2)));
    } else {
      const val = ratio * 60;
      onControlChange("jawPosition", Number(val.toFixed(1)));
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Interactive Canvas */}
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
          Drag mouse horizontally on stage
        </div>
      </div>

      {/* Quick Action Button Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isSpherometer) onControlChange("sagittaH", 1.84);
              else if (isScrewGauge) onControlChange("spindleGap", 3.42);
              else onControlChange("jawPosition", 24.6);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-300 transition-all hover:text-white"
          >
            Reset Specimen
          </button>
          <button
            onClick={() => onControlChange("zeroError", 0)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-300 transition-all hover:text-white"
          >
            Zero Calibrate
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
