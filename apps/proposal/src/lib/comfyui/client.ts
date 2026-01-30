/**
 * ComfyUI API 클라이언트
 * 로컬 ComfyUI 서버와 통신하는 HTTP 클라이언트
 */

import type {
	ComfyUIHistory,
	ComfyUIImage,
	GenerationStatus,
	QueuePromptResponse,
} from "./types";

const COMFYUI_API_URL = process.env.COMFYUI_API_URL || "http://localhost:8188";
const COMFYUI_TIMEOUT = Number(process.env.COMFYUI_TIMEOUT) || 60000;

/**
 * ComfyUI API 클라이언트 클래스
 */
export class ComfyUIClient {
	private baseUrl: string;
	private timeout: number;

	constructor(baseUrl?: string, timeout?: number) {
		this.baseUrl = baseUrl || COMFYUI_API_URL;
		this.timeout = timeout || COMFYUI_TIMEOUT;
	}

	/**
	 * 워크플로우를 큐에 추가
	 */
	async queuePrompt(
		workflow: Record<string, unknown>,
	): Promise<QueuePromptResponse> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(`${this.baseUrl}/prompt`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt: workflow }),
				signal: controller.signal,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`ComfyUI queuePrompt failed: ${response.status} - ${errorText}`,
				);
			}

			return await response.json();
		} finally {
			clearTimeout(timeoutId);
		}
	}

	/**
	 * 특정 프롬프트의 히스토리 조회
	 */
	async getHistory(promptId: string): Promise<ComfyUIHistory> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(`${this.baseUrl}/history/${promptId}`, {
				signal: controller.signal,
			});

			if (!response.ok) {
				throw new Error(`ComfyUI getHistory failed: ${response.status}`);
			}

			return await response.json();
		} finally {
			clearTimeout(timeoutId);
		}
	}

	/**
	 * 큐 상태 조회
	 */
	async getQueue(): Promise<{
		queue_running: unknown[];
		queue_pending: unknown[];
	}> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(`${this.baseUrl}/queue`, {
				signal: controller.signal,
			});

			if (!response.ok) {
				throw new Error(`ComfyUI getQueue failed: ${response.status}`);
			}

			return await response.json();
		} finally {
			clearTimeout(timeoutId);
		}
	}

	/**
	 * 시스템 정보 조회 (연결 테스트용)
	 */
	async getSystemStats(): Promise<Record<string, unknown>> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);

		try {
			const response = await fetch(`${this.baseUrl}/system_stats`, {
				signal: controller.signal,
			});

			if (!response.ok) {
				throw new Error(`ComfyUI getSystemStats failed: ${response.status}`);
			}

			return await response.json();
		} finally {
			clearTimeout(timeoutId);
		}
	}

	/**
	 * 이미지 URL 생성
	 */
	getImageUrl(
		filename: string,
		subfolder = "",
		type: "output" | "input" | "temp" = "output",
	): string {
		const params = new URLSearchParams({
			filename,
			subfolder,
			type,
		});
		return `${this.baseUrl}/view?${params.toString()}`;
	}

	/**
	 * 이미지 바이너리 가져오기
	 */
	async getImage(
		filename: string,
		subfolder = "",
		type: "output" | "input" | "temp" = "output",
	): Promise<ArrayBuffer> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const url = this.getImageUrl(filename, subfolder, type);
			const response = await fetch(url, {
				signal: controller.signal,
			});

			if (!response.ok) {
				throw new Error(`ComfyUI getImage failed: ${response.status}`);
			}

			return await response.arrayBuffer();
		} finally {
			clearTimeout(timeoutId);
		}
	}

	/**
	 * 프롬프트 실행 상태 폴링
	 */
	async pollStatus(
		promptId: string,
		maxAttempts = 60,
		interval = 1000,
	): Promise<GenerationStatus> {
		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			const history = await this.getHistory(promptId);
			const entry = history[promptId];

			if (entry) {
				if (entry.status.status_str === "error") {
					return {
						status: "error",
						error:
							entry.status.messages?.[0]?.[1]?.toString() || "Unknown error",
					};
				}

				if (entry.status.completed) {
					// 출력에서 이미지 추출
					const images: ComfyUIImage[] = [];
					for (const nodeOutput of Object.values(entry.outputs)) {
						if (nodeOutput.images) {
							images.push(...nodeOutput.images);
						}
					}

					return {
						status: "completed",
						progress: 100,
						images,
					};
				}
			}

			// 큐 상태 확인
			const queue = await this.getQueue();
			const inQueue = [...queue.queue_running, ...queue.queue_pending].some(
				(item: unknown) => Array.isArray(item) && item[1] === promptId,
			);

			if (!inQueue && !entry) {
				// 큐에 없고 히스토리에도 없으면 아직 처리 중
				await this.sleep(interval);
				continue;
			}

			await this.sleep(interval);
		}

		return {
			status: "error",
			error: "Timeout waiting for generation",
		};
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

// 싱글톤 인스턴스
export const comfyUIClient = new ComfyUIClient();
