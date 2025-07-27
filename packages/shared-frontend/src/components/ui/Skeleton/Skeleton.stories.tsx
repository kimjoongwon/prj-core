import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";
import { useEffect, useState } from "react";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A skeleton loading component that displays placeholder content while data is being loaded. Based on NextUI Skeleton component.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isLoaded: {
      control: "boolean",
      description: "Whether the content is loaded",
      defaultValue: false,
    },
    children: {
      control: "text",
      description: "The content to display when loaded",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoaded: false,
    children: "Content loaded!",
    className: "w-48 h-12 rounded-lg",
  },
  parameters: {
    docs: {
      description: {
        story: "Default skeleton loading state.",
      },
    },
  },
};

export const Loaded: Story = {
  args: {
    isLoaded: true,
    children: "This content has finished loading!",
    className: "w-48 h-12 rounded-lg",
  },
  parameters: {
    docs: {
      description: {
        story: "Skeleton with content loaded.",
      },
    },
  },
};

export const TextSkeletons: Story = {
  render: () => (
    <div className="space-y-3 max-w-sm">
      <Skeleton isLoaded={false} className="w-3/4 h-4 rounded-lg" />
      <Skeleton isLoaded={false} className="w-full h-4 rounded-lg" />
      <Skeleton isLoaded={false} className="w-2/3 h-4 rounded-lg" />
      <Skeleton isLoaded={false} className="w-1/2 h-4 rounded-lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Multiple text line skeletons with different widths.",
      },
    },
  },
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="max-w-sm bg-white border rounded-lg shadow p-6 space-y-4">
      <Skeleton isLoaded={false} className="w-full h-32 rounded-lg" />
      <div className="space-y-2">
        <Skeleton isLoaded={false} className="w-3/4 h-6 rounded-lg" />
        <Skeleton isLoaded={false} className="w-full h-4 rounded-lg" />
        <Skeleton isLoaded={false} className="w-full h-4 rounded-lg" />
        <Skeleton isLoaded={false} className="w-2/3 h-4 rounded-lg" />
      </div>
      <div className="flex space-x-2">
        <Skeleton isLoaded={false} className="w-20 h-8 rounded-lg" />
        <Skeleton isLoaded={false} className="w-24 h-8 rounded-lg" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Card layout skeleton with image, text, and button placeholders.",
      },
    },
  },
};

export const ProfileSkeleton: Story = {
  render: () => (
    <div className="flex items-center space-x-4 p-4 bg-white border rounded-lg shadow max-w-md">
      <Skeleton isLoaded={false} className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton isLoaded={false} className="w-24 h-4 rounded-lg" />
        <Skeleton isLoaded={false} className="w-32 h-3 rounded-lg" />
      </div>
      <Skeleton isLoaded={false} className="w-16 h-6 rounded-lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Profile card skeleton with avatar, name, and status placeholders.",
      },
    },
  },
};

export const ListSkeleton: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
          <Skeleton isLoaded={false} className="w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton isLoaded={false} className="w-3/4 h-4 rounded-lg" />
            <Skeleton isLoaded={false} className="w-1/2 h-3 rounded-lg" />
          </div>
          <Skeleton isLoaded={false} className="w-12 h-6 rounded-lg" />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "List of skeleton items for loading states in lists.",
      },
    },
  },
};

export const LoadingStates: Story = {
  render: () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setIsLoaded(true), 2000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="max-w-sm bg-white border rounded-lg shadow p-6">
        <Skeleton isLoaded={isLoaded} className="w-full h-40 rounded-lg mb-4">
          <div className="w-full h-40 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg" />
        </Skeleton>

        <div className="space-y-2">
          <Skeleton isLoaded={isLoaded} className="w-3/4 h-6 rounded-lg">
            <h3 className="text-lg font-bold">Amazing Product Title</h3>
          </Skeleton>

          <Skeleton isLoaded={isLoaded} className="w-full h-4 rounded-lg">
            <p className="text-gray-600">
              This is a detailed product description that explains all the features.
            </p>
          </Skeleton>

          <Skeleton isLoaded={isLoaded} className="w-1/3 h-6 rounded-lg">
            <div className="text-xl font-bold text-blue-600">$99.99</div>
          </Skeleton>
        </div>

        <div className="mt-4">
          <Skeleton isLoaded={isLoaded} className="w-full h-10 rounded-lg">
            <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Add to Cart
            </button>
          </Skeleton>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive example showing skeleton loading state transitioning to actual content.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    isLoaded: false,
    children: "Playground content",
    className: "w-64 h-16 rounded-lg",
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different skeleton configurations.",
      },
    },
  },
};
