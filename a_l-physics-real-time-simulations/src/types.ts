export type PracticalCategory = 
  | "Mechanics & Matter"
  | "Hydrostatics & Fluids"
  | "Oscillations & Waves"
  | "Geometrical Optics"
  | "Thermal Physics"
  | "Electricity & Electronics";

export interface PracticalControl {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  description?: string;
}

export interface PracticalItem {
  id: string;
  number: string;
  title: string;
  category: PracticalCategory;
  archetype: 
    | "vernier_micrometer"
    | "mechanics_forces"
    | "pendulum_spring"
    | "sonometer_sound"
    | "optics_bench"
    | "prism_spectrometer"
    | "travelling_microscope"
    | "heat_thermo"
    | "fluids_capillary"
    | "electricity_electronics";
  formula: string;
  formulaDescription: string;
  keyConstants: { label: string; value: string }[];
  controls: PracticalControl[];
  graphConfig: {
    xAxis: string;
    yAxis: string;
    expectedSlopeMeaning: string;
    resultFormula: string;
  };
  precautions: string[];
  summary: string;
  tags: string[];
}

export interface ReadingPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
  timestamp: string;
  extra?: Record<string, number | string>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "assistant";
  content: string;
  timestamp: string | number;
  modelUsed?: string;
  groundingChunks?: any[];
}
