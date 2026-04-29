/// <reference types="vitest/globals" />

import { beforeEach, describe, expect, it, vi } from "vitest";
import { NavItem, type NavItemConfig } from "../navItem";
import { NavigationStore } from "../navigationStore";

describe("NavItem", () => {
	const createNavItemConfig = (
		overrides?: Partial<NavItemConfig>,
	): NavItemConfig => ({
		id: "nav-1",
		label: "테스트 아이템",
		path: "/test",
		icon: "Home",
		subject: "TestItem",
		...overrides,
	});

	describe("생성자", () => {
		it("아이템을 올바르게 생성해야 한다", () => {
			// Given
			const config = createNavItemConfig();

			// When
			const navItem = new NavItem(config);

			// Then
			expect(navItem.id).toBe("nav-1");
			expect(navItem.label).toBe("테스트 아이템");
			expect(navItem.path).toBe("/test");
			expect(navItem.icon).toBe("Home");
			expect(navItem.subject).toBe("TestItem");
		});

		it("하위 아이템을 재귀적으로 생성해야 한다", () => {
			// Given
			const config = createNavItemConfig({
				children: [
					{
						id: "child-1",
						label: "자식 1",
						path: "/test/child1",
						subject: "Child1",
					},
					{
						id: "child-2",
						label: "자식 2",
						path: "/test/child2",
						subject: "Child2",
					},
				],
			});

			// When
			const navItem = new NavItem(config);

			// Then
			expect(navItem.children).toHaveLength(2);
			expect(navItem.children[0].id).toBe("child-1");
			expect(navItem.children[1].id).toBe("child-2");
		});
	});

	describe("active 상태", () => {
		it("초기 active 상태는 false여야 한다", () => {
			const navItem = new NavItem(createNavItemConfig());
			expect(navItem.active).toBe(false);
		});

		it("setActive로 상태를 변경할 수 있어야 한다", () => {
			// Given
			const navItem = new NavItem(createNavItemConfig());

			// When
			navItem.setActive(true);

			// Then
			expect(navItem.active).toBe(true);
		});
	});

	describe("hasChildren", () => {
		it("자식이 있으면 true를 반환해야 한다", () => {
			const navItem = new NavItem(
				createNavItemConfig({
					children: [{ id: "child", label: "자식", subject: "Child" }],
				}),
			);
			expect(navItem.hasChildren).toBe(true);
		});

		it("자식이 없으면 false를 반환해야 한다", () => {
			const navItem = new NavItem(createNavItemConfig());
			expect(navItem.hasChildren).toBe(false);
		});
	});

	describe("firstChildPath", () => {
		it("자식이 있으면 첫 번째 자식의 path를 반환해야 한다", () => {
			const navItem = new NavItem(
				createNavItemConfig({
					children: [
						{
							id: "child-1",
							label: "자식 1",
							path: "/first",
							subject: "Child1",
						},
						{
							id: "child-2",
							label: "자식 2",
							path: "/second",
							subject: "Child2",
						},
					],
				}),
			);
			expect(navItem.firstChildPath).toBe("/first");
		});

		it("자식이 없으면 자신의 path를 반환해야 한다", () => {
			const navItem = new NavItem(createNavItemConfig({ path: "/self" }));
			expect(navItem.firstChildPath).toBe("/self");
		});
	});

	describe("findChildById", () => {
		it("ID로 자식 아이템을 찾아야 한다", () => {
			const navItem = new NavItem(
				createNavItemConfig({
					children: [
						{ id: "child-1", label: "자식 1", subject: "Child1" },
						{ id: "child-2", label: "자식 2", subject: "Child2" },
					],
				}),
			);

			const found = navItem.findChildById("child-2");
			expect(found?.label).toBe("자식 2");
		});

		it("없는 ID면 undefined를 반환해야 한다", () => {
			const navItem = new NavItem(createNavItemConfig());
			expect(navItem.findChildById("nonexistent")).toBeUndefined();
		});
	});

	describe("findChildByPath", () => {
		it("경로로 자식 아이템을 찾아야 한다", () => {
			const navItem = new NavItem(
				createNavItemConfig({
					children: [
						{
							id: "child-1",
							label: "자식 1",
							path: "/users",
							subject: "Child1",
						},
						{
							id: "child-2",
							label: "자식 2",
							path: "/settings",
							subject: "Child2",
						},
					],
				}),
			);

			const found = navItem.findChildByPath("/users/123");
			expect(found?.id).toBe("child-1");
		});
	});

	describe("resetChildrenActive", () => {
		it("모든 자식의 active 상태를 false로 설정해야 한다", () => {
			const navItem = new NavItem(
				createNavItemConfig({
					children: [
						{ id: "child-1", label: "자식 1", subject: "Child1" },
						{ id: "child-2", label: "자식 2", subject: "Child2" },
					],
				}),
			);

			navItem.children[0].setActive(true);
			navItem.children[1].setActive(true);

			navItem.resetChildrenActive();

			expect(navItem.children[0].active).toBe(false);
			expect(navItem.children[1].active).toBe(false);
		});
	});
});

describe("NavigationStore", () => {
	const createNavItemConfigs = (): NavItemConfig[] => [
		{
			id: "members",
			label: "회원",
			subject: "Member",
			children: [
				{
					id: "member-list",
					label: "회원 목록",
					path: "/members/list",
					subject: "MemberList",
				},
				{
					id: "member-add",
					label: "회원 추가",
					path: "/members/add",
					subject: "MemberAdd",
				},
			],
		},
		{
			id: "settings",
			label: "설정",
			subject: "Settings",
			children: [
				{
					id: "general",
					label: "일반",
					path: "/settings/general",
					subject: "General",
				},
				{
					id: "security",
					label: "보안",
					path: "/settings/security",
					subject: "Security",
					scopeKind: "global-full-access-only",
				},
			],
		},
		{
			id: "dashboard",
			label: "대시보드",
			path: "/dashboard",
			subject: "Dashboard",
		},
	];

	let navigationStore: NavigationStore;
	let mockNavigate: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockNavigate = vi.fn();
		navigationStore = new NavigationStore(createNavItemConfigs(), {
			onNavigate: mockNavigate,
		});
	});

	describe("생성자", () => {
		it("아이템을 올바르게 초기화해야 한다", () => {
			expect(navigationStore.allItems).toHaveLength(3);
			expect(navigationStore.allItems[0].id).toBe("members");
		});
	});

	describe("items (권한 필터링)", () => {
		it("abilityChecker가 없으면 모든 아이템을 반환해야 한다", () => {
			expect(navigationStore.items).toHaveLength(3);
		});

		it("abilityChecker로 아이템을 필터링해야 한다", () => {
			// Given
			const abilityChecker = vi.fn().mockImplementation((_action, subject) => {
				return subject !== "Security"; // Security만 숨김
			});
			navigationStore.setAbilityChecker(abilityChecker);

			// When
			const items = navigationStore.items;

			// Then
			const settingsItem = items.find((m) => m.id === "settings");
			expect(settingsItem?.children).toHaveLength(1);
			expect(settingsItem?.children[0].id).toBe("general");
		});

		it("scopeChecker로 global-full-access-only 아이템을 필터링해야 한다", () => {
			navigationStore.setAbilityChecker(() => true);
			navigationStore.setScopeChecker(
				(scopeKind) => scopeKind !== "global-full-access-only",
			);

			const items = navigationStore.items;
			const settingsItem = items.find((item) => item.id === "settings");

			expect(settingsItem?.children).toHaveLength(1);
			expect(settingsItem?.children[0].id).toBe("general");
		});
	});

	describe("setCurrentPath", () => {
		it("경로를 기반으로 활성 아이템을 설정해야 한다", () => {
			// When
			navigationStore.setCurrentPath("/members/list");

			// Then
			expect(navigationStore.selectedNavItem?.id).toBe("members");
			expect(navigationStore.selectedSubNavItem?.id).toBe("member-list");
		});

		it("중첩 경로도 매칭해야 한다", () => {
			// When
			navigationStore.setCurrentPath("/members/add");

			// Then
			expect(navigationStore.selectedNavItem?.id).toBe("members");
			expect(navigationStore.selectedSubNavItem?.id).toBe("member-add");
		});

		it("children이 없는 아이템도 매칭해야 한다", () => {
			// When
			navigationStore.setCurrentPath("/dashboard");

			// Then
			expect(navigationStore.selectedNavItem?.id).toBe("dashboard");
			expect(navigationStore.selectedSubNavItem).toBeNull();
		});

		it("동일한 경로로 재호출하면 무시해야 한다", () => {
			// Given
			navigationStore.setCurrentPath("/members/list");
			const selectedNavItem = navigationStore.selectedNavItem;

			// When
			navigationStore.setCurrentPath("/members/list");

			// Then - 동일한 인스턴스여야 함
			expect(navigationStore.selectedNavItem).toBe(selectedNavItem);
		});
	});

	describe("selectNavItem", () => {
		it("아이템을 선택하고 첫 번째 자식으로 네비게이션해야 한다", () => {
			// When
			navigationStore.selectNavItem("members");

			// Then
			expect(navigationStore.selectedNavItem?.id).toBe("members");
			expect(mockNavigate).toHaveBeenCalledWith("/members/list");
		});

		it("아이템 선택 시 선택된 1depth 메뉴만 펼쳐야 한다", () => {
			// Given
			navigationStore.expandNavItem("settings");

			// When
			navigationStore.selectNavItem("members");

			// Then
			expect(Array.from(navigationStore.expandedNavItemIds)).toEqual([
				"members",
			]);
		});

		it("children이 없는 1depth 아이템 선택 시 다른 1depth 메뉴를 모두 닫아야 한다", () => {
			// Given
			navigationStore.expandNavItem("members");
			navigationStore.expandNavItem("settings");
			navigationStore.selectSubNavItem("member-add");

			// When
			navigationStore.selectNavItem("dashboard");

			// Then
			expect(navigationStore.selectedNavItem?.id).toBe("dashboard");
			expect(navigationStore.selectedSubNavItem).toBeNull();
			expect(Array.from(navigationStore.expandedNavItemIds)).toEqual([]);
		});
	});

	describe("selectSubNavItem", () => {
		it("하위 아이템을 선택하고 네비게이션해야 한다", () => {
			// When
			navigationStore.selectSubNavItem("member-add");

			// Then
			expect(navigationStore.selectedSubNavItem?.id).toBe("member-add");
			expect(mockNavigate).toHaveBeenCalledWith("/members/add");
		});

		it("부모 아이템도 자동으로 선택해야 한다", () => {
			// When
			navigationStore.selectSubNavItem("security");

			// Then
			expect(navigationStore.selectedNavItem?.id).toBe("settings");
			expect(navigationStore.selectedSubNavItem?.id).toBe("security");
		});

		it("1depth 아이템 ID가 들어오면 루트 아이템 선택으로 fallback 해야 한다", () => {
			// When
			navigationStore.selectSubNavItem("dashboard");

			// Then
			expect(navigationStore.selectedNavItem?.id).toBe("dashboard");
			expect(navigationStore.selectedSubNavItem).toBeNull();
			expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
		});

		it("하위 아이템 선택 시 본인이 속한 1depth 메뉴만 펼쳐야 한다", () => {
			// Given
			navigationStore.expandNavItem("members");

			// When
			navigationStore.selectSubNavItem("security");

			// Then
			expect(navigationStore.selectedNavItem?.id).toBe("settings");
			expect(Array.from(navigationStore.expandedNavItemIds)).toEqual([
				"settings",
			]);
		});
	});

	describe("toggleNavItem", () => {
		it("아이템 펼침/접힘을 토글해야 한다", () => {
			// Given
			expect(navigationStore.isNavItemExpanded("members")).toBe(false);

			// When
			navigationStore.toggleNavItem("members");

			// Then
			expect(navigationStore.isNavItemExpanded("members")).toBe(true);

			// When
			navigationStore.toggleNavItem("members");

			// Then
			expect(navigationStore.isNavItemExpanded("members")).toBe(false);
		});

		it("다른 1depth 아이템을 펼칠 때 기존 1depth 아이템은 닫아야 한다", () => {
			// Given
			navigationStore.toggleNavItem("members");

			// When
			navigationStore.toggleNavItem("settings");

			// Then
			expect(Array.from(navigationStore.expandedNavItemIds)).toEqual([
				"settings",
			]);
		});
	});

	describe("expandNavItem", () => {
		it("아이템을 펼쳐야 한다", () => {
			// When
			navigationStore.expandNavItem("settings");

			// Then
			expect(navigationStore.isNavItemExpanded("settings")).toBe(true);
		});
	});

	describe("findNavItemById", () => {
		it("ID로 아이템을 찾아야 한다", () => {
			const navItem = navigationStore.findNavItemById("settings");
			expect(navItem?.label).toBe("설정");
		});
	});

	describe("findSubNavItemById", () => {
		it("ID로 하위 아이템을 찾아야 한다", () => {
			const subNavItem = navigationStore.findSubNavItemById("security");
			expect(subNavItem?.label).toBe("보안");
		});
	});

	describe("subNavItems", () => {
		it("선택된 아이템의 하위 아이템을 반환해야 한다", () => {
			// Given
			navigationStore.setCurrentPath("/members/list");

			// When
			const subNavItems = navigationStore.subNavItems;

			// Then
			expect(subNavItems).toHaveLength(2);
			expect(subNavItems[0].id).toBe("member-list");
		});

		it("선택된 아이템이 없으면 빈 배열을 반환해야 한다", () => {
			expect(navigationStore.subNavItems).toHaveLength(0);
		});
	});

	describe("navigateTo", () => {
		it("직접 경로로 이동해야 한다", () => {
			// When
			navigationStore.navigateTo("/custom/path");

			// Then
			expect(mockNavigate).toHaveBeenCalledWith("/custom/path");
		});
	});
});
