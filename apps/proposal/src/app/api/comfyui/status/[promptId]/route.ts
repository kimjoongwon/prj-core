/**
 * ComfyUI 생성 상태 조회 API
 * GET /api/comfyui/status/[promptId]
 */

import { NextRequest, NextResponse } from "next/server";
import {
	type ComfyUIImage,
	comfyUIClient,
	type GenerationStatus,
} from "@/lib/comfyui";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ promptId: string }> },
) {
	try {
		const { promptId } = await params;

		if (!promptId) {
			return NextResponse.json(
				{ error: "Prompt ID is required" },
				{ status: 400 },
			);
		}

		// 히스토리에서 상태 조회
		const history = await comfyUIClient.getHistory(promptId);
		const entry = history[promptId];

		if (entry) {
			// 완료 또는 에러 상태
			if (entry.status.status_str === "error") {
				const status: GenerationStatus = {
					status: "error",
					error: entry.status.messages?.[0]?.[1]?.toString() || "Unknown error",
				};
				return NextResponse.json(status);
			}

			if (entry.status.completed) {
				// 출력에서 이미지 추출
				const images: ComfyUIImage[] = [];
				for (const nodeOutput of Object.values(entry.outputs)) {
					if (nodeOutput.images) {
						images.push(...nodeOutput.images);
					}
				}

				const status: GenerationStatus = {
					status: "completed",
					progress: 100,
					images,
				};
				return NextResponse.json(status);
			}
		}

		// 큐 상태 확인
		const queue = await comfyUIClient.getQueue();
		const isRunning = queue.queue_running.some(
			(item: unknown) => Array.isArray(item) && item[1] === promptId,
		);
		const isPending = queue.queue_pending.some(
			(item: unknown) => Array.isArray(item) && item[1] === promptId,
		);

		if (isRunning) {
			const status: GenerationStatus = {
				status: "processing",
				progress: 50, // WebSocket 없이는 정확한 진행률 알 수 없음
			};
			return NextResponse.json(status);
		}

		if (isPending) {
			const status: GenerationStatus = {
				status: "queued",
				progress: 0,
			};
			return NextResponse.json(status);
		}

		// 히스토리에 없고 큐에도 없는 경우
		const status: GenerationStatus = {
			status: "processing",
			progress: 75,
		};
		return NextResponse.json(status);
	} catch (error) {
		console.error("ComfyUI status error:", error);

		const message = error instanceof Error ? error.message : "Unknown error";
		const isConnectionError =
			message.includes("ECONNREFUSED") || message.includes("fetch failed");

		return NextResponse.json(
			{
				status: "error",
				error: isConnectionError
					? "ComfyUI 서버에 연결할 수 없습니다."
					: message,
			},
			{ status: isConnectionError ? 503 : 500 },
		);
	}
}
