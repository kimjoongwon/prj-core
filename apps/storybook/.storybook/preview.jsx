import "../tailwind.css";
import { AppProviders, UIProviders } from "@shared/frontend";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  decorators: [
    (Story, { title, parameters }) => {
      // 페이지 폴더의 스토리들에만 AppProviders 적용
      if (title?.startsWith("페이지/") || parameters?.pageProvider) {
        return (
          <AppProviders>
            <Story />
          </AppProviders>
        );
      }

      // 빌더 컴포넌트들에는 AppProviders 적용
      if (title?.startsWith("빌더 컴포넌트/")) {
        return (
          <AppProviders>
            <Story />
          </AppProviders>
        );
      }

      // 일반 컴포넌트는 UIProviders만 적용
      return (
        <UIProviders>
          <Story />
        </UIProviders>
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
