import { observer } from "mobx-react-lite";
import type { StorybookCanvasSurfaceProps } from "./StorybookCanvasSurface.props";

export const StorybookCanvasSurface = observer(function StorybookCanvasSurface({
	children,
	layout = "padded",
	viewMode = "story",
}: StorybookCanvasSurfaceProps) {
	return (
		<div
			className={
				viewMode === "docs"
					? layout === "centered"
						? "inline-flex items-center justify-center bg-background text-foreground"
						: "bg-background text-foreground"
					: layout === "centered"
						? "flex min-h-screen w-full items-center justify-center bg-background text-foreground"
						: "min-h-screen w-full bg-background text-foreground"
			}
			data-storybook-canvas-surface=""
			data-storybook-layout={layout}
			data-storybook-view-mode={viewMode}
		>
			{children}
		</div>
	);
});
