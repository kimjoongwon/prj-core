import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useEffect, useState } from "react";
import {
	DEFAULT_DESIGN_SYSTEM_TAB,
	DESIGN_SYSTEM_TAB_QUERY_KEY,
	DesignSystemScreen,
	type DesignSystemTabId,
	isDesignSystemTabId,
} from "./DesignSystemScreen";

const getTabFromLocation = (): DesignSystemTabId => {
	if (typeof window === "undefined") {
		return DEFAULT_DESIGN_SYSTEM_TAB;
	}

	const nextTab = new URL(window.location.href).searchParams.get(
		DESIGN_SYSTEM_TAB_QUERY_KEY,
	);

	return isDesignSystemTabId(nextTab) ? nextTab : DEFAULT_DESIGN_SYSTEM_TAB;
};

const replaceTabQuery = (tabId: DesignSystemTabId) => {
	if (typeof window === "undefined") {
		return;
	}

	const nextUrl = new URL(window.location.href);
	nextUrl.searchParams.set(DESIGN_SYSTEM_TAB_QUERY_KEY, tabId);
	window.history.replaceState(window.history.state, "", nextUrl);
};

const QueryStringDesignSystemScreen = () => {
	const [activeTab, setActiveTab] = useState<DesignSystemTabId>(() =>
		getTabFromLocation(),
	);

	useEffect(() => {
		const handlePopState = () => {
			setActiveTab(getTabFromLocation());
		};

		window.addEventListener("popstate", handlePopState);

		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, []);

	const handleChangeTab = useCallback((tabId: DesignSystemTabId) => {
		setActiveTab(tabId);
		replaceTabQuery(tabId);
	}, []);

	return (
		<DesignSystemScreen activeTab={activeTab} onChangeTab={handleChangeTab} />
	);
};

const meta = {
	title: "DesignSystem/DesignSystemScreen",
	component: DesignSystemScreen,
	parameters: {
		layout: "fullscreen",
		storybookRuntime: {
			realm: "admin",
			requiresSpace: false,
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof DesignSystemScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <QueryStringDesignSystemScreen />,
};
