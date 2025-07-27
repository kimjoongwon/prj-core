import type { Meta, StoryObj } from "@storybook/react";
import { NotFound } from "./NotFound";

const meta = {
  title: "UI/NotFound",
  component: NotFound,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A 404 Not Found page component with customizable content, navigation buttons, and icon. Handles navigation using React Router.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The main title text",
    },
    description: {
      control: "text",
      description: "The description text below the title",
    },
    homeButtonText: {
      control: "text",
      description: "Text for the home button",
    },
    backButtonText: {
      control: "text",
      description: "Text for the back button",
    },
    homePath: {
      control: "text",
      description: "Path to navigate to when home button is clicked",
    },
    icon: {
      description: "Custom icon to display instead of default 404",
    },
    actions: {
      description: "Custom action buttons to replace default buttons",
    },
  },
} satisfies Meta<typeof NotFound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Default 404 page with Korean text and standard navigation buttons.",
      },
    },
  },
};

export const English: Story = {
  args: {
    title: "Page Not Found",
    description: "The page you are looking for doesn't exist or has been moved.",
    homeButtonText: "Go Home",
    backButtonText: "Go Back",
  },
  parameters: {
    docs: {
      description: {
        story: "404 page with English text content.",
      },
    },
  },
};

export const WithCustomIcon: Story = {
  args: {
    title: "Oops! Something went wrong",
    description: "We couldn't find what you're looking for.",
    icon: (
      <div className="text-6xl text-blue-500 mb-4">
        🔍
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "404 page with custom emoji icon instead of 404 text.",
      },
    },
  },
};

export const WithCustomActions: Story = {
  args: {
    title: "Access Denied",
    description: "You don't have permission to access this resource.",
    actions: (
      <div className="flex flex-col gap-3 w-full">
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          Contact Support
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          View Documentation
        </button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "404 page with custom action buttons for different use cases.",
      },
    },
  },
};

export const Minimal: Story = {
  args: {
    title: "404",
    description: "Page not found",
    homeButtonText: "Home",
    backButtonText: "Back",
    icon: <div className="text-6xl text-gray-400">⚠️</div>,
  },
  parameters: {
    docs: {
      description: {
        story: "Minimal 404 page with short text and warning icon.",
      },
    },
  },
};

export const ServerError: Story = {
  args: {
    title: "500 - Server Error",
    description: "Something went wrong on our end. Please try again later or contact support if the problem persists.",
    homeButtonText: "Return Home",
    backButtonText: "Try Again",
    icon: (
      <div className="text-8xl text-red-400 font-bold">500</div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Error page configured for server errors (500) with appropriate messaging.",
      },
    },
  },
};

export const MaintenanceMode: Story = {
  args: {
    title: "Under Maintenance",
    description: "We're currently performing scheduled maintenance. Please check back in a few hours.",
    homeButtonText: "Check Status Page",
    backButtonText: "Notify Me",
    icon: (
      <div className="text-6xl text-yellow-500 mb-4">
        🔧
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Page configured for maintenance mode with appropriate messaging.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    title: "페이지를 찾을 수 없습니다",
    description: "요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.",
    homeButtonText: "홈으로 돌아가기",
    backButtonText: "이전 페이지",
    homePath: "/",
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different NotFound configurations.",
      },
    },
  },
};