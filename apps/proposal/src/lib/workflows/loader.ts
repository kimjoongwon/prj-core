/**
 * ComfyUI 워크플로우 로더
 * JSON 워크플로우에 프롬프트 및 파라미터를 주입
 */

import iconGeneratorWorkflow from "./icon-generator.json";

export interface WorkflowParams {
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  steps?: number;
  cfgScale?: number;
  width?: number;
  height?: number;
  batchSize?: number;
}

/**
 * 아이콘 생성 워크플로우 로드 및 파라미터 주입
 */
export function loadIconGeneratorWorkflow(params: WorkflowParams): Record<string, unknown> {
  // 깊은 복사
  const workflow = JSON.parse(JSON.stringify(iconGeneratorWorkflow)) as Record<string, Record<string, unknown>>;

  // _meta 제거 (ComfyUI API에 불필요)
  delete workflow._meta;

  // 포지티브 프롬프트 주입 (노드 6)
  if (workflow["6"]?.inputs) {
    const basePrompt = "flat icon, simple design, minimalist, clean lines, solid background, ui icon, app icon, vector style";
    (workflow["6"].inputs as Record<string, unknown>).text = params.prompt
      ? `${params.prompt}, ${basePrompt}`
      : basePrompt;
  }

  // 네거티브 프롬프트 주입 (노드 7)
  if (workflow["7"]?.inputs && params.negativePrompt) {
    const baseNegative = "blurry, low quality, noisy, distorted, watermark, signature, text, letters, words";
    (workflow["7"].inputs as Record<string, unknown>).text = `${params.negativePrompt}, ${baseNegative}`;
  }

  // KSampler 파라미터 주입 (노드 3)
  if (workflow["3"]?.inputs) {
    const samplerInputs = workflow["3"].inputs as Record<string, unknown>;

    // 시드 (0이면 랜덤)
    samplerInputs.seed = params.seed ?? Math.floor(Math.random() * 2147483647);

    // 스텝 수 (SDXL Turbo는 4스텝 권장)
    if (params.steps) {
      samplerInputs.steps = params.steps;
    }

    // CFG Scale (SDXL Turbo는 1.0 권장)
    if (params.cfgScale) {
      samplerInputs.cfg = params.cfgScale;
    }
  }

  // 이미지 크기 주입 (노드 5)
  if (workflow["5"]?.inputs) {
    const latentInputs = workflow["5"].inputs as Record<string, unknown>;

    if (params.width) {
      latentInputs.width = params.width;
    }
    if (params.height) {
      latentInputs.height = params.height;
    }
    if (params.batchSize) {
      latentInputs.batch_size = params.batchSize;
    }
  }

  return workflow;
}

/**
 * 사용 가능한 워크플로우 목록
 */
export const availableWorkflows = [
  {
    id: "icon-generator",
    name: "아이콘 생성",
    description: "플랫 스타일 아이콘 생성 (SDXL Turbo)",
    defaultParams: {
      steps: 4,
      cfgScale: 1.0,
      width: 512,
      height: 512,
      batchSize: 4,
    },
  },
] as const;

export type WorkflowId = (typeof availableWorkflows)[number]["id"];
