import type { ElevationLevel } from "./SurfaceElevation.type";

export const surfaceElevations = {
	flat: {
		background: "bg-background",
		shadow: "shadow-none",
		border: "",
	},
	raised: {
		background: "bg-surface",
		shadow: "shadow-sm",
		border: "",
	},
	elevated: {
		background: "bg-surface",
		shadow: "shadow-md",
		border: "border border-border",
	},
	floating: {
		background: "bg-surface-secondary",
		shadow: "shadow-lg",
		border: "",
	},
	overlay: {
		background: "bg-surface-secondary",
		shadow: "shadow-xl",
		border: "",
	},
} satisfies Record<
	ElevationLevel,
	{
		background: string;
		shadow: string;
		border: string;
	}
>;
