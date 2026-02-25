import "../tailwind.css";
import { ToastProvider } from "@heroui/react";
import { NuqsAdapter } from "nuqs/adapters/react";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  decorators: [
    (Story) => {
      return (
        // @ts-expect-error - NuqsAdapter React 19 type compatibility issue
        <NuqsAdapter>
          <ToastProvider placement="bottom-center" />
          <Story />
        </NuqsAdapter>
      );
    },
  ],
  parameters: {
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
