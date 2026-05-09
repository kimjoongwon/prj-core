import { createElement, type ReactNode } from "react";
import {
	Pressable,
	ScrollView,
	Text,
	View,
	type PressableProps,
	type ViewProps,
} from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
import {
	BookingClassCard,
	type BookingClassFeedItem,
} from "../../data-display/BookingClassCard";
import { BookingPolicySheet } from "../../feedback/BookingPolicySheet";
import { StatusFeedback } from "../../feedback/StatusFeedback";
import { ScreenFrame } from "../../layout/ScreenFrame";
import { DateStrip, type DateStripOption } from "../../selection/DateStrip";

export type ReservationHomeFilterValue =
	| "all"
	| "bookable"
	| "mine"
	| "waitlist";

export type ReservationHomeFeedStatus = "loading" | "error" | "empty" | "ready";

export interface ReservationHomeFilterOption {
	label: ReactNode;
	value: ReservationHomeFilterValue;
}

export interface ReservationHomePolicySheet {
	confirmLabel?: ReactNode;
	isLoading?: boolean;
	isOpen: boolean;
	item?: BookingClassFeedItem | null;
	memoValue?: string;
	onCancel?: () => void;
	onChangeMemo?: (value: string) => void;
	onConfirm?: (item: BookingClassFeedItem, memo: string) => void;
}

export interface ReservationHomeScreenProps extends Omit<ViewProps, "children"> {
	bookingWindowDays: number;
	cardItems: readonly BookingClassFeedItem[];
	dateOptions: readonly DateStripOption[];
	feedErrorDescription?: ReactNode;
	feedStatus: ReservationHomeFeedStatus;
	filterOptions: readonly ReservationHomeFilterOption[];
	isFetching?: boolean;
	onPressBookingCta?: (item: BookingClassFeedItem) => void;
	onPressFilter?: (value: ReservationHomeFilterValue) => void;
	onPressRetry?: () => void;
	onSelectDate?: (value: string, option: DateStripOption) => void;
	policySheet: ReservationHomePolicySheet;
	reservationErrorDescription?: ReactNode;
	reservationSuccessDescription?: ReactNode;
	reservedCount: number;
	selectedDate: string;
	selectedDateLabel?: ReactNode;
	selectedFilter: ReservationHomeFilterValue;
}

const createFilterPressHandler = (
	option: ReservationHomeFilterOption,
	onPressFilter: ReservationHomeScreenProps["onPressFilter"],
) => {
	if (!onPressFilter) {
		return undefined;
	}

	return () => {
		onPressFilter(option.value);
	};
};

const renderFilterChip = (
	option: ReservationHomeFilterOption,
	props: Pick<ReservationHomeScreenProps, "onPressFilter" | "selectedFilter">,
) => {
	const isSelected = option.value === props.selectedFilter;
	const filterClassNames = reservationHomeScreenClassNames({
		selected: isSelected,
	});

	return createElement(
		Pressable,
		{
			accessibilityLabel: `filter-${option.value}`,
			accessibilityRole: "button",
			accessibilityState: { selected: isSelected },
			key: option.value,
			onPress: createFilterPressHandler(
				option,
				props.onPressFilter,
			) as PressableProps["onPress"],
			className: filterClassNames.filterChip(),
		},
		createElement(
			Text,
			{
				className: filterClassNames.filterChipText(),
			},
			option.label,
		),
	);
};

const renderFilterChips = (props: ReservationHomeScreenProps) =>
	props.filterOptions.map((option) => renderFilterChip(option, props));

const renderBookingClassCard = (
	item: BookingClassFeedItem,
	onPressBookingCta: ReservationHomeScreenProps["onPressBookingCta"],
) =>
	createElement(BookingClassCard, {
		item,
		key: item.id,
		onPressCta: onPressBookingCta,
	});

const renderBookingClassCards = (props: ReservationHomeScreenProps) =>
	props.cardItems.map((item) =>
		renderBookingClassCard(item, props.onPressBookingCta),
	);

const renderFeedContent = (props: ReservationHomeScreenProps) => {
	if (props.feedStatus === "loading") {
		return createElement(StatusFeedback, {
			description: "예약 가능한 클래스와 내 예약 상태를 확인하고 있습니다.",
			key: "feed-loading",
			status: "loading",
			title: "수업 피드를 불러오는 중",
		});
	}

	if (props.feedStatus === "error") {
		return createElement(StatusFeedback, {
			description: props.feedErrorDescription,
			key: "feed-error",
			onPressPrimaryAction: props.onPressRetry,
			primaryActionLabel: "다시 시도",
			status: "error",
			title: "예약 피드를 확인할 수 없습니다",
		});
	}

	if (props.feedStatus === "empty") {
		return createElement(StatusFeedback, {
			description: "다른 날짜나 필터를 선택해 예약 가능한 수업을 확인해 주세요.",
			key: "feed-empty",
			onPressPrimaryAction: props.onPressRetry,
			primaryActionLabel: "피드 새로고침",
			status: "empty",
			title: "표시할 수업이 없습니다",
		});
	}

	return renderBookingClassCards(props);
};

const renderReservationSuccess = (description: ReactNode) => {
	if (!description) {
		return null;
	}

	return createElement(StatusFeedback, {
		description,
		key: "reservation-success",
		status: "success",
		title: "예약 요청 완료",
	});
};

const renderReservationError = (description: ReactNode) => {
	if (!description) {
		return null;
	}

	return createElement(StatusFeedback, {
		description,
		key: "reservation-error",
		status: "error",
		title: "예약 요청에 실패했습니다",
	});
};

const renderPolicySheet = (policySheet: ReservationHomePolicySheet) => {
	if (!policySheet.isOpen) {
		return null;
	}

	return createElement(BookingPolicySheet, {
		cancelLabel: "닫기",
		cancellationPolicy:
			"확정 예약은 시작 2시간 전까지, 대기 예약은 시작 전까지 취소할 수 있습니다.",
		confirmLabel: policySheet.confirmLabel,
		isLoading: policySheet.isLoading,
		item: policySheet.item,
		key: "policy-sheet",
		memoLabel: "요청 메모",
		memoPlaceholder: "코치에게 전달할 메모를 입력하세요",
		memoValue: policySheet.memoValue,
		onCancel: policySheet.onCancel,
		onChangeMemo: policySheet.onChangeMemo,
		onConfirm: policySheet.onConfirm,
		title: "예약 정책 확인",
	});
};

export const ReservationHomeScreen = observer(
	(props: ReservationHomeScreenProps) => {
		const {
			bookingWindowDays,
			cardItems: _cardItems,
			dateOptions,
			feedErrorDescription: _feedErrorDescription,
			feedStatus: _feedStatus,
			filterOptions: _filterOptions,
			isFetching = false,
			onPressBookingCta: _onPressBookingCta,
			onPressFilter: _onPressFilter,
			onPressRetry: _onPressRetry,
			onSelectDate,
			policySheet,
			reservationErrorDescription,
			reservationSuccessDescription,
			reservedCount,
			selectedDate,
			selectedDateLabel,
			selectedFilter: _selectedFilter,
			style,
			...viewProps
		} = props;

		return createElement(
			ScreenFrame,
			{
				...viewProps,
				className: classNames.screenFrame(),
				contentClassName: classNames.root(),
				edges: ["top", "right", "left"],
				style,
			},
			createElement(
				ScrollView,
				{
					contentContainerClassName: classNames.contentContainer(),
					showsVerticalScrollIndicator: false,
				},
				createElement(View, { className: classNames.tabContent() }, [
					createElement(View, { className: classNames.hero(), key: "hero" }, [
						createElement(
							Text,
							{ className: classNames.eyebrow(), key: "eyebrow" },
							"ONORA BOOKING",
						),
						createElement(
							Text,
							{ className: classNames.heroTitle(), key: "title" },
							"오늘의 수업",
						),
						createElement(
							Text,
							{ className: classNames.heroDescription(), key: "description" },
							"지점의 예약 가능한 클래스와 내 예약 상태를 날짜별로 확인합니다.",
						),
						createElement(View, { className: classNames.summaryGrid(), key: "summary" }, [
							createElement(View, { className: classNames.summaryCard(), key: "window" }, [
								createElement(
									Text,
									{ className: classNames.summaryLabel(), key: "label" },
									"조회 기간",
								),
								createElement(
									Text,
									{ className: classNames.summaryValue(), key: "value" },
									bookingWindowDays,
									"일",
								),
							]),
							createElement(View, { className: classNames.summaryCard(), key: "reserved" }, [
								createElement(
									Text,
									{ className: classNames.summaryLabel(), key: "label" },
									"내 예약",
								),
								createElement(
									Text,
									{ className: classNames.summaryValue(), key: "value" },
									reservedCount,
								),
							]),
						]),
					]),
					createElement(View, { className: classNames.section(), key: "dates" }, [
						createElement(View, { className: classNames.sectionHeader(), key: "header" }, [
							createElement(
								Text,
								{ className: classNames.sectionTitle(), key: "title" },
								"날짜",
							),
							createElement(
								Text,
								{ className: classNames.sectionDescription(), key: "description" },
								"클래스를 볼 날짜를 선택하세요.",
							),
						]),
						createElement(DateStrip, {
							key: "strip",
							onSelect: onSelectDate,
							options: dateOptions,
							selectedValue: selectedDate,
						}),
					]),
					createElement(View, { className: classNames.section(), key: "feed" }, [
						createElement(
							View,
							{ className: classNames.filterRow(), key: "filters" },
							renderFilterChips(props),
						),
						isFetching
							? createElement(
									Text,
									{ className: classNames.sessionLabel(), key: "fetching" },
									"최신 예약 상태를 확인 중입니다.",
								)
							: null,
						renderFeedContent(props),
					]),
					renderReservationSuccess(reservationSuccessDescription),
					renderPolicySheet(policySheet),
					renderReservationError(reservationErrorDescription),
					selectedDateLabel
						? createElement(
								Text,
								{ className: classNames.sectionDescription(), key: "selected-date" },
								"선택 날짜: ",
								selectedDateLabel,
							)
						: null,
				]),
			),
		);
	},
);

ReservationHomeScreen.displayName = "ReservationHomeScreen";

const reservationHomeScreenClassNames = tv({
	slots: {
		contentContainer: "px-5 pb-9 pt-5",
		eyebrow: "text-sm font-bold text-amber-500",
		filterChip:
			"rounded-full border border-[#2e382f] bg-[#151a16] px-[14px] py-[9px]",
		filterChipText: "text-[13px] font-extrabold text-[#d6d3c7]",
		filterRow: "flex-row flex-wrap gap-2",
		hero: "gap-2.5 rounded-[20px] border border-[#353126] bg-[#181712] p-5",
		heroDescription: "text-[15px] leading-[22px] text-[#d6d3c7]",
		heroTitle: "text-[28px] font-extrabold leading-[34px] text-[#fffaf0]",
		root: "flex-1 bg-[#0c0f0b]",
		screenFrame: "bg-[#0c0f0b]",
		section: "gap-3",
		sectionDescription: "text-sm leading-[21px] text-stone-400",
		sectionHeader: "gap-1.5",
		sectionTitle: "text-[22px] font-extrabold text-[#fffaf0]",
		sessionLabel: "text-sm text-stone-400",
		summaryCard:
			"flex-1 gap-1 rounded-2xl border border-[#2e382f] bg-[#151a16] p-4",
		summaryGrid: "flex-row gap-3",
		summaryLabel: "text-[13px] text-stone-400",
		summaryValue: "text-[26px] font-extrabold text-[#fffaf0]",
		tabContent: "gap-[18px]",
	},
	variants: {
		selected: {
			false: {},
			true: {
				filterChip: "border-[#9ad66d] bg-[#9ad66d]",
				filterChipText: "text-[#10200d]",
			},
		},
	},
	defaultVariants: {
		selected: false,
	},
});

const classNames = reservationHomeScreenClassNames();
