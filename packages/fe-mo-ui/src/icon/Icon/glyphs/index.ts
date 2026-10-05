import type { ReactElement } from "react";
import {
	CreditCardGlyph,
	ReceiptGlyph,
	TicketCheckGlyph,
	WalletCardsGlyph,
} from "./commerce";
import {
	ArrowRightGlyph,
	CalendarCheckGlyph,
	CalendarClockGlyph,
	CalendarDaysGlyph,
	CalendarRangeGlyph,
	ChevronLeftGlyph,
	HouseGlyph,
	UserRoundGlyph,
} from "./navigation";
import {
	BadgeCheckGlyph,
	CircleAlertGlyph,
	CircleCheckGlyph,
	CircleDashedGlyph,
	CircleGlyph,
	CircleSlashGlyph,
	InfoGlyph,
	LoaderCircleGlyph,
	ShieldCheckGlyph,
	TriangleAlertGlyph,
} from "./status";
import {
	ClockGlyph,
	HourglassGlyph,
	ListChecksGlyph,
	LockKeyholeGlyph,
	LogInGlyph,
	LogOutGlyph,
	MailGlyph,
	MapPinGlyph,
	UsersGlyph,
} from "./system";
import type { IconGlyphProps } from "./types";

export type { IconGlyphProps };

export const mobileIcons = {
	arrowRight: ArrowRightGlyph,
	badgeCheck: BadgeCheckGlyph,
	calendarCheck: CalendarCheckGlyph,
	calendarClock: CalendarClockGlyph,
	calendarDays: CalendarDaysGlyph,
	calendarRange: CalendarRangeGlyph,
	chevronLeft: ChevronLeftGlyph,
	circle: CircleGlyph,
	circleAlert: CircleAlertGlyph,
	circleCheck: CircleCheckGlyph,
	circleDashed: CircleDashedGlyph,
	circleSlash: CircleSlashGlyph,
	clock: ClockGlyph,
	creditCard: CreditCardGlyph,
	hourglass: HourglassGlyph,
	house: HouseGlyph,
	info: InfoGlyph,
	listChecks: ListChecksGlyph,
	loaderCircle: LoaderCircleGlyph,
	lockKeyhole: LockKeyholeGlyph,
	logIn: LogInGlyph,
	logOut: LogOutGlyph,
	mail: MailGlyph,
	mapPin: MapPinGlyph,
	receipt: ReceiptGlyph,
	shieldCheck: ShieldCheckGlyph,
	ticketCheck: TicketCheckGlyph,
	triangleAlert: TriangleAlertGlyph,
	userRound: UserRoundGlyph,
	users: UsersGlyph,
	walletCards: WalletCardsGlyph,
} satisfies Record<string, (props: IconGlyphProps) => ReactElement>;
