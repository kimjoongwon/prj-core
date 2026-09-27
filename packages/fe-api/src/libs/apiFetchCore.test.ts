import { afterEach, describe, expect, it, vi } from "vitest";

// AbortSignal.any/timeout이 없는 런타임(RN/Hermes 구버전)의 수동 폴백 경로를
// 검증한다. 정적 메서드를 undefined로 가려 typeof 검사가 폴백을 선택하게 한다.
const LegacyAbortSignal = class extends AbortSignal {};
Object.defineProperty(LegacyAbortSignal, "any", { value: undefined });
Object.defineProperty(LegacyAbortSignal, "timeout", { value: undefined });

const jsonResponse = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

describe("executeApiFetch 타임아웃 signal 합성 폴백", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.useRealTimers();
	});

	it("요청이 완료되면 타임아웃 타이머를 해제한다", async () => {
		vi.stubGlobal("AbortSignal", LegacyAbortSignal);
		// setTimeout/clearTimeout만 가짜로 대체한다(Response 본문 읽기가
		// 스트림 스케줄링에 쓰는 다른 타이머까지 멈추면 검증 자체가 막힌다).
		vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
		const fetchMock = vi.fn<typeof fetch>();
		fetchMock.mockResolvedValue(jsonResponse({ ok: true }));
		vi.stubGlobal("fetch", fetchMock);
		const { executeApiFetch } = await import("./apiFetchCore");

		await executeApiFetch<{ ok: boolean }>("/api/v1/templates", {
			method: "GET",
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		// 완료된 요청에 10초 타임아웃 타이머가 남아 있으면 안 된다.
		expect(vi.getTimerCount()).toBe(0);
	});

	it("타임아웃이 지나면 요청을 중단하고 일반 에러로 바꿔 전파한다", async () => {
		vi.stubGlobal("AbortSignal", LegacyAbortSignal);
		vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
		const fetchMock = vi.fn<typeof fetch>().mockImplementation(
			(_input, init) =>
				new Promise((_resolve, reject) => {
					init?.signal?.addEventListener("abort", () => {
						reject(
							new DOMException("This operation was aborted", "AbortError"),
						);
					});
				}),
		);
		vi.stubGlobal("fetch", fetchMock);
		const { executeApiFetch } = await import("./apiFetchCore");

		const pendingRequest = executeApiFetch("/api/v1/templates", {
			method: "GET",
		});
		pendingRequest.catch(() => {});
		vi.advanceTimersByTime(10_000);

		await expect(pendingRequest).rejects.toThrow("timeout of 10000ms exceeded");
	});
});
