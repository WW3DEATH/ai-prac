import React, { useRef, useEffect, useState } from "react";
import { PracticalItem } from "../../types";

interface Props {
  practical: PracticalItem;
  controlValues: Record<string, number>;
  onControlChange: (id: string, val: number) => void;
  onRecordReading?: () => void;
}

export const ElectricityElectronicsSim: React.FC<Props> = ({
  practical,
  controlValues,
  onControlChange,
  onRecordReading,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isMetreBridge = practical.id === "prac-32";
  const isPotentiometer = practical.id === "prac-33" || practical.id === "prac-34";
  const isDiode = practical.id === "prac-35";
  const isTransistor = practical.id === "prac-36";
  const isLogicGates = practical.id === "prac-37";
  const isDryCell = practical.id === "prac-31";

  // Control values
  const jockeyPos = controlValues["jockeyPosition"] ?? 58.4; // cm
  const rheostatR = controlValues["resistanceBoxR"] ?? (controlValues["rheostatR"] ?? 4.5); // ohms
  const logicInA = controlValues["inputA"] ?? 1;
  const logicInB = controlValues["inputB"] ?? 0;
  const gateType = controlValues["gateType"] ?? 0; // 0: AND, 1: OR, 2: NAND, 3: NOR, 4: XOR
  const forwardBiasV = controlValues["forwardBiasV"] ?? 0.68; // V
  const baseCurrentIb = controlValues["baseCurrentIb"] ?? 40; // uA
  const vce = controlValues["collectorVoltageVce"] ?? 4.0; // V

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dark sleek electrical circuit board background
    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#080d1a");
    bg.addColorStop(1, "#03060c");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // PCB circuit lines pattern
    ctx.strokeStyle = "rgba(14, 165, 233, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (isLogicGates) {
      // --- 37. LOGIC GATES SIMULATION ---
      const gateNames = ["AND", "OR", "NAND", "NOR", "XOR"];
      const currentGate = gateNames[Math.floor(gateType) % gateNames.length];

      let outputY = 0;
      if (currentGate === "AND") outputY = logicInA && logicInB ? 1 : 0;
      else if (currentGate === "OR") outputY = logicInA || logicInB ? 1 : 0;
      else if (currentGate === "NAND") outputY = !(logicInA && logicInB) ? 1 : 0;
      else if (currentGate === "NOR") outputY = !(logicInA || logicInB) ? 1 : 0;
      else if (currentGate === "XOR") outputY = logicInA !== logicInB ? 1 : 0;

      const gateCenterX = width / 2 - 30;
      const gateCenterY = height / 2;

      // Inputs A and B switches
      const inAX = gateCenterX - 140;
      const inAY = gateCenterY - 45;
      const inBX = gateCenterX - 140;
      const inBY = gateCenterY + 45;

      // Draw Input Switch A
      ctx.fillStyle = logicInA ? "#22c55e" : "#475569";
      ctx.beginPath();
      ctx.arc(inAX, inAY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.fillText(`A=${logicInA}`, inAX - 12, inAY + 5);

      // Draw Input Switch B
      ctx.fillStyle = logicInB ? "#22c55e" : "#475569";
      ctx.beginPath();
      ctx.arc(inBX, inBY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`B=${logicInB}`, inBX - 12, inBY + 5);

      // Connecting wires to gate
      ctx.strokeStyle = logicInA ? "#22c55e" : "#64748b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(inAX + 18, inAY);
      ctx.lineTo(gateCenterX - 50, inAY);
      ctx.stroke();

      ctx.strokeStyle = logicInB ? "#22c55e" : "#64748b";
      ctx.beginPath();
      ctx.moveTo(inBX + 18, inBY);
      ctx.lineTo(gateCenterX - 50, inBY);
      ctx.stroke();

      // Draw Logic Gate Symbol
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;

      // Logic Gate Body
      ctx.beginPath();
      ctx.rect(gateCenterX - 50, gateCenterY - 60, 100, 120);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 20px 'JetBrains Mono', monospace";
      ctx.fillText(currentGate, gateCenterX - 24, gateCenterY + 7);

      // Output wire to LED
      const outX = gateCenterX + 150;
      ctx.strokeStyle = outputY ? "#38bdf8" : "#64748b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(gateCenterX + 50, gateCenterY);
      ctx.lineTo(outX - 25, gateCenterY);
      ctx.stroke();

      // Output Glowing LED
      ctx.fillStyle = outputY ? "#38bdf8" : "#334155";
      ctx.beginPath();
      ctx.arc(outX, gateCenterY, 22, 0, Math.PI * 2);
      ctx.fill();

      if (outputY) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 8;
        ctx.stroke();
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px 'JetBrains Mono', monospace";
      ctx.fillText(`Y = ${outputY}`, outX - 18, gateCenterY + 5);

      // Truth Table on right side
      const ttX = width - 190;
      const ttY = 50;
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.fillRect(ttX, ttY, 170, 140);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1;
      ctx.strokeRect(ttX, ttY, 170, 140);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillText(`TRUTH TABLE: ${currentGate}`, ttX + 12, ttY + 22);
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText("A   B  |  Y", ttX + 15, ttY + 44);
      ctx.fillText("--------------", ttX + 15, ttY + 54);
      ctx.fillText("0   0  |  " + (currentGate === "AND" ? "0" : currentGate === "OR" ? "0" : currentGate === "NAND" ? "1" : currentGate === "NOR" ? "1" : "0"), ttX + 15, ttY + 70);
      ctx.fillText("0   1  |  " + (currentGate === "AND" ? "0" : currentGate === "OR" ? "1" : currentGate === "NAND" ? "1" : currentGate === "NOR" ? "0" : "1"), ttX + 15, ttY + 86);
      ctx.fillText("1   0  |  " + (currentGate === "AND" ? "0" : currentGate === "OR" ? "1" : currentGate === "NAND" ? "1" : currentGate === "NOR" ? "0" : "1"), ttX + 15, ttY + 102);
      ctx.fillText("1   1  |  " + (currentGate === "AND" ? "1" : currentGate === "OR" ? "1" : currentGate === "NAND" ? "0" : currentGate === "NOR" ? "0" : "0"), ttX + 15, ttY + 118);

      // HUD
      ctx.fillStyle = "#f8fafc";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillText(`Gate Type: ${currentGate}`, 24, 30);
      ctx.fillText(`Boolean State: A = ${logicInA}, B = ${logicInB} ➔ Output Y = ${outputY}`, 24, 52);
      ctx.fillStyle = outputY ? "#4ade80" : "#f43f5e";
      ctx.font = "bold 15px 'JetBrains Mono', monospace";
      ctx.fillText(`Output Status: ${outputY ? "HIGH (5.0V - LED GLOWING)" : "LOW (0.0V - LED OFF)"}`, 24, 80);

    } else if (isPotentiometer || isMetreBridge) {
      // --- 32, 33, 34. METRE BRIDGE & POTENTIOMETER ---
      const wireStartX = 80;
      const wireEndX = width - 80;
      const wireY = height / 2 + 35;
      const wireLenPx = wireEndX - wireStartX;
      const pxPerCm = wireLenPx / 100;

      // Wooden baseboard
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(wireStartX - 20, wireY - 20, wireLenPx + 40, 55);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.strokeRect(wireStartX - 20, wireY - 20, wireLenPx + 40, 55);

      // 1-metre uniform resistance wire
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(wireStartX, wireY);
      ctx.lineTo(wireEndX, wireY);
      ctx.stroke();

      // Brass terminal strips at A (0cm) and B (100cm)
      ctx.fillStyle = "#eab308";
      ctx.fillRect(wireStartX - 16, wireY - 15, 16, 30);
      ctx.fillRect(wireEndX, wireY - 15, 16, 30);

      // Millimeter Scale under wire
      ctx.fillStyle = "#64748b";
      ctx.font = "9px 'JetBrains Mono', monospace";
      for (let cm = 0; cm <= 100; cm += 10) {
        const x = wireStartX + cm * pxPerCm;
        ctx.beginPath();
        ctx.moveTo(x, wireY);
        ctx.lineTo(x, wireY + 8);
        ctx.stroke();
        ctx.fillText(`${cm}`, x - 6, wireY + 22);
      }

      // Exact balance point
      const trueBalanceL = isMetreBridge
        ? (100 * rheostatR) / (rheostatR + 6.2) // R = S * l / (100 - l)
        : (isPotentiometer ? 58.4 : 50);

      const galvanometerDeflection = (jockeyPos - trueBalanceL) * 2.2;
      const isBalanced = Math.abs(jockeyPos - trueBalanceL) < 0.6;

      // Jockey knife-edge contact
      const jockeyX = wireStartX + jockeyPos * pxPerCm;
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(jockeyX - 6, wireY - 18);
      ctx.lineTo(jockeyX, wireY);
      ctx.lineTo(jockeyX + 6, wireY - 18);
      ctx.closePath();
      ctx.fill();

      // Jockey handle
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(jockeyX - 3, wireY - 55, 6, 37);

      // Sensitive Center-Zero Galvanometer
      const galvoX = width / 2;
      const galvoY = 85;
      const galvoR = 48;

      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(galvoX, galvoY, galvoR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isBalanced ? "#4ade80" : "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Galvanometer Dial scale
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      for (let a = -30; a <= 30; a += 10) {
        const rad = ((a - 90) * Math.PI) / 180;
        const x1 = galvoX + Math.cos(rad) * 36;
        const y1 = galvoY + Math.sin(rad) * 36;
        const x2 = galvoX + Math.cos(rad) * 44;
        const y2 = galvoY + Math.sin(rad) * 44;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Galvanometer Center-Zero Needle
      const needleAngle = Math.max(-50, Math.min(50, galvanometerDeflection));
      const needleRad = ((needleAngle - 90) * Math.PI) / 180;
      ctx.strokeStyle = isBalanced ? "#4ade80" : "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(galvoX, galvoY + 10);
      ctx.lineTo(galvoX + Math.cos(needleRad) * 40, galvoY + Math.sin(needleRad) * 40);
      ctx.stroke();

      ctx.fillStyle = isBalanced ? "#4ade80" : "#94a3b8";
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillText("G (0-Center)", galvoX - 35, galvoY + 30);

      // Wire connecting jockey to galvanometer
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(jockeyX, wireY - 55);
      ctx.quadraticCurveTo(jockeyX, galvoY + 40, galvoX, galvoY + 40);
      ctx.stroke();

      // HUD
      ctx.fillStyle = "#f8fafc";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillText(`Jockey Position (l): ${jockeyPos.toFixed(1)} cm | (100 - l) = ${(100 - jockeyPos).toFixed(1)} cm`, 24, 30);
      ctx.fillText(`Known Resistance (S): ${rheostatR.toFixed(2)} Ω`, 24, 52);
      ctx.fillStyle = isBalanced ? "#4ade80" : "#f59e0b";
      ctx.font = "bold 15px 'JetBrains Mono', monospace";
      if (isBalanced) {
        const unkR = (rheostatR * trueBalanceL) / (100 - trueBalanceL);
        ctx.fillText(`✓ NULL DEFLECTION REACHED (Ig = 0)! Unknown R = ${unkR.toFixed(2)} Ω`, 24, 80);
      } else {
        ctx.fillText(`Galvanometer Deflection: ${galvanometerDeflection > 0 ? "+" : ""}${galvanometerDeflection.toFixed(1)}°`, 24, 80);
      }

    } else if (isDiode) {
      // --- 35. SEMICONDUCTOR DIODE I-V CHARACTERISTIC ---
      // Shockley diode equation: I = Is * (exp(V / (n*Vt)) - 1)
      const Vt = 0.026; // V
      const Is = 1e-9; // A
      const diodeCurrentMa = forwardBiasV > 0.4
        ? Math.min(60, Is * (Math.exp(forwardBiasV / (1.5 * Vt)) - 1) * 1000)
        : 0;

      // Draw I-V Graph Display on Canvas
      const gX = 80;
      const gY = 60;
      const gW = width - 160;
      const gH = height - 120;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(gX, gY, gW, gH);
      ctx.strokeStyle = "#334155";
      ctx.strokeRect(gX, gY, gW, gH);

      // Axes
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.5;
      // Y-axis (Current I in mA)
      ctx.beginPath();
      ctx.moveTo(gX + 60, gY);
      ctx.lineTo(gX + 60, gY + gH);
      ctx.stroke();

      // X-axis (Voltage V in Volts)
      ctx.beginPath();
      ctx.moveTo(gX, gY + gH - 30);
      ctx.lineTo(gX + gW, gY + gH - 30);
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText("Forward Current I (mA) ➔", gX + 65, gY + 20);
      ctx.fillText("Forward Voltage V (V) ➔", gX + gW - 170, gY + gH - 12);

      // Knee voltage mark (0.6V Silicon)
      const pxPerV = (gW - 100) / 1.0;
      const kneeX = gX + 60 + 0.6 * pxPerV;
      ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(kneeX, gY);
      ctx.lineTo(kneeX, gY + gH - 30);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#f59e0b";
      ctx.fillText("Knee V ≈ 0.6V", kneeX - 35, gY + 40);

      // Characteristic Curve
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let v = 0; v <= 0.85; v += 0.02) {
        const iVal = v > 0.4 ? Math.min(60, Is * (Math.exp(v / (1.5 * Vt)) - 1) * 1000) : 0;
        const ptX = gX + 60 + v * pxPerV;
        const ptY = (gY + gH - 30) - (iVal / 60) * (gH - 50);
        if (v === 0) ctx.moveTo(ptX, ptY);
        else ctx.lineTo(ptX, ptY);
      }
      ctx.stroke();

      // Active Operating Point dot
      const opX = gX + 60 + forwardBiasV * pxPerV;
      const opY = (gY + gH - 30) - (diodeCurrentMa / 60) * (gH - 50);
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(opX, opY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f87171";
      ctx.lineWidth = 3;
      ctx.stroke();

      // HUD
      ctx.fillStyle = "#f8fafc";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillText(`Diode Voltage (V): ${forwardBiasV.toFixed(2)} V`, 24, 30);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`Forward Current (I): ${diodeCurrentMa.toFixed(2)} mA`, 24, 52);
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 15px 'JetBrains Mono', monospace";
      ctx.fillText(`Dynamic Resistance rd = ΔV/ΔI ≈ ${(Vt / (diodeCurrentMa * 1e-3 || 1e-4)).toFixed(1)} Ω`, 24, 80);

    } else {
      // --- 31. DRY CELL EMF & INTERNAL RESISTANCE ---
      // E = V + Ir => I = E / (R + r), V = I * R
      const E = 1.52; // Volts
      const r = 1.25; // Ohms
      const currentA = E / (rheostatR + r);
      const terminalV = currentA * rheostatR;

      // Circuit schematic components
      const cellX = width / 2 - 120;
      const cellY = height / 2 - 40;

      // Dry cell battery icon
      ctx.fillStyle = "#334155";
      ctx.fillRect(cellX - 25, cellY - 15, 50, 30);
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(cellX + 25, cellY - 8, 8, 16);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 12px 'JetBrains Mono', monospace";
      ctx.fillText(`Cell (E, r)`, cellX - 35, cellY - 24);

      // Resistor Box
      const resX = width / 2 + 100;
      const resY = height / 2 - 40;
      ctx.fillStyle = "#475569";
      ctx.fillRect(resX - 30, resY - 18, 60, 36);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.strokeRect(resX - 30, resY - 18, 60, 36);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`${rheostatR.toFixed(1)}Ω`, resX - 16, resY + 5);

      // Digital Voltmeter (in parallel)
      const vmX = width / 2;
      const vmY = height / 2 + 70;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(vmX - 50, vmY - 25, 100, 50);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.strokeRect(vmX - 50, vmY - 25, 100, 50);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 15px 'JetBrains Mono', monospace";
      ctx.fillText(`${terminalV.toFixed(2)} V`, vmX - 28, vmY + 6);
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Voltmeter", vmX - 26, vmY + 20);

      // Circuit wires
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Top loop
      ctx.moveTo(cellX + 33, cellY);
      ctx.lineTo(resX - 30, resY);
      ctx.stroke();

      // Bottom return loop
      ctx.beginPath();
      ctx.moveTo(resX + 30, resY);
      ctx.lineTo(resX + 60, resY);
      ctx.lineTo(resX + 60, resY + 80);
      ctx.lineTo(cellX - 60, resY + 80);
      ctx.lineTo(cellX - 60, cellY);
      ctx.lineTo(cellX - 25, cellY);
      ctx.stroke();

      // Voltmeter taps
      ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
      ctx.beginPath();
      ctx.moveTo(cellX - 25, cellY);
      ctx.lineTo(cellX - 25, vmY);
      ctx.lineTo(vmX - 50, vmY);
      ctx.moveTo(cellX + 33, cellY);
      ctx.lineTo(cellX + 33, vmY);
      ctx.lineTo(vmX + 50, vmY);
      ctx.stroke();

      // HUD
      ctx.fillStyle = "#f8fafc";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.fillText(`Load Resistance (R): ${rheostatR.toFixed(2)} Ω`, 24, 30);
      ctx.fillText(`Circuit Current (I = E / (R + r)): ${(currentA * 1000).toFixed(1)} mA`, 24, 52);
      ctx.fillText(`Terminal Potential Difference (V): ${terminalV.toFixed(2)} V`, 24, 74);
      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 15px 'JetBrains Mono', monospace";
      ctx.fillText(`Cell EMF E = ${E.toFixed(2)} V | Internal Resistance r = ${r.toFixed(2)} Ω`, 24, 102);
    }

  }, [practical.id, jockeyPos, rheostatR, logicInA, logicInB, gateType, forwardBiasV, isMetreBridge, isPotentiometer, isDiode, isLogicGates, isDryCell]);

  // Mouse drag handler on canvas
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (isPotentiometer || isMetreBridge) {
      const pos = ratio * 100;
      onControlChange("jockeyPosition", Number(pos.toFixed(1)));
    } else if (isDiode) {
      const v = ratio * 0.85;
      onControlChange("forwardBiasV", Number(v.toFixed(2)));
    } else {
      const r = 0.5 + ratio * 20;
      onControlChange("resistanceBoxR", Number(r.toFixed(1)));
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
          Drag horizontally to slide jockey / adjust voltage
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isLogicGates ? (
            <>
              <button
                onClick={() => onControlChange("inputA", logicInA ? 0 : 1)}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-200 transition-all"
              >
                Toggle Input A ({logicInA})
              </button>
              <button
                onClick={() => onControlChange("inputB", logicInB ? 0 : 1)}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-200 transition-all"
              >
                Toggle Input B ({logicInB})
              </button>
              <button
                onClick={() => onControlChange("gateType", (gateType + 1) % 5)}
                className="px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/70 text-xs font-medium text-cyan-300 transition-all"
              >
                Switch Gate Type
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                if (isPotentiometer || isMetreBridge) onControlChange("jockeyPosition", 58.4);
                else if (isDiode) onControlChange("forwardBiasV", 0.68);
                else onControlChange("resistanceBoxR", 4.5);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-300 transition-all hover:text-white"
            >
              Reset Value
            </button>
          )}
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
