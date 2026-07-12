import { AppContext, ModalStore, type ModalState } from "@cocrepo/store";
import { fireEvent, render, screen } from "@testing-library/react";
import { observer } from "mobx-react-lite";
import { describe, expect, it, vi } from "vitest";
import type { AppStore } from "@cocrepo/store";
import { AppModalHost } from "./AppModalHost";

interface FixtureState {
	message: string;
}

const FixtureContent = observer(
	({ state }: { state: ModalState<FixtureState> }) => (
		<>
			<p>{state.contentState.message}</p>
			<button type="button" onClick={() => state.close()}>
				닫기
			</button>
		</>
	),
);

function renderHost(modal: ModalStore) {
	return render(
		<AppContext.Provider value={{ modal } as AppStore}>
			<AppModalHost />
		</AppContext.Provider>,
	);
}

describe("AppModalHost", () => {
	it("component content에 동일한 ModalState를 전달한다", () => {
		const modal = new ModalStore();
		modal.open({
			title: "공통 모달",
			state: { message: "component content" },
			content: { kind: "component", component: FixtureContent },
		});

		renderHost(modal);

		expect(
			screen.getByText("공통 모달").closest('[data-slot="modal-header"]'),
		).toBeInTheDocument();
		expect(
			screen
				.getByText("component content")
				.closest('[data-slot="modal-body"]'),
		).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: "닫기" }));
		expect(modal.current).toBeNull();
	});

	it("render callback에 동일한 ModalState를 전달한다", () => {
		const modal = new ModalStore();
		const renderContent = vi.fn((state: ModalState<FixtureState>) => (
			<p>{state.contentState.message}</p>
		));
		const modalState = modal.open({
			title: "Render Modal",
			state: { message: "render content" },
			content: { kind: "render", render: renderContent },
		});

		renderHost(modal);

		expect(renderContent).toHaveBeenCalledWith(modalState);
		expect(screen.getByText("render content")).toBeInTheDocument();
	});

	it("Backdrop dismiss는 현재 ModalState의 close 경로를 사용한다", () => {
		const modal = new ModalStore();
		const onClose = vi.fn();
		modal.open({
			title: "Dismiss Modal",
			state: { message: "dismiss content" },
			content: { kind: "component", component: FixtureContent },
			onClose,
		});

		renderHost(modal);
		const backdrop = document.querySelector('[data-slot="modal-backdrop"]');
		if (!(backdrop instanceof HTMLElement)) {
			throw new Error("Modal backdrop이 필요합니다.");
		}
		fireEvent.click(backdrop);

		expect(modal.current).toBeNull();
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("Escape dismiss는 현재 ModalState의 close 경로를 사용한다", () => {
		const modal = new ModalStore();
		const onClose = vi.fn();
		modal.open({
			title: "Escape Modal",
			state: { message: "escape content" },
			content: { kind: "component", component: FixtureContent },
			onClose,
		});

		renderHost(modal);
		const dialog = screen.getByRole("dialog");
		dialog.focus();
		fireEvent.keyDown(dialog, { key: "Escape" });

		expect(modal.current).toBeNull();
		expect(onClose).toHaveBeenCalledOnce();
	});
});
