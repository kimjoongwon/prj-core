import "../tailwind.css";
import { withStorybookRuntime } from "../src/runtime/StorybookRuntimeProvider";

/** @type { import('@storybook/nextjs-vite').Preview } */
const preview = {
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
    backgrounds: {
      default: "plate-dark",
      values: [
        { name: "plate-dark", value: "#0E1116" },
        { name: "plate-surface", value: "#141925" },
        { name: "plate-soft", value: "#1D2435" },
      ],
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
      realm: "none",
      requiresSpace: false,
    },
  },
};

export default preview;
