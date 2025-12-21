/// <reference types="vitest/globals" />

import type { RouteDto } from "@cocrepo/api";
import { beforeEach, describe, expect, it } from "vitest";
import { NavigatorStore } from "../navigatorStore";
import { PlateStore } from "../plateStore";

describe("NavigatorStore", () => {
	let navigatorStore: NavigatorStore;
	let mockPlateStore: PlateStore;

	const mockRoutes: RouteDto[] = [
		{
			name: "Dashboard",
			fullPath: "/dashboard",
			relativePath: "/dashboard",
			icon: "dashboard",
			children: [
				{
					name: "Analytics",
					fullPath: "/dashboard/analytics",
					relativePath: "/analytics",
					icon: "chart",
					children: null,
				},
				{
					name: "Reports",
					fullPath: "/dashboard/reports",
					relativePath: "/reports",
					icon: "report",
					children: null,
				},
			],
		},
		{
			name: "Users",
			fullPath: "/users",
			relativePath: "/users",
			icon: "users",
			children: [
				{
					name: "List",
					fullPath: "/users/list",
					relativePath: "/list",
					icon: "list",
					children: [
						{
							name: "Detail",
							fullPath: "/users/list/detail",
							relativePath: "/detail",
							icon: "detail",
							children: null,
						},
					],
				},
			],
		},
		{
			name: "Settings",
			fullPath: "/settings",
			relativePath: "/settings",
			icon: "settings",
			children: null,
		},
	];

	beforeEach(() => {
		mockPlateStore = {} as PlateStore;
		navigatorStore = new NavigatorStore(mockPlateStore);
	});

	describe("생성자", () => {
		it("PlateStore 의존성이 올바르게 주입되어야 함", () => {
			expect(navigatorStore.plateStore).toBe(mockPlateStore);
		});
	});

	describe("getRouteByFullPath 메서드", () => {
		it("최상위 경로를 찾을 수 있어야 함", () => {
			const result = navigatorStore.getRouteByFullPath(
				"/dashboard",
				mockRoutes,
			);

			expect(result).toBeDefined();
			expect(result?.name).toBe("Dashboard");
			expect(result?.fullPath).toBe("/dashboard");
		});

		it("1단계 자식 경로를 찾을 수 있어야 함", () => {
			const result = navigatorStore.getRouteByFullPath(
				"/dashboard/analytics",
				mockRoutes,
			);

			expect(result).toBeDefined();
			expect(result?.name).toBe("Analytics");
			expect(result?.fullPath).toBe("/dashboard/analytics");
		});

		it("2단계 자식 경로를 찾을 수 있어야 함", () => {
			const result = navigatorStore.getRouteByFullPath(
				"/users/list/detail",
				mockRoutes,
			);

			expect(result).toBeDefined();
			expect(result?.name).toBe("Detail");
			expect(result?.fullPath).toBe("/users/list/detail");
		});

		it("children이 null인 경로를 찾을 수 있어야 함", () => {
			const result = navigatorStore.getRouteByFullPath("/settings", mockRoutes);

			expect(result).toBeDefined();
			expect(result?.name).toBe("Settings");
			expect(result?.fullPath).toBe("/settings");
			expect(result?.children).toBeNull();
		});

		it("존재하지 않는 경로는 undefined를 반환해야 함", () => {
			const result = navigatorStore.getRouteByFullPath(
				"/nonexistent",
				mockRoutes,
			);

			expect(result).toBeUndefined();
		});

		it("부분적으로 일치하는 경로는 찾지 못해야 함", () => {
			const result = navigatorStore.getRouteByFullPath("/dash", mockRoutes);

			expect(result).toBeUndefined();
		});

		it("유사하지만 다른 경로는 찾지 못해야 함", () => {
			const result = navigatorStore.getRouteByFullPath(
				"/dashboard/analytic",
				mockRoutes,
			);

			expect(result).toBeUndefined();
		});

		it("빈 경로 배열에서는 undefined를 반환해야 함", () => {
			const result = navigatorStore.getRouteByFullPath("/dashboard", []);

			expect(result).toBeUndefined();
		});

		it("빈 문자열 경로는 찾지 못해야 함", () => {
			const result = navigatorStore.getRouteByFullPath("", mockRoutes);

			expect(result).toBeUndefined();
		});

		it("슬래시로 시작하지 않는 경로는 찾지 못해야 함", () => {
			const result = navigatorStore.getRouteByFullPath("dashboard", mockRoutes);

			expect(result).toBeUndefined();
		});

		it("여러 단계 중첩된 구조에서 올바른 경로를 찾아야 함", () => {
			const complexRoutes: RouteDto[] = [
				{
					name: "Level1",
					fullPath: "/level1",
					relativePath: "/level1",
					icon: "level1",
					children: [
						{
							name: "Level2",
							fullPath: "/level1/level2",
							relativePath: "/level2",
							icon: "level2",
							children: [
								{
									name: "Level3",
									fullPath: "/level1/level2/level3",
									relativePath: "/level3",
									icon: "level3",
									children: [
										{
											name: "Level4",
											fullPath: "/level1/level2/level3/level4",
											relativePath: "/level4",
											icon: "level4",
											children: null,
										},
									],
								},
							],
						},
					],
				},
			];

			const result = navigatorStore.getRouteByFullPath(
				"/level1/level2/level3/level4",
				complexRoutes,
			);

			expect(result).toBeDefined();
			expect(result?.name).toBe("Level4");
			expect(result?.fullPath).toBe("/level1/level2/level3/level4");
		});

		it("동일한 이름의 경로가 있을 때 첫 번째로 일치하는 경로를 반환해야 함", () => {
			const duplicateRoutes: RouteDto[] = [
				{
					name: "Test",
					fullPath: "/test1",
					relativePath: "/test1",
					icon: "test1",
					children: null,
				},
				{
					name: "Test",
					fullPath: "/test2",
					relativePath: "/test2",
					icon: "test2",
					children: null,
				},
			];

			const result = navigatorStore.getRouteByFullPath(
				"/test1",
				duplicateRoutes,
			);

			expect(result).toBeDefined();
			expect(result?.fullPath).toBe("/test1");
			expect(result?.icon).toBe("test1");
		});
	});

	describe("엣지 케이스", () => {
		it("null children이 있는 경로에서 검색이 정상 작동해야 함", () => {
			const routesWithNullChildren: RouteDto[] = [
				{
					name: "Parent",
					fullPath: "/parent",
					relativePath: "/parent",
					icon: "parent",
					children: null,
				},
			];

			const result = navigatorStore.getRouteByFullPath(
				"/parent",
				routesWithNullChildren,
			);

			expect(result).toBeDefined();
			expect(result?.name).toBe("Parent");
		});

		it("빈 children 배열이 있는 경로에서 검색이 정상 작동해야 함", () => {
			const routesWithEmptyChildren: RouteDto[] = [
				{
					name: "Parent",
					fullPath: "/parent",
					relativePath: "/parent",
					icon: "parent",
					children: [],
				},
			];

			const result = navigatorStore.getRouteByFullPath(
				"/parent",
				routesWithEmptyChildren,
			);

			expect(result).toBeDefined();
			expect(result?.name).toBe("Parent");
		});

		it("특수문자가 포함된 경로를 찾을 수 있어야 함", () => {
			const specialRoutes: RouteDto[] = [
				{
					name: "Special",
					fullPath: "/special-route_with.dots",
					relativePath: "/special-route_with.dots",
					icon: "special",
					children: null,
				},
			];

			const result = navigatorStore.getRouteByFullPath(
				"/special-route_with.dots",
				specialRoutes,
			);

			expect(result).toBeDefined();
			expect(result?.name).toBe("Special");
		});
	});
});
