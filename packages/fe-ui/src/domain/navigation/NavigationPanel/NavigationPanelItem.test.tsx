import { NavItem } from "@cocrepo/store";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NavigationPanelItem } from "./NavigationPanelItem";

const dashboardItem = new NavItem({
	id: "dashboard",
	label: "대시보드",
	path: "/dashboard",
	icon: "LayoutDashboard",
	subject: "Dashboard",
});

describe("NavigationPanelItem", () => {
	it("Given a selected item When rendered Then it uses the restrained accent palette", () => {
		render(
			<NavigationPanelItem
				item={dashboardItem}
				isSelected
				isActiveBranch={false}
				isExpanded={false}
				selectedSubItemId={null}
				onNavItemClick={vi.fn()}
				onSubNavItemClick={vi.fn()}
				onToggle={vi.fn()}
				density="compact"
				descriptionVisibility="active"
				getItemDescription={() => "운영 상태를 확인합니다."}
			/>,
		);

		const itemButton = screen.getByRole("button", { name: /대시보드/ });

		expect(itemButton).toHaveAttribute("aria-current", "page");
		expect(itemButton).toHaveClass(
			"bg-accent-soft",
			"text-accent-soft-foreground",
			"shadow-none",
		);
		expect(screen.getByText("운영 상태를 확인합니다.")).toHaveClass(
			"text-accent-soft-foreground/70",
		);
	});

	it("Given a leaf item When clicked Then it delegates selection", () => {
		const onNavItemClick = vi.fn();

		render(
			<NavigationPanelItem
				item={dashboardItem}
				isSelected={false}
				isActiveBranch={false}
				isExpanded={false}
				selectedSubItemId={null}
				onNavItemClick={onNavItemClick}
				onSubNavItemClick={vi.fn()}
				onToggle={vi.fn()}
				density="compact"
				descriptionVisibility="hidden"
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "대시보드" }));

		expect(onNavItemClick).toHaveBeenCalledWith("dashboard");
	});
});
