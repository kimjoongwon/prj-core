/**
 * 이미지 생성 이력 관리
 * localStorage 기반 영속성
 */

const STORAGE_KEY = "comfyui-image-history";
const MAX_HISTORY_ITEMS = 50;

export interface ImageHistoryImage {
	filename: string;
	subfolder: string;
	type: "output" | "input" | "temp";
}

export interface ImageHistoryItem {
	id: string;
	promptId: string;
	prompt: string;
	negativePrompt?: string;
	images: ImageHistoryImage[];
	createdAt: string;
	seed?: number;
}

/**
 * 이력 목록 조회
 */
export function getImageHistory(): ImageHistoryItem[] {
	if (typeof window === "undefined") {
		return [];
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) {
			return [];
		}
		return JSON.parse(stored) as ImageHistoryItem[];
	} catch (error) {
		console.error("Failed to load image history:", error);
		return [];
	}
}

/**
 * 이력 항목 추가
 */
export function addImageHistory(
	item: Omit<ImageHistoryItem, "id" | "createdAt">,
): ImageHistoryItem {
	const history = getImageHistory();

	const newItem: ImageHistoryItem = {
		...item,
		id: generateId(),
		createdAt: new Date().toISOString(),
	};

	// 최신 항목을 앞에 추가
	const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);

	saveHistory(updatedHistory);

	return newItem;
}

/**
 * 이력 항목 삭제
 */
export function removeImageHistory(id: string): void {
	const history = getImageHistory();
	const updatedHistory = history.filter((item) => item.id !== id);
	saveHistory(updatedHistory);
}

/**
 * 이력 전체 삭제
 */
export function clearImageHistory(): void {
	if (typeof window === "undefined") {
		return;
	}
	localStorage.removeItem(STORAGE_KEY);
}

/**
 * 특정 이력 항목 조회
 */
export function getImageHistoryItem(id: string): ImageHistoryItem | null {
	const history = getImageHistory();
	return history.find((item) => item.id === id) || null;
}

/**
 * 이미지 URL 생성 (프록시 API 경유)
 */
export function getProxyImageUrl(image: ImageHistoryImage): string {
	const params = new URLSearchParams({
		filename: image.filename,
		subfolder: image.subfolder || "",
		type: image.type || "output",
	});
	return `/api/comfyui/image?${params.toString()}`;
}

// 내부 함수

function saveHistory(history: ImageHistoryItem[]): void {
	if (typeof window === "undefined") {
		return;
	}

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
	} catch (error) {
		console.error("Failed to save image history:", error);
	}
}

function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
