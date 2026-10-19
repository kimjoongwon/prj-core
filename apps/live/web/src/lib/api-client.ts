export const apiBasePath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api`;

export const liveVideoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/videos/live-loop.mp4`;

export class ApiError extends Error {
	status: number;
	payload: unknown;

	constructor(message: string, status: number, payload: unknown) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.payload = payload;
	}
}

export async function apiFetchJson<T>(
	url: string,
	init?: RequestInit,
): Promise<T> {
	const response = await fetch(url, {
		...init,
		headers: { "Content-Type": "application/json", ...init?.headers },
	});
	const data = await response.json().catch(() => null);
	if (!response.ok) {
		throw new ApiError(`요청 실패 (${response.status})`, response.status, data);
	}
	return data as T;
}
