/**
 * ComfyUI API 타입 정의
 */

/** ComfyUI 프롬프트 요청 응답 */
export interface QueuePromptResponse {
  prompt_id: string;
  number: number;
  node_errors: Record<string, unknown>;
}

/** ComfyUI 이미지 출력 */
export interface ComfyUIImage {
  filename: string;
  subfolder: string;
  type: "output" | "input" | "temp";
}

/** ComfyUI 노드 출력 */
export interface ComfyUINodeOutput {
  images?: ComfyUIImage[];
  [key: string]: unknown;
}

/** ComfyUI 히스토리 엔트리 */
export interface ComfyUIHistoryEntry {
  prompt: [number, string, Record<string, unknown>, Record<string, string>, string[]];
  outputs: Record<string, ComfyUINodeOutput>;
  status: {
    status_str: "success" | "error";
    completed: boolean;
    messages: Array<[string, Record<string, unknown>]>;
  };
}

/** ComfyUI 히스토리 응답 */
export interface ComfyUIHistory {
  [promptId: string]: ComfyUIHistoryEntry;
}

/** 생성 진행 상태 */
export interface GenerationStatus {
  status: "queued" | "processing" | "completed" | "error";
  progress?: number;
  currentNode?: string;
  images?: ComfyUIImage[];
  error?: string;
}

/** 이미지 생성 요청 */
export interface GenerateImageRequest {
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  steps?: number;
  cfgScale?: number;
  width?: number;
  height?: number;
}

/** 이미지 생성 응답 */
export interface GenerateImageResponse {
  promptId: string;
  status: GenerationStatus;
}

/** WebSocket 메시지 타입 */
export type ComfyUIWebSocketMessage =
  | { type: "status"; data: { status: { exec_info: { queue_remaining: number } } } }
  | { type: "execution_start"; data: { prompt_id: string } }
  | { type: "execution_cached"; data: { prompt_id: string; nodes: string[] } }
  | { type: "executing"; data: { node: string | null; prompt_id: string } }
  | { type: "progress"; data: { value: number; max: number; prompt_id: string; node: string } }
  | { type: "executed"; data: { node: string; output: ComfyUINodeOutput; prompt_id: string } }
  | { type: "execution_error"; data: { prompt_id: string; node_id: string; exception_message: string } };
