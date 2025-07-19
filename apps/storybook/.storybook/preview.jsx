import React from "react";
import "../tailwind.css";
import { HeroUIProvider } from "@heroui/react";
import heroui from "../hero.ts";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
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
  decorators: [
    (Story) => (
      <HeroUIProvider theme={heroui}>
        <Story />
      </HeroUIProvider>
    ),
  ],
};

export default preview;
