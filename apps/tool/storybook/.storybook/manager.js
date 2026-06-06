import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

const plateTheme = create({
  base: "dark",
  brandTitle: "PLATE",
  brandUrl: "",
  brandImage: null,
  brandTarget: "_self",
  colorPrimary: "#F2B236",
  colorSecondary: "#F2B236",
  appBg: "#0E1116",
  appContentBg: "#141925",
  appBorderColor: "#2A3247",
  appBorderRadius: 12,
  textColor: "#F4F7FF",
  textInverseColor: "#0E1116",
  barTextColor: "#97A3BD",
  barSelectedColor: "#F4F7FF",
  barHoverColor: "#F2B236",
  barBg: "#111724",
  inputBg: "#0E1116",
  inputBorder: "#2A3247",
  inputTextColor: "#F4F7FF",
  inputBorderRadius: 8,
  fontBase: "\"Space Grotesk\", \"Pretendard\", sans-serif",
  fontCode: "\"JetBrains Mono\", monospace"
});

addons.setConfig({
  theme: plateTheme,
  showAddonPanel: true,
  sidebar: {
    showRoots: true
  },
  panelPosition: "right",
  addonPanelInRight: true
});
