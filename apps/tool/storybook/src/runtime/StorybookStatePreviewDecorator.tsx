import { InputStateInspectionProvider } from "@cocrepo/hook";
import { StorybookStatePreview } from "@cocrepo/ui/storybook";
import type { Decorator } from "@storybook/react";
import { resolveStorySource } from "./StorybookSourceCatalog";

export const withStorybookStatePreview: Decorator = (Story, context) => {
	const source = resolveStorySource(context);

	return (
		<InputStateInspectionProvider>
			<StorybookStatePreview source={source}>
				<Story />
			</StorybookStatePreview>
		</InputStateInspectionProvider>
	);
};
