import { Circle, Path } from "react-native-svg";
import { BrandedSvg } from "./shared";
import type { IconGlyphProps } from "./types";

export const BadgeCheckGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Path d="M12 3.8 14.1 5l2.4-.1 1.1 2.1 2 1.3-.3 2.4.7 2.3-1.7 1.7-.7 2.3-2.3.7-1.7 1.7-2.3-.7-2.4.3-1.3-2-2.1-1.1.1-2.4L4.5 12l.8-2.3-.1-2.4 2.1-1.1 1.3-2 2.4.3L12 3.8Z" />
		<Path d="m8.6 12.3 2.2 2.1 4.7-4.8" />
	</BrandedSvg>
);

export const CircleAlertGlyph = (props: IconGlyphProps) => {
	const color = props.color ?? "currentColor";
	return (
		<BrandedSvg {...props}>
			<Circle cx="12" cy="12" r="8.2" />
			<Path d="M12 7.8v5.1" />
			<Circle cx="12" cy="16.4" fill={color} r=".8" stroke="none" />
		</BrandedSvg>
	);
};

export const CircleCheckGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Circle cx="12" cy="12" r="8.2" />
		<Path d="m8.4 12.3 2.3 2.3 4.9-5.2" />
	</BrandedSvg>
);

export const CircleDashedGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Circle cx="12" cy="12" r="8.2" strokeDasharray="2.4 3.6" />
	</BrandedSvg>
);

export const CircleGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Circle cx="12" cy="12" r="8.2" />
	</BrandedSvg>
);

export const CircleSlashGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Circle cx="12" cy="12" r="8.2" />
		<Path d="M6.2 17.8 17.8 6.2" />
	</BrandedSvg>
);

export const InfoGlyph = (props: IconGlyphProps) => {
	const color = props.color ?? "currentColor";
	return (
		<BrandedSvg {...props}>
			<Circle cx="12" cy="12" r="8.2" />
			<Path d="M12 11v5" />
			<Circle cx="12" cy="7.8" fill={color} r=".8" stroke="none" />
		</BrandedSvg>
	);
};

export const LoaderCircleGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Path d="M12 3.8a8.2 8.2 0 1 1-7.1 4.1" />
		<Path d="M4.5 4.9v3.3h3.3" />
	</BrandedSvg>
);

export const ShieldCheckGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Path d="M12 3.5 18.3 6v5.1c0 4-2.4 7-6.3 9.1-3.9-2.1-6.3-5.1-6.3-9.1V6L12 3.5Z" />
		<Path d="m8.8 12.1 2.1 2 4.2-4.4" />
	</BrandedSvg>
);

export const TriangleAlertGlyph = (props: IconGlyphProps) => {
	const color = props.color ?? "currentColor";
	return (
		<BrandedSvg {...props}>
			<Path d="M10.4 4.8 3.7 17c-.7 1.2.2 2.7 1.6 2.7h13.4c1.4 0 2.3-1.5 1.6-2.7L13.6 4.8c-.7-1.2-2.5-1.2-3.2 0Z" />
			<Path d="M12 9v4.5" />
			<Circle cx="12" cy="16.5" fill={color} r=".8" stroke="none" />
		</BrandedSvg>
	);
};
