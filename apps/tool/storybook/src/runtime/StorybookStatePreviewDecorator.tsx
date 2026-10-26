import { InputStateInspectionProvider } from "@cocrepo/hook";
import { StorybookStatePreview } from "@cocrepo/ui/storybook";
import type { Decorator } from "@storybook/react";

export const withStorybookStatePreview: Decorator = (Story) => {
	return (
		<InputStateInspectionProvider>
			<StorybookStatePreview>
				<Story />
			</StorybookStatePreview>
		</InputStateInspectionProvider>
	);
};
