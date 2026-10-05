import { observer } from "mobx-react-lite";
import { type ReactNode } from "react";
import { ScrollView, View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";
import { Chip } from "../../data-display/Chip";
import { Typography } from "../../data-display/Typography";
import { BookingPolicySheet } from "../../feature/BookingPolicySheet";
import { StatusFeedback } from "../../feedback/StatusFeedback";
import { Icon } from "../../icon";
import {
	PureDateStrip as DateStrip,
	type DateStripOption,
} from "../../input/DateStrip";
import { ScreenFrame } from "../../layout/ScreenFrame";
import { HStack, VStack } from "../../rhythm";
import {
	BookingClassCard,
	type BookingClassFeedItem,
} from "../../widget/BookingClassCard";
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
export interface ReservationHomeScreenProps
	extends Omit<ViewProps, "children"> {
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
export const ReservationHomeScreen = observer(
	(props: ReservationHomeScreenProps) => {
		const {
			bookingWindowDays,
			cardItems,
			dateOptions,
			feedErrorDescription,
			feedStatus,
			filterOptions,
			isFetching = false,
			onPressBookingCta,
			onPressFilter,
			onPressRetry,
			onSelectDate,
			policySheet,
			reservationErrorDescription,
			reservationSuccessDescription,
			reservedCount,
			selectedDate,
			selectedDateLabel,
			selectedFilter,
			style,
			...viewProps
		} = props;
		const filterChipNodes: ReactNode[] = [];

		for (const option of filterOptions) {
			const isSelected = option.value === selectedFilter;

			filterChipNodes.push(
				<Chip
					accessibilityLabel={`filter-${option.value}`}
					accessibilityRole="button"
					accessibilityState={{
						selected: isSelected,
					}}
					className="min-h-11"
					color={isSelected ? "accent" : "default"}
					key={option.value}
					onPress={createFilterPressHandler(option, onPressFilter)}
					variant={isSelected ? "primary" : "soft"}
				>
					{option.label}
				</Chip>,
			);
		}

		const bookingClassCardNodes: ReactNode[] = [];

		for (const item of cardItems) {
			bookingClassCardNodes.push(
				<BookingClassCard
					item={item}
					key={item.id}
					onPressCta={onPressBookingCta}
				/>,
			);
		}

		let feedContent: ReactNode;

		if (feedStatus === "loading") {
			feedContent = (
				<StatusFeedback
					description="예약 가능한 클래스와 내 예약 상태를 확인하고 있습니다."
					key="feed-loading"
					status="loading"
					title="수업 피드를 불러오는 중"
				/>
			);
		} else if (feedStatus === "error") {
			feedContent = (
				<StatusFeedback
					description={feedErrorDescription}
					key="feed-error"
					onPressPrimaryAction={onPressRetry}
					primaryActionLabel="다시 시도"
					status="error"
					title="예약 피드를 확인할 수 없습니다"
				/>
			);
		} else if (feedStatus === "empty") {
			feedContent = (
				<StatusFeedback
					description="다른 날짜나 필터를 선택해 예약 가능한 수업을 확인해 주세요."
					key="feed-empty"
					onPressPrimaryAction={onPressRetry}
					primaryActionLabel="피드 새로고침"
					status="empty"
					title="표시할 수업이 없습니다"
				/>
			);
		} else {
			feedContent = bookingClassCardNodes;
		}

		return (
			<ScreenFrame
				{...viewProps}
				className={classNames.screenFrame()}
				contentClassName={classNames.root()}
				edges={["right", "left"]}
				style={style}
			>
				<ScrollView
					contentContainerClassName={classNames.contentContainer()}
					showsVerticalScrollIndicator={false}
				>
					<VStack gap="page">
						<VStack
							className={classNames.overview()}
							gap="section"
							key="overview"
						>
							<VStack gap="dense" key="header">
								<Typography className={classNames.eyebrow()} key="eyebrow" type="body-sm">
									예약 현황
								</Typography>
								<Typography
									className={classNames.overviewTitle()}
									key="title"
									type="body-sm"
								>
									{selectedDateLabel ?? "선택한 날짜"}
								</Typography>
							</VStack>
							<Typography
								className={classNames.overviewDescription()}
								key="description"
								type="body-sm"
							>
								예약 가능한 수업과 내 예약 상태를 한 화면에서 확인합니다.
							</Typography>
							<HStack
								className={classNames.summaryGrid()}
								gap="dense"
								key="summary"
							>
								<View className={classNames.summaryCard()} key="window">
									<HStack key="label">
										<Icon name="calendarRange" size="xs" tone="muted" />
										<Typography className={classNames.summaryLabel()} type="body-sm">
											조회 기간
										</Typography>
									</HStack>
									<Typography
										className={classNames.summaryValue()}
										key="value"
										type="body-sm"
									>
										{bookingWindowDays}일
									</Typography>
								</View>
								<View className={classNames.summaryCard()} key="reserved">
									<HStack key="label">
										<Icon name="ticketCheck" size="xs" tone="muted" />
										<Typography className={classNames.summaryLabel()} type="body-sm">
											내 예약
										</Typography>
									</HStack>
									<Typography
										className={classNames.summaryValue()}
										key="value"
										type="body-sm"
									>
										{reservedCount}
									</Typography>
								</View>
								<View className={classNames.summaryCard()} key="visible">
									<HStack key="label">
										<Icon name="listChecks" size="xs" tone="muted" />
										<Typography className={classNames.summaryLabel()} type="body-sm">
											표시 수업
										</Typography>
									</HStack>
									<Typography
										className={classNames.summaryValue()}
										key="value"
										type="body-sm"
									>
										{cardItems.length}개
									</Typography>
								</View>
							</HStack>
						</VStack>
						<VStack gap="block" key="dates">
							<VStack gap="dense" key="header">
								<Typography
									className={classNames.sectionTitle()}
									key="title"
									type="body-sm"
								>
									예약 날짜
								</Typography>
								<Typography
									className={classNames.sectionDescription()}
									key="description"
									type="body-sm"
								>
									오늘부터 14일간의 예약 가능 수업입니다.
								</Typography>
							</VStack>
							<DateStrip
								key="strip"
								onSelect={onSelectDate}
								options={dateOptions}
								selectedValue={selectedDate}
							/>
						</VStack>
						<VStack gap="block" key="feed">
							<VStack gap="dense" key="header">
								<Typography
									className={classNames.sectionTitle()}
									key="title"
									type="body-sm"
								>
									수업 목록
								</Typography>
								<Typography
									className={classNames.sectionDescription()}
									key="description"
									type="body-sm"
								>
									{selectedDateLabel ?? "선택한 날짜"} 기준으로 예약 상태를
									보여줍니다.
								</Typography>
							</VStack>
							<HStack className="flex-wrap" gap="inline" key="filters">
								{filterChipNodes}
							</HStack>
							{isFetching ? (
								<Typography
									className={classNames.sessionLabel()}
									key="fetching"
									type="body-sm"
								>
									최신 예약 상태를 확인 중입니다.
								</Typography>
							) : null}
							{feedContent}
						</VStack>
						{reservationSuccessDescription ? (
							<StatusFeedback
								description={reservationSuccessDescription}
								key="reservation-success"
								status="success"
								title="예약 요청 완료"
							/>
						) : null}
						{policySheet.isOpen ? (
							<BookingPolicySheet
								cancelLabel="닫기"
								cancellationPolicy="확정 예약은 시작 2시간 전까지, 대기 예약은 시작 전까지 취소할 수 있습니다."
								confirmLabel={policySheet.confirmLabel}
								isLoading={policySheet.isLoading}
								item={policySheet.item}
								key="policy-sheet"
								memoLabel="요청 메모"
								memoPlaceholder="코치에게 전달할 메모를 입력하세요"
								memoValue={policySheet.memoValue}
								onCancel={policySheet.onCancel}
								onChangeMemo={policySheet.onChangeMemo}
								onConfirm={policySheet.onConfirm}
								title="예약 정책 확인"
							/>
						) : null}
						{reservationErrorDescription ? (
							<StatusFeedback
								description={reservationErrorDescription}
								key="reservation-error"
								status="error"
								title="예약 요청에 실패했습니다"
							/>
						) : null}
					</VStack>
				</ScrollView>
			</ScreenFrame>
		);
	},
);
ReservationHomeScreen.displayName = "ReservationHomeScreen";
const reservationHomeScreenClassNames = tv({
	slots: {
		contentContainer: "px-4 pb-8 pt-3",
		eyebrow: "text-xs font-bold uppercase text-accent",
		overview: "rounded-lg border border-border bg-surface px-4 py-4",
		overviewDescription: "text-[13px] leading-5 text-muted",
		overviewTitle: "text-[22px] font-bold leading-7 text-foreground",
		root: "flex-1 bg-background",
		screenFrame: "bg-background",
		sectionDescription: "text-[13px] leading-5 text-muted",
		sectionTitle: "text-base font-bold leading-6 text-foreground",
		sessionLabel: "text-[13px] leading-5 text-muted",
		summaryCard:
			"min-h-14 flex-1 justify-between rounded-lg bg-background px-3 py-2",
		summaryGrid: "rounded-lg bg-background p-1",
		summaryLabel: "text-[11px] font-semibold uppercase leading-4 text-muted",
		summaryValue: "text-[19px] font-bold leading-6 text-foreground",
	},
});
const classNames = reservationHomeScreenClassNames();
