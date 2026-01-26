import { comfyUIClient } from "@/lib/comfyui";
import { NextResponse } from "next/server";

export interface ComfyUIHealthResponse {
  connected: boolean;
  url: string;
  systemStats?: {
    cudaVersion?: string;
    vram?: { total: number; used: number; free: number };
    devices?: Array<{ name: string; type: string; vram_total: number; vram_free: number }>;
  };
  queue?: {
    running: number;
    pending: number;
  };
  error?: string;
}

/**
 * ComfyUI 연결 상태 확인 API
 * GET /api/comfyui/health
 */
export async function GET(): Promise<NextResponse<ComfyUIHealthResponse>> {
  const url = process.env.COMFYUI_API_URL || "http://localhost:8188";

  try {
    // 시스템 정보 조회로 연결 테스트
    const systemStats = await comfyUIClient.getSystemStats();
    const queue = await comfyUIClient.getQueue();

    return NextResponse.json({
      connected: true,
      url,
      systemStats: {
        cudaVersion: (systemStats.system as Record<string, unknown>)?.cuda_version as string | undefined,
        devices: (systemStats.devices as Array<{ name: string; type: string; vram_total: number; vram_free: number }>) || [],
      },
      queue: {
        running: queue.queue_running.length,
        pending: queue.queue_pending.length,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({
      connected: false,
      url,
      error: message,
    });
  }
}
