import type { Meta, StoryObj } from "@storybook/react";
import { Message } from "./Message";

const meta = {
  title: "UI/Message",
  component: Message,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A message component for displaying alerts and notifications with title and message content. Uses blue styling for informational messages.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The title of the message",
    },
    message: {
      control: "text",
      description: "The main message content",
    },
  },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Information",
    message: "This is an informational message.",
  },
  parameters: {
    docs: {
      description: {
        story: "Default message with title and content.",
      },
    },
  },
};

export const ShortMessage: Story = {
  args: {
    title: "Notice",
    message: "Short message.",
  },
  parameters: {
    docs: {
      description: {
        story: "Message with short content.",
      },
    },
  },
};

export const LongMessage: Story = {
  args: {
    title: "Important Update",
    message: "This is a longer message that contains more detailed information about an important update or notification that users need to be aware of. It demonstrates how the message component handles longer text content.",
  },
  parameters: {
    docs: {
      description: {
        story: "Message with longer content demonstrating text wrapping.",
      },
    },
  },
};

export const SystemMessages: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Message 
        title="System Maintenance" 
        message="Scheduled maintenance will occur tonight from 12:00 AM to 2:00 AM EST." 
      />
      <Message 
        title="New Feature Available" 
        message="Dark mode is now available in your account settings." 
      />
      <Message 
        title="Backup Completed" 
        message="Your data backup has been successfully completed." 
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Multiple system messages demonstrating different use cases.",
      },
    },
  },
};

export const WelcomeMessage: Story = {
  args: {
    title: "Welcome!",
    message: "Thank you for joining our platform. Get started by exploring the dashboard and setting up your profile.",
  },
  parameters: {
    docs: {
      description: {
        story: "Welcome message for new users.",
      },
    },
  },
};

export const UpdateNotification: Story = {
  args: {
    title: "Update Available",
    message: "Version 2.1.0 is now available with new features and bug fixes. Update now to get the latest improvements.",
  },
  parameters: {
    docs: {
      description: {
        story: "Software update notification message.",
      },
    },
  },
};

export const InformationalBanner: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Message 
        title="COVID-19 Update" 
        message="We continue to follow all health and safety guidelines. Our services remain available with enhanced safety measures in place." 
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Wide informational banner message for important announcements.",
      },
    },
  },
};

export const QuickTips: Story = {
  render: () => (
    <div className="space-y-3 max-w-lg">
      <Message 
        title="Tip #1" 
        message="Use keyboard shortcuts Ctrl+S to save your work quickly." 
      />
      <Message 
        title="Tip #2" 
        message="Click the star icon to bookmark your favorite items." 
      />
      <Message 
        title="Tip #3" 
        message="Use the search bar to quickly find what you're looking for." 
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Series of helpful tip messages for users.",
      },
    },
  },
};

export const StatusUpdates: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Message 
        title="Processing Complete" 
        message="Your file has been successfully processed and is ready for download." 
      />
      <Message 
        title="Sync in Progress" 
        message="Synchronizing your data with the cloud. This may take a few minutes." 
      />
      <Message 
        title="Connection Restored" 
        message="Internet connection has been restored. All features are now available." 
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Status update messages for different system states.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    title: "Playground Message",
    message: "This is a playground message for testing different configurations.",
  },
  parameters: {
    docs: {
      description: {
        story: "Playground for testing different message configurations.",
      },
    },
  },
};