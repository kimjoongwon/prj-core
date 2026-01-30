"use client";

import { useEffect, useState } from "react";
import type { GenerationStatus } from "@/lib/comfyui";
import type { ImageHistoryImage, ImageHistoryItem } from "@/lib/image-history";
import {
	addImageHistory,
	clearImageHistory,
	getImageHistory,
	removeImageHistory,
} from "@/lib/image-history";

interface UseImageGenerationReturn {
	// 입력 상태
	prompt: string;
	negativePrompt: string;
	setPrompt: (value: string) => void;
	setNegativePrompt: (value: string) => void;

	// 생성 상태
	isGenerating: boolean;
	status: GenerationStatus | null;
	currentImages: ImageHistoryImage[];

	// 이력
	history: ImageHistoryItem[];
	selectedHistory: ImageHistoryItem | null;

	// 액션
	generate: () => Promise<void>;
	regenerate: () => Promise<void>;
	selectHistory: (item: ImageHistoryItem | null) => void;
	deleteHistory: (id: string) => void;
	clearHistory: () => void;
}

const POLL_INTERVAL = 1000;
const MAX_POLL_ATTEMPTS = 120;

export function useImageGeneration(): UseImageGenerationReturn {
	const [prompt, setPrompt] = useState("");
	const [negativePrompt, setNegativePrompt] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [status, setStatus] = useState<GenerationStatus | null>(null);
	const [currentImages, setCurrentImages] = useState<ImageHistoryImage[]>([]);
	const [history, setHistory] = useState<ImageHistoryItem[]>([]);
	const [selectedHistory, setSelectedHistory] =
		useState<ImageHistoryItem | null>(null);

	// 초기 이력 로드
	useEffect(() => {
		setHistory(getImageHistory());
	}, []);

	// 상태 폴링
	const pollStatus = async (promptId: string): Promise<GenerationStatus> => {
		for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
			const response = await fetch(`/api/comfyui/status/${promptId}`);
			const data = (await response.json()) as GenerationStatus;

			setStatus(data);

			if (data.status === "completed" || data.status === "error") {
				return data;
			}

			await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
		}

		return { status: "error", error: "Timeout waiting for generation" };
	};

	// 이미지 생성
	const generate = async () => {
		if (!prompt.trim() || isGenerating) return;

		setIsGenerating(true);
		setStatus({ status: "queued", progress: 0 });
		setCurrentImages([]);
		setSelectedHistory(null);

		try {
			// 생성 요청
			const response = await fetch("/api/comfyui/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					prompt: prompt.trim(),
					negativePrompt: negativePrompt.trim() || undefined,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to start generation");
			}

			const { promptId } = await response.json();

			// 상태 폴링
			const finalStatus = await pollStatus(promptId);

			if (finalStatus.status === "completed" && finalStatus.images) {
				setCurrentImages(finalStatus.images);

				// 이력에 추가
				const newItem = addImageHistory({
					promptId,
					prompt: prompt.trim(),
					negativePrompt: negativePrompt.trim() || undefined,
					images: finalStatus.images,
				});

				setHistory((prev) => [newItem, ...prev].slice(0, 50));
			}
		} catch (error) {
			console.error("Generation error:", error);
			setStatus({
				status: "error",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		} finally {
			setIsGenerating(false);
		}
	};

	// 재생성 (현재 프롬프트로)
	const regenerate = async () => {
		await generate();
	};

	// 이력 선택
	const selectHistory = (item: ImageHistoryItem | null) => {
		setSelectedHistory(item);
		if (item) {
			setCurrentImages(item.images);
			setPrompt(item.prompt);
			setNegativePrompt(item.negativePrompt || "");
			setStatus(null);
		}
	};

	// 이력 삭제
	const deleteHistory = (id: string) => {
		removeImageHistory(id);
		setHistory((prev) => prev.filter((item) => item.id !== id));

		if (selectedHistory?.id === id) {
			setSelectedHistory(null);
			setCurrentImages([]);
		}
	};

	// 이력 전체 삭제
	const clearHistoryHandler = () => {
		clearImageHistory();
		setHistory([]);
		setSelectedHistory(null);
		setCurrentImages([]);
	};

	return {
		prompt,
		negativePrompt,
		setPrompt,
		setNegativePrompt,
		isGenerating,
		status,
		currentImages,
		history,
		selectedHistory,
		generate,
		regenerate,
		selectHistory,
		deleteHistory,
		clearHistory: clearHistoryHandler,
	};
}
