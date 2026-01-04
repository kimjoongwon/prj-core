/// <reference types="vitest/globals" />

import { beforeEach, describe, expect, it, vi } from "vitest";
import { Navigator, type Router } from "../navigator";

describe("Navigator", () => {
	let mockRouter: Router;
	let navigator: Navigator;

	beforeEach(() => {
		mockRouter = {
			push: vi.fn(),
			replace: vi.fn(),
			back: vi.fn(),
			forward: vi.fn(),
			refresh: vi.fn(),
		};
		navigator = new Navigator({ router: mockRouter });
	});

	describe("push", () => {
		it("router.push를 호출해야 한다", () => {
			// When
			navigator.push("/members");

			// Then
			expect(mockRouter.push).toHaveBeenCalledWith("/members");
		});

		it("basePath가 있으면 경로에 추가해야 한다", () => {
			// Given
			const navigatorWithBase = new Navigator({
				router: mockRouter,
				basePath: "/admin",
			});

			// When
			navigatorWithBase.push("/members");

			// Then
			expect(mockRouter.push).toHaveBeenCalledWith("/admin/members");
		});

		it("경로가 이미 basePath로 시작하면 중복 추가하지 않아야 한다", () => {
			// Given
			const navigatorWithBase = new Navigator({
				router: mockRouter,
				basePath: "/admin",
			});

			// When
			navigatorWithBase.push("/admin/members");

			// Then
			expect(mockRouter.push).toHaveBeenCalledWith("/admin/members");
		});
	});

	describe("replace", () => {
		it("router.replace를 호출해야 한다", () => {
			// When
			navigator.replace("/login");

			// Then
			expect(mockRouter.replace).toHaveBeenCalledWith("/login");
		});

		it("basePath가 있으면 경로에 추가해야 한다", () => {
			// Given
			const navigatorWithBase = new Navigator({
				router: mockRouter,
				basePath: "/admin",
			});

			// When
			navigatorWithBase.replace("/login");

			// Then
			expect(mockRouter.replace).toHaveBeenCalledWith("/admin/login");
		});
	});

	describe("back", () => {
		it("router.back을 호출해야 한다", () => {
			// When
			navigator.back();

			// Then
			expect(mockRouter.back).toHaveBeenCalled();
		});
	});

	describe("forward", () => {
		it("router.forward를 호출해야 한다", () => {
			// When
			navigator.forward();

			// Then
			expect(mockRouter.forward).toHaveBeenCalled();
		});

		it("router.forward가 없으면 아무것도 하지 않아야 한다", () => {
			// Given
			const minimalRouter: Router = {
				push: vi.fn(),
				replace: vi.fn(),
				back: vi.fn(),
			};
			const nav = new Navigator({ router: minimalRouter });

			// When & Then - 에러 없이 실행되어야 함
			expect(() => nav.forward()).not.toThrow();
		});
	});

	describe("refresh", () => {
		it("router.refresh를 호출해야 한다", () => {
			// When
			navigator.refresh();

			// Then
			expect(mockRouter.refresh).toHaveBeenCalled();
		});

		it("router.refresh가 없으면 아무것도 하지 않아야 한다", () => {
			// Given
			const minimalRouter: Router = {
				push: vi.fn(),
				replace: vi.fn(),
				back: vi.fn(),
			};
			const nav = new Navigator({ router: minimalRouter });

			// When & Then - 에러 없이 실행되어야 함
			expect(() => nav.refresh()).not.toThrow();
		});
	});
});
