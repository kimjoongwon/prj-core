import { Circle, Line, Path, Rect } from "react-native-svg";
import { BrandedSvg } from "./shared";
import type { IconGlyphProps } from "./types";

export const ClockGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Circle cx="12" cy="12" r="8.2" />
		<Path d="M12 7.6v4.7l3.1 1.9" />
	</BrandedSvg>
);

export const HourglassGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Path d="M7 4.5h10" />
		<Path d="M7 19.5h10" />
		<Path d="M8 4.5v3.2c0 1.6.9 3 2.3 3.8L12 12.5l1.7-1c1.4-.8 2.3-2.2 2.3-3.8V4.5" />
		<Path d="M8 19.5v-3.2c0-1.6.9-3 2.3-3.8l1.7-1 1.7 1c1.4.8 2.3 2.2 2.3 3.8v3.2" />
	</BrandedSvg>
);

export const ListChecksGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Path d="m4.5 7.5 1.4 1.4 2.5-2.8" />
		<Path d="m4.5 14.5 1.4 1.4 2.5-2.8" />
		<Line x1="11" x2="19" y1="8" y2="8" />
		<Line x1="11" x2="19" y1="15" y2="15" />
	</BrandedSvg>
);

export const LockKeyholeGlyph = (props: IconGlyphProps) => {
	const color = props.color ?? "currentColor";
	return (
		<BrandedSvg {...props}>
			<Rect height="10" rx="2.7" width="13" x="5.5" y="10" />
			<Path d="M8 10V8.1c0-2.3 1.7-4.1 4-4.1s4 1.8 4 4.1V10" />
			<Circle cx="12" cy="14.3" fill={color} r=".8" stroke="none" />
			<Path d="M12 15.2v1.8" />
		</BrandedSvg>
	);
};

export const LogInGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Path d="M4.5 12h10" />
		<Path d="m10.5 7.3 4.5 4.7-4.5 4.7" />
		<Path d="M14 4.8h3c1.1 0 2 .9 2 2v10.4c0 1.1-.9 2-2 2h-3" />
	</BrandedSvg>
);

export const LogOutGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Path d="M9.8 12h9.7" />
		<Path d="m15.5 7.3 4.5 4.7-4.5 4.7" />
		<Path d="M10.2 19.2h-3c-1.1 0-2-.9-2-2V6.8c0-1.1.9-2 2-2h3" />
	</BrandedSvg>
);

export const MailGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Rect height="13" rx="3" width="17" x="3.5" y="5.5" />
		<Path d="m5.2 8 6.8 5 6.8-5" />
	</BrandedSvg>
);

export const MapPinGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Path d="M12 20.2s6-5.1 6-10.1A6 6 0 0 0 6 10.1c0 5 6 10.1 6 10.1Z" />
		<Circle cx="12" cy="10.2" r="2.2" />
	</BrandedSvg>
);

export const UsersGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Circle cx="9.3" cy="8.5" r="3" />
		<Path d="M3.8 19c.7-3.2 2.7-4.8 5.5-4.8 2.6 0 4.4 1.4 5.2 4.1" />
		<Path d="M15.4 6.2c1.8.3 3 1.7 3 3.4 0 1.6-1.1 3-2.7 3.4" />
		<Path d="M16.2 14.6c2.3.3 3.8 1.8 4.4 4.4" />
	</BrandedSvg>
);
