import { InputStateInspectionProvider } from "@cocrepo/hook";
import { StorybookStatePreview } from "@cocrepo/mo-ui/storybook";
import type { Decorator } from "@storybook/react-native";
import { resolveMobileStorySource } from "./StorybookSourceCatalog";

export const withMobileStatePreview: Decorator = (Story, context) => (
	<InputStateInspectionProvider>
		<StorybookStatePreview source={resolveMobileStorySource(context.title)}>
			<Story />
		</StorybookStatePreview>
	</InputStateInspectionProvider>
);
