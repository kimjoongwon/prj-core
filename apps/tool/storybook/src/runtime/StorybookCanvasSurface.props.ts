import type { ReactNode } from "react";

export interface StorybookCanvasSurfaceProps {
	children: ReactNode;
	layout?: "centered" | "fullscreen" | "padded";
}
