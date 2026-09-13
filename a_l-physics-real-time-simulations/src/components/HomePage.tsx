import React, { useState, useRef, useEffect } from "react";
import { PracticalItem } from "../types";
import {
  Sparkles,
  Compass,
  Layers,
  ArrowRight,
  Play,
  Atom,
  Cpu,
  Waves,
  Eye,
  Thermometer,
  Zap,
  Droplets,
  Search,
  CheckCircle2,
  ChevronRight,
  Sliders,
  TrendingUp,
  BrainCircuit,
  MessageSquareCode,
  ShieldCheck,
} from "lucide-react";

interface Props {
  practicals: PracticalItem[];
  onSelectPractical: (id: string) => void;
  onEnterLab: () => void;
  onOpenAITutor: (query?: string) => void;
}

export const HomePage: React.FC<Props> = ({
  practicals,
  onSelectPractical,
  onEnterLab,
  onOpenAITutor,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeSpotlight, setActiveSpotlight] = useState<"sonometer" | "vernier" | "prism">("sonometer");
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightCanvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Filter practicals for the matrix
  const categories = [
    "All",
    "Mechanics & Matter",
    "Hydrostatics & Fluids",
    "Oscillations & Waves",
    "Geometrical Optics",
    "Thermal Physics",
    "Electricity & Electronics",
  ];

  const filtered = practicals.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.formula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Hero Background Interactive Particle & Wave Canvas
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 650;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      time += 0.015;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Radial glowing background around mouse
      const mx = mousePos.current.x * width;
      const my = mousePos.current.y * height;

      const radialGrad = ctx.createRadialGradient(mx, my, 10, mx, my, 350);
      radialGrad.addColorStop(0, "rgba(56, 189, 248, 0.12)");
      radialGrad.addColorStop(0.5, "rgba(14, 165, 233, 0.04)");
      radialGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Flowing Harmonic Standing Wave lines
      const waveCount = 4;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        ctx.strokeStyle =
          w === 0
            ? "rgba(56, 189, 248, 0.35)"
            : w === 1
            ? "rgba(168, 85, 247, 0.25)"
            : w === 2
            ? "rgba(45, 212, 191, 0.2)"
            : "rgba(244, 114, 182, 0.15)";
        ctx.lineWidth = w === 0 ? 2.5 : 1.5;

        const freq = 0.004 * (w + 1);
        const baseAmp = 35 + w * 15;
        const phase = time * (1.2 + w * 0.4);

        for (let x = 0; x <= width; x += 15) {
          const envelope = Math.sin((x / width) * Math.PI);
          // Standing wave modulated by mouse Y
          const mouseInfluence = 1 + (mousePos.current.y - 0.5) * 0.8;
          const y =
            height * (0.45 + w * 0.08) +
            Math.sin(x * freq + phase) * envelope * baseAmp * mouseInfluence;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Physics harmonic node markers
      const nodes = 5;
      for (let n = 1; n < nodes; n++) {
        const nx = (n / nodes) * width;
        const ny = height * 0.45;
        ctx.fillStyle = "rgba(56, 189, 248, 0.6)";
        ctx.beginPath();
        ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
        ctx.beginPath();
        ctx.arc(nx, ny, 8 + Math.sin(time * 3 + n) * 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Spotlight Mini Interactive Canvas
  useEffect(() => {
    const canvas = spotlightCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#080e1a");
      bg.addColorStop(1, "#03060c");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      if (activeSpotlight === "sonometer") {
        // Live sonometer standing waves and paper rider
        const midY = h / 2 + 10;
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, midY);
        ctx.lineTo(w - 30, midY);
        ctx.stroke();

        // Bridges
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.moveTo(60, midY);
        ctx.lineTo(50, midY + 25);
        ctx.lineTo(70, midY + 25);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(w - 60, midY);
        ctx.lineTo(w - 70, midY + 25);
        ctx.lineTo(w - 50, midY + 25);
        ctx.closePath();
        ctx.fill();

        // Oscillating string
        ctx.strokeStyle = "#f8fafc";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(60, midY);
        const amp = 16 * Math.sin(t * 6);
        for (let x = 60; x <= w - 60; x += 5) {
          const ratio = (x - 60) / (w - 120);
          const y = midY + Math.sin(ratio * Math.PI) * amp;
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Paper Rider at midpoint
        const riderX = w / 2;
        const riderY = midY + amp;
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.moveTo(riderX - 8, riderY + 10);
        ctx.lineTo(riderX, riderY);
        ctx.lineTo(riderX + 8, riderY + 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.fillText("Fundamental Resonance: f = (1/2l) √(T/μ)", 30, 35);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText("Vibrating string mode with paper rider excitation", 30, 55);

      } else if (activeSpotlight === "vernier") {
        // Vernier Calliper preview
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(40, h / 2 - 20, w - 80, 40);
        ctx.strokeStyle = "#0ea5e9";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(40, h / 2 - 20, w - 80, 40);

        // Scale ticks
        ctx.strokeStyle = "#e2e8f0";
        for (let mm = 0; mm <= 40; mm++) {
          const x = 70 + mm * 8;
          if (x > w - 60) break;
          ctx.beginPath();
          ctx.moveTo(x, h / 2 + 20);
          ctx.lineTo(x, h / 2 + (mm % 5 === 0 ? 5 : 12));
          ctx.stroke();
        }

        // Sliding Vernier Plate
        const slideX = 70 + (Math.sin(t * 1.5) * 0.5 + 0.5) * 120;
        ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
        ctx.fillRect(slideX, h / 2 - 24, 70, 48);
        ctx.strokeStyle = "#38bdf8";
        ctx.strokeRect(slideX, h / 2 - 24, 70, 48);

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.fillText("Sub-Millimeter Coincidence: LC = 0.1 mm", 30, 35);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText("Main Scale & Vernier Scale coincidence alignment", 30, 55);

      } else {
        // Prism Ray Tracing
        const px = w / 2;
        const py = h / 2 - 10;
        // Prism triangle
        ctx.fillStyle = "rgba(56, 189, 248, 0.2)";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, py - 50);
        ctx.lineTo(px - 60, py + 50);
        ctx.lineTo(px + 60, py + 50);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Incident Ray
        const rot = Math.sin(t * 1.5) * 0.15;
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px - 140, py + 20 + rot * 80);
        ctx.lineTo(px - 28, py + 5);
        ctx.stroke();

        // Refracted ray inside
        ctx.strokeStyle = "rgba(250, 204, 21, 0.8)";
        ctx.beginPath();
        ctx.moveTo(px - 28, py + 5);
        ctx.lineTo(px + 28, py + 5);
        ctx.stroke();

        // Emergent dispersed rays
        ctx.strokeStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(px + 28, py + 5);
        ctx.lineTo(px + 130, py + 35);
        ctx.stroke();

        ctx.strokeStyle = "#38bdf8";
        ctx.beginPath();
        ctx.moveTo(px + 28, py + 5);
        ctx.lineTo(px + 130, py + 50);
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.fillText("Refraction & Minimum Deviation Dm", 30, 35);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText("Snell's Law ray geometry through 60° Crown Glass", 30, 55);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeSpotlight]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePos.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const domainCategories = [
    {
      title: "Mechanics & Elasticity",
      icon: Atom,
      count: 8,
      desc: "Vernier, Micrometer, Spherometer, Searle's Young's Modulus, Principle of Moments, Gravesand's Forces.",
      color: "from-cyan-500/20 to-blue-500/10",
      borderColor: "border-cyan-500/30",
      textColor: "text-cyan-400",
      firstId: "prac-1",
    },
    {
      title: "Oscillations & Waves",
      icon: Waves,
      count: 6,
      desc: "Simple Pendulum, Helical Spring, Sonometer wire resonance, Resonance Tube velocity of sound.",
      color: "from-purple-500/20 to-indigo-500/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      firstId: "prac-10",
    },
    {
      title: "Geometrical Optics",
      icon: Eye,
      count: 6,
      desc: "Travelling Microscope, Refraction through Prism, Critical Angle, Spectrometer, Convex/Concave no-parallax.",
      color: "from-emerald-500/20 to-teal-500/10",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      firstId: "prac-4",
    },
    {
      title: "Thermal Physics",
      icon: Thermometer,
      count: 8,
      desc: "Charles's Law absolute zero, Pressure Law, Method of Mixtures, Newton's Cooling, Dew Point, Latent Heats.",
      color: "from-amber-500/20 to-orange-500/10",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
      firstId: "prac-23",
    },
    {
      title: "Electricity & Electronics",
      icon: Zap,
      count: 7,
      desc: "Dry Cell EMF/r, Metre Bridge Cu coil, Potentiometer cell comparison, Diode I-V, Transistor CE, Logic Gates.",
      color: "from-blue-500/20 to-cyan-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      firstId: "prac-31",
    },
    {
      title: "Hydrostatics & Matter",
      icon: Droplets,
      count: 7,
      desc: "U-tube, Hare's suction, Quill tube Boyle's law, Poiseuille's viscosity, Capillary rise, Jaeger's bubble method.",
      color: "from-sky-500/20 to-indigo-500/10",
      borderColor: "border-sky-500/30",
      textColor: "text-sky-400",
      firstId: "prac-7",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[25%] w-[650px] h-[650px] rounded-full bg-cyan-600/10 blur-[150px]" />
        <div className="absolute top-[35%] right-[5%] w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[180px]" />
        <div className="absolute top-[70%] left-[10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[170px]" />
      </div>

      {/* --- HERO SECTION WITH INTERACTIVE CANVAS & PARALLAX --- */}
      <section
        onMouseMove={handleMouseMove}
        className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 pt-10 pb-16 overflow-hidden z-10"
      >
        {/* Interactive Ambient Canvas */}
        <canvas
          ref={heroCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-lg shadow-cyan-500/10 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-mono font-medium text-cyan-300">
              Next-Gen AI Physics Laboratory • Full 42 G.C.E. A/L Syllabus
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
            Master Physics Practicals with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              Real-Time Simulations
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300/90 max-w-2xl leading-relaxed mb-8 font-normal">
            Experience sub-millimeter Vernier calibration, standing acoustic sonometer waves,
            optical bench ray-tracing, and potentiometer null points. Completely controlled by mouse
            with Gemini AI theoretical analysis.
          </p>

          {/* Primary Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
            <button
              onClick={onEnterLab}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center gap-2 group"
            >
              <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              <span>Enter Interactive Workbench</span>
            </button>

            <a
              href="#matrix"
              className="px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 text-slate-200 font-medium text-sm backdrop-blur-xl transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Explore All 42 Practicals</span>
            </a>
          </div>

          {/* Hero Stats Pill Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">42 / 42</div>
              <div className="text-xs text-slate-400">Syllabus Practicals</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">100%</div>
              <div className="text-xs text-slate-400">Mouse Interactive</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">0.01 mm</div>
              <div className="text-xs text-slate-400">Vernier Precision</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-purple-400">Gemini AI</div>
              <div className="text-xs text-slate-400">Thinking Tutor</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- INTERACTIVE SPOTLIGHT SANDBOX PREVIEW --- */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/50 p-6 backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                <Sliders className="w-4 h-4" />
                Live Physics Engine Sandbox
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Experience Real-Time Simulation Fidelity
              </h3>
            </div>

            {/* Switch tabs */}
            <div className="flex items-center gap-2 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveSpotlight("sonometer")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeSpotlight === "sonometer"
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sonometer Wire
              </button>
              <button
                onClick={() => setActiveSpotlight("vernier")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeSpotlight === "vernier"
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Vernier Callipers
              </button>
              <button
                onClick={() => setActiveSpotlight("prism")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeSpotlight === "prism"
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Prism Refraction
              </button>
            </div>
          </div>

          {/* Sandbox Canvas */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-inner">
            <canvas
              ref={spotlightCanvasRef}
              width={760}
              height={280}
              className="w-full h-auto block"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              Every practical contains full harmonic physics, zero-error calibration, and data tables.
            </span>
            <button
              onClick={() => {
                if (activeSpotlight === "sonometer") onSelectPractical("prac-12");
                else if (activeSpotlight === "vernier") onSelectPractical("prac-1");
                else onSelectPractical("prac-17");
              }}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 group"
            >
              <span>Open Full Practical Workspace</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* --- PARALLAX PHYSICS DOMAINS SECTION --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Comprehensive Curriculum
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 mb-3">
            Six Specialized Physics Domains
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Categorized directly according to the Department of Examinations G.C.E. Advanced Level syllabus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {domainCategories.map((dom, i) => {
            const Icon = dom.icon;
            return (
              <div
                key={i}
                className={`p-6 rounded-3xl border ${dom.borderColor} bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/70 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:shadow-2xl hover:scale-[1.01]`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${dom.color} ${dom.textColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-400">
                      {dom.count} Practicals
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {dom.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {dom.desc}
                  </p>
                </div>

                <button
                  onClick={() => onSelectPractical(dom.firstId)}
                  className="w-full py-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 group-hover:text-white group-hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Launch Domain Practicals</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- AI LAB TUTOR SPOTLIGHT SECTION --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/20 to-slate-900/40 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
                <BrainCircuit className="w-3.5 h-3.5" />
                Gemini AI Thinking Mode
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Your Personal AI Physics Lab Tutor
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Connect directly with Gemini to dissect any experimental step. Analyze trial readings
                for random or systematic errors, deduce theoretical linear gradients (y = mx + c),
                and avoid classic A/L structured essay examination traps.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time analysis of logged trial data points & best-fit regression lines</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Google Search Grounding for past examination marking scheme criteria</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Precise guidance on eliminating parallax, back-lash, and zero errors</span>
                </div>
              </div>

              <button
                onClick={() => onOpenAITutor("What are the most tested structured essay questions across all 42 A/L physics practicals?")}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Tutor a Question</span>
              </button>
            </div>

            {/* Mock Chat Card Preview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-xl font-sans text-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="font-mono text-cyan-400 font-bold">AI TUTOR PREVIEW</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Reasoning
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-slate-200">
                <span className="font-semibold text-cyan-300">Student:</span> "Why do we take readings for both increasing and decreasing loads in Searle's wire experiment?"
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed">
                <span className="font-semibold text-emerald-400">AI Tutor:</span> "This eliminates elastic hysteresis and confirms the wire remains within its Hooke's Law proportional limit without permanent set. If loading and unloading lines coincide, deformation is purely elastic!"
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
                <button
                  onClick={() => onOpenAITutor("Explain the significance of the gradient in Sonometer f vs 1/l graph")}
                  className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                >
                  📈 Sonometer Gradient
                </button>
                <button
                  onClick={() => onOpenAITutor("How to eliminate zero error in micrometer screw gauge?")}
                  className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                >
                  ⚙ Screw Gauge Calibration
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ALL 42 PRACTICALS INTERACTIVE MATRIX --- */}
      <section id="matrix" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1">
              <Layers className="w-4 h-4" />
              Full Syllabus Syllabus Matrix
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              All 42 Prescribed Practicals
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search practicals, formulas..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPractical(p.id)}
              className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/80 backdrop-blur-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] font-semibold">
                    EXP #{p.number}
                  </span>
                  <span className="text-[10px] text-slate-500">{p.category}</span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {p.summary}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="font-mono text-cyan-400/80 truncate max-w-[190px]">
                  {p.formula}
                </span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center font-medium">
                  Launch <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MINIMAL FOOTER --- */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-semibold">Physics Real-Time Lab Suite</span>
            <span>• G.C.E. Advanced Level</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onEnterLab} className="text-slate-400 hover:text-white transition-colors">
              Simulation Workbench
            </button>
            <button onClick={() => onOpenAITutor()} className="text-slate-400 hover:text-white transition-colors">
              AI Tutor
            </button>
            <a href="#matrix" className="text-slate-400 hover:text-white transition-colors">
              42 Practicals
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
