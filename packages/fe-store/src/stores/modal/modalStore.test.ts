import type { ComponentType } from "react";
import { describe, expect, it, vi } from "vitest";
import { ModalStore } from "./modalStore";
import type { ModalContentProps } from "./types";

interface FixtureState {
	value: string;
}

const FixtureComponent: ComponentType<ModalContentProps<FixtureState>> = () =>
	null;

describe("ModalStore", () => {
	it("component content와 도메인 state를 동일한 ModalState로 연다", () => {
		const store = new ModalStore();
		const contentState = { value: "fixture" };

		const modalState = store.open({
			title: "Fixture Modal",
			state: contentState,
			content: { kind: "component", component: FixtureComponent },
		});

		expect(store.current).toBe(modalState);
		expect(modalState.contentState).toBe(contentState);
		expect(modalState.content).toEqual({
			kind: "component",
			component: FixtureComponent,
		});
		expect(modalState.isOpen).toBe(true);
	});

	it("render callback과 close callback에 동일한 ModalState를 전달한다", () => {
		const store = new ModalStore();
		const render = vi.fn(() => null);
		const onClose = vi.fn();
		const modalState = store.open({
			title: "Render Modal",
			state: { value: "render" },
			content: { kind: "render", render },
			onClose,
		});

		modalState.close();

		expect(store.current).toBeNull();
		expect(modalState.isOpen).toBe(false);
		expect(onClose).toHaveBeenCalledWith(modalState);
	});

	it("새 Modal이 기존 state를 callback 없이 교체한다", () => {
		const store = new ModalStore();
		const previousClose = vi.fn();
		const previousState = store.open({
			title: "Previous",
			state: { value: "previous" },
			content: { kind: "component", component: FixtureComponent },
			onClose: previousClose,
		});
		const nextState = store.open({
			title: "Next",
			state: { value: "next" },
			content: { kind: "component", component: FixtureComponent },
		});

		expect(previousState.isOpen).toBe(false);
		expect(previousClose).not.toHaveBeenCalled();
		expect(store.current).toBe(nextState);
	});

	it("교체된 이전 state는 현재 Modal을 닫지 못한다", () => {
		const store = new ModalStore();
		const previousState = store.open({
			title: "Previous",
			state: { value: "previous" },
			content: { kind: "component", component: FixtureComponent },
		});
		const nextState = store.open({
			title: "Next",
			state: { value: "next" },
			content: { kind: "component", component: FixtureComponent },
		});

		previousState.close();

		expect(store.current).toBe(nextState);
		expect(nextState.isOpen).toBe(true);
	});

	it("dismiss는 close callback 없이 활성 Modal을 정리한다", () => {
		const store = new ModalStore();
		const onClose = vi.fn();
		const modalState = store.open({
			title: "Dismiss",
			state: { value: "dismiss" },
			content: { kind: "component", component: FixtureComponent },
			onClose,
		});

		store.dismiss();

		expect(store.current).toBeNull();
		expect(modalState.isOpen).toBe(false);
		expect(onClose).not.toHaveBeenCalled();
	});
});
