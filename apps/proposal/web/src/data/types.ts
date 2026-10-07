export interface TechOption {
  id: string;
  name: string;
  vendor: string;
  tagline: string;
  pros: string[];
  cons: string[];
  costRange: string;
  bestFor: string;
  monthlyCost: number;
}

export interface ComparisonRow {
  label: string;
  values: Record<string, string>;
}

export interface StepData {
  id: string;
  title: string;
  description: string;
  options: TechOption[];
  comparison: ComparisonRow[];
  recommendations: { scenario: string; pick: string; reason: string }[];
}

export interface SelectionState {
  frontend: string | null;
  backend: string | null;
  infrastructure: string | null;
  aiService: boolean;
}

export const TOTAL_STEPS = 7;
