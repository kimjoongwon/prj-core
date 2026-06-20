import { Circle, Line, Path, Rect } from "react-native-svg";
import { BrandedSvg } from "./shared";
import type { IconGlyphProps } from "./types";

export const ArrowRightGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Path d="M5 12h13" />
		<Path d="m13.5 6.5 5 5.5-5 5.5" />
	</BrandedSvg>
);

export const CalendarCheckGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Rect height="15" rx="3.2" width="16" x="4" y="5.5" />
		<Path d="M7.5 3.5v4" />
		<Path d="M16.5 3.5v4" />
		<Path d="M4.5 10h15" />
		<Path d="m8.2 15.5 2.2 2.1 4.9-5.1" />
	</BrandedSvg>
);

export const CalendarClockGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Rect height="15" rx="3.2" width="16" x="4" y="5.5" />
		<Path d="M7.5 3.5v4" />
		<Path d="M16.5 3.5v4" />
		<Path d="M4.5 10h15" />
		<Circle cx="12" cy="15.5" r="3.2" />
		<Path d="M12 13.9v1.8l1.4.9" />
	</BrandedSvg>
);

export const CalendarDaysGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Rect height="15" rx="3.2" width="16" x="4" y="5.5" />
		<Path d="M7.5 3.5v4" />
		<Path d="M16.5 3.5v4" />
		<Path d="M4.5 10h15" />
		<Line x1="8" x2="9.1" y1="14" y2="14" />
		<Line x1="11.5" x2="12.6" y1="14" y2="14" />
		<Line x1="15" x2="16.1" y1="14" y2="14" />
		<Line x1="8" x2="9.1" y1="17" y2="17" />
		<Line x1="11.5" x2="12.6" y1="17" y2="17" />
	</BrandedSvg>
);

export const CalendarRangeGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Rect height="15" rx="3.2" width="16" x="4" y="5.5" />
		<Path d="M7.5 3.5v4" />
		<Path d="M16.5 3.5v4" />
		<Path d="M4.5 10h15" />
		<Path d="M8 14h3.2" />
		<Path d="M13.2 17h3.2" />
		<Path d="M11.2 14c1.5 0 1.5 3 3 3" />
	</BrandedSvg>
);

export const ChevronLeftGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Path d="m14.5 5.5-6 6.5 6 6.5" />
	</BrandedSvg>
);

export const HouseGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Path d="M4.5 11.2 12 5l7.5 6.2" />
		<Path d="M6.4 10.6v7.1c0 1 .8 1.8 1.8 1.8h7.6c1 0 1.8-.8 1.8-1.8v-7.1" />
		<Path d="M10 19.5v-4.9c0-.6.5-1.1 1.1-1.1h1.8c.6 0 1.1.5 1.1 1.1v4.9" />
	</BrandedSvg>
);

export const UserRoundGlyph = (props: IconGlyphProps) => (
	<BrandedSvg {...props}>
		<Circle cx="12" cy="8" r="3.4" />
		<Path d="M5.5 20c.8-3.5 3.1-5.3 6.5-5.3s5.7 1.8 6.5 5.3" />
	</BrandedSvg>
);
