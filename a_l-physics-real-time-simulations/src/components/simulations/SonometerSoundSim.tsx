import React, { useRef, useEffect, useState } from "react";
import { PracticalItem } from "../../types";

interface Props {
  practical: PracticalItem;
  controlValues: Record<string, number>;
  onControlChange: (id: string, val: number) => void;
  onRecordReading?: () => void;
}

export const SonometerSoundSim: React.FC<Props> = ({
  practical,
  controlValues,
  onControlChange,
  onRecordReading,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const isResonanceTube = practical.id === "prac-14" || practical.id === "prac-15";

  // Sonometer parameters
  const bridgeLengthCm = controlValues["bridgeLength"] ?? 28.5;
  const hangerTensionKg = controlValues["hangerTension"] ?? 3.0;
  const tuningForkFreq = controlValues["tuningForkFreq"] ?? (controlValues["forkFrequency"] ?? 256);
  const mu = 0.0018; // kg/m
  const tensionN = hangerTensionKg * 9.81;

  // Exact resonant length for sonometer
  const resonantLengthM = (1 / (2 * tuningForkFreq)) * Math.sqrt(tensionN / mu);
  const resonantLengthCm = resonantLengthM * 100;
  const sonometerDetuning = Math.abs(bridgeLengthCm - resonantLengthCm);
  // Resonance closeness (1 = exact resonance, 0 = off)
  const sonometerResonance = Math.max(0, 1 - sonometerDetuning / 4);

  // Resonance tube parameters
  const waterLevelCm = controlValues["waterLevel"] ?? (controlValues["airColumnLength"] ?? 33.6);
  const soundSpeed = 344; // m/s
  // Wavelength lambda = v / f
  const lambdaCm = (soundSpeed / tuningForkFreq) * 100;
  const endCorrection = 0.96; // cm
  const firstResonanceCm = lambdaCm / 4 - endCorrection;
  const secondResonanceCm = (3 * lambdaCm) / 4 - endCorrection;

  const distToRes1 = Math.abs(waterLevelCm - firstResonanceCm);
  const distToRes2 = Math.abs(waterLevelCm - secondResonanceCm);
  const tubeResonance = Math.max(
    Math.max(0, 1 - distToRes1 / 3),
    Math.max(0, 1 - distToRes2 / 3)
  );

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
      bg.addColorStop(0, "#0a0f1d");
      bg.addColorStop(1, "#05070d");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      if (!isResonanceTube) {
        // --- SONOMETER SIMULATION ---
        const boxX = 60;
        const boxY = 140;
        const boxW = width - 180;
        const boxH = 90;

        // Wooden Soundbox
        ctx.fillStyle = "#854d0e";
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeStyle = "#451a03";
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Sound holes in wooden box
        ctx.fillStyle = "#1e1b18";
        ctx.beginPath();
        ctx.ellipse(boxX + 120, boxY + 45, 20, 10, 0, 0, Math.PI * 2);
        ctx.ellipse(boxX + boxW - 120, boxY + 45, 20, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fixed Left Bridge
        const leftBridgeX = boxX + 60;
        ctx.fillStyle = "#475569";
        ctx.beginPath();
        ctx.moveTo(leftBridgeX, boxY);
        ctx.lineTo(leftBridgeX - 12, boxY + 25);
        ctx.lineTo(leftBridgeX + 12, boxY + 25);
        ctx.closePath();
        ctx.fill();

        // Movable Right Bridge (adjusted by mouse/bridgeLengthCm)
        const pxPerCm = 6.2;
        const rightBridgeX = leftBridgeX + bridgeLengthCm * pxPerCm;
        ctx.fillStyle = "#0284c7";
        ctx.beginPath();
        ctx.moveTo(rightBridgeX, boxY);
        ctx.lineTo(rightBridgeX - 12, boxY + 25);
        ctx.lineTo(rightBridgeX + 12, boxY + 25);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pulley at right end
        const pulleyX = boxX + boxW + 20;
        const pulleyY = boxY + 12;
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.arc(pulleyX, pulleyY, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Stretched Wire
        // Wave standing vibration between bridges
        ctx.strokeStyle = "#f8fafc";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(boxX, boxY);
        ctx.lineTo(leftBridgeX, boxY);

        // Oscillating string segment
        const stringPoints = 40;
        const amp = 14 * sonometerResonance * Math.sin(timeRef.current * tuningForkFreq * 0.08);

        for (let i = 0; i <= stringPoints; i++) {
          const ratio = i / stringPoints;
          const x = leftBridgeX + ratio * (rightBridgeX - leftBridgeX);
          // Fundamental mode: sin(pi * x / l)
          const y = boxY + Math.sin(Math.PI * ratio) * amp;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(pulleyX, pulleyY);
        ctx.lineTo(pulleyX, 320);
        ctx.stroke();

        // Slotted weight hanger
        ctx.fillStyle = "#0369a1";
        ctx.fillRect(pulleyX - 15, 320, 30, 35);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px 'JetBrains Mono', monospace";
        ctx.fillText(`${hangerTensionKg}kg`, pulleyX - 12, 342);

        // Inverted V Paper Rider at string midpoint
        const midX = (leftBridgeX + rightBridgeX) / 2;
        const midY = boxY + amp;

        if (sonometerResonance > 0.88) {
          // Paper rider flies off!
          ctx.fillStyle = "#facc15";
          const flyY = boxY - 35 - (timeRef.current * 40) % 60;
          ctx.beginPath();
          ctx.moveTo(midX - 6, flyY + 8);
          ctx.lineTo(midX, flyY);
          ctx.lineTo(midX + 6, flyY + 8);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#f59e0b";
          ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText("⚡ RESONANCE! Paper rider threw off!", midX - 90, boxY - 60);
        } else {
          // Paper rider sitting on wire
          ctx.fillStyle = "#facc15";
          ctx.beginPath();
          ctx.moveTo(midX - 6, midY + 8);
          ctx.lineTo(midX, midY);
          ctx.lineTo(midX + 6, midY + 8);
          ctx.closePath();
          ctx.fill();
        }

        // Vibrating Tuning Fork pressed on soundbox
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(leftBridgeX - 35, boxY - 55, 12, 45);
        ctx.fillRect(leftBridgeX - 42, boxY - 95, 8, 42);
        ctx.fillRect(leftBridgeX - 22, boxY - 95, 8, 42);

        // Tuning fork acoustic ripples
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.beginPath();
        ctx.arc(leftBridgeX - 32, boxY - 75, 16 + (timeRef.current * 30) % 20, 0, Math.PI * 2);
        ctx.stroke();

        // HUD Readout
        ctx.fillStyle = "#f8fafc";
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.fillText(`Tuning Fork Frequency (f): ${tuningForkFreq} Hz`, 24, 30);
        ctx.fillText(`Wire Tension (T = Mg): ${tensionN.toFixed(1)} N (${hangerTensionKg} kg wt)`, 24, 52);
        ctx.fillText(`Active Vibrating Length (l): ${bridgeLengthCm.toFixed(1)} cm`, 24, 74);
        ctx.fillStyle = "#38bdf8";
        ctx.fillText(`Theoretical Resonance Length: ${resonantLengthCm.toFixed(1)} cm`, 24, 98);
        ctx.fillStyle = sonometerResonance > 0.85 ? "#4ade80" : "#f59e0b";
        ctx.font = "bold 15px 'JetBrains Mono', monospace";
        ctx.fillText(`Resonance Match: ${(sonometerResonance * 100).toFixed(0)}%`, 24, 124);

      } else {
        // --- RESONANCE TUBE SIMULATION ---
        const tubeX = width / 2 - 40;
        const tubeTopY = 70;
        const tubeH = 260;
        const tubeW = 48;

        // Glass tube outer boundary
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 3;
        ctx.strokeRect(tubeX, tubeTopY, tubeW, tubeH);

        // Water level inside tube (waterLevelCm from top mouth)
        const pxPerCm = 2.2;
        const airColHeightPx = Math.min(tubeH - 10, waterLevelCm * pxPerCm);
        const waterTopY = tubeTopY + airColHeightPx;

        // Water fill
        const waterGrad = ctx.createLinearGradient(0, waterTopY, 0, tubeTopY + tubeH);
        waterGrad.addColorStop(0, "rgba(56, 189, 248, 0.5)");
        waterGrad.addColorStop(1, "rgba(14, 165, 233, 0.8)");
        ctx.fillStyle = waterGrad;
        ctx.fillRect(tubeX + 2, waterTopY, tubeW - 4, tubeTopY + tubeH - waterTopY);

        // Water Meniscus
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(tubeX + tubeW / 2, waterTopY - 4, tubeW / 2 - 2, 0, Math.PI);
        ctx.stroke();

        // Standing Acoustic Sound Waves inside air column
        ctx.strokeStyle = "rgba(244, 63, 94, 0.7)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        const steps = 30;
        const waveAmp = 18 * tubeResonance * Math.sin(timeRef.current * 18);

        for (let s = 0; s <= steps; s++) {
          const ratio = s / steps;
          const y = tubeTopY + ratio * airColHeightPx;
          // Standing wave with node at water surface, antinode at top
          // cos((1 - ratio) * pi / 2)
          const offset = Math.cos((1 - ratio) * Math.PI * 0.5) * waveAmp;
          if (s === 0) ctx.moveTo(tubeX + tubeW / 2 + offset, y);
          else ctx.lineTo(tubeX + tubeW / 2 + offset, y);
        }
        ctx.stroke();

        // Opposite branch of envelope
        ctx.beginPath();
        for (let s = 0; s <= steps; s++) {
          const ratio = s / steps;
          const y = tubeTopY + ratio * airColHeightPx;
          const offset = -Math.cos((1 - ratio) * Math.PI * 0.5) * waveAmp;
          if (s === 0) ctx.moveTo(tubeX + tubeW / 2 + offset, y);
          else ctx.lineTo(tubeX + tubeW / 2 + offset, y);
        }
        ctx.stroke();

        // Vibrating Tuning Fork horizontally above tube mouth
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(tubeX - 25, tubeTopY - 25, 45, 8);
        ctx.fillRect(tubeX - 25, tubeTopY - 40, 45, 8);
        ctx.fillRect(tubeX - 45, tubeTopY - 36, 20, 14);

        // Sound intensity indicator
        ctx.fillStyle = tubeResonance > 0.85 ? "#4ade80" : "#94a3b8";
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.fillText(`Acoustic Resonance: ${(tubeResonance * 100).toFixed(0)}%`, width - 260, 40);

        // Millimeter scale along tube
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(tubeX - 28, tubeTopY, 20, tubeH);
        ctx.strokeStyle = "#64748b";
        for (let cm = 0; cm <= 100; cm += 10) {
          const y = tubeTopY + cm * 2.2;
          if (y > tubeTopY + tubeH) break;
          ctx.beginPath();
          ctx.moveTo(tubeX - 28, y);
          ctx.lineTo(tubeX - 14, y);
          ctx.stroke();
        }

        // HUD Readout
        ctx.fillStyle = "#f8fafc";
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.fillText(`Tuning Fork Frequency (f): ${tuningForkFreq} Hz`, 24, 30);
        ctx.fillText(`Wavelength λ = ${(lambdaCm).toFixed(1)} cm`, 24, 52);
        ctx.fillText(`First Resonance Length (l1): ${firstResonanceCm.toFixed(1)} cm`, 24, 74);
        ctx.fillText(`Second Resonance Length (l2): ${secondResonanceCm.toFixed(1)} cm`, 24, 96);
        ctx.fillStyle = "#38bdf8";
        ctx.fillText(`Current Air Column Length: ${waterLevelCm.toFixed(1)} cm`, 24, 120);
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 15px 'JetBrains Mono', monospace";
        ctx.fillText(`Calculated Speed of Sound v = ${soundSpeed} m/s | e = ${endCorrection} cm`, 24, 146);
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isResonanceTube, bridgeLengthCm, hangerTensionKg, tuningForkFreq, waterLevelCm, resonantLengthCm, sonometerResonance, tubeResonance, firstResonanceCm, secondResonanceCm, tensionN]);

  // Mouse drag handler on canvas
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (!isResonanceTube) {
      const len = 12 + ratio * 55;
      onControlChange("bridgeLength", Number(len.toFixed(1)));
    } else {
      const wLevel = 10 + ratio * 95;
      onControlChange("waterLevel", Number(wLevel.toFixed(1)));
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
          Drag mouse horizontally to move bridge / reservoir
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!isResonanceTube) onControlChange("bridgeLength", Number(resonantLengthCm.toFixed(1)));
              else onControlChange("waterLevel", Number(firstResonanceCm.toFixed(1)));
            }}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-700/60 text-xs font-medium text-cyan-300 transition-all flex items-center gap-1"
          >
            🎯 Auto-Tune to Resonance
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
