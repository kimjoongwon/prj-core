import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DolmenResumeStatus } from "../data/dolmenHealthClient";
import { AgentStatusBar, createAgentStatusBarState } from "./AgentStatusBar";

const clients = vi.hoisted(() => ({ health: vi.fn(), resume: vi.fn() }));

vi.mock("../data/dolmenHealthClient", () => ({
	fetchDolmenHealthStatus: clients.health,
	fetchDolmenResumeStatus: clients.resume,
}));

vi.mock("@cocrepo/ui", () => ({
	Chip: ({ children, color }: { children: ReactNode; color: string }) => (
		<span data-color={color}>{children}</span>
	),
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
	vi.useRealTimers();
});

describe("AgentStatusBar의 이력서 상태", () => {
	it("이력서 확인 전에는 준비됨을 표시하지 않고 서비스 상태를 독립적으로 갱신한다", async () => {
		clients.resume.mockImplementation(() => new Promise(() => {}));
		await act(async () => {
			render(<AgentStatusBar />);
		});
		expect(screen.getByText("이력서 확인 중…")).toBeInTheDocument();
		expect(screen.getByText("서비스 연결됨")).toBeInTheDocument();
		expect(screen.queryByText(/이력서 준비됨/)).not.toBeInTheDocument();
	});

	it.each([
		["unregistered", "이력서 등록 안 됨"],
		["not-ready", "이력서 준비 실패"],
		["unavailable", "이력서 상태 확인 실패"],
	])("%s를 구분하고 준비 완료로 표시하지 않는다", async (state, label) => {
		clients.resume.mockResolvedValue({ state });
		await act(async () => {
			render(<AgentStatusBar />);
		});
		expect(screen.getByText(label)).toBeInTheDocument();
		expect(screen.queryByText(/이력서 준비됨/)).not.toBeInTheDocument();
	});

	it("준비된 이름·근거만 표시하고 재조회 실패 시 이전 준비 상태를 지운다", async () => {
		clients.resume.mockResolvedValue(readyResume);
		let unmount = () => {};
		await act(async () => {
			({ unmount } = render(<AgentStatusBar />));
		});
		expect(
			screen.getByText("테스트 지원자님 이력서 준비됨 · 근거 1개"),
		).toHaveAttribute("data-color", "success");
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
		const statusState = createAgentStatusBarState();
		statusState.activate();
		const refresh = statusState.refreshStatuses();
		statusState.dispose();
		resolveResume(readyResume);
		await refresh;
		expect(statusState.resumeStatus).toBeNull();
	});
});
