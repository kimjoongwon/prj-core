/**
 * ComfyUI 이미지 생성 API
 * POST /api/comfyui/generate
 */

import { NextRequest, NextResponse } from "next/server";
import { comfyUIClient } from "@/lib/comfyui";
import { loadIconGeneratorWorkflow } from "@/lib/workflows/loader";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { prompt, negativePrompt, seed, steps, cfgScale, width, height } =
			body;

		if (!prompt) {
			return NextResponse.json(
				{ error: "Prompt is required" },
				{ status: 400 },
			);
		}

		// 워크플로우 로드 및 프롬프트 주입
		const workflow = loadIconGeneratorWorkflow({
			prompt,
			negativePrompt,
			seed,
			steps,
			cfgScale,
			width,
			height,
		});

		// ComfyUI에 큐 추가
		const response = await comfyUIClient.queuePrompt(workflow);

		return NextResponse.json({
			promptId: response.prompt_id,
			status: "queued",
		});
	} catch (error) {
		console.error("ComfyUI generate error:", error);

		const message = error instanceof Error ? error.message : "Unknown error";
		const isConnectionError =
			message.includes("ECONNREFUSED") || message.includes("fetch failed");

		return NextResponse.json(
			{
				error: isConnectionError
					? "ComfyUI 서버에 연결할 수 없습니다. ComfyUI가 실행 중인지 확인해주세요."
					: message,
			},
			{ status: isConnectionError ? 503 : 500 },
		);
	}
}
