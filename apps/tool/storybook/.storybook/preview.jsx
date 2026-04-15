import "../tailwind.css";
import { buildOverviewManifest } from "../src/overview/manifest";
import { PagePlanningDock } from "../src/planning/PagePlanningDock";
import { withStorybookRuntime } from "../src/runtime/StorybookRuntimeProvider";

const overviewManifest = buildOverviewManifest();

const withPagePlanningDock = (Story, context) => {
  const isPageStory = typeof context.title === "string" && context.title.startsWith("page/");
  const inlinePlanning = context.parameters?.pagePlanning?.inline ?? true;
  const codexEnabled = context.parameters?.pagePlanning?.codex?.enabled !== false;

  if (context.viewMode !== "story" || !isPageStory || !inlinePlanning) {
    return <Story />;
  }

  return (
    <PagePlanningDock
      codexEnabled={codexEnabled}
      manifest={overviewManifest}
      storyId={context.id ?? null}
    >
      <Story />
    </PagePlanningDock>
  );
};

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
  },
  initialGlobals: {
    storybookRealm: "auto",
  },
  decorators: [
    withStorybookRuntime,
    withPagePlanningDock,
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    options: {
      storySort: {
        method: "alphabetical",
        includeNames: true,
        order: ["overview", "cell", "control", "detail", "display", "feature", "form", "layout", "master", "page", "rhythm", "surface", "widget", "widget-heavy", "Auto"],
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
      requiresSpace: false,
    },
    pagePlanningManifest: overviewManifest,
  },
};

export default preview;
