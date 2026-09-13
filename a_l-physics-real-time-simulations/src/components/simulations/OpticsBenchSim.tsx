import React, { useRef, useEffect, useState } from "react";
import { PracticalItem } from "../../types";

interface Props {
  practical: PracticalItem;
  controlValues: Record<string, number>;
  onControlChange: (id: string, val: number) => void;
  onRecordReading?: () => void;
}

export const OpticsBenchSim: React.FC<Props> = ({
  practical,
  controlValues,
  onControlChange,
  onRecordReading,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isConcave = practical.id === "prac-21-2";

  // Optical bench positions
  const u = controlValues["objectDistanceU"] ?? (controlValues["combDistanceU"] ?? 30); // cm
  const f1 = controlValues["lensFocalLength"] ?? (controlValues["convexF1"] ?? 15); // cm
  const f2 = controlValues["concaveF2"] ?? 25; // cm (for concave lens)

  // Observer lateral parallax offset
  const eyeOffset = controlValues["parallaxOffset"] ?? 0; // mm

  // Lens equations
  let imageDistanceV = 0;
  let combinationF = f1;

  if (!isConcave) {
    // 1/v + 1/u = 1/f => v = (f * u) / (u - f)
    imageDistanceV = u > f1 ? (f1 * u) / (u - f1) : 120;
  } else {
    // 1/F = 1/f1 - 1/f2 => F = (f1 * f2) / (f2 - f1)
    combinationF = (f1 * f2) / (f2 - f1);
    imageDistanceV = u > combinationF ? (combinationF * u) / (u - combinationF) : 120;
  }

  // Magnification
  const m = imageDistanceV / u;
  const objectHeight = 35; // px
  const imageHeight = objectHeight * m;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dark sleek optical darkroom
    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#080c16");
    bg.addColorStop(1, "#03050a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Optical bench rail
    const benchY = height / 2 + 60;
    const startX = 60;
    const benchW = width - 120;

    // Heavy optical bench rail
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(startX, benchY, benchW, 24);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, benchY, benchW, 24);

    // Bench millimeter graduations (0 to 100 cm)
    const pxPerCm = benchW / 100;
    ctx.strokeStyle = "#94a3b8";
    ctx.fillStyle = "#64748b";
    ctx.font = "9px 'JetBrains Mono', monospace";
    for (let cm = 0; cm <= 100; cm += 5) {
      const x = startX + cm * pxPerCm;
      const tickH = cm % 10 === 0 ? 10 : 6;
      ctx.beginPath();
      ctx.moveTo(x, benchY);
      ctx.lineTo(x, benchY + tickH);
      ctx.stroke();
      if (cm % 20 === 0) {
        ctx.fillText(`${cm}`, x - 6, benchY + 20);
      }
    }

    // Optical Axis
    const axisY = benchY - 80;
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX - 20, axisY);
    ctx.lineTo(width - startX + 20, axisY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Lens position fixed on bench (e.g. at 45 cm mark)
    const lensBenchCm = 45;
    const lensX = startX + lensBenchCm * pxPerCm;

    // Object Pin position (at lensBenchCm - u)
    const objectPinX = lensX - u * pxPerCm;

    // Real Image position (at lensBenchCm + imageDistanceV)
    const realImageX = lensX + imageDistanceV * pxPerCm;

    // Search Pin Position (user can align to realImageX)
    const searchPinX = realImageX;

    // Ray tracing:
    // Ray 1: Parallel to principal axis, refracts through right focal point F
    const focalPointRightX = lensX + (isConcave ? combinationF : f1) * pxPerCm;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(objectPinX, axisY - objectHeight);
    ctx.lineTo(lensX, axisY - objectHeight);
    ctx.lineTo(realImageX, axisY + imageHeight);
    ctx.stroke();

    // Ray 2: Passes straight through optical center without deviation
    ctx.strokeStyle = "rgba(244, 114, 182, 0.75)";
    ctx.beginPath();
    ctx.moveTo(objectPinX, axisY - objectHeight);
    ctx.lineTo(lensX, axisY);
    ctx.lineTo(realImageX, axisY + imageHeight);
    ctx.stroke();

    // Draw Lens Holder and Glass Element
    ctx.fillStyle = "#334155";
    ctx.fillRect(lensX - 10, benchY - 140, 20, 140);

    // Convex Lens Glass
    ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(lensX, axisY, 14, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (isConcave) {
      // Concave lens paired in close contact
      ctx.fillStyle = "rgba(168, 85, 247, 0.25)";
      ctx.strokeStyle = "#c084fc";
      ctx.beginPath();
      ctx.moveTo(lensX + 8, axisY - 50);
      ctx.quadraticCurveTo(lensX + 16, axisY, lensX + 8, axisY + 50);
      ctx.lineTo(lensX + 22, axisY + 50);
      ctx.quadraticCurveTo(lensX + 14, axisY, lensX + 22, axisY - 50);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw Object Pin (Erect, illuminated metal tip)
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(objectPinX - 4, axisY, 8, benchY - axisY);
    // Tapered sharp needle point
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.moveTo(objectPinX - 4, axisY);
    ctx.lineTo(objectPinX, axisY - objectHeight);
    ctx.lineTo(objectPinX + 4, axisY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fbbf24";
    ctx.stroke();

    // Draw Real Inverted Image
    // Parallax lateral shift when eye moves
    const relativeParallaxShift = (eyeOffset * (searchPinX - realImageX) * 0.1);

    ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
    ctx.fillRect(realImageX + relativeParallaxShift - 3, axisY, 6, imageHeight);
    // Inverted arrow tip
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(realImageX + relativeParallaxShift - 4, axisY + imageHeight - 10);
    ctx.lineTo(realImageX + relativeParallaxShift, axisY + imageHeight);
    ctx.lineTo(realImageX + relativeParallaxShift + 4, axisY + imageHeight - 10);
    ctx.closePath();
    ctx.fill();

    // Draw Image Search Pin (Upright metal pin on bench)
    ctx.fillStyle = "#64748b";
    ctx.fillRect(searchPinX - 4, axisY + imageHeight, 8, benchY - (axisY + imageHeight));
    ctx.fillStyle = "#4ade80";
    ctx.beginPath();
    ctx.moveTo(searchPinX - 4, axisY + imageHeight);
    ctx.lineTo(searchPinX, axisY + imageHeight);
    ctx.lineTo(searchPinX + 4, axisY + imageHeight);
    ctx.closePath();
    ctx.fill();

    // Inset View: Eye Viewing Alignment & No-Parallax Test
    const insetX = width - 210;
    const insetY = 30;
    const insetW = 180;
    const insetH = 110;

    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.fillRect(insetX, insetY, insetW, insetH);
    ctx.strokeStyle = "#0ea5e9";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(insetX, insetY, insetW, insetH);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "10px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("EYE NO-PARALLAX VIEW", insetX + 15, insetY + 18);

    // Draw image tip and pin tip in magnifying view
    const viewCenterX = insetX + insetW / 2 + (eyeOffset * 1.5);
    const viewCenterY = insetY + insetH / 2;

    // Search pin tip (pointing up from below)
    ctx.fillStyle = "#4ade80";
    ctx.beginPath();
    ctx.moveTo(insetX + insetW / 2 - 8, viewCenterY + 28);
    ctx.lineTo(insetX + insetW / 2, viewCenterY);
    ctx.lineTo(insetX + insetW / 2 + 8, viewCenterY + 28);
    ctx.closePath();
    ctx.fill();

    // Inverted image tip (pointing down from above)
    const imgShift = eyeOffset * 0.1;
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(insetX + insetW / 2 + imgShift - 8, viewCenterY - 28);
    ctx.lineTo(insetX + insetW / 2 + imgShift, viewCenterY);
    ctx.lineTo(insetX + insetW / 2 + imgShift + 8, viewCenterY - 28);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = Math.abs(imgShift) < 0.2 ? "#4ade80" : "#f59e0b";
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    ctx.fillText(Math.abs(imgShift) < 0.2 ? "✓ PERFECT NO-PARALLAX" : "PARALLAX DETECTED", insetX + 22, insetY + insetH - 10);

    // HUD Readout
    ctx.fillStyle = "#f8fafc";
    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.fillText(`Object Distance (u): ${u.toFixed(1)} cm`, 24, 30);
    ctx.fillText(`Image Distance (v): ${imageDistanceV.toFixed(1)} cm`, 24, 52);
    ctx.fillText(`Focal Length f: ${(isConcave ? combinationF : f1).toFixed(1)} cm`, 24, 74);
    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 15px 'JetBrains Mono', monospace";
    ctx.fillText(`1/u + 1/v = ${(1 / u + 1 / imageDistanceV).toFixed(4)} cm⁻¹ (1/f = ${(1 / (isConcave ? combinationF : f1)).toFixed(4)} cm⁻¹)`, 24, 102);

  }, [u, f1, f2, isConcave, eyeOffset, imageDistanceV, combinationF, imageHeight]);

  // Mouse drag handler on canvas to change object distance
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    const objDist = 18 + Math.round(ratio * 40);
    if (!isConcave) {
      onControlChange("objectDistanceU", objDist);
    } else {
      onControlChange("combDistanceU", objDist);
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
          Drag horizontally to position object pin
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onControlChange("parallaxOffset", (eyeOffset === 0 ? 10 : 0));
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-200 transition-all flex items-center gap-1.5"
          >
            👀 Test Eye Parallax ({eyeOffset !== 0 ? "Shifted" : "Centered"})
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
