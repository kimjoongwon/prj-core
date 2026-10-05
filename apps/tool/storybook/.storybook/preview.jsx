import "../tailwind.css";
import { withStorybookMswLoader } from "../src/runtime/StorybookMswRuntime";
import { withStorybookPlanningPreview } from "../src/runtime/StorybookPlanningPreview";
import { withStorybookRuntime } from "../src/runtime/StorybookRuntimeProvider";

/** @type { import('@storybook/nextjs-vite').Preview } */
const preview = {
	loaders: [withStorybookMswLoader],
	decorators: [withStorybookPlanningPreview, withStorybookRuntime],
	parameters: {
		nextjs: {
			appDirectory: true,
		},
		options: {
			storySort: {
				method: "alphabetical",
				includeNames: true,
				order: [
					"design-system",
					"surface",
					"screen",
					"feature",
					"widget",
					"widget-heavy",
					"form",
					"layout",
					"rhythm",
					"action",
					"input",
					"data-grid",
					"data-display",
					"feedback",
					"overlay",
					"navigation",
					"selection",
					"cell",
					"columns",
					"Auto",
				],
			},
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},

		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: "todo",
		},
	},
};

export default preview;
