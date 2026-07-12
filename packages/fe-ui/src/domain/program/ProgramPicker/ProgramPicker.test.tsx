import { ModalStore } from "@cocrepo/store";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProgramPicker } from "./ProgramPicker";
import { ProgramPickerState } from "./ProgramPickerState";

function createOpenPicker(options = defaultOptions) {
	const modal = new ModalStore();
	const onSelect = vi.fn();
	const programPickerState = new ProgramPickerState({
		searchLabel: "프로그램 검색",
		searchPlaceholder: "프로그램명",
		options,
		selectedId: options[0]?.id,
		onSelect,
	});
	const modalState = modal.open({
		title: "프로그램 선택",
		state: programPickerState,
		content: { kind: "component", component: ProgramPicker },
	});

	return { modal, modalState, onSelect };
}

const defaultOptions = [
	{ id: "program-yoga", name: "모닝 요가", subtitle: "초급 / 60분" },
	{ id: "program-pilates", name: "리포머 필라테스" },
];

describe("ProgramPicker", () => {
	it("검색 결과를 표시하고 선택 callback 후 Modal을 닫는다", () => {
		const { modal, modalState, onSelect } = createOpenPicker();
		render(<ProgramPicker state={modalState} />);

		fireEvent.change(screen.getByLabelText("프로그램 검색"), {
			target: { value: "필라테스" },
		});
		fireEvent.click(screen.getByRole("button", { name: "리포머 필라테스" }));

		expect(onSelect).toHaveBeenCalledWith(
			"program-pilates",
			modalState.contentState,
		);
		expect(modal.current).toBeNull();
	});

	it("선택 후보가 없으면 빈 결과를 표시한다", () => {
		const { modalState } = createOpenPicker([]);
		render(<ProgramPicker state={modalState} />);

		expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
	});
});
