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

export function getRhythmTailwindGapClass(value: RhythmScaleValue): string {
	return rhythmTailwindGapClasses[value];
}
