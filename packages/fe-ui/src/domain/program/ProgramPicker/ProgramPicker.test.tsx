import { useGetRoutine, useGetRoutines } from "@cocrepo/api/core/routines";
import { useGetUserById, useGetUsers } from "@cocrepo/api/core/users";
import { ModalStore } from "@cocrepo/store";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProgramPicker } from "./ProgramPicker";
import { ProgramPickerState } from "./ProgramPickerState";

vi.mock("@cocrepo/api/core/routines", () => ({
	useGetRoutine: vi.fn(),
	useGetRoutines: vi.fn(),
}));
vi.mock("@cocrepo/api/core/users", () => ({
	useGetUserById: vi.fn(),
	useGetUsers: vi.fn(),
}));

function createOpenPicker(kind: "routine" | "instructor" = "routine") {
	const modal = new ModalStore();
	const onSelect = vi.fn();
	const programPickerState = new ProgramPickerState({
		kind,
		onSelect,
	});
	const modalState = modal.open({
		title: "프로그램 선택",
		state: programPickerState,
		content: { kind: "component", component: ProgramPicker },
	});

	return { modal, modalState, onSelect };
}

describe("ProgramPicker", () => {
	beforeEach(() => {
		vi.mocked(useGetRoutines).mockReturnValue({
			data: {
				data: [
					{
						id: "program-yoga",
						name: "모닝 요가",
						label: "요가",
						activities: [],
					},
					{
						id: "program-pilates",
						name: "리포머 필라테스",
						label: "필라테스",
						activities: [],
					},
				],
			},
			isLoading: false,
			isError: false,
		} as never);
		vi.mocked(useGetRoutine).mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: false,
		} as never);
		vi.mocked(useGetUsers).mockReturnValue({
			data: { data: [] },
			isLoading: false,
			isError: false,
		} as never);
		vi.mocked(useGetUserById).mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: false,
		} as never);
	});

	it("검색 결과를 표시하고 선택 callback 후 Modal을 닫는다", () => {
		const { modal, modalState, onSelect } = createOpenPicker();
		render(<ProgramPicker state={modalState} />);

		fireEvent.change(screen.getByLabelText("루틴 검색"), {
			target: { value: "필라테스" },
		});
		fireEvent.click(screen.getByRole("button", { name: /리포머 필라테스/ }));

		expect(onSelect).toHaveBeenCalledWith(
			"program-pilates",
			expect.objectContaining({ name: "리포머 필라테스" }),
			modalState.contentState,
		);
		expect(modal.current).toBeNull();
	});

	it("선택 후보가 없으면 빈 결과를 표시한다", () => {
		vi.mocked(useGetRoutines).mockReturnValue({
			data: { data: [] },
			isLoading: false,
			isError: false,
		} as never);
		const { modalState } = createOpenPicker();
		render(<ProgramPicker state={modalState} />);

		expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
	});

	it("강사 종류는 users API를 호출하고 이메일을 후보 부가 정보로 표시한다", () => {
		vi.mocked(useGetUsers).mockReturnValue({
			data: {
				data: [{ id: "instructor-a", name: "강사 A", email: "a@test.com" }],
			},
			isLoading: false,
			isError: false,
		} as never);
		const { modalState } = createOpenPicker("instructor");

		render(<ProgramPicker state={modalState} />);

		expect(
			screen.getByRole("button", { name: /강사 A 이메일: a@test.com/ }),
		).toBeInTheDocument();
		expect(useGetUsers).toHaveBeenCalledWith(
			expect.objectContaining({
				take: 50,
				roles: ["COMPANY_MANAGER", "PLATFORM_ADMIN"],
				status: "active",
			}),
			{ query: { enabled: true } },
		);
	});
});
