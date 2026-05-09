import { createElement, type ReactNode } from "react";
import {
	Pressable,
	Text,
	View,
	type PressableProps,
	type ViewProps,
} from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";

export type BookingAvailabilityStatus =
	| "AVAILABLE"
	| "FEW_LEFT"
	| "WAITLIST_OPEN"
	| "RESERVED"
	| "WAITLISTED"
	| "BOOKING_CLOSED";

export interface BookingClassFeedItem {
	availableCount?: number;
	capacity?: number;
	coachName?: ReactNode;
	confirmedCount?: number;
	ctaLabel?: ReactNode;
	id: string;
	level?: ReactNode;
	myReservationStatus?: ReactNode;
	previewExerciseTags?: readonly ReactNode[];
	programName: ReactNode;
	routineLabel?: ReactNode;
	sessionName?: ReactNode;
	status: BookingAvailabilityStatus;
	statusLabel?: ReactNode;
	timeLabel: ReactNode;
	timelineName?: ReactNode;
	waitlistCount?: number;
}

export interface BookingClassCardProps extends Omit<ViewProps, "children"> {
	item: BookingClassFeedItem;
	onPressCta?: (item: BookingClassFeedItem) => void;
}

const STATUS_LABELS: Record<BookingAvailabilityStatus, string> = {
	AVAILABLE: "Available",
	BOOKING_CLOSED: "Closed",
	FEW_LEFT: "Few left",
	RESERVED: "Reserved",
	WAITLISTED: "Waitlisted",
	WAITLIST_OPEN: "Waitlist open",
};

const DEFAULT_CTA_LABELS: Record<BookingAvailabilityStatus, string> = {
	AVAILABLE: "Book",
	BOOKING_CLOSED: "Closed",
	FEW_LEFT: "Book",
	RESERVED: "Reserved",
	WAITLISTED: "Waitlisted",
	WAITLIST_OPEN: "Join waitlist",
};

const isActionDisabled = (item: BookingClassFeedItem, onPressCta?: unknown) =>
	!onPressCta ||
	item.status === "BOOKING_CLOSED" ||
	item.status === "RESERVED" ||
	item.status === "WAITLISTED";

const renderOptionalText = (
	value: ReactNode,
	key: string,
	className: string,
) => {
	if (value === undefined || value === null || value === false) {
		return null;
	}

	return createElement(Text, { className, key }, value);
};

const renderCapacity = (item: BookingClassFeedItem) => {
	const parts = [
		item.capacity === undefined ? undefined : `Capacity ${item.capacity}`,
		item.confirmedCount === undefined ? undefined : `Confirmed ${item.confirmedCount}`,
		item.availableCount === undefined ? undefined : `Available ${item.availableCount}`,
		item.waitlistCount === undefined ? undefined : `Waitlist ${item.waitlistCount}`,
	].filter(Boolean);

	if (!parts.length) {
		return null;
	}

	return createElement(
		Text,
		{ className: classNames.capacityText() },
		parts.join(" / "),
	);
};

const renderTag = (tag: ReactNode, index: number) =>
	createElement(
		View,
		{
			key: `exercise-tag-${index}`,
			className: classNames.tag(),
		},
		createElement(Text, { className: classNames.tagText() }, tag),
	);

const renderTags = (item: BookingClassFeedItem) => {
	if (!item.previewExerciseTags?.length) {
		return null;
	}

	return createElement(
		View,
		{ className: classNames.tags() },
		item.previewExerciseTags.map(renderTag),
	);
};

const renderMeta = (item: BookingClassFeedItem) => {
	const meta = [
		item.coachName
			? createElement(
					Text,
					{ className: classNames.metaText() },
					"Coach ",
					item.coachName,
				)
			: undefined,
		item.level,
		item.routineLabel,
	].filter(Boolean);

	if (!meta.length) {
		return null;
	}

	return createElement(
		View,
		{ className: classNames.meta() },
		meta.map((value, index) =>
			createElement(
				Text,
					{
						key: `booking-class-meta-${index}`,
						className: classNames.metaText(),
					},
					value,
				),
		),
	);
};

const createPressHandler = (
	item: BookingClassFeedItem,
	onPressCta: BookingClassCardProps["onPressCta"],
) => {
	if (isActionDisabled(item, onPressCta)) {
		return undefined;
	}

	return () => {
		onPressCta?.(item);
	};
};

const BookingClassCardComponent = observer((props: BookingClassCardProps) => {
	const { item, onPressCta, style, ...rest } = props;
	const ctaLabel = item.ctaLabel ?? DEFAULT_CTA_LABELS[item.status];
	const disabled = isActionDisabled(item, onPressCta);
	const slotClassNames = bookingClassCardClassNames({
		disabled,
		status: item.status,
	});

	return createElement(
		View,
		{
			...rest,
			className: slotClassNames.root(),
			style,
		},
		createElement(View, { className: slotClassNames.header() }, [
			createElement(View, { className: slotClassNames.timeBlock(), key: "time" }, [
				createElement(
					Text,
					{ className: slotClassNames.time(), key: "time-label" },
					item.timeLabel,
				),
				createElement(
					View,
					{
						className: slotClassNames.statusBadge(),
						key: "status",
					},
					createElement(
						Text,
						{ className: slotClassNames.statusText() },
						item.statusLabel ?? STATUS_LABELS[item.status],
					),
				),
			]),
			createElement(View, { className: slotClassNames.titleBlock(), key: "titles" }, [
				createElement(
					Text,
					{ className: slotClassNames.program(), key: "program" },
					item.programName,
				),
				renderOptionalText(item.sessionName, "session", slotClassNames.session()),
				renderOptionalText(item.timelineName, "timeline", slotClassNames.timeline()),
			]),
		]),
		renderMeta(item),
		renderCapacity(item),
		renderTags(item),
		item.myReservationStatus
			? createElement(
					Text,
					{ className: slotClassNames.myStatus() },
					item.myReservationStatus,
				)
			: null,
		createElement(
			Pressable,
			{
				accessibilityLabel:
					typeof ctaLabel === "string" ? ctaLabel : `Action for ${item.id}`,
				accessibilityRole: "button",
				accessibilityState: {
					disabled,
				},
				disabled,
				onPress: createPressHandler(item, onPressCta) as PressableProps["onPress"],
				className: slotClassNames.action(),
			},
			createElement(
				Text,
				{ className: slotClassNames.actionText() },
				ctaLabel,
			),
		),
	);
});

BookingClassCardComponent.displayName = "BookingClassCard";

export const BookingClassCard = BookingClassCardComponent;

const bookingClassCardClassNames = tv({
	slots: {
		action:
			"min-h-[46px] items-center justify-center rounded-xl bg-[#9ad66d] px-4 py-3",
		actionText:
			"text-[15px] font-extrabold leading-5 text-[#10200d]",
		capacityText: "text-[13px] leading-[18px] text-[#dbe5d7]",
		header: "flex-row items-start gap-[14px]",
		meta: "flex-row flex-wrap gap-2",
		metaText: "text-[13px] leading-[18px] text-[#c5cec4]",
		myStatus: "text-[13px] font-bold leading-[18px] text-[#9ad66d]",
		program: "text-[17px] font-extrabold leading-[23px] text-[#f5f8f1]",
		root: "gap-3 rounded-[14px] border border-[#2b342c] bg-[#151915] p-4",
		session: "text-sm font-bold leading-5 text-[#dbe5d7]",
		statusBadge:
			"items-center self-start rounded-full bg-[#263026] px-[9px] py-[5px]",
		statusText: "text-[11px] font-extrabold leading-[14px] text-[#f5f8f1]",
		tag: "rounded-full bg-[#263026] px-2.5 py-[5px]",
		tagText: "text-xs font-bold leading-4 text-[#dbe5d7]",
		tags: "flex-row flex-wrap gap-2",
		time: "text-lg font-black leading-6 text-[#f5f8f1]",
		timeBlock: "min-w-[88px] gap-2",
		timeline: "text-[13px] leading-[18px] text-[#aeb7ac]",
		titleBlock: "flex-1 gap-1",
	},
	variants: {
		disabled: {
			false: {},
			true: {
				action: "bg-[#263026] opacity-75",
				actionText: "text-[#f5f8f1]",
			},
		},
		status: {
			AVAILABLE: {},
			BOOKING_CLOSED: {
				statusBadge: "bg-gray-700",
			},
			FEW_LEFT: {
				statusBadge: "bg-[#6b5d1f]",
			},
			RESERVED: {
				statusBadge: "bg-[#386626]",
			},
			WAITLISTED: {
				statusBadge: "bg-[#386626]",
			},
			WAITLIST_OPEN: {
				statusBadge: "bg-[#2f5f98]",
			},
		},
	},
});

const classNames = bookingClassCardClassNames();
