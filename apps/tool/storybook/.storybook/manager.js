import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

const storybookTheme = create({
	brandTitle: "온짓다",
});

addons.setConfig({
	theme: storybookTheme,
});
