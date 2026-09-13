import React, { useRef, useEffect, useState } from "react";
import { PracticalItem } from "../../types";

interface Props {
  practical: PracticalItem;
  controlValues: Record<string, number>;
  onControlChange: (id: string, val: number) => void;
  onRecordReading?: () => void;
}

export const MechanicsForcesSim: React.FC<Props> = ({
  practical,
  controlValues,
  onControlChange,
  onRecordReading,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.clearRect(0, 0, width, height);
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#0b1120");
    grad.addColorStop(1, "#070a12");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    if (practical.id === "prac-5") {
      // 5. PARALLELOGRAM OF FORCES
      const P = controlValues["weightP"] ?? 120; // grams
      const Q = controlValues["weightQ"] ?? 140; // grams
      const thetaDeg = controlValues["angleTheta"] ?? 78; // degrees
      const thetaRad = (thetaDeg * Math.PI) / 180;

      // Resultant W in grams
      const W = Math.sqrt(P * P + Q * Q + 2 * P * Q * Math.cos(thetaRad));

      const originX = width / 2;
      const originY = 170;

      // Pulleys
      const pulleyLeftX = 140;
      const pulleyRightX = width - 140;
      const pulleyY = 80;

      ctx.fillStyle = "#475569";
      ctx.beginPath();
      ctx.arc(pulleyLeftX, pulleyY, 22, 0, Math.PI * 2);
      ctx.arc(pulleyRightX, pulleyY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Board backdrop with coordinate grid
      ctx.strokeStyle = "rgba(148, 163, 184, 0.1)";
      ctx.lineWidth = 1;
      for (let x = 180; x < width - 180; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 70);
        ctx.lineTo(x, 320);
        ctx.stroke();
      }
      for (let y = 70; y < 320; y += 25) {
        ctx.beginPath();
        ctx.moveTo(180, y);
        ctx.lineTo(width - 180, y);
        ctx.stroke();
      }

      // Vector scale (pixels per gram)
      const scale = 0.8;
      const alpha = Math.atan2(Q * Math.sin(thetaRad), P + Q * Math.cos(thetaRad));
      const leftAngle = Math.PI * 0.5 + thetaRad / 2;
      const rightAngle = Math.PI * 0.5 - thetaRad / 2;

      const pVecX = originX - Math.sin(thetaRad / 2) * P * scale;
      const pVecY = originY - Math.cos(thetaRad / 2) * P * scale;
      const qVecX = originX + Math.sin(thetaRad / 2) * Q * scale;
      const qVecY = originY - Math.cos(thetaRad / 2) * Q * scale;
      const rVecX = originX;
      const rVecY = originY - W * scale;

      // Draw Parallelogram dashed lines
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pVecX, pVecY);
      ctx.lineTo(rVecX, rVecY);
      ctx.lineTo(qVecX, qVecY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Vector arrows from central knot
      // Vector P
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(pVecX, pVecY);
      ctx.stroke();

      // Vector Q
      ctx.strokeStyle = "#a855f7";
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(qVecX, qVecY);
      ctx.stroke();

      // Resultant Vector R (Upward)
      ctx.strokeStyle = "#4ade80";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(rVecX, rVecY);
      ctx.stroke();

      // Hanging Strings and Weights
      // String to left pulley & hanging P
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(pulleyLeftX, pulleyY);
      ctx.lineTo(pulleyLeftX - 22, 280);
      ctx.stroke();

      // Left hanger P
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(pulleyLeftX - 32, 280, 20, 32);
      ctx.fillStyle = "#ffffff";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText(`${P}g`, pulleyLeftX - 31, 300);

      // String to right pulley & hanging Q
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(pulleyRightX, pulleyY);
      ctx.lineTo(pulleyRightX + 22, 280);
      ctx.stroke();

      // Right hanger Q
      ctx.fillStyle = "#a855f7";
      ctx.fillRect(pulleyRightX + 12, 280, 20, 32);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`${Q}g`, pulleyRightX + 13, 300);

      // Vertical string hanging unknown weight W
      ctx.strokeStyle = "#4ade80";
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX, 310);
      ctx.stroke();

      // Unknown Weight W body
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(originX - 16, 310, 32, 38);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillText("W", originX - 5, 332);

      // Central Knot
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(originX, originY, 6, 0, Math.PI * 2);
      ctx.fill();

      // HUD readout
      ctx.fillStyle = "#f8fafc";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillText(`Force P = ${(P * 0.00981).toFixed(2)} N (${P} g)`, 24, 30);
      ctx.fillText(`Force Q = ${(Q * 0.00981).toFixed(2)} N (${Q} g)`, 24, 52);
      ctx.fillText(`Included Angle θ = ${thetaDeg}°`, 24, 74);
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 15px 'JetBrains Mono', monospace";
      ctx.fillText(`Balancing Mass W = ${W.toFixed(1)} g (Force = ${(W * 0.00981).toFixed(2)} N)`, 24, 102);

    } else if (practical.id === "prac-6") {
      // 6. PRINCIPLE OF MOMENTS
      const fulcrum = controlValues["fulcrumPos"] ?? 40; // cm
      const knownMass = controlValues["knownMass"] ?? 80; // g
      const knownPos = controlValues["knownArm"] ?? 15; // cm mark
      const ruleMass = 115; // grams
      const ruleCG = 50; // cm mark

      // Calculate unknown mass required for exact balance at 85cm mark
      const unknownPos = 85;
      // Clockwise moments = Anticlockwise moments
      // Fulcrum at F. If F = 40cm, known at 15cm is anticlockwise arm (40-15)=25cm
      // Rule CG at 50cm is clockwise arm (50-40)=10cm
      // Unknown at 85cm is clockwise arm (85-40)=45cm
      const dKnown = fulcrum - knownPos;
      const dRule = ruleCG - fulcrum;
      const dUnknown = unknownPos - fulcrum;

      const unknownMassCalc = (knownMass * dKnown - ruleMass * dRule) / dUnknown;
      const safeUnknown = Math.max(10, Math.round(unknownMassCalc));

      const startX = 60;
      const ruleW = width - 120;
      const ruleY = height / 2 + 10;
      const pxPerCm = ruleW / 100;

      // Fulcrum knife-edge position in canvas
      const fulcrumX = startX + fulcrum * pxPerCm;

      // Triangular Fulcrum stand
      ctx.fillStyle = "#475569";
      ctx.beginPath();
      ctx.moveTo(fulcrumX, ruleY);
      ctx.lineTo(fulcrumX - 25, ruleY + 80);
      ctx.lineTo(fulcrumX + 25, ruleY + 80);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Wooden Metre Rule
      ctx.fillStyle = "#ca8a04";
      ctx.fillRect(startX, ruleY - 10, ruleW, 20);
      ctx.strokeStyle = "#78350f";
      ctx.strokeRect(startX, ruleY - 10, ruleW, 20);

      // Centimeter graduations
      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillStyle = "#ffffff";
      ctx.font = "9px 'JetBrains Mono', monospace";
      for (let cm = 0; cm <= 100; cm += 5) {
        const x = startX + cm * pxPerCm;
        const tickH = cm % 10 === 0 ? 10 : 6;
        ctx.beginPath();
        ctx.moveTo(x, ruleY - 10);
        ctx.lineTo(x, ruleY - 10 + tickH);
        ctx.stroke();
        if (cm % 20 === 0) {
          ctx.fillText(`${cm}`, x - 5, ruleY + 4);
        }
      }

      // Rule Center of Gravity indicator (50 cm)
      const cgX = startX + 50 * pxPerCm;
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(cgX, ruleY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText("C.G.", cgX - 10, ruleY - 15);

      // Known Mass Hanger (Left)
      const knownX = startX + knownPos * pxPerCm;
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(knownX, ruleY + 10);
      ctx.lineTo(knownX, ruleY + 60);
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(knownX - 15, ruleY + 60, 30, 35);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillText(`${knownMass}g`, knownX - 12, ruleY + 82);

      // Unknown Mass Hanger (Right)
      const unkX = startX + unknownPos * pxPerCm;
      ctx.strokeStyle = "#94a3b8";
      ctx.beginPath();
      ctx.moveTo(unkX, ruleY + 10);
      ctx.lineTo(unkX, ruleY + 60);
      ctx.stroke();

      ctx.fillStyle = "#4ade80";
      ctx.fillRect(unkX - 16, ruleY + 60, 32, 40);
      ctx.fillStyle = "#0f172a";
      ctx.fillText(`${safeUnknown}g`, unkX - 14, ruleY + 85);

      // Moment arrows
      ctx.fillStyle = "#f8fafc";
      ctx.font = "13px 'JetBrains Mono', monospace";
      ctx.fillText(`Fulcrum at: ${fulcrum} cm`, 24, 30);
      ctx.fillText(`Known Mass m: ${knownMass} g at ${knownPos} cm (arm = ${(fulcrum - knownPos).toFixed(1)} cm)`, 24, 52);
      ctx.fillText(`Metre Rule Mass: ${ruleMass} g (C.G. at 50 cm)`, 24, 74);
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 15px 'JetBrains Mono', monospace";
      ctx.fillText(`Calculated Unknown Mass M = ${safeUnknown} g`, 24, 102);

    } else {
      // 38. YOUNG'S MODULUS (Searle's Apparatus)
      const loadM = controlValues["loadMassM"] ?? 2.5; // kg
      const radiusMm = controlValues["wireRadiusR"] ?? 0.35; // mm
      const lengthM = controlValues["wireLengthL"] ?? 2.5; // m
      const Y = 2.0e11; // Steel Young's Modulus in Pa

      // elongation e = (M * g * L) / (pi * r^2 * Y)
      const rM = radiusMm * 1e-3;
      const area = Math.PI * rM * rM;
      const g = 9.81;
      const elongationM = (loadM * g * lengthM) / (area * Y);
      const elongationMm = elongationM * 1000;

      // Twin suspension wires from rigid ceiling
      const ceilingY = 50;
      const wireLeftX = width / 2 - 45; // Reference wire
      const wireRightX = width / 2 + 45; // Test wire

      // Rigid ceiling support
      ctx.fillStyle = "#334155";
      ctx.fillRect(width / 2 - 90, ceilingY - 20, 180, 20);
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 2;
      ctx.strokeRect(width / 2 - 90, ceilingY - 20, 180, 20);

      // Left wire (reference)
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(wireLeftX, ceilingY);
      ctx.lineTo(wireLeftX, 220);
      ctx.stroke();

      // Right wire (test wire under load)
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(wireRightX, ceilingY);
      ctx.lineTo(wireRightX, 220 + elongationMm * 30);
      ctx.stroke();

      // Searle's Frame & Spirit Level
      const frameY = 220;
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(wireLeftX - 15, frameY, 30, 50);
      ctx.fillRect(wireRightX - 15, frameY + elongationMm * 30, 30, 50);

      // Spirit Level Bar connecting frames
      ctx.fillStyle = "#0f766e";
      ctx.fillRect(wireLeftX + 15, frameY + 15, 60, 16);
      ctx.strokeStyle = "#14b8a6";
      ctx.strokeRect(wireLeftX + 15, frameY + 15, 60, 16);

      // Bubble inside spirit level
      const bubbleOffset = (elongationMm * 20);
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.ellipse(width / 2 + bubbleOffset, frameY + 23, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Micrometer screw on right frame
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(wireRightX + 18, frameY + elongationMm * 30 + 10, 14, 30);

      // Dead weight on left frame (to keep reference taut)
      ctx.fillStyle = "#64748b";
      ctx.fillRect(wireLeftX - 12, frameY + 65, 24, 35);
      ctx.fillStyle = "#ffffff";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText("1kg", wireLeftX - 8, frameY + 85);

      // Slotted weights hanger on test wire
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(wireRightX - 16, frameY + elongationMm * 30 + 65, 32, 45);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillText(`${loadM}kg`, wireRightX - 14, frameY + elongationMm * 30 + 92);

      // HUD
      ctx.fillStyle = "#f8fafc";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillText(`Load Mass (M): ${loadM.toFixed(1)} kg (Force = ${(loadM * g).toFixed(1)} N)`, 24, 30);
      ctx.fillText(`Wire Diameter: ${(radiusMm * 2).toFixed(2)} mm (Area = ${(area * 1e6).toFixed(3)} mm²)`, 24, 52);
      ctx.fillText(`Initial Wire Length: ${lengthM.toFixed(2)} m`, 24, 74);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 15px 'JetBrains Mono', monospace";
      ctx.fillText(`Extension e = ${elongationMm.toFixed(3)} mm (Spirit bubble leveled)`, 24, 102);
      ctx.fillStyle = "#4ade80";
      ctx.fillText(`Young's Modulus Y = ${(Y / 1e11).toFixed(2)} × 10¹¹ N/m²`, 24, 126);
    }
  }, [practical.id, controlValues]);

  // Mouse drag handler on canvas
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (practical.id === "prac-5") {
      const val = 30 + Math.round(ratio * 120);
      onControlChange("angleTheta", val);
    } else if (practical.id === "prac-6") {
      const val = 25 + Math.round(ratio * 50);
      onControlChange("fulcrumPos", val);
    } else {
      const val = 0.5 + Math.round(ratio * 9) * 0.5;
      onControlChange("loadMassM", val);
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
          Drag horizontally to adjust load / angle
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (practical.id === "prac-5") onControlChange("angleTheta", 78);
              else if (practical.id === "prac-6") onControlChange("fulcrumPos", 40);
              else onControlChange("loadMassM", 2.5);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-300 transition-all hover:text-white"
          >
            Reset Equilibrium
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
