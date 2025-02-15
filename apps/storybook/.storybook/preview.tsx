import '../src/styles/globals.css';
import React from 'react';
import type { Preview } from '@storybook/react';
import { HeroUIProvider } from '@heroui/react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    Story => (
      <HeroUIProvider>
        <Story />
      </HeroUIProvider>
    ),
  ],
};

export default preview;
