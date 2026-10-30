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
  /** 추천 기본 스택에 포함된 선택지 — 카드에 "추천" 배지 표시 */
  isRecommended?: boolean;
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
  designTool: string | null;
}

export const TOTAL_STEPS = 8;
export const RESULT_STEP = TOTAL_STEPS + 1;
