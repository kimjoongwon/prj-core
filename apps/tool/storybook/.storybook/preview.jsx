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
          <div style={{ position: "relative", minHeight: "100vh" }}>
            <div
              style={{
                position: "fixed",
                top: 12,
                right: 12,
                zIndex: 9999,
                pointerEvents: "none",
                borderRadius: 9999,
                border: "1px solid rgba(242, 178, 54, 0.45)",
                background: "rgba(14, 17, 22, 0.86)",
                color: "#F2B236",
                fontFamily: "\"Space Grotesk\", \"Pretendard\", sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "6px 10px",
              }}
            >
              Plate Proprietary
            </div>
            <Story />
          </div>
        </NuqsAdapter>
      );
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: ["Auto", "Inputs", "Ui", "Widget", "Feature", "Layouts", "Page", "Widgets"],
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
  },
};

export default preview;
