import React, { useRef, useEffect, useState } from "react";
import { PracticalItem } from "../../types";

interface Props {
  practical: PracticalItem;
  controlValues: Record<string, number>;
  onControlChange: (id: string, val: number) => void;
  onRecordReading?: () => void;
}

export const PendulumSpringSim: React.FC<Props> = ({
  practical,
  controlValues,
  onControlChange,
  onRecordReading,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isSpring = practical.id === "prac-11";

  // Animation state
  const animRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Pendulum params
  const lengthCm = controlValues["pendulumLength"] ?? 75;
  const initialAngleDeg = controlValues["initialAngle"] ?? 6;
  const g = controlValues["gravityVal"] ?? 9.81;

  // Spring params
  const massG = controlValues["suspendedMass"] ?? 150;
  const k = controlValues["springStiffness"] ?? 25;
  const mEff = 12.5; // grams

  // Theoretical periods
  const pendulumPeriod = 2 * Math.PI * Math.sqrt((lengthCm / 100) / g);
  const springTotalM = (massG + mEff) / 1000; // kg
  const springPeriod = 2 * Math.PI * Math.sqrt(springTotalM / k);

  useEffect(() => {
    let lastStamp = performance.now();

    const render = (now: number) => {
      const dt = (now - lastStamp) / 1000;
      lastStamp = now;

      if (isPlaying && !isDragging) {
        timeRef.current += dt;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Dark canvas
      ctx.clearRect(0, 0, width, height);
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#080e1a");
      bg.addColorStop(1, "#04070e");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Laboratory grid
      ctx.strokeStyle = "rgba(148, 163, 184, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const pivotX = width / 2;
      const pivotY = 50;

      // Rigid ceiling mount
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(pivotX - 100, pivotY - 20, 200, 20);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.strokeRect(pivotX - 100, pivotY - 20, 200, 20);

      if (!isSpring) {
        // --- 10. SIMPLE PENDULUM ---
        const omega = Math.sqrt(g / (lengthCm / 100));
        const theta0Rad = (initialAngleDeg * Math.PI) / 180;
        // Harmonic motion with slight damping
        const decay = Math.exp(-0.02 * timeRef.current);
        const currentAngle = theta0Rad * Math.cos(omega * timeRef.current) * decay;

        const pxPerCm = 2.4;
        const stringLenPx = lengthCm * pxPerCm;
        const bobX = pivotX + stringLenPx * Math.sin(currentAngle);
        const bobY = pivotY + stringLenPx * Math.cos(currentAngle);

        // Vertical dashed reference line
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(pivotX, pivotY + stringLenPx + 30);
        ctx.stroke();
        ctx.setLineDash([]);

        // Suspension Pivot
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
        ctx.fill();

        // String
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();

        // Spherical Metallic Bob
        const bobGrad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, 16);
        bobGrad.addColorStop(0, "#f8fafc");
        bobGrad.addColorStop(0.4, "#94a3b8");
        bobGrad.addColorStop(1, "#334155");
        ctx.fillStyle = bobGrad;
        ctx.beginPath();
        ctx.arc(bobX, bobY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Photogate / Equilibrium fiducial pointer
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(pivotX - 3, pivotY + stringLenPx - 4, 6, 8);

        // Energy Indicator Bars
        const potentialRatio = Math.pow(Math.sin(currentAngle) / Math.sin(theta0Rad || 0.01), 2);
        const kineticRatio = Math.max(0, 1 - potentialRatio);

        // HUD Readout
        ctx.fillStyle = "#f8fafc";
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.fillText(`Suspension Length (l): ${lengthCm.toFixed(1)} cm (${(lengthCm / 100).toFixed(2)} m)`, 24, 30);
        ctx.fillText(`Release Angle (θ): ${initialAngleDeg}°`, 24, 52);
        ctx.fillStyle = "#38bdf8";
        ctx.fillText(`Periodic Time T: ${pendulumPeriod.toFixed(3)} s`, 24, 76);
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 15px 'JetBrains Mono', monospace";
        ctx.fillText(`T² = ${(pendulumPeriod * pendulumPeriod).toFixed(3)} s² | Slope 4π²/g = ${(4 * Math.PI * Math.PI / g).toFixed(3)}`, 24, 102);

        // Energy meters
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText("Kinetic Energy", 24, height - 42);
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(24, height - 38, kineticRatio * 140, 8);

        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Potential Energy", 24, height - 20);
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(24, height - 16, potentialRatio * 140, 8);

      } else {
        // --- 11. HELIX SPRING ---
        const omega = Math.sqrt(k / springTotalM);
        const amplitude = 35 * Math.exp(-0.03 * timeRef.current);
        const displacement = amplitude * Math.cos(omega * timeRef.current);

        const restLength = 120;
        const currentLength = restLength + (massG / 2) + displacement;

        // Draw coiled spring
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);

        const coils = 16;
        const coilH = currentLength / coils;
        for (let i = 0; i < coils; i++) {
          const sy = pivotY + i * coilH;
          const sx = pivotX + (i % 2 === 0 ? 18 : -18);
          ctx.lineTo(sx, sy + coilH / 2);
        }
        ctx.lineTo(pivotX, pivotY + currentLength);
        ctx.stroke();

        // Hook and Suspended Mass Hanger
        const loadY = pivotY + currentLength;
        ctx.fillStyle = "#0284c7";
        ctx.fillRect(pivotX - 25, loadY, 50, 45);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.strokeRect(pivotX - 25, loadY, 50, 45);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px 'JetBrains Mono', monospace";
        ctx.fillText(`${massG}g`, pivotX - 16, loadY + 27);

        // Reference pointer on vertical millimeter scale
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.moveTo(pivotX + 30, loadY + 20);
        ctx.lineTo(pivotX + 50, loadY + 15);
        ctx.lineTo(pivotX + 50, loadY + 25);
        ctx.closePath();
        ctx.fill();

        // Vertical Scale
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(pivotX + 55, 60, 20, 260);
        ctx.strokeStyle = "#64748b";
        for (let s = 70; s <= 310; s += 10) {
          ctx.beginPath();
          ctx.moveTo(pivotX + 55, s);
          ctx.lineTo(pivotX + (s % 50 === 0 ? 72 : 64), s);
          ctx.stroke();
        }

        // HUD Readout
        ctx.fillStyle = "#f8fafc";
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.fillText(`Suspended Load Mass (M): ${massG} g (${(massG / 1000).toFixed(3)} kg)`, 24, 30);
        ctx.fillText(`Spring Stiffness (k): ${k} N/m`, 24, 52);
        ctx.fillText(`Effective Spring Mass (m_eff): ${mEff} g`, 24, 74);
        ctx.fillStyle = "#38bdf8";
        ctx.fillText(`Periodic Time T = ${springPeriod.toFixed(3)} s`, 24, 98);
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 15px 'JetBrains Mono', monospace";
        ctx.fillText(`T² = ${(springPeriod * springPeriod).toFixed(3)} s² | (M + m_eff) = ${((massG + mEff) / 1000).toFixed(3)} kg`, 24, 124);
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, isDragging, isSpring, lengthCm, initialAngleDeg, g, massG, k, springPeriod, pendulumPeriod, springTotalM]);

  // Mouse interaction: drag bob / pull spring
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (!isSpring) {
      const angle = 2 + Math.round(ratio * 12);
      onControlChange("initialAngle", angle);
      timeRef.current = 0; // reset phase
    } else {
      const mass = 50 + Math.round(ratio * 14) * 25;
      onControlChange("suspendedMass", mass);
      timeRef.current = 0;
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950/70 shadow-2xl backdrop-blur-md">
        <canvas
          ref={canvasRef}
          width={760}
          height={380}
          className="w-full h-auto cursor-pointer select-none touch-none block"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 text-[11px] font-mono text-cyan-400 backdrop-blur-md pointer-events-none flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          Drag mouse horizontally to set amplitude / mass
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-200 transition-all flex items-center gap-1.5"
          >
            {isPlaying ? "⏸ Pause Motion" : "▶ Resume Motion"}
          </button>
          <button
            onClick={() => {
              timeRef.current = 0;
              if (!isSpring) onControlChange("pendulumLength", 75);
              else onControlChange("suspendedMass", 150);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-300 transition-all hover:text-white"
          >
            Reset Oscillation
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
