import React from "react";
import { AddonPanel } from "storybook/internal/components";
import { addons, types, useParameter, useStorybookState } from "storybook/manager-api";
import { PagePlanningPanelView } from "../src/planning/PagePlanningPanel";

const ADDON_ID = "plate/page-planning";
const PANEL_ID = `${ADDON_ID}/panel`;

function StoryPlanningPanel() {
	const { storyId } = useStorybookState();
	const overviewManifest = useParameter("pagePlanningManifest", null);
	const planningParameters = useParameter("pagePlanning", null);

	if (!overviewManifest) {
		return null;
	}

	return (
		<PagePlanningPanelView
			codexEnabled={planningParameters?.codex?.enabled !== false}
			manifest={overviewManifest}
			storyId={storyId ?? null}
		/>
	);
}

addons.register(ADDON_ID, () => {
	addons.add(PANEL_ID, {
		type: types.PANEL,
		title: "Planning",
		render: ({ active, key }) => (
			<AddonPanel active={active} key={key}>
				<StoryPlanningPanel />
			</AddonPanel>
		),
	});
});
