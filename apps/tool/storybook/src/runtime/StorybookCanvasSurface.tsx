import { observer } from "mobx-react-lite";
import type { StorybookCanvasSurfaceProps } from "./StorybookCanvasSurface.props";

export const StorybookCanvasSurface = observer(function StorybookCanvasSurface({
	children,
	layout = "padded",
}: StorybookCanvasSurfaceProps) {
	return (
		<div
			className={
				layout === "centered"
					? "flex min-h-screen w-full items-center justify-center bg-background text-foreground"
					: "min-h-screen w-full bg-background text-foreground"
			}
			data-storybook-canvas-surface=""
			data-storybook-layout={layout}
		>
			{children}
		</div>
	);
});
