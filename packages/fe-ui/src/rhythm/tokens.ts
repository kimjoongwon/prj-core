export const rhythmScaleValues = [
	0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24,
] as const;

export type RhythmScaleValue = (typeof rhythmScaleValues)[number];

export const rhythmTailwindGapClasses = {
	0: "gap-0",
	1: "gap-1",
	2: "gap-2",
	3: "gap-3",
	4: "gap-4",
	5: "gap-5",
	6: "gap-6",
	8: "gap-8",
	10: "gap-10",
	12: "gap-12",
	16: "gap-16",
	20: "gap-20",
	24: "gap-24",
} as const satisfies Record<RhythmScaleValue, string>;

export const rhythmTailwindAxisClasses = {
	x: {
		0: "w-0",
		1: "w-1",
		2: "w-2",
		3: "w-3",
		4: "w-4",
		5: "w-5",
		6: "w-6",
		8: "w-8",
		10: "w-10",
		12: "w-12",
		16: "w-16",
		20: "w-20",
		24: "w-24",
	},
	y: {
		0: "h-0",
		1: "h-1",
		2: "h-2",
		3: "h-3",
		4: "h-4",
		5: "h-5",
		6: "h-6",
		8: "h-8",
		10: "h-10",
		12: "h-12",
		16: "h-16",
		20: "h-20",
		24: "h-24",
	},
} as const satisfies Record<"x" | "y", Record<RhythmScaleValue, string>>;

export const rhythmLegacyPixelGapClasses = {
	0: "gap-[0px]",
	1: "gap-[1px]",
	2: "gap-[2px]",
	3: "gap-[3px]",
	4: "gap-[4px]",
	5: "gap-[5px]",
	6: "gap-[6px]",
	8: "gap-[8px]",
	10: "gap-[10px]",
	12: "gap-[12px]",
	16: "gap-[16px]",
	20: "gap-[20px]",
	24: "gap-[24px]",
} as const satisfies Record<RhythmScaleValue, string>;

export function getRhythmTailwindGapClass(value: RhythmScaleValue): string {
	return rhythmTailwindGapClasses[value];
}

export function getRhythmTailwindAxisClass(
	axis: "x" | "y",
	value: RhythmScaleValue,
): string {
	return rhythmTailwindAxisClasses[axis][value];
}

export function getRhythmLegacyPixelGapClass(value: RhythmScaleValue): string {
	return rhythmLegacyPixelGapClasses[value];
}
