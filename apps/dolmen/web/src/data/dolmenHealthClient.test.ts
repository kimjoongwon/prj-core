// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchDolmenResumeStatus } from "./dolmenHealthClient";

function createResumeStatusBody() {
	return {
		revision: 1,
		sources: ["등록 이력서 · 1쪽"],
		resume_configured: true,
		resume_ready: true,
		section_count: 1,
		candidate_name: "테스트 지원자",
		resume_updated_at: "테스트 기준일",
	};
}

function mockResumeResponse(body: unknown, status = 200) {
	const fetchResumeStatus = vi
		.fn()
		.mockResolvedValue(Response.json(body, { status }));
	vi.stubGlobal("fetch", fetchResumeStatus);
	return fetchResumeStatus;
}

afterEach(() => vi.unstubAllGlobals());

describe("fetchDolmenResumeStatus", () => {
	it("새 이력서 상태와 쪽 출처를 화면 계약으로 변환한다", async () => {
		const fetchResumeStatus = mockResumeResponse(createResumeStatusBody());
		await expect(fetchDolmenResumeStatus()).resolves.toEqual({
			state: "ready",
			sectionCount: 1,
			revision: 1,
			sources: ["등록 이력서 · 1쪽"],
			candidateName: "테스트 지원자",
			resumeUpdatedAt: "테스트 기준일",
		});
		expect(fetchResumeStatus).toHaveBeenCalledWith("/dolmen/api/documents", {
			cache: "no-store",
		});
	});

	it.each([
		["resume_not_configured", "unregistered"],
		["resume_not_ready", "not-ready"],
		["unknown", "unavailable"],
	])("HTTP503 %s를 %s로 구분한다", async (code, state) => {
		mockResumeResponse(
			{ detail: { code, message: "이력서를 준비할 수 없습니다." } },
			503,
		);
		await expect(fetchDolmenResumeStatus()).resolves.toEqual({ state });
	});

	it.each([
		[{ ...createResumeStatusBody(), resume_configured: false }, "unregistered"],
		[{ ...createResumeStatusBody(), resume_ready: false }, "not-ready"],
		[
			{ ...createResumeStatusBody(), section_count: 0, sources: [] },
			"not-ready",
		],
		[{ revision: 1, sources: ["이전 문서"] }, "unavailable"],
	])("미등록·미준비·이전 응답을 준비됨으로 표시하지 않는다 %#", async (body, state) => {
		mockResumeResponse(body);
		await expect(fetchDolmenResumeStatus()).resolves.toEqual({ state });
	});

	it("통신 실패와 JSON 실패를 준비 실패 상태로 반환한다", async () => {
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network")));
		await expect(fetchDolmenResumeStatus()).resolves.toEqual({
			state: "unavailable",
		});
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("invalid")));
		await expect(fetchDolmenResumeStatus()).resolves.toEqual({
			state: "unavailable",
		});
	});
});
