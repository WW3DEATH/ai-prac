import { PracticalItem } from "../types";

export const PRACTICALS_DATA: PracticalItem[] = [
  // 1. Vernier Callipers
  {
    id: "prac-1",
    number: "01",
    title: "Usage of the Vernier Callipers",
    category: "Mechanics & Matter",
    archetype: "vernier_micrometer",
    formula: "Reading = MSR + (VSR × LC) - Zero Error",
    formulaDescription: "Least Count (LC) = 1 MSD - 1 VSD = 1mm - 0.9mm = 0.1 mm (0.01 cm)",
    keyConstants: [
      { label: "Least Count (LC)", value: "0.1 mm (0.01 cm)" },
      { label: "Main Scale Div", value: "1.0 mm" },
      { label: "Vernier Divisions", value: "10 divs (or 50 divs for 0.02mm)" },
    ],
    controls: [
      { id: "jawPosition", label: "Jaw Aperture (Diameter/Width)", min: 0, max: 80, step: 0.1, defaultValue: 24.6, unit: "mm" },
      { id: "zeroError", label: "Zero Error Calibration", min: -0.5, max: 0.5, step: 0.1, defaultValue: 0.0, unit: "mm" },
      { id: "mode", label: "Measurement Mode (0=External, 1=Internal, 2=Depth)", min: 0, max: 2, step: 1, defaultValue: 0, unit: "" },
    ],
    graphConfig: {
      xAxis: "Object Trial #",
      yAxis: "Corrected Diameter (mm)",
      expectedSlopeMeaning: "Consistency of repeat measurements across orientations",
      resultFormula: "Mean Diameter d = Σ d_i / n",
    },
    precautions: [
      "Always determine and account for zero error with sign before taking readings.",
      "Do not overtighten jaws on soft or hollow objects; avoid parallax error when reading coincidences.",
      "Take measurements at multiple mutually perpendicular diameters and take the average.",
    ],
    summary: "Measurement of internal/external diameter and depth of cylindrical objects using primary and secondary sliding scales.",
    tags: ["Instruments", "Measurement", "Precision", "Mechanics"],
  },

  // 2. Micrometer Screw Gauge
  {
    id: "prac-2",
    number: "02",
    title: "Usage of the Micrometer Screw Gauge",
    category: "Mechanics & Matter",
    archetype: "vernier_micrometer",
    formula: "Reading = PSR + (HSR × LC) - Zero Error",
    formulaDescription: "Pitch = 0.5 mm, Circular scale divisions = 50, LC = 0.5 / 50 = 0.01 mm",
    keyConstants: [
      { label: "Pitch of screw", value: "0.5 mm" },
      { label: "Thimble Divisions", value: "50 divs" },
      { label: "Least Count (LC)", value: "0.01 mm (10 µm)" },
    ],
    controls: [
      { id: "spindleGap", label: "Spindle Gap (Wire Diameter / Sheet Thickness)", min: 0, max: 25, step: 0.01, defaultValue: 3.42, unit: "mm" },
      { id: "zeroError", label: "Zero Error (Positive or Negative)", min: -0.05, max: 0.05, step: 0.01, defaultValue: 0.02, unit: "mm" },
      { id: "ratchetClicks", label: "Ratchet Tightness (0-3 clicks)", min: 0, max: 3, step: 1, defaultValue: 3, unit: "clicks" },
    ],
    graphConfig: {
      xAxis: "Position Along Wire (cm)",
      yAxis: "Diameter d (mm)",
      expectedSlopeMeaning: "Uniformity of cross-sectional wire diameter",
      resultFormula: "Mean Diameter d = Σ d_i / N",
    },
    precautions: [
      "Always turn using the ratchet, never force the thimble directly, to prevent deformation of specimen.",
      "Clean spindle and anvil faces with paper before zero error calibration.",
      "Check for both positive and negative zero errors and subtract algebraically.",
    ],
    summary: "High-precision measurement of thin wire diameters, glass plate thickness, and spheres down to 0.01 mm.",
    tags: ["Instruments", "Metrology", "Screw Gauge", "Mechanics"],
  },

  // 3. Spherometer
  {
    id: "prac-3",
    number: "03",
    title: "Usage of the Spherometer",
    category: "Mechanics & Matter",
    archetype: "vernier_micrometer",
    formula: "R = (a² / 6h) + (h / 2)",
    formulaDescription: "a = mean distance between outer triangular legs, h = sagitta (central screw elevation)",
    keyConstants: [
      { label: "Leg Distance (a)", value: "40.0 mm" },
      { label: "Circular Pitch", value: "1.0 mm (100 divisions)" },
      { label: "Least Count", value: "0.01 mm" },
    ],
    controls: [
      { id: "sagittaH", label: "Elevation / Depression (Sagitta h)", min: 0.1, max: 5.0, step: 0.02, defaultValue: 1.84, unit: "mm" },
      { id: "legDistance", label: "Leg Distance (a)", min: 20, max: 60, step: 1, defaultValue: 42, unit: "mm" },
      { id: "surfaceType", label: "Surface (0=Convex, 1=Concave, 2=Plane Glass)", min: 0, max: 2, step: 1, defaultValue: 0, unit: "" },
    ],
    graphConfig: {
      xAxis: "Sagitta h (mm)",
      yAxis: "Radius of Curvature R (cm)",
      expectedSlopeMeaning: "Geometric curvature profile of spherical lenses and mirrors",
      resultFormula: "R = a²/(6h) + h/2",
    },
    precautions: [
      "Ensure all three fixed legs and the central screw make simultaneous contact (use thin paper slip feeler).",
      "Record zero reading on a flat optical plane glass plate first.",
      "Press the legs on cardboard or paper to measure triangle leg distance 'a' with a vernier calliper.",
    ],
    summary: "Measurement of radius of curvature of spherical mirrors and lenses by determining sagitta h.",
    tags: ["Instruments", "Curvature", "Optics", "Mechanics"],
  },

  // 4. Travelling Microscope
  {
    id: "prac-4",
    number: "04",
    title: "Usage of the Travelling Microscope",
    category: "Mechanics & Matter",
    archetype: "travelling_microscope",
    formula: "d = |R2 - R1| ; LC = Main Div / Vernier Divs",
    formulaDescription: "High-resolution optical crosshair displacement along vertical or horizontal axes without touching the specimen.",
    keyConstants: [
      { label: "Main scale div", value: "0.5 mm" },
      { label: "Vernier divs", value: "50 divs" },
      { label: "Least count", value: "0.01 mm" },
    ],
    controls: [
      { id: "verticalPos", label: "Vertical Microscope Position (y)", min: 0, max: 100, step: 0.02, defaultValue: 48.34, unit: "mm" },
      { id: "focusRack", label: "Fine Focus Knob Adjustment", min: -10, max: 10, step: 0.1, defaultValue: 0, unit: "mm" },
      { id: "crosshairAngle", label: "Crosshair Alignment", min: 0, max: 90, step: 5, defaultValue: 0, unit: "deg" },
    ],
    graphConfig: {
      xAxis: "Capillary / Specimen Point",
      yAxis: "Microscope Reading (mm)",
      expectedSlopeMeaning: "Bore diameter or liquid column elevation difference",
      resultFormula: "Difference Δy = R2 - R1",
    },
    precautions: [
      "Rack the microscope in ONE direction only to eliminate backlash error in the fine screw thread.",
      "Ensure crosshairs are sharply focused on eyepiece before viewing object.",
      "Eliminate parallax between crosswire and the real image formed by microscope objective.",
    ],
    summary: "Precise non-contact measurement of small lengths, capillary bores, and liquid menisci using rack-and-pinion vernier stages.",
    tags: ["Instruments", "Optics", "Precision", "Metrology"],
  },

  // 5. Parallelogram of Forces
  {
    id: "prac-5",
    number: "05",
    title: "Law of Parallelogram of Forces & Mass of a Body",
    category: "Mechanics & Matter",
    archetype: "mechanics_forces",
    formula: "R² = P² + Q² + 2PQ cos(θ) ; W = R",
    formulaDescription: "At static equilibrium, the resultant R of tensions P and Q balances the unknown weight W.",
    keyConstants: [
      { label: "Pulley Friction", value: "Negligible" },
      { label: "Equilibrium condition", value: "ΣF = 0" },
    ],
    controls: [
      { id: "weightP", label: "Weight P on Left Hanger", min: 50, max: 300, step: 10, defaultValue: 120, unit: "g" },
      { id: "weightQ", label: "Weight Q on Right Hanger", min: 50, max: 300, step: 10, defaultValue: 140, unit: "g" },
      { id: "angleTheta", label: "Angle Between Strings (θ)", min: 30, max: 150, step: 1, defaultValue: 78, unit: "°" },
    ],
    graphConfig: {
      xAxis: "Vector Resultant R (N)",
      yAxis: "Balancing Weight W (N)",
      expectedSlopeMeaning: "Slope = 1.00 confirms vector sum matches opposing gravitational force",
      resultFormula: "W = √(P² + Q² + 2PQ cos θ)",
    },
    precautions: [
      "Ensure pulleys are frictionless and rotate smoothly; gently tap board before noting junction knot position.",
      "Use mirror strip behind strings to mark alignment dots without parallax error.",
      "String knot must be positioned centrally and free from wall contact.",
    ],
    summary: "Verification of vector addition of coplanar concurrent forces and determination of an unknown suspended mass.",
    tags: ["Vectors", "Statics", "Equilibrium", "Mechanics"],
  },

  // 6. Principle of Moments
  {
    id: "prac-6",
    number: "06",
    title: "Determination of Mass Using Principle of Moments",
    category: "Mechanics & Matter",
    archetype: "mechanics_forces",
    formula: "M × d1 = m × d2 + m_rule × (d_cg - d_fulcrum)",
    formulaDescription: "Clockwise Moments = Anticlockwise Moments around the knife-edge fulcrum.",
    keyConstants: [
      { label: "Rule length", value: "100.0 cm" },
      { label: "Meter Rule Mass", value: "115.0 g" },
      { label: "Rule C.G.", value: "50.0 cm" },
    ],
    controls: [
      { id: "fulcrumPos", label: "Knife Edge Fulcrum Position", min: 20, max: 80, step: 1, defaultValue: 40, unit: "cm" },
      { id: "knownMass", label: "Known Mass (m)", min: 20, max: 200, step: 5, defaultValue: 80, unit: "g" },
      { id: "knownArm", label: "Known Mass Position", min: 2, max: 38, step: 1, defaultValue: 15, unit: "cm" },
      { id: "unknownMass", label: "Unknown Mass (M)", min: 30, max: 250, step: 5, defaultValue: 110, unit: "g" },
    ],
    graphConfig: {
      xAxis: "Distance of Known Mass (d1 in cm)",
      yAxis: "Distance of Unknown Mass (d2 in cm)",
      expectedSlopeMeaning: "Slope = M / m allows computing unknown mass directly",
      resultFormula: "M = m × (d2 / d1)",
    },
    precautions: [
      "Support the meter rule on a sharp horizontal knife edge placed perpendicular to rule length.",
      "Account for meter rule mass if fulcrum is NOT placed at center of gravity (50 cm mark).",
      "Avoid air drafts by conducting experiment away from open windows or fans.",
    ],
    summary: "Determination of mass of a body and uniform meter rule using rotational torque equilibrium.",
    tags: ["Moments", "Torque", "Equilibrium", "Mechanics"],
  },

  // 7. U Tube Relative Density
  {
    id: "prac-7",
    number: "07",
    title: "Relative Density of a Liquid Using the U Tube",
    category: "Hydrostatics & Fluids",
    archetype: "fluids_capillary",
    formula: "h1 × ρ1 = h2 × ρ2  =>  RD = ρ2 / ρ1 = h1 / h2",
    formulaDescription: "Pressures at common horizontal interface in communicating tubes must balance: P0 + h1 ρ1 g = P0 + h2 ρ2 g.",
    keyConstants: [
      { label: "Water Density ρ1", value: "1000 kg/m³" },
      { label: "Standard Gravity g", value: "9.81 m/s²" },
    ],
    controls: [
      { id: "waterCol", label: "Water Column Height (h1)", min: 5, max: 30, step: 0.5, defaultValue: 16.0, unit: "cm" },
      { id: "oilDensity", label: "Liquid Density (e.g. Kerosene / Oil)", min: 650, max: 950, step: 10, defaultValue: 800, unit: "kg/m³" },
      { id: "meniscusTension", label: "Capillary Meniscus Correction", min: 0, max: 2, step: 0.1, defaultValue: 0.2, unit: "mm" },
    ],
    graphConfig: {
      xAxis: "Test Liquid Height h2 (cm)",
      yAxis: "Water Column Height h1 (cm)",
      expectedSlopeMeaning: "Slope = ρ_liquid / ρ_water = Relative Density",
      resultFormula: "RD = slope = h1 / h2",
    },
    precautions: [
      "Only immiscible liquids can be used directly; pour test liquid slowly down the tube side to prevent mixing.",
      "Measure heights from the clear dividing interface, not from the bottom bend of the U-tube.",
      "Keep the U-tube strictly vertical during readings to avoid parallax and geometric errors.",
    ],
    summary: "Hydrostatic balancing of two immiscible liquid columns in communicating arms to determine relative density.",
    tags: ["Fluids", "Hydrostatics", "Density", "U-Tube"],
  },

  // 8. Hare's Apparatus
  {
    id: "prac-8",
    number: "08",
    title: "Relative Density of Liquid Using Hare's Apparatus",
    category: "Hydrostatics & Fluids",
    archetype: "fluids_capillary",
    formula: "h1 × ρ1 = h2 × ρ2  =>  h1 = (ρ2 / ρ1) × h2",
    formulaDescription: "P_tube = P0 - h1 ρ1 g = P0 - h2 ρ2 g. Air suction lowers pressure equally above both arms.",
    keyConstants: [
      { label: "Atmospheric Pressure P0", value: "1.013 × 10⁵ Pa" },
      { label: "Water Density", value: "1.000 g/cm³" },
    ],
    controls: [
      { id: "suctionP", label: "Internal Suction Level (Negative gauge pressure)", min: 500, max: 3500, step: 100, defaultValue: 1800, unit: "Pa" },
      { id: "liquidDensity", label: "Test Liquid Density (Turpentine/Alcohol)", min: 700, max: 1200, step: 10, defaultValue: 850, unit: "kg/m³" },
      { id: "tubeBore", label: "Capillary Bore Symmetry", min: 4, max: 10, step: 0.5, defaultValue: 6, unit: "mm" },
    ],
    graphConfig: {
      xAxis: "Water Column Height h_w (cm)",
      yAxis: "Liquid Column Height h_l (cm)",
      expectedSlopeMeaning: "Slope = ρ_w / ρ_l => Relative Density = 1 / slope",
      resultFormula: "RD = h_water / h_liquid",
    },
    precautions: [
      "Suitable for miscible liquids since liquids are contained in separate beakers.",
      "Tubes must dip well below liquid surfaces without touching the bottom of beakers.",
      "Check that clip at rubber tubing is airtight so column heights remain completely stationary during measurement.",
    ],
    summary: "Measurement of relative density of miscible or immiscible liquids by reduced pressure suction in inverted twin tubes.",
    tags: ["Fluids", "Hare's", "Density", "Suction"],
  },

  // 9. Weighted Test Tube Hydrometer
  {
    id: "prac-9",
    number: "09",
    title: "Determination of Liquid Density Using Weighted Test Tube",
    category: "Hydrostatics & Fluids",
    archetype: "fluids_capillary",
    formula: "M = A × h × ρ  =>  h = (M / A) × (1 / ρ)",
    formulaDescription: "Archimedes' principle: Weight of floating test tube equals weight of displaced liquid.",
    keyConstants: [
      { label: "Tube Cross-section A", value: "2.54 cm²" },
      { label: "Total Tube Mass M", value: "42.0 g" },
    ],
    controls: [
      { id: "liquidDensity", label: "Liquid Density (ρ)", min: 700, max: 1300, step: 20, defaultValue: 1000, unit: "kg/m³" },
      { id: "tubeMass", label: "Total Mass of Tube + Lead Shots (M)", min: 25, max: 65, step: 2, defaultValue: 45, unit: "g" },
      { id: "meniscusCorrection", label: "Meniscus Elevation", min: 0, max: 3, step: 0.2, defaultValue: 0.8, unit: "mm" },
    ],
    graphConfig: {
      xAxis: "Inverse Density (1 / ρ in m³/kg)",
      yAxis: "Submerged Depth h (cm)",
      expectedSlopeMeaning: "Straight line through origin with slope = M / A",
      resultFormula: "ρ = M / (A × h)",
    },
    precautions: [
      "Add lead shots into the bottom until test tube floats strictly upright without tilting or touching jar walls.",
      "Fix narrow millimeter graph paper strip inside tube to read submerged depth accurately.",
      "Take reading from bottom of liquid meniscus.",
    ],
    summary: "Constant-weight hydrometer principle where submerged depth is inversely proportional to liquid density.",
    tags: ["Archimedes", "Fluids", "Buoyancy", "Hydrometer"],
  },

  // 10. Simple Pendulum
  {
    id: "prac-10",
    number: "10",
    title: "Determination of 'g' Using Simple Pendulum",
    category: "Oscillations & Waves",
    archetype: "pendulum_spring",
    formula: "T = 2π √(l / g)  =>  T² = (4π² / g) × l",
    formulaDescription: "l = length of string + hook + radius of spherical bob (effective pendulum length).",
    keyConstants: [
      { label: "Theoretical g", value: "9.81 m/s²" },
      { label: "Bob Diameter", value: "2.0 cm" },
      { label: "Air Drag", value: "Small damping" },
    ],
    controls: [
      { id: "pendulumLength", label: "Suspension Length (l)", min: 30, max: 120, step: 5, defaultValue: 75, unit: "cm" },
      { id: "initialAngle", label: "Release Amplitude (θ < 10°)", min: 2, max: 15, step: 1, defaultValue: 5, unit: "°" },
      { id: "gravityVal", label: "Local Gravitational Field (g)", min: 9.6, max: 10.0, step: 0.05, defaultValue: 9.81, unit: "m/s²" },
    ],
    graphConfig: {
      xAxis: "Effective Length l (m)",
      yAxis: "Square of Period T² (s²)",
      expectedSlopeMeaning: "Slope m = 4π² / g  =>  g = 4π² / slope",
      resultFormula: "g = 4π² / slope",
    },
    precautions: [
      "Keep oscillation amplitude small (< 10°) so sin θ ≈ θ for true simple harmonic motion.",
      "Time at least 20 to 50 complete oscillations to minimize reaction time error in stopwatch.",
      "Count oscillations as bob crosses equilibrium fiducial mark in the same direction.",
    ],
    summary: "Determination of acceleration due to gravity g by measuring periodic time against varying effective pendulum length.",
    tags: ["SHM", "Pendulum", "Gravity", "Oscillations"],
  },

  // 11. Helical Spring Mass vs Period
  {
    id: "prac-11",
    number: "11",
    title: "Mass of Body Suspended from Helix Spring vs Period",
    category: "Oscillations & Waves",
    archetype: "pendulum_spring",
    formula: "T = 2π √((M + m_eff) / k)  =>  T² = (4π² / k) M + (4π² m_eff / k)",
    formulaDescription: "k = spring force constant, m_eff = effective mass of spring (approx m_spring / 3).",
    keyConstants: [
      { label: "Spring Constant k", value: "25.0 N/m" },
      { label: "Effective Spring Mass", value: "12.5 g" },
    ],
    controls: [
      { id: "suspendedMass", label: "Suspended Load Mass (M)", min: 50, max: 400, step: 25, defaultValue: 150, unit: "g" },
      { id: "springStiffness", label: "Spring Constant (k)", min: 10, max: 60, step: 5, defaultValue: 25, unit: "N/m" },
      { id: "dampingFactor", label: "Air Damping Rate", min: 0.01, max: 0.2, step: 0.01, defaultValue: 0.04, unit: "s⁻¹" },
    ],
    graphConfig: {
      xAxis: "Suspended Mass M (kg)",
      yAxis: "Period Squared T² (s²)",
      expectedSlopeMeaning: "Slope = 4π² / k, Negative x-intercept gives effective mass of spring m_eff",
      resultFormula: "k = 4π² / slope ; m_eff = - intercept_x",
    },
    precautions: [
      "Ensure vertical oscillations only; avoid lateral swinging or helical torsion.",
      "Stay strictly within the elastic limit of the spring (Hooke's law).",
      "Time 20 complete oscillations through the central equilibrium reference pointer.",
    ],
    summary: "Verification of harmonic period relation T² ∝ (M + m_eff) and determination of spring stiffness constant k.",
    tags: ["Hooke's Law", "Spring", "Oscillations", "SHM"],
  },

  // 12. Sonometer Tuning Fork Frequency
  {
    id: "prac-12",
    number: "12",
    title: "Determination of Frequency of Tuning Fork Using Sonometer",
    category: "Oscillations & Waves",
    archetype: "sonometer_sound",
    formula: "f = (1 / 2l) √(T / µ)  =>  l = (1 / 2f) √(T / µ)",
    formulaDescription: "Resonance occurs when vibrating string fundamental mode equals tuning fork frequency f; paper rider throws off.",
    keyConstants: [
      { label: "Linear Mass Density µ", value: "0.0018 kg/m" },
      { label: "Tuning Fork Frequency", value: "256 Hz" },
    ],
    controls: [
      { id: "bridgeLength", label: "Vibrating Length (l between bridges)", min: 10, max: 70, step: 0.5, defaultValue: 28.5, unit: "cm" },
      { id: "hangerTension", label: "Tension Mass (M in hanger)", min: 1, max: 6, step: 0.5, defaultValue: 3.0, unit: "kg" },
      { id: "tuningForkFreq", label: "Tuning Fork Frequency (f)", min: 128, max: 512, step: 32, defaultValue: 256, unit: "Hz" },
    ],
    graphConfig: {
      xAxis: "Square Root of Tension √T (N^(1/2))",
      yAxis: "Resonating Length l (m)",
      expectedSlopeMeaning: "Slope = 1 / (2f √µ)  =>  f = 1 / (2 × slope × √µ)",
      resultFormula: "f = 1 / (2 × slope × √µ)",
    },
    precautions: [
      "Place paper rider strictly at midpoint of vibrating segment (antinode of fundamental mode).",
      "Press the stem of vibrating tuning fork firmly against the hollow soundbox near one bridge.",
      "Sharp knife-edge wooden bridges must be parallel and firmly pressed against wire.",
    ],
    summary: "Determination of unknown tuning fork frequency via stationary transverse acoustic waves on a stretched wire.",
    tags: ["Sound", "Waves", "Sonometer", "Resonance"],
  },

  // 13. Sonometer Frequency vs Vibrating Length
  {
    id: "prac-13",
    number: "13",
    title: "Verification of Frequency vs Vibrating Length (Sonometer)",
    category: "Oscillations & Waves",
    archetype: "sonometer_sound",
    formula: "f × l = constant  =>  f ∝ 1 / l  (at constant tension T)",
    formulaDescription: "Fundamental resonance law of transverse string vibrations.",
    keyConstants: [
      { label: "Fixed Tension T", value: "29.4 N (3 kg wt)" },
      { label: "Linear density µ", value: "0.0018 kg/m" },
    ],
    controls: [
      { id: "forkIndex", label: "Tuning Fork Selection (256, 288, 320, 341, 384, 426, 480, 512)", min: 256, max: 512, step: 32, defaultValue: 256, unit: "Hz" },
      { id: "bridgeLength", label: "Adjustable Resonating Length (l)", min: 12, max: 50, step: 0.2, defaultValue: 28.5, unit: "cm" },
      { id: "riderExcitation", label: "Paper Rider Oscillation State", min: 0, max: 100, step: 5, defaultValue: 95, unit: "%" },
    ],
    graphConfig: {
      xAxis: "Inverse Resonating Length (1 / l in m⁻¹)",
      yAxis: "Tuning Fork Frequency f (Hz)",
      expectedSlopeMeaning: "Straight line through origin confirms f ∝ 1/l; slope = (1/2) √(T/µ)",
      resultFormula: "f × l = constant",
    },
    precautions: [
      "Ensure tension remains constant throughout all tuning fork trials.",
      "Adjust bridge distance slowly to detect true sharp resonance where paper rider flies off.",
      "Strike tuning fork gently with rubber mallet, never against metallic surfaces.",
    ],
    summary: "Verification that frequency of a stretched wire is inversely proportional to its resonant vibrating length.",
    tags: ["Acoustics", "Sonometer", "Harmonics", "Standing Waves"],
  },

  // 14. Closed Resonance Tube & Single Tuning Fork
  {
    id: "prac-14",
    number: "14",
    title: "Velocity of Sound & End Correction (Closed Tube, 1 Fork)",
    category: "Oscillations & Waves",
    archetype: "sonometer_sound",
    formula: "v = 2f (l2 - l1)  ;  e = (l2 - 3l1) / 2 = 0.3 d",
    formulaDescription: "First resonance l1 + e = λ/4, second resonance l2 + e = 3λ/4. Difference l2 - l1 = λ/2 eliminates end correction e.",
    keyConstants: [
      { label: "Air Temperature", value: "25 °C" },
      { label: "Speed of sound (v)", value: "344 m/s" },
      { label: "Internal diameter d", value: "3.2 cm" },
    ],
    controls: [
      { id: "waterLevel", label: "Water Reservoir Height (controls air column length)", min: 10, max: 110, step: 0.5, defaultValue: 33.6, unit: "cm" },
      { id: "tuningForkFreq", label: "Tuning Fork Frequency (f)", min: 256, max: 512, step: 64, defaultValue: 512, unit: "Hz" },
      { id: "ambientTemp", label: "Room Temperature", min: 15, max: 35, step: 1, defaultValue: 25, unit: "°C" },
    ],
    graphConfig: {
      xAxis: "Resonance Mode (1st, 2nd)",
      yAxis: "Air Column Length (cm)",
      expectedSlopeMeaning: "Spacing between nodes gives λ/2 => v = 2f(l2 - l1)",
      resultFormula: "v = 2f(l2 - l1) ; e = (l2 - 3l1)/2",
    },
    precautions: [
      "Hold vibrating tuning fork prongs horizontally just above tube mouth without touching rim.",
      "Lower water level from highest position to identify 1st resonance before 2nd resonance.",
      "Record temperature to correct speed of sound: v_T = v_0 √(1 + T/273).",
    ],
    summary: "Determination of velocity of sound in air and antinode end correction e using a single tuning fork in a closed resonance tube.",
    tags: ["Resonance", "Acoustics", "Speed of Sound", "Waves"],
  },

  // 15. Resonance Tube with Set of Tuning Forks
  {
    id: "prac-15",
    number: "15",
    title: "Velocity of Sound in Air Using Set of Tuning Forks",
    category: "Oscillations & Waves",
    archetype: "sonometer_sound",
    formula: "l = (v / 4) × (1 / f) - e",
    formulaDescription: "First resonance length l plotted against inverse frequency (1/f) yields slope = v/4 and y-intercept = -e.",
    keyConstants: [
      { label: "Speed of Sound v", value: "344 m/s" },
      { label: "End Correction e", value: "0.96 cm" },
    ],
    controls: [
      { id: "forkFrequency", label: "Tuning Fork Frequency (f in Hz)", min: 256, max: 512, step: 32, defaultValue: 341, unit: "Hz" },
      { id: "airColumnLength", label: "Resonating Air Column Length (l)", min: 12, max: 38, step: 0.2, defaultValue: 24.2, unit: "cm" },
      { id: "soundIntensity", label: "Resonance Sound Loudness", min: 0, max: 100, step: 5, defaultValue: 90, unit: "%" },
    ],
    graphConfig: {
      xAxis: "Inverse Frequency (1 / f in ms)",
      yAxis: "First Resonating Length l (cm)",
      expectedSlopeMeaning: "Slope m = v / 4 => v = 4 × slope ; y-intercept = -e",
      resultFormula: "v = 4 × slope ; e = - y_intercept",
    },
    precautions: [
      "Keep fork prongs strictly parallel and 1 cm above open mouth.",
      "Adjust water level slowly to pinpoint peak resonance loudness accurately.",
      "Verify internal tube diameter d with vernier caliper to cross-check e ≈ 0.3 d.",
    ],
    summary: "Linear graphical determination of velocity of sound in air and tube end correction using multiple frequency standards.",
    tags: ["Sound", "Resonance Tube", "Wavelength", "Acoustics"],
  },

  // 16. Refractive Index of Glass Block by Travelling Microscope
  {
    id: "prac-16",
    number: "16",
    title: "Refractive Index of Glass Using Travelling Microscope",
    category: "Geometrical Optics",
    archetype: "travelling_microscope",
    formula: "µ = Real Depth / Apparent Depth = (R3 - R1) / (R3 - R2)",
    formulaDescription: "R1 = reading on ink dot on paper, R2 = reading on dot through glass slab, R3 = reading on lycopodium powder on top face.",
    keyConstants: [
      { label: "Standard Crown Glass µ", value: "1.52" },
      { label: "Microscope LC", value: "0.01 mm" },
    ],
    controls: [
      { id: "glassThickness", label: "Slab Thickness (Real Depth)", min: 15, max: 50, step: 1, defaultValue: 30.0, unit: "mm" },
      { id: "glassIndex", label: "True Refractive Index of Glass (µ)", min: 1.45, max: 1.65, step: 0.01, defaultValue: 1.52, unit: "" },
      { id: "microscopeZ", label: "Microscope Vertical Focus Stage", min: 0, max: 60, step: 0.05, defaultValue: 10.2, unit: "mm" },
    ],
    graphConfig: {
      xAxis: "Apparent Depth (R3 - R2 in mm)",
      yAxis: "Real Depth (R3 - R1 in mm)",
      expectedSlopeMeaning: "Slope = Refractive Index µ of glass",
      resultFormula: "µ = (R3 - R1) / (R3 - R2)",
    },
    precautions: [
      "Sprinkle a very thin dusting of lycopodium powder on the top surface of the glass slab to focus top face.",
      "Focus microscope only in upward direction to prevent rack backlash error.",
      "Do not disturb or slide paper or glass slab between readings R1, R2, and R3.",
    ],
    summary: "Measurement of real and apparent depth of a glass block using travelling microscope to calculate refractive index µ.",
    tags: ["Optics", "Refraction", "Microscope", "Apparent Depth"],
  },

  // 17. Angle of Minimum Deviation of Prism
  {
    id: "prac-17",
    number: "17",
    title: "Angle of Minimum Deviation of Prism by Ray Tracing",
    category: "Geometrical Optics",
    archetype: "prism_spectrometer",
    formula: "d = (i + e) - A  ;  d_min = Dm when i = e",
    formulaDescription: "At minimum deviation, the ray passes symmetrically through the prism parallel to its base.",
    keyConstants: [
      { label: "Prism Angle A", value: "60.0°" },
      { label: "Refractive Index µ", value: "1.52" },
      { label: "Theoretical Dm", value: "38.8°" },
    ],
    controls: [
      { id: "incidentAngle", label: "Angle of Incidence (i)", min: 30, max: 75, step: 1, defaultValue: 48, unit: "°" },
      { id: "prismAngle", label: "Prism Refracting Angle (A)", min: 45, max: 65, step: 1, defaultValue: 60, unit: "°" },
      { id: "glassMu", label: "Prism Refractive Index (µ)", min: 1.45, max: 1.70, step: 0.01, defaultValue: 1.52, unit: "" },
    ],
    graphConfig: {
      xAxis: "Angle of Incidence i (°)",
      yAxis: "Angle of Deviation d (°)",
      expectedSlopeMeaning: "Parabolic curve with distinct minimum at (i_min, Dm)",
      resultFormula: "Dm = Minimum point on i - d curve",
    },
    precautions: [
      "Pins must be placed at least 5 to 6 cm apart along each ray to define directions accurately.",
      "Pins must stand strictly vertical; view their pin feet, not the tilted heads, when aligning.",
      "Keep prism strictly within its penciled outline on drawing board.",
    ],
    summary: "Tracing incident and emergent rays using optical pins to plot the i - d curve and locate minimum deviation Dm.",
    tags: ["Optics", "Prism", "Deviation", "Ray Tracing"],
  },

  // 18. Refractive Index of Prism by Critical Angle Method
  {
    id: "prac-18",
    number: "18",
    title: "Refractive Index of Prism by Critical Angle Method",
    category: "Geometrical Optics",
    archetype: "prism_spectrometer",
    formula: "sin(C) = 1 / µ  =>  µ = 1 / sin(C)",
    formulaDescription: "Total internal reflection boundary at grazing emergence inside prism gives critical angle C.",
    keyConstants: [
      { label: "Critical Angle C", value: "41.1° (for µ=1.52)" },
      { label: "Prism Angle", value: "60°" },
    ],
    controls: [
      { id: "criticalAngleC", label: "Internal Incident Angle (θ)", min: 35, max: 45, step: 0.1, defaultValue: 41.1, unit: "°" },
      { id: "prismMu", label: "Prism Material µ", min: 1.40, max: 1.75, step: 0.01, defaultValue: 1.52, unit: "" },
      { id: "turntableAngle", label: "Turntable Rotation", min: 0, max: 90, step: 1, defaultValue: 48, unit: "°" },
    ],
    graphConfig: {
      xAxis: "Refractive Index µ",
      yAxis: "Critical Angle C (°)",
      expectedSlopeMeaning: "Non-linear inverse sine relationship C = arcsin(1/µ)",
      resultFormula: "µ = 1 / sin(C)",
    },
    precautions: [
      "Observe the sudden transition between total internal reflection brightness and critical refraction field.",
      "Clean prism polished faces with lens tissue; do not touch with fingers.",
      "Use monochromatic light (sodium D line yellow) for sharp critical boundary.",
    ],
    summary: "Determination of refractive index of prism glass from the boundary of total internal reflection and grazing emergence.",
    tags: ["TIR", "Critical Angle", "Optics", "Prism"],
  },

  // 19. Spectrometer Adjustment & Refracting Angle of Prism
  {
    id: "prac-19",
    number: "19",
    title: "Adjustment of Spectrometer & Refracting Angle of Prism (A)",
    category: "Geometrical Optics",
    archetype: "prism_spectrometer",
    formula: "2A = |θ2 - θ1|  =>  A = |θ2 - θ1| / 2",
    formulaDescription: "Parallel beam from collimator splits on prism apex; reflected beams from both faces subtend angle 2A on telescope.",
    keyConstants: [
      { label: "Prism Apex Angle A", value: "60° 00'" },
      { label: "Spectrometer LC", value: "1 minute of arc (1')" },
    ],
    controls: [
      { id: "telescopeRot", label: "Telescope Vernier Angle (θ)", min: 0, max: 360, step: 0.1, defaultValue: 120.0, unit: "°" },
      { id: "slitWidth", label: "Collimator Slit Width", min: 0.1, max: 2.0, step: 0.1, defaultValue: 0.3, unit: "mm" },
      { id: "collimatorFocus", label: "Schuster's Focus Alignment", min: 0, max: 100, step: 5, defaultValue: 100, unit: "%" },
    ],
    graphConfig: {
      xAxis: "Reflected Image Face (Left, Right)",
      yAxis: "Telescope Scale Reading θ (°)",
      expectedSlopeMeaning: "Angular difference gives twice refracting angle 2A",
      resultFormula: "A = (θ_right - θ_left) / 2",
    },
    precautions: [
      "Carry out optical leveling of spectrometer prism table with spirit level before mounting prism.",
      "Focus telescope for infinity on distant object, then focus collimator using telescope.",
      "Read both Vernier 1 and Vernier 2 to eliminate eccentricity error of circular scale.",
    ],
    summary: "Optical adjustment of spectrometer using Schuster's method and determination of apex angle A by reflected images.",
    tags: ["Spectrometer", "Optics", "Prism", "Schuster's"],
  },

  // 20. Angle of Minimum Deviation & µ Using Spectrometer
  {
    id: "prac-20",
    number: "20",
    title: "Angle of Minimum Deviation & µ Using Spectrometer",
    category: "Geometrical Optics",
    archetype: "prism_spectrometer",
    formula: "µ = sin((A + Dm) / 2) / sin(A / 2)",
    formulaDescription: "Standard Fraunhofer prism formula connecting apex angle A and minimum deviation Dm to refractive index µ.",
    keyConstants: [
      { label: "Prism Angle A", value: "60.0°" },
      { label: "Theoretical Dm", value: "38.8°" },
      { label: "Flint/Crown µ", value: "1.520" },
    ],
    controls: [
      { id: "minDevAngle", label: "Minimum Deviation Angle (Dm)", min: 30, max: 55, step: 0.1, defaultValue: 38.8, unit: "°" },
      { id: "prismAngleA", label: "Prism Angle (A)", min: 55, max: 65, step: 0.1, defaultValue: 60.0, unit: "°" },
      { id: "spectralColor", label: "Wavelength (0=Red, 1=Yellow D, 2=Violet)", min: 0, max: 2, step: 1, defaultValue: 1, unit: "" },
    ],
    graphConfig: {
      xAxis: "Wavelength λ (nm)",
      yAxis: "Refractive Index µ",
      expectedSlopeMeaning: "Cauchy's dispersion relation µ(λ) = A + B/λ²",
      resultFormula: "µ = sin((A + Dm)/2) / sin(A/2)",
    },
    precautions: [
      "Rotate prism table until spectral line turns back (stationary turnaround point defines Dm precisely).",
      "Lock telescope tangent screw for fine crosswire coincidence on the turn-around crest.",
      "Read both circular verniers V1 and V2 to remove scale center offset errors.",
    ],
    summary: "High-precision spectrometer measurement of minimum deviation Dm to calculate glass refractive index µ.",
    tags: ["Spectrometer", "Dispersion", "Optics", "Refraction"],
  },

  // 21.1 Convex Lens Focal Length by No-Parallax
  {
    id: "prac-21-1",
    number: "21.1",
    title: "Focal Length of Convex Lens by No-Parallax Method",
    category: "Geometrical Optics",
    archetype: "optics_bench",
    formula: "(1 / v) + (1 / u) = 1 / f  =>  v = (f × u) / (u - f)",
    formulaDescription: "Real inverted image formed by convex lens coincides with image search pin without relative parallax shift.",
    keyConstants: [
      { label: "Focal Length f", value: "15.0 cm" },
      { label: "Lens Type", value: "Biconvex" },
    ],
    controls: [
      { id: "objectDistanceU", label: "Object Distance (u)", min: 18, max: 60, step: 1, defaultValue: 25, unit: "cm" },
      { id: "lensFocalLength", label: "Lens Focal Length (f)", min: 10, max: 30, step: 1, defaultValue: 15, unit: "cm" },
      { id: "parallaxOffset", label: "Observer Eye Lateral Displacement", min: -20, max: 20, step: 1, defaultValue: 0, unit: "mm" },
    ],
    graphConfig: {
      xAxis: "Inverse Object Distance (1 / u in cm⁻¹)",
      yAxis: "Inverse Image Distance (1 / v in cm⁻¹)",
      expectedSlopeMeaning: "Slope = -1.0 ; Both intercepts equal 1/f",
      resultFormula: "1/f = intercept_y = intercept_x",
    },
    precautions: [
      "Eliminate parallax between image tip and search pin tip by moving eye from side to side.",
      "Tips of object pin, image pin, and optical center of lens must lie on same horizontal line.",
      "Apply sign convention consistently (u negative, v positive for real images in Cartesian convention).",
    ],
    summary: "Determination of convex lens focal length using optical bench pins with parallax-free alignment.",
    tags: ["Lenses", "Optics", "Focal Length", "No-Parallax"],
  },

  // 21.2 Concave Lens Focal Length by No-Parallax (Combination)
  {
    id: "prac-21-2",
    number: "21.2",
    title: "Focal Length of Concave Lens by No-Parallax Method",
    category: "Geometrical Optics",
    archetype: "optics_bench",
    formula: "(1 / F) = (1 / f_convex) + (1 / f_concave)  =>  f_concave = (F × f_cv) / (f_cv - F)",
    formulaDescription: "Since concave lens forms virtual images, an auxiliary powerful convex lens creates a real image combination.",
    keyConstants: [
      { label: "Convex Lens f1", value: "+15.0 cm" },
      { label: "Concave Lens f2", value: "-25.0 cm" },
      { label: "Combination F", value: "+37.5 cm" },
    ],
    controls: [
      { id: "convexF1", label: "Auxiliary Convex Lens Focal Length (f1)", min: 10, max: 25, step: 1, defaultValue: 15, unit: "cm" },
      { id: "concaveF2", label: "Concave Lens Focal Length (|f2|)", min: 15, max: 40, step: 1, defaultValue: 25, unit: "cm" },
      { id: "combDistanceU", label: "Object Pin Distance (u)", min: 40, max: 90, step: 2, defaultValue: 50, unit: "cm" },
    ],
    graphConfig: {
      xAxis: "Distance (cm)",
      yAxis: "Focal Power (Diopters)",
      expectedSlopeMeaning: "Power combination P_comb = P1 + P2",
      resultFormula: "1/f_concave = 1/F_combination - 1/f_convex",
    },
    precautions: [
      "Focal length of auxiliary convex lens must be shorter than that of concave lens so combination is converging.",
      "Keep lenses in close contact with their optical axes strictly aligned.",
      "Confirm image pin tip and combined inverted image remain locked together when moving eye side to side.",
    ],
    summary: "Determination of focal length of a diverging concave lens using an auxiliary convex lens combination.",
    tags: ["Optics", "Concave Lens", "No-Parallax", "Focal Length"],
  },

  // 22. Atmospheric Pressure Using Quill Tube
  {
    id: "prac-22",
    number: "22",
    title: "Atmospheric Pressure Using Quill Tube",
    category: "Hydrostatics & Fluids",
    archetype: "fluids_capillary",
    formula: "P0 = (2 × h × l1 × l2) / (l_horiz × (l1 - l2))  (or vertical: (P0 + h)l1 = (P0 - h)l2)",
    formulaDescription: "Trapped dry air column length l changes with tube orientation due to mercury pellet head h (Boyle's Law P × V = const).",
    keyConstants: [
      { label: "Mercury Density", value: "13,600 kg/m³" },
      { label: "Pellet Length h", value: "15.0 cm Hg" },
      { label: "Standard Atm P0", value: "76.0 cm Hg" },
    ],
    controls: [
      { id: "pelletLengthH", label: "Mercury Index Thread Length (h)", min: 5, max: 25, step: 0.5, defaultValue: 15.0, unit: "cm" },
      { id: "tiltAngle", label: "Tube Tilt Angle (0°=Horiz, +90°=Open Up, -90°=Open Down)", min: -90, max: 90, step: 15, defaultValue: 0, unit: "°" },
      { id: "actualAtmP0", label: "Atmospheric Pressure P0", min: 70, max: 80, step: 0.5, defaultValue: 76.0, unit: "cm Hg" },
    ],
    graphConfig: {
      xAxis: "sin(θ) (Effective Pellet Head Component)",
      yAxis: "Inverse Air Length (1 / l in cm⁻¹)",
      expectedSlopeMeaning: "Straight line confirms Boyle's law; intercept gives P0",
      resultFormula: "P0 = h × (l1 + l2) / (l1 - l2)",
    },
    precautions: [
      "Ensure the trapped air is dry (moisture causes vapor pressure deviation from ideal gas law).",
      "Avoid warming the air column with hands while rotating tube; handle only by supporting frame.",
      "Move tube gently so mercury index thread does not break or separate.",
    ],
    summary: "Measurement of atmospheric pressure using Boyle's law applied to an air column trapped by a mercury pellet.",
    tags: ["Boyle's Law", "Quill Tube", "Atmosphere", "Fluids"],
  },

  // 23. Charles's Law (Volume vs Temperature)
  {
    id: "prac-23",
    number: "23",
    title: "Verification of Relationship: Volume vs Temperature at Constant Pressure",
    category: "Thermal Physics",
    archetype: "heat_thermo",
    formula: "V ∝ T  =>  l_t = l_0 (1 + γ_p × t)  =>  Absolute Zero = -1 / γ_p",
    formulaDescription: "Capillary tube sealed at bottom with mercury pellet index open to atmospheric pressure heated in stirred water bath.",
    keyConstants: [
      { label: "Theoretical Volume Exp Coeff γ_p", value: "1 / 273.15 ≈ 0.00366 K⁻¹" },
      { label: "Absolute Zero", value: "-273.15 °C" },
    ],
    controls: [
      { id: "waterTemp", label: "Water Bath Temperature (t)", min: 0, max: 100, step: 2, defaultValue: 25, unit: "°C" },
      { id: "initialAirLength", label: "Air Column Length at 0°C (l0)", min: 10, max: 25, step: 0.5, defaultValue: 15.0, unit: "cm" },
      { id: "stirrerRate", label: "Water Bath Stirrer Speed", min: 0, max: 100, step: 10, defaultValue: 60, unit: "%" },
    ],
    graphConfig: {
      xAxis: "Temperature t (°C)",
      yAxis: "Length of Air Column l (cm)",
      expectedSlopeMeaning: "Straight line whose x-intercept extrapolates to Absolute Zero (-273 °C)",
      resultFormula: "Absolute Zero T0 = - intercept_y / slope",
    },
    precautions: [
      "Stir water bath continuously to ensure uniform temperature throughout the water column.",
      "Allow thermometer and capillary tube sufficient time to attain thermal equilibrium before reading.",
      "Keep capillary tube strictly vertical and completely immersed in the water bath.",
    ],
    summary: "Verification of Charles's Law and determination of the volume expansion coefficient and absolute zero temperature.",
    tags: ["Charles's Law", "Thermodynamics", "Gas Laws", "Absolute Zero"],
  },

  // 24. Pressure Law (Pressure vs Temperature at Constant Volume)
  {
    id: "prac-24",
    number: "24",
    title: "Verification of Pressure vs Absolute Temperature at Constant Volume",
    category: "Thermal Physics",
    archetype: "heat_thermo",
    formula: "P ∝ T  =>  P_t = P_0 (1 + β × t)  =>  Absolute Zero = -1 / β",
    formulaDescription: "Jolly's bulb constant-volume air thermometer: Mercury level in closed manometer arm held at fixed fiducial mark.",
    keyConstants: [
      { label: "Pressure Coeff β", value: "1 / 273.15 K⁻¹" },
      { label: "Fiducial Mark Level", value: "Constant V" },
    ],
    controls: [
      { id: "bathTemperature", label: "Water Bath Temperature (t)", min: 0, max: 100, step: 5, defaultValue: 30, unit: "°C" },
      { id: "initialPressure", label: "Initial Pressure P0 at 0°C", min: 70, max: 80, step: 0.5, defaultValue: 76.0, unit: "cm Hg" },
      { id: "manometerAdjustment", label: "Open Arm Height Adjustment (to restore fiducial mark)", min: -20, max: 40, step: 0.5, defaultValue: 8.3, unit: "cm" },
    ],
    graphConfig: {
      xAxis: "Temperature t (°C)",
      yAxis: "Total Pressure P (cm Hg)",
      expectedSlopeMeaning: "Linear relationship with slope = P0 × β; extrapolation to P = 0 gives -273.15 °C",
      resultFormula: "β = slope / P0 ; T_zero = - P0 / slope",
    },
    precautions: [
      "Always adjust movable manometer reservoir arm so mercury in fixed arm exactly touches fiducial pointer before recording pressure.",
      "Ensure bulb air is thoroughly dried with calcium chloride tube during filling.",
      "Stir heating bath vigorously and remove flame briefly before taking readings.",
    ],
    summary: "Verification of Gay-Lussac's Pressure Law using Jolly's constant-volume gas thermometer.",
    tags: ["Pressure Law", "Gas Laws", "Thermodynamics", "Jolly's Bulb"],
  },

  // 25. Specific Heat Capacity of Solid by Method of Mixtures
  {
    id: "prac-25",
    number: "25",
    title: "Specific Heat Capacity of Solid by Method of Mixtures",
    category: "Thermal Physics",
    archetype: "heat_thermo",
    formula: "m_s × c_s × (θ_solid - θ_mix) = (m_cal × c_cal + m_w × c_w) × (θ_mix - θ_initial)",
    formulaDescription: "Heat lost by hot solid sample = Heat gained by cold water + calorimeter + stirrer.",
    keyConstants: [
      { label: "Specific Heat of Water c_w", value: "4186 J/(kg·K)" },
      { label: "Specific Heat of Copper c_cal", value: "385 J/(kg·K)" },
      { label: "Sample Material", value: "Lead / Brass / Aluminum" },
    ],
    controls: [
      { id: "solidMass", label: "Mass of Solid Sample (m_s)", min: 40, max: 200, step: 5, defaultValue: 100, unit: "g" },
      { id: "initialBoilerTemp", label: "Boiler Temperature of Solid (θ_s)", min: 85, max: 100, step: 0.5, defaultValue: 98.0, unit: "°C" },
      { id: "waterMass", label: "Mass of Water in Calorimeter (m_w)", min: 50, max: 150, step: 5, defaultValue: 90, unit: "g" },
      { id: "initialWaterTemp", label: "Initial Water Temperature (θ_i)", min: 18, max: 30, step: 0.5, defaultValue: 24.0, unit: "°C" },
    ],
    graphConfig: {
      xAxis: "Time After Mixing (s)",
      yAxis: "Calorimeter Temperature (°C)",
      expectedSlopeMeaning: "Cooling curve extrapolation corrects for radiation loss",
      resultFormula: "c_s = [(m_w c_w + m_cal c_cal)(θ_mix - θ_i)] / [m_s(θ_s - θ_mix)]",
    },
    precautions: [
      "Transfer hot solid quickly into calorimeter without splashing water.",
      "Solid must remain in steam boiler until its temperature is completely steady at 100°C.",
      "Keep calorimeter inside wooden outer vessel with insulating felt to minimize heat exchange.",
    ],
    summary: "Measurement of specific heat capacity of metal samples using copper calorimeter and method of mixtures.",
    tags: ["Heat Capacity", "Calorimetry", "Thermodynamics", "Mixtures"],
  },

  // 26. Specific Heat Capacity of Liquid by Method of Cooling
  {
    id: "prac-26",
    number: "26",
    title: "Specific Heat Capacity of Liquid by Method of Cooling",
    category: "Thermal Physics",
    archetype: "heat_thermo",
    formula: "(m_l c_l + W) / t_l = (m_w c_w + W) / t_w",
    formulaDescription: "Newton's Law of Cooling: Rate of heat loss dQ/dt depends only on excess temperature and identical radiating surface.",
    keyConstants: [
      { label: "Water c_w", value: "4186 J/(kg·K)" },
      { label: "Calorimeter Water Equivalent W", value: "m_c × c_c" },
    ],
    controls: [
      { id: "liquidTypeDensity", label: "Test Liquid (Turpentine / Paraffin oil)", min: 750, max: 950, step: 10, defaultValue: 820, unit: "kg/m³" },
      { id: "startCoolingTemp", label: "Initial Hot Temperature", min: 60, max: 85, step: 1, defaultValue: 75, unit: "°C" },
      { id: "ambientRoomTemp", label: "Enclosure Ambient Temp (θ_0)", min: 18, max: 28, step: 1, defaultValue: 24, unit: "°C" },
    ],
    graphConfig: {
      xAxis: "Cooling Time t (min)",
      yAxis: "Temperature θ (°C)",
      expectedSlopeMeaning: "Comparison of time intervals t_l and t_w to cool between identical temperatures θ1 and θ2",
      resultFormula: "c_l = [(m_w c_w + W)(t_l / t_w) - W] / m_l",
    },
    precautions: [
      "Both calorimeters must have identical polished outer surfaces, volumes, and radiation shield enclosures.",
      "Stir both liquids steadily and gently to maintain uniform temperature distribution.",
      "Take cooling times over the exact same temperature interval (e.g. 60°C to 50°C).",
    ],
    summary: "Comparison of cooling rates under Newton's Law of Cooling to determine specific heat capacity of an unknown liquid.",
    tags: ["Cooling", "Newton's Law", "Heat", "Calorimetry"],
  },

  // 27. Specific Latent Heat of Fusion of Ice
  {
    id: "prac-27",
    number: "27",
    title: "Determination of Specific Latent Heat of Fusion of Ice",
    category: "Thermal Physics",
    archetype: "heat_thermo",
    formula: "m_ice × L_f + m_ice × c_w × θ_final = (m_cal c_cal + m_w c_w) × (θ_initial - θ_final)",
    formulaDescription: "Heat required to melt ice at 0°C + heat to warm melted ice = heat given up by warm water and calorimeter.",
    keyConstants: [
      { label: "Theoretical Latent Heat L_f", value: "3.34 × 10⁵ J/kg" },
      { label: "Melting Point of Ice", value: "0.0 °C" },
    ],
    controls: [
      { id: "iceMassAdded", label: "Mass of Dry Ice Added (m_ice)", min: 10, max: 40, step: 2, defaultValue: 22, unit: "g" },
      { id: "initialWaterTemp", label: "Initial Warm Water Temp (θ_i)", min: 25, max: 40, step: 1, defaultValue: 32, unit: "°C" },
      { id: "calorimeterWaterMass", label: "Warm Water Mass (m_w)", min: 80, max: 150, step: 5, defaultValue: 100, unit: "g" },
    ],
    graphConfig: {
      xAxis: "Ice Mass Added (g)",
      yAxis: "Temperature Drop Δθ (°C)",
      expectedSlopeMeaning: "Linear relationship between ice mass and temperature drop",
      resultFormula: "L_f = [(m_w c_w + W)(θ_i - θ_f) - m_ice c_w θ_f] / m_ice",
    },
    precautions: [
      "Ice pieces must be thoroughly dried with filter paper just before adding so no adhering water is introduced.",
      "Start with water temperature slightly above room temperature and end about the same amount below room temperature to balance radiation.",
      "Stir gently until all ice is completely melted before recording minimum temperature.",
    ],
    summary: "Measurement of latent heat of fusion L_f of ice using calorimeter and method of mixtures.",
    tags: ["Phase Change", "Fusion", "Ice", "Calorimetry"],
  },

  // 28. Specific Latent Heat of Vaporization of Water
  {
    id: "prac-28",
    number: "28",
    title: "Determination of Latent Heat of Vaporization of Water",
    category: "Thermal Physics",
    archetype: "heat_thermo",
    formula: "m_steam × L_v + m_steam × c_w × (100 - θ_final) = (m_cal c_cal + m_w c_w) × (θ_final - θ_initial)",
    formulaDescription: "Heat released by condensing steam at 100°C + cooling condensed water = heat absorbed by cold water + calorimeter.",
    keyConstants: [
      { label: "Theoretical L_v", value: "2.26 × 10⁶ J/kg" },
      { label: "Boiling Point", value: "100.0 °C" },
    ],
    controls: [
      { id: "steamPassTime", label: "Steam Delivery Duration", min: 30, max: 180, step: 10, defaultValue: 75, unit: "s" },
      { id: "steamTrapEfficiency", label: "Water Trap Efficiency (Dry steam delivery)", min: 80, max: 100, step: 5, defaultValue: 98, unit: "%" },
      { id: "initialWaterTemp", label: "Initial Cold Water Temp (θ_i)", min: 10, max: 20, step: 1, defaultValue: 15, unit: "°C" },
    ],
    graphConfig: {
      xAxis: "Condensed Steam Mass (g)",
      yAxis: "Calorimeter Temperature Rise (°C)",
      expectedSlopeMeaning: "Proportional enthalpy transfer slope gives L_v",
      resultFormula: "L_v = [(m_w c_w + W)(θ_f - θ_i) - m_s c_w (100 - θ_f)] / m_s",
    },
    precautions: [
      "Use an efficient steam trap close to calorimeter to prevent water droplets entering with steam.",
      "Shield calorimeter with a wooden partition from direct heat radiation of boiler flame.",
      "Deliver delivery tube outlet well below water surface and remove before turning off steam.",
    ],
    summary: "Determination of latent heat of vaporization of water L_v using a steam boiler, steam trap, and copper calorimeter.",
    tags: ["Vaporization", "Steam", "Calorimetry", "Phase Change"],
  },

  // 29. Relative Humidity by Polished Calorimeter (Dew Point)
  {
    id: "prac-29",
    number: "29",
    title: "Determination of Relative Humidity Using Polished Calorimeter",
    category: "Thermal Physics",
    archetype: "heat_thermo",
    formula: "RH = (SVP at Dew Point / SVP at Room Temp) × 100 %",
    formulaDescription: "Dew point is the temperature at which water vapor in air becomes saturated; determined by appearance/disappearance of mist on polished surface.",
    keyConstants: [
      { label: "Room Temperature", value: "28.0 °C" },
      { label: "SVP at 28°C", value: "28.3 mm Hg" },
      { label: "SVP at 18°C", value: "15.5 mm Hg" },
    ],
    controls: [
      { id: "coolingEtherRate", label: "Air Bubbling Rate (Cooling speed)", min: 1, max: 10, step: 1, defaultValue: 4, unit: "bubbles/s" },
      { id: "ambientHumidity", label: "Atmospheric Relative Humidity", min: 30, max: 90, step: 5, defaultValue: 62, unit: "%" },
      { id: "roomTemp", label: "Ambient Room Temperature", min: 20, max: 35, step: 1, defaultValue: 28, unit: "°C" },
    ],
    graphConfig: {
      xAxis: "Observation Cycle",
      yAxis: "Temperature (°C)",
      expectedSlopeMeaning: "Mean of appearance temp θ1 and disappearance temp θ2 gives exact Dew Point",
      resultFormula: "Dew Point θ_d = (θ1 + θ2) / 2 ; RH = (SVP(θ_d)/SVP(θ_room)) × 100%",
    },
    precautions: [
      "Calorimeter outer surface must be polished to a mirror finish to detect the earliest faint misting.",
      "Do not breathe near polished calorimeter surface; observe from a distance or through glass window.",
      "Bubble air very slowly near dew point so temperature drops by no more than 1°C per minute.",
    ],
    summary: "Measurement of dew point using Regnault's polished calorimeter to calculate atmospheric relative humidity RH.",
    tags: ["Humidity", "Dew Point", "Regnault's", "SVP"],
  },

  // 30. Thermal Conductivity by Searle's Method
  {
    id: "prac-30",
    number: "30",
    title: "Thermal Conductivity of a Metal by Searle's Method",
    category: "Thermal Physics",
    archetype: "heat_thermo",
    formula: "k = (m × c_w × (θ4 - θ3) × d) / (A × (θ1 - θ2) × t)",
    formulaDescription: "Heat conducted along insulated copper bar = Heat absorbed by circulating cooling water coil in steady state.",
    keyConstants: [
      { label: "Copper Conductivity k", value: "385 W/(m·K)" },
      { label: "Bar Cross-Section A", value: "1.96 × 10⁻³ m² (dia 5 cm)" },
      { label: "Distance Between Thermometers d", value: "10.0 cm" },
    ],
    controls: [
      { id: "steamInletTemp", label: "Steam Chamber Temp (θ_steam)", min: 95, max: 100, step: 0.5, defaultValue: 99.5, unit: "°C" },
      { id: "waterFlowRate", label: "Cooling Water Mass Rate (m/t)", min: 2, max: 15, step: 0.5, defaultValue: 6.5, unit: "g/s" },
      { id: "metalType", label: "Metal Bar Material (0=Copper, 1=Aluminum, 2=Brass)", min: 0, max: 2, step: 1, defaultValue: 0, unit: "" },
    ],
    graphConfig: {
      xAxis: "Position Along Bar (cm)",
      yAxis: "Temperature (°C)",
      expectedSlopeMeaning: "Uniform negative temperature gradient (dθ/dx) in steady state",
      resultFormula: "k = [m c_w (θ4 - θ3)] / [A (dθ/dx)]",
    },
    precautions: [
      "Ensure thick felt insulation wraps the bar completely to prevent radial heat loss to surroundings.",
      "Wait until steady state is reached (all four thermometers remain completely stationary for 10 minutes).",
      "Thermometer cavities must contain mercury or oil for good thermal contact with the metal bar.",
    ],
    summary: "Determination of thermal conductivity k of good metallic conductors under steady state axial heat conduction.",
    tags: ["Conductivity", "Heat Transfer", "Searle's", "Thermal"],
  },

  // 31. EMF and Internal Resistance of Dry Cell
  {
    id: "prac-31",
    number: "31",
    title: "Determination of Internal Resistance and EMF of a Dry Cell",
    category: "Electricity & Electronics",
    archetype: "electricity_electronics",
    formula: "V = E - I × r  =>  V = -r × I + E",
    formulaDescription: "Terminal potential difference V plotted against discharge current I yields slope = -r (internal resistance) and y-intercept = E (EMF).",
    keyConstants: [
      { label: "Cell Nominal EMF E", value: "1.50 V" },
      { label: "Internal Resistance r", value: "0.85 Ω" },
    ],
    controls: [
      { id: "loadResistance", label: "Variable Load Resistance (R)", min: 0.5, max: 20, step: 0.5, defaultValue: 4.0, unit: "Ω" },
      { id: "cellEMF", label: "Cell Real EMF (E)", min: 1.3, max: 1.6, step: 0.05, defaultValue: 1.50, unit: "V" },
      { id: "internalR", label: "True Cell Internal Resistance (r)", min: 0.2, max: 2.5, step: 0.1, defaultValue: 0.85, unit: "Ω" },
    ],
    graphConfig: {
      xAxis: "Circuit Current I (A)",
      yAxis: "Terminal Potential Difference V (V)",
      expectedSlopeMeaning: "Negative slope = -r (internal resistance), y-intercept = E (EMF)",
      resultFormula: "E = y_intercept ; r = - slope",
    },
    precautions: [
      "Open the key between readings to prevent cell polarization and internal heating.",
      "Use high-resistance voltmeter or digital multimeter to measure open-circuit EMF without drawing current.",
      "Vary load resistance progressively across a wide current range (0.1 A to 1.5 A).",
    ],
    summary: "Determination of open-circuit electromotive force E and internal resistance r by plotting terminal voltage vs current.",
    tags: ["Current", "EMF", "Internal Resistance", "Ohm's Law"],
  },

  // 32. Temperature Coefficient of Resistance by Metre Bridge
  {
    id: "prac-32",
    number: "32",
    title: "Temperature Coefficient of Resistance (Cu) Using Metre Bridge",
    category: "Electricity & Electronics",
    archetype: "electricity_electronics",
    formula: "R_t = R_0 (1 + α × t)  ;  R_t / S = l / (100 - l)",
    formulaDescription: "Wheatstone bridge principle balances unknown copper coil resistance against standard resistor S at various bath temperatures.",
    keyConstants: [
      { label: "Temp Coeff α for Copper", value: "0.00393 K⁻¹" },
      { label: "Standard Resistor S", value: "5.0 Ω" },
      { label: "Metre Wire Length", value: "100.0 cm" },
    ],
    controls: [
      { id: "oilBathTemp", label: "Oil/Water Bath Temp (t)", min: 20, max: 100, step: 5, defaultValue: 25, unit: "°C" },
      { id: "standardResistor", label: "Known Resistor S in Right Gap", min: 1, max: 10, step: 1, defaultValue: 5, unit: "Ω" },
      { id: "jockeyPosition", label: "Metre Bridge Jockey Position (l)", min: 10, max: 90, step: 0.1, defaultValue: 48.5, unit: "cm" },
    ],
    graphConfig: {
      xAxis: "Temperature t (°C)",
      yAxis: "Coil Resistance R_t (Ω)",
      expectedSlopeMeaning: "Slope = R_0 × α  =>  α = slope / R_0",
      resultFormula: "α = slope / R_0",
    },
    precautions: [
      "Do not press or drag jockey roughly along bridge wire; tap gently to avoid scraping or changing wire cross-section.",
      "Stir heating bath continuously to ensure copper coil wire is at exact thermometer temperature.",
      "Interchange resistors in left and right gaps to eliminate end resistance errors.",
    ],
    summary: "Measurement of linear resistance increase of a copper coil with temperature using Wheatstone Metre Bridge.",
    tags: ["Wheatstone", "Metre Bridge", "Resistance", "Temp Coeff"],
  },

  // 33. Comparison of EMFs Using Potentiometer
  {
    id: "prac-33",
    number: "33",
    title: "Comparison of Electromotive Forces of Two Cells Using Potentiometer",
    category: "Electricity & Electronics",
    archetype: "electricity_electronics",
    formula: "E1 / E2 = L1 / L2",
    formulaDescription: "At null point, zero galvanometer current is drawn, measuring true open-circuit electromotive forces without loading error.",
    keyConstants: [
      { label: "Potentiometer Wire Length", value: "400 cm (4-wire) or 100 cm" },
      { label: "Driver Cell EMF E_d", value: "2.1 V (Lead-acid accumulator)" },
    ],
    controls: [
      { id: "cell1EMF", label: "Cell 1 EMF (Leclanché / Li-ion)", min: 1.2, max: 1.8, step: 0.05, defaultValue: 1.45, unit: "V" },
      { id: "cell2EMF", label: "Cell 2 EMF (Daniel / NiMH)", min: 0.9, max: 1.4, step: 0.05, defaultValue: 1.08, unit: "V" },
      { id: "jockeySlider", label: "Jockey Slider Position", min: 0, max: 400, step: 0.5, defaultValue: 276.2, unit: "cm" },
      { id: "activeCellSwitch", label: "Two-way Key (0=Cell 1, 1=Cell 2)", min: 0, max: 1, step: 1, defaultValue: 0, unit: "" },
    ],
    graphConfig: {
      xAxis: "Cell Selection (Cell 1, Cell 2)",
      yAxis: "Balancing Length L (cm)",
      expectedSlopeMeaning: "Direct ratio L1 / L2 equals EMF ratio E1 / E2",
      resultFormula: "E1 / E2 = L1 / L2",
    },
    precautions: [
      "Driver accumulator EMF must be strictly greater than either test cell EMF.",
      "All positive terminals must be connected to the zero-end binding post (common positive rail).",
      "Use protective high resistance in series with galvanometer while searching for balance point.",
    ],
    summary: "Comparison of EMFs of two cells without drawing current from them using potentiometer null balance.",
    tags: ["Potentiometer", "Null Method", "EMF", "Circuits"],
  },

  // 34. Internal Resistance of Cell Using Potentiometer
  {
    id: "prac-34",
    number: "34",
    title: "Determination of Internal Resistance of a Cell Using Potentiometer",
    category: "Electricity & Electronics",
    archetype: "electricity_electronics",
    formula: "r = R × ((L0 - L) / L)  =>  (1 / L) = (r / L0) × (1 / R) + (1 / L0)",
    formulaDescription: "L0 = balance length on open circuit (E ∝ L0), L = balance length when shunted by resistance box R (V ∝ L).",
    keyConstants: [
      { label: "Driver Cell EMF", value: "2.1 V" },
      { label: "Cell Open Circuit L0", value: "285.0 cm" },
      { label: "Nominal r", value: "1.20 Ω" },
    ],
    controls: [
      { id: "shuntResistorR", label: "Shunt Resistance Box (R)", min: 1, max: 20, step: 1, defaultValue: 5, unit: "Ω" },
      { id: "cellInternalR", label: "Cell True Internal Resistance (r)", min: 0.5, max: 3.0, step: 0.1, defaultValue: 1.2, unit: "Ω" },
      { id: "jockeyPosition", label: "Jockey Slider Position (L)", min: 50, max: 350, step: 0.5, defaultValue: 230.0, unit: "cm" },
      { id: "shuntKeyClosed", label: "Shunt Key (0=Open L0, 1=Closed L)", min: 0, max: 1, step: 1, defaultValue: 1, unit: "" },
    ],
    graphConfig: {
      xAxis: "Inverse Shunt Resistance (1 / R in Ω⁻¹)",
      yAxis: "Inverse Balancing Length (1 / L in m⁻¹)",
      expectedSlopeMeaning: "Slope m = r / L0  =>  r = slope × L0",
      resultFormula: "r = R × (L0 - L) / L",
    },
    precautions: [
      "Recheck open-circuit balance length L0 periodically to ensure driver cell has not discharged.",
      "Close shunt key only momentarily while seeking null deflection to prevent polarizing cell.",
      "Keep rheostat in driver circuit constant throughout all readings.",
    ],
    summary: "Measurement of internal resistance r of a primary cell by shunting it with calibrated resistance box.",
    tags: ["Potentiometer", "Internal Resistance", "Circuits", "Null Method"],
  },

  // 35. I-V Curve for Forward Biased Semiconductor Diode
  {
    id: "prac-35",
    number: "35",
    title: "I-V Characteristic Curve for Forward Biased Semiconductor Diode",
    category: "Electricity & Electronics",
    archetype: "electricity_electronics",
    formula: "I = I_s × (exp(e V / η k T) - 1)",
    formulaDescription: "Shockley diode equation: Current remains tiny until knee / cut-in voltage (~0.7V for Silicon, ~0.3V for Germanium), then rises exponentially.",
    keyConstants: [
      { label: "Knee Voltage (Si)", value: "0.65 - 0.70 V" },
      { label: "Knee Voltage (Ge)", value: "0.25 - 0.30 V" },
      { label: "Dynamic Resistance", value: "r_d = ΔV / ΔI" },
    ],
    controls: [
      { id: "forwardVoltage", label: "Forward Bias Voltage (V)", min: 0, max: 1.0, step: 0.02, defaultValue: 0.68, unit: "V" },
      { id: "diodeType", label: "Semiconductor Type (0=Silicon 0.7V, 1=Germanium 0.3V)", min: 0, max: 1, step: 1, defaultValue: 0, unit: "" },
      { id: "seriesLimitResistor", label: "Current Limiting Resistor", min: 50, max: 500, step: 50, defaultValue: 150, unit: "Ω" },
    ],
    graphConfig: {
      xAxis: "Forward Voltage V_f (V)",
      yAxis: "Forward Current I_f (mA)",
      expectedSlopeMeaning: "Reciprocal of dynamic resistance r_d = ΔV / ΔI in conduction region",
      resultFormula: "r_d = ΔV / ΔI ; V_knee = threshold intersection",
    },
    precautions: [
      "Always include current-limiting resistor in series to prevent thermal runaway burn-out of PN junction.",
      "Take voltage readings in very small increments (0.02 V) around the knee threshold region.",
      "Do not exceed the rated maximum continuous forward current (typically 100-200 mA).",
    ],
    summary: "Construction of forward-bias characteristic curve, determination of knee voltage and dynamic AC resistance of PN junction.",
    tags: ["Semiconductors", "Diode", "Electronics", "I-V Curve"],
  },

  // 36. Transistor Common Emitter Transfer Characteristics (IB vs IC)
  {
    id: "prac-36",
    number: "36",
    title: "Transfer Characteristic Curve Between IB and IC of Transistor (CE)",
    category: "Electricity & Electronics",
    archetype: "electricity_electronics",
    formula: "I_C = β × I_B + I_CEO  =>  β = ΔI_C / ΔI_B",
    formulaDescription: "Common Emitter transfer characteristic: Small base current I_B (µA) controls large collector current I_C (mA) at fixed V_CE.",
    keyConstants: [
      { label: "Current Gain β (h_FE)", value: "120 - 250" },
      { label: "Fixed Collector Voltage V_CE", value: "5.0 V" },
      { label: "Transistor Type", value: "NPN (e.g. BC547)" },
    ],
    controls: [
      { id: "baseCurrentIB", label: "Base Current (I_B)", min: 0, max: 100, step: 5, defaultValue: 35, unit: "µA" },
      { id: "fixedVCE", label: "Collector-Emitter Voltage (V_CE)", min: 1, max: 12, step: 1, defaultValue: 5, unit: "V" },
      { id: "transistorBeta", label: "Transistor Current Gain (β)", min: 80, max: 300, step: 10, defaultValue: 160, unit: "" },
    ],
    graphConfig: {
      xAxis: "Base Current I_B (µA)",
      yAxis: "Collector Current I_C (mA)",
      expectedSlopeMeaning: "Slope of linear transfer region gives common-emitter current gain β = ΔI_C / ΔI_B",
      resultFormula: "β = (ΔI_C in mA × 1000) / (ΔI_B in µA)",
    },
    precautions: [
      "Maintain collector-emitter voltage V_CE strictly constant while varying base current.",
      "Ensure transistor leads (Collector, Base, Emitter) are correctly identified to prevent reverse voltage breakdown.",
      "Stay well below maximum transistor power dissipation limit P_tot = V_CE × I_C.",
    ],
    summary: "Construction of CE transfer characteristics and determination of small-signal current amplification factor β.",
    tags: ["Transistor", "Electronics", "Current Gain", "Common Emitter"],
  },

  // 37. Logic Gates Truth Tables & Gate Identification
  {
    id: "prac-37",
    number: "37",
    title: "Truth Tables of Simple Fundamental Logic Gates & Gate Identification",
    category: "Electricity & Electronics",
    archetype: "electricity_electronics",
    formula: "AND: Y = A·B | OR: Y = A+B | NOT: Y = Ā | NAND: Y = (A·B)̄ | NOR: Y = (A+B)̄ | XOR: Y = A⊕B",
    formulaDescription: "Application of binary logic voltage levels (0V = LOW, 5V = HIGH) to input pins and observing output logic level indicator LED.",
    keyConstants: [
      { label: "Logic HIGH (1)", value: "5.0 V (TTL)" },
      { label: "Logic LOW (0)", value: "0.0 V (GND)" },
      { label: "IC Families", value: "7408 (AND), 7432 (OR), 7404 (NOT), 7400 (NAND)" },
    ],
    controls: [
      { id: "gateType", label: "Gate Under Test (0=AND, 1=OR, 2=NAND, 3=NOR, 4=XOR, 5=NOT)", min: 0, max: 5, step: 1, defaultValue: 0, unit: "" },
      { id: "inputA", label: "Input Switch A (0=LOW, 1=HIGH)", min: 0, max: 1, step: 1, defaultValue: 1, unit: "" },
      { id: "inputB", label: "Input Switch B (0=LOW, 1=HIGH)", min: 0, max: 1, step: 1, defaultValue: 1, unit: "" },
    ],
    graphConfig: {
      xAxis: "Input State Combo (00, 01, 10, 11)",
      yAxis: "Output Logic Level (0 or 1)",
      expectedSlopeMeaning: "Discrete Boolean state transitions matching characteristic truth table",
      resultFormula: "Gate Type = Match with Boolean Truth Table",
    },
    precautions: [
      "Ensure V_CC (Pin 14) and GND (Pin 7) are connected correctly before powering breadboard.",
      "Do not leave unused CMOS inputs floating; tie to V_CC or GND.",
      "Use 330 Ω series resistor with output LED to prevent excessive current draw from output stage.",
    ],
    summary: "Experimental verification of Boolean truth tables and systematic identification of unknown black-box digital logic ICs.",
    tags: ["Digital", "Logic Gates", "Boolean", "Truth Table"],
  },

  // 38. Young's Modulus by Searle's Apparatus
  {
    id: "prac-38",
    number: "38",
    title: "Determination of Young's Modulus of a Metal Wire (Searle's Apparatus)",
    category: "Mechanics & Matter",
    archetype: "mechanics_forces",
    formula: "Y = (M × g × L) / (π × r² × e)  =>  e = ((g L) / (π r² Y)) × M",
    formulaDescription: "Extension e of test wire measured using micrometer screw and spirit level referenced to identical dummy wire.",
    keyConstants: [
      { label: "Steel Wire Young's Modulus Y", value: "2.0 × 10¹¹ N/m²" },
      { label: "Wire Original Length L", value: "2.50 m" },
      { label: "Wire Radius r", value: "0.35 mm" },
    ],
    controls: [
      { id: "loadMassM", label: "Slotted Weights on Test Hanger (M)", min: 0.5, max: 5.0, step: 0.5, defaultValue: 2.5, unit: "kg" },
      { id: "wireRadiusR", label: "Wire Radius (r)", min: 0.2, max: 0.6, step: 0.02, defaultValue: 0.35, unit: "mm" },
      { id: "wireLengthL", label: "Initial Wire Length (L)", min: 1.5, max: 3.5, step: 0.1, defaultValue: 2.5, unit: "m" },
    ],
    graphConfig: {
      xAxis: "Load Mass M (kg)",
      yAxis: "Elongation e (mm)",
      expectedSlopeMeaning: "Slope = (g L) / (π r² Y)  =>  Y = (g L) / (π r² × slope)",
      resultFormula: "Y = (g × L) / (π × r² × slope)",
    },
    precautions: [
      "Use twin parallel wires (reference dummy wire and test wire) attached to common ceiling support to eliminate building flexure and temperature expansion.",
      "Record extension both while loading and unloading to check absence of elastic hysteresis or yielding.",
      "Level spirit level bubble to exact central mark with micrometer screw before reading extension.",
    ],
    summary: "High-precision measurement of tensile elasticity and Young's modulus Y of steel wire using Searle's apparatus.",
    tags: ["Elasticity", "Young's Modulus", "Stress-Strain", "Searle's"],
  },

  // 39. Viscosity of Liquid by Capillary Flow (Poiseuille's Formula)
  {
    id: "prac-39",
    number: "39",
    title: "Coefficient of Viscosity of Liquid by Capillary Flow (Poiseuille)",
    category: "Mechanics & Matter",
    archetype: "fluids_capillary",
    formula: "η = (π × P × r⁴) / (8 × l × Q)  =  (π × ρ × g × h × r⁴) / (8 × l × (V / t))",
    formulaDescription: "Q = V/t is steady laminar volume flow rate through narrow capillary of radius r and length l under hydrostatic head h.",
    keyConstants: [
      { label: "Water Viscosity η (at 25°C)", value: "0.89 × 10⁻³ Pa·s" },
      { label: "Capillary Radius r", value: "0.45 mm" },
      { label: "Capillary Length l", value: "35.0 cm" },
    ],
    controls: [
      { id: "pressureHeadH", label: "Constant Head Difference (h)", min: 5, max: 40, step: 1, defaultValue: 18, unit: "cm" },
      { id: "waterTemp", label: "Liquid Temperature", min: 15, max: 50, step: 1, defaultValue: 25, unit: "°C" },
      { id: "capillaryRadius", label: "Capillary Radius (r)", min: 0.3, max: 0.7, step: 0.02, defaultValue: 0.45, unit: "mm" },
    ],
    graphConfig: {
      xAxis: "Pressure Head h (cm)",
      yAxis: "Volume Flow Rate Q = V/t (cm³/s)",
      expectedSlopeMeaning: "Slope = (π ρ g r⁴) / (8 l η)  =>  η = (π ρ g r⁴) / (8 l × slope)",
      resultFormula: "η = (π × ρ × g × r⁴ × h) / (8 × l × Q)",
    },
    precautions: [
      "Keep Reynolds number Re < 2000 to ensure strictly streamline laminar flow without turbulence.",
      "Ensure capillary tube is held strictly horizontal.",
      "Measure capillary bore diameter at both ends using travelling microscope across perpendicular diameters.",
    ],
    summary: "Determination of dynamic viscosity coefficient η of water using constant-head capillary flow apparatus.",
    tags: ["Viscosity", "Poiseuille", "Laminar Flow", "Fluids"],
  },

  // 40. Surface Tension by Microscope Slide (Wilhelmy Plate / Balance)
  {
    id: "prac-40",
    number: "40",
    title: "Determination of Surface Tension of Water Using Microscope Slide",
    category: "Mechanics & Matter",
    archetype: "fluids_capillary",
    formula: "F = 2 × l × γ  =>  γ = (m × g) / (2 × l)",
    formulaDescription: "Tearing force F required to detach microscope glass slide of length l from water surface (two film surfaces).",
    keyConstants: [
      { label: "Water Surface Tension γ", value: "0.0728 N/m (72.8 mN/m)" },
      { label: "Slide Length l", value: "7.5 cm" },
      { label: "Slide Thickness t", value: "0.12 cm (neglected or added to 2(l+t))" },
    ],
    controls: [
      { id: "slideLengthL", label: "Slide Contact Edge Length (l)", min: 4, max: 10, step: 0.5, defaultValue: 7.5, unit: "cm" },
      { id: "detachmentMass", label: "Counterweight Mass Added (m)", min: 0.5, max: 3.0, step: 0.05, defaultValue: 1.11, unit: "g" },
      { id: "waterPurity", label: "Contamination / Detergent (0=Pure, 1=Traces, 2=Soapy)", min: 0, max: 2, step: 1, defaultValue: 0, unit: "" },
    ],
    graphConfig: {
      xAxis: "Slide Contact Perimeter 2(l + t) (cm)",
      yAxis: "Detachment Force F (mN)",
      expectedSlopeMeaning: "Slope gives surface tension γ directly",
      resultFormula: "γ = F / (2 × (l + t))",
    },
    precautions: [
      "Slide must be scrupulously cleaned with chromic acid or alcohol so water completely wicks with contact angle θ = 0°.",
      "Lower the water container very smoothly using a lab jack so film stretches uniformly until rupture.",
      "Slide lower edge must be precisely horizontal when approaching water surface.",
    ],
    summary: "Direct measurement of surface tension force on a glass slide suspended from a sensitive beam balance.",
    tags: ["Surface Tension", "Fluids", "Wilhelmy", "Capillarity"],
  },

  // 41. Surface Tension of Water by Capillary Rise Method
  {
    id: "prac-41",
    number: "41",
    title: "Determination of Surface Tension of Water by Capillary Rise Method",
    category: "Mechanics & Matter",
    archetype: "fluids_capillary",
    formula: "γ = (r × (h + r/3) × ρ × g) / (2 × cos θ)  ≈  (r × h × ρ × g) / 2",
    formulaDescription: "Upward vertical surface tension pull 2πr γ cos θ balances weight of elevated meniscus cylinder πr²h ρ g + meniscus volume.",
    keyConstants: [
      { label: "Water Surface Tension γ", value: "0.0728 N/m" },
      { label: "Contact Angle for Clean Glass θ", value: "0° (cos θ = 1)" },
      { label: "Water Density ρ", value: "1000 kg/m³" },
    ],
    controls: [
      { id: "capillaryRadiusR", label: "Capillary Tube Internal Radius (r)", min: 0.15, max: 0.60, step: 0.02, defaultValue: 0.25, unit: "mm" },
      { id: "waterTemp", label: "Water Temperature", min: 15, max: 50, step: 1, defaultValue: 22, unit: "°C" },
      { id: "capillaryRiseH", label: "Observed Capillary Elevation (h)", min: 20, max: 80, step: 0.5, defaultValue: 59.4, unit: "mm" },
    ],
    graphConfig: {
      xAxis: "Inverse Radius (1 / r in mm⁻¹)",
      yAxis: "Capillary Rise Height h (mm)",
      expectedSlopeMeaning: "Straight line through origin (Jurin's law h ∝ 1/r); slope = 2γ / (ρ g)",
      resultFormula: "γ = (slope × ρ × g) / 2",
    },
    precautions: [
      "Capillary bore must be chemically clean; check that water wets glass completely with zero contact angle.",
      "Use travelling microscope with vertical vernier scale to measure meniscus height relative to horizontal pointer touching beaker surface.",
      "Cut tube at meniscus position and measure internal diameter with travelling microscope.",
    ],
    summary: "Measurement of capillary elevation h in narrow glass bores to calculate water surface tension γ.",
    tags: ["Surface Tension", "Capillary Rise", "Jurin's Law", "Fluids"],
  },

  // 42. Surface Tension of Liquid by Jaeger's Method
  {
    id: "prac-42",
    number: "42",
    title: "Determination of Surface Tension of a Liquid by Jaeger's Method",
    category: "Mechanics & Matter",
    archetype: "fluids_capillary",
    formula: "P_max = h1 × ρ_manometer × g  =  h × ρ_liquid × g + (2 × γ / r)",
    formulaDescription: "Maximum excess pressure inside hemispherical air bubble growing at orifice of radius r at depth h in liquid.",
    keyConstants: [
      { label: "Liquid Density ρ", value: "1000 kg/m³" },
      { label: "Manometer Liquid (Water/Xylene)", value: "ρ_m = 1000 kg/m³" },
      { label: "Orifice Radius r", value: "0.20 mm" },
    ],
    controls: [
      { id: "immersionDepthH", label: "Orifice Immersion Depth (h)", min: 1, max: 12, step: 0.5, defaultValue: 4.0, unit: "cm" },
      { id: "orificeRadiusR", label: "Orifice Bore Radius (r)", min: 0.1, max: 0.4, step: 0.02, defaultValue: 0.22, unit: "mm" },
      { id: "bubbleReleaseRate", label: "Aspirator Dropping Rate (bubble frequency)", min: 1, max: 8, step: 1, defaultValue: 3, unit: "bubbles/min" },
    ],
    graphConfig: {
      xAxis: "Immersion Depth h (cm)",
      yAxis: "Manometer Head Difference H (cm)",
      expectedSlopeMeaning: "Straight line: slope = ρ_liq / ρ_manometer, y-intercept = 2γ / (r ρ_manometer g)",
      resultFormula: "γ = (y_intercept × ρ_m × g × r) / 2",
    },
    precautions: [
      "Regulate aspirator pinch-cock so bubbles detach very slowly (one bubble every 15-20 seconds) to ensure quasi-static pressure peak.",
      "Orifice tube must be strictly vertical with cleanly cleaved horizontal plane face.",
      "Record the maximum peak manometer deflection just before bubble breaks away.",
    ],
    summary: "Determination of surface tension γ and variation with immersion depth using maximum bubble pressure method.",
    tags: ["Surface Tension", "Jaeger's", "Bubble Pressure", "Fluids"],
  },
];
