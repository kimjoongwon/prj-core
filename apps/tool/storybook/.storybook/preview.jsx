import "../tailwind.css";
import { withStorybookRuntime } from "../src/runtime/StorybookRuntimeProvider";

/** @type { import('@storybook/nextjs-vite').Preview } */
const preview = {
  globalTypes: {
    storybookRealm: {
      name: "Runtime",
      description: "Override the Storybook runtime realm for stories without a storybookRuntime realm.",
      toolbar: {
        icon: "globe",
        dynamicTitle: true,
        items: [
          { value: "auto", title: "Runtime: Auto" },
          { value: "admin", title: "Runtime: Admin" },
          { value: "idp", title: "Runtime: IDP" },
          { value: "none", title: "Runtime: None" },
        ],
      },
    },
    storybookTheme: {
      name: "Theme",
      description: "Preview stories with the app light or dark theme.",
      toolbar: {
        icon: "circlehollow",
        dynamicTitle: true,
        items: [
          { value: "system", title: "Theme: System" },
          { value: "dark", title: "Theme: Dark" },
          { value: "light", title: "Theme: Light" },
        ],
      },
    },
  },
  initialGlobals: {
    storybookRealm: "auto",
    storybookTheme: "system",
  },
  decorators: [
    withStorybookRuntime,
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    options: {
      storySort: {
        method: "alphabetical",
        includeNames: true,
	        order: ["cell", "control", "detail", "display", "feature", "form", "layout", "master", "page", "rhythm", "surface", "widget", "widget-heavy", "Auto"],
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
    storybookRuntime: {
      requiresSpace: false,
    },
  },
};

export default preview;
