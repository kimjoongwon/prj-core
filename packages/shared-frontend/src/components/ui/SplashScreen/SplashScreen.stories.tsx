import type { Meta, StoryObj } from "@storybook/react";
import { SplashScreen } from "./SplashScreen";

const meta = {
  title: "UI/SplashScreen",
  component: SplashScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A full-screen splash screen component with loading animation, progress indication, and decorative background elements. Typically used during app initialization.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Main title text displayed on the splash screen",
    },
    subtitle: {
      control: "text",
      description: "Subtitle text displayed below the title",
    },
    progress: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Progress percentage (0-100). If undefined, shows indeterminate progress",
    },
    showProgress: {
      control: "boolean",
      description: "Whether to show the progress bar",
    },
  },
} satisfies Meta<typeof SplashScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Default splash screen with Korean text and indeterminate progress.",
      },
    },
  },
};

export const WithProgress: Story = {
  args: {
    progress: 45,
  },
  parameters: {
    docs: {
      description: {
        story: "Splash screen with specific progress percentage.",
      },
    },
  },
};

export const English: Story = {
  args: {
    title: "Preparing the app",
    subtitle: "Please wait a moment...",
    progress: 25,
  },
  parameters: {
    docs: {
      description: {
        story: "Splash screen with English text content.",
      },
    },
  },
};

export const WithoutProgress: Story = {
  args: {
    title: "Welcome",
    subtitle: "Setting up your experience",
    showProgress: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Splash screen without progress bar.",
      },
    },
  },
};

export const CustomMessages: Story = {
  args: {
    title: "System Update",
    subtitle: "Installing the latest features and improvements",
    progress: 75,
  },
  parameters: {
    docs: {
      description: {
        story: "Splash screen with custom title and subtitle for updates.",
      },
    },
  },
};

export const NearCompletion: Story = {
  args: {
    title: "Almost Ready",
    subtitle: "Finalizing setup...",
    progress: 95,
  },
  parameters: {
    docs: {
      description: {
        story: "Splash screen showing near completion with high progress percentage.",
      },
    },
  },
};

export const Starting: Story = {
  args: {
    title: "Starting Up",
    subtitle: "Initializing application...",
    progress: 5,
  },
  parameters: {
    docs: {
      description: {
        story: "Splash screen at the beginning of loading process.",
      },
    },
  },
};

export const DataLoading: Story = {
  args: {
    title: "Loading Data",
    subtitle: "Fetching your personal content...",
    progress: 60,
  },
  parameters: {
    docs: {
      description: {
        story: "Splash screen customized for data loading scenarios.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    title: "앱을 준비하고 있습니다",
    subtitle: "잠시만 기다려주세요...",
    progress: 50,
    showProgress: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different splash screen configurations.",
      },
    },
  },
};