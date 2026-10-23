import "@testing-library/jest-dom/vitest";
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DolmenResumeStatus } from "../data/dolmenHealthClient";
import { activityFixture } from "../test/dolmenFixtures";
import {
	createDeveloperDebugPanelState,
	DeveloperDebugPanel,
} from "./DeveloperDebugPanel";

const clients = vi.hoisted(() => ({ health: vi.fn(), resume: vi.fn() }));

vi.mock("../data/dolmenHealthClient", () => ({
	fetchDolmenHealthStatus: clients.health,
	fetchDolmenResumeStatus: clients.resume,
}));

const readyResume: DolmenResumeStatus = {
	state: "ready",
	sectionCount: 1,
	revision: 1,
	sources: ["등록 이력서 · 1쪽"],
	candidateName: "테스트 지원자",
	resumeUpdatedAt: "테스트 기준일",
};

beforeEach(() => {
	vi.useFakeTimers();
	clients.health
		.mockReset()
		.mockResolvedValue({ apiOnline: true, llmConfigured: true });
	clients.resume.mockReset().mockResolvedValue({ state: "unregistered" });
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
	vi.useRealTimers();
});

describe("DeveloperDebugPanel의 이력서 상태", () => {
	it("이력서 확인 전에는 준비됨을 표시하지 않고 서비스 상태를 독립적으로 갱신한다", async () => {
		clients.resume.mockImplementation(() => new Promise(() => {}));
		await act(async () => {
			render(<DeveloperDebugPanel agentActivities={[]} />);
		});
		expect(screen.getByText("이력서 확인 중…")).toBeInTheDocument();
		expect(screen.getByText("API 연결됨")).toBeInTheDocument();
		expect(screen.queryByText(/이력서 준비됨/)).not.toBeInTheDocument();
	});

	it.each([
		["unregistered", "이력서 등록 안 됨"],
		["not-ready", "이력서 준비 실패"],
		["unavailable", "이력서 상태 확인 실패"],
	])("%s를 구분하고 준비 완료로 표시하지 않는다", async (state, label) => {
		clients.resume.mockResolvedValue({ state });
		await act(async () => {
			render(<DeveloperDebugPanel agentActivities={[]} />);
		});
		expect(screen.getByText(label)).toBeInTheDocument();
		expect(screen.queryByText(/이력서 준비됨/)).not.toBeInTheDocument();
	});

	it("준비된 이름·근거만 표시하고 재조회 실패 시 이전 준비 상태를 지운다", async () => {
		clients.resume.mockResolvedValue(readyResume);
		let unmount = () => {};
		await act(async () => {
			({ unmount } = render(<DeveloperDebugPanel agentActivities={[]} />));
		});
		expect(
			screen.getByText("테스트 지원자님 이력서 준비됨 · 근거 1개"),
		).toBeInTheDocument();
		clients.resume.mockResolvedValue({ state: "not-ready" });
		await act(async () => {
			await vi.advanceTimersByTimeAsync(12_000);
		});
		expect(screen.getByText("이력서 준비 실패")).toBeInTheDocument();
		expect(screen.queryByText(/테스트 지원자/)).not.toBeInTheDocument();
		unmount();
		expect(vi.getTimerCount()).toBe(0);
	});

	it("dispose 뒤 완료된 조회는 화면 상태에 반영하지 않는다", async () => {
		let resolveResume: (resumeStatus: DolmenResumeStatus) => void = () => {};
		clients.resume.mockImplementation(
			() =>
				new Promise<DolmenResumeStatus>((resolve) => {
					resolveResume = resolve;
				}),
		);
		const statusState = createDeveloperDebugPanelState();
		statusState.activate();
		const refresh = statusState.refreshStatuses();
		statusState.dispose();
		resolveResume(readyResume);
		await refresh;
		expect(statusState.resumeStatus).toBeNull();
	});
	it("등록 데이터는 기본으로 열고 상세 전체와 정제 발췌문을 키보드로 접근 가능한 summary에서 펼친다", async () => {
		clients.resume.mockResolvedValue({
			...readyResume,
			sectionCount: 5,
			debug: {
				pageCount: 5,
				modelId: "test-model",
				sections: Array.from({ length: 5 }, (_, index) => ({
					documentId: `test-${index}`,
					source: `등록 이력서 · ${index + 1}쪽`,
					version: "test-version",
					characterCount: 100,
					snippet: `정제된 테스트 발췌 ${index + 1}`,
				})),
			},
		});
		await act(async () => {
			render(<DeveloperDebugPanel agentActivities={[]} />);
		});
		expect(screen.getByText("등록 데이터").closest("details")).toHaveAttribute(
			"open",
		);
		const sectionsSummary = screen.getByText("전체 등록 절 목록 (5)");
		expect(sectionsSummary.tagName).toBe("SUMMARY");
		expect(screen.getByText("정제된 테스트 발췌 5")).not.toBeVisible();
		fireEvent.click(sectionsSummary);
		expect(screen.getByText("정제된 테스트 발췌 5")).toBeVisible();
		expect(screen.getByText("ID: test-4")).toBeVisible();
		expect(screen.getByText("test-model")).toBeVisible();
		fireEvent.click(sectionsSummary);
		expect(screen.getByText("정제된 테스트 발췌 5")).not.toBeVisible();
	});

	it("개발 상세가 없는 이전 API는 준비 상태를 유지하고 미수신으로 표시한다", async () => {
		clients.resume.mockResolvedValue(readyResume);
		await act(async () => {
			render(<DeveloperDebugPanel agentActivities={[]} />);
		});
		expect(
			screen.getByText("개발 데이터 미수신 · 수집 꺼짐 또는 API 미지원"),
		).toBeVisible();
		expect(screen.getByText("전체 등록 절 목록 (미확인)")).toBeVisible();
		expect(screen.getAllByText("미확인").length).toBeGreaterThan(0);
		expect(
			screen.getByText("테스트 지원자님 이력서 준비됨 · 근거 1개"),
		).toBeVisible();
	});
	it("명시한 현재 브라우저 진단을 저장하고 Blob URL을 바로 정리한다", () => {
		const createObjectURL = vi.fn().mockReturnValue("blob:test-diagnostics");
		const revokeObjectURL = vi.fn();
		vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
		const click = vi
			.spyOn(HTMLAnchorElement.prototype, "click")
			.mockImplementation(() => {});
		const state = createDeveloperDebugPanelState();
		state.exportDiagnostics([activityFixture()]);
		expect(createObjectURL).toHaveBeenCalledOnce();
		expect(click).toHaveBeenCalledOnce();
		expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith(
			"blob:test-diagnostics",
		);
		expect(state.exportMessage).toMatch(/저장했습니다/);
	});
});
