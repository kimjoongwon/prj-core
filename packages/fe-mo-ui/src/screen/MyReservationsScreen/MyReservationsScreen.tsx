import { observer } from "mobx-react-lite";
import { type ReactNode } from "react";
import { ScrollView, View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";
import { Chip, chipClassNames } from "../../data-display/Chip";
import { Typography } from "../../data-display/Typography";
import { StatusFeedback } from "../../feedback/StatusFeedback";
import { Icon } from "../../icon";
import { ScreenFrame } from "../../layout/ScreenFrame";
import { HStack, VStack } from "../../rhythm";
export type MyReservationsScreenStatus =
	| "loading"
	| "error"
	| "empty"
	| "ready";
export interface MyReservationCardItem {
	dateLabel: ReactNode;
	id: string;
	memo?: ReactNode;
	metaLabel?: ReactNode;
	statusLabel: ReactNode;
	title: ReactNode;
}
export interface MyReservationsScreenProps extends Omit<ViewProps, "children"> {
	errorDescription?: ReactNode;
	items: readonly MyReservationCardItem[];
	onPressRetry?: () => void;
	status: MyReservationsScreenStatus;
}
export const MyReservationsScreen = observer(
	(props: MyReservationsScreenProps) => {
		const {
			errorDescription,
			items,
			onPressRetry,
			status,
			style,
			...viewProps
		} = props;
		let reservationsContent: ReactNode;

		if (status === "loading") {
			reservationsContent = (
				<StatusFeedback
					description="예약과 대기 목록을 확인하고 있습니다."
					key="reservations-loading"
					status="loading"
					title="내 예약을 불러오는 중"
				/>
			);
		} else if (status === "error") {
			reservationsContent = (
				<StatusFeedback
					description={errorDescription}
					key="reservations-error"
					onPressPrimaryAction={onPressRetry}
					primaryActionLabel="다시 시도"
					status="error"
					title="내 예약을 확인할 수 없습니다"
				/>
			);
		} else if (status === "empty") {
			reservationsContent = (
				<StatusFeedback
					description="홈에서 수업을 선택하면 예약 또는 대기 항목이 이곳에 표시됩니다."
					key="reservations-empty"
					onPressPrimaryAction={onPressRetry}
					primaryActionLabel="목록 새로고침"
					status="empty"
					title="아직 예약이 없습니다"
				/>
			);
		} else {
			const reservationCards: ReactNode[] = [];

			for (const item of items) {
				reservationCards.push(
					<VStack
						className={classNames.reservationCard()}
						gap="block"
						key={item.id}
					>
						<View className={classNames.reservationHeader()} key="header">
							<HStack alignItems="center" gap="dense" key="date">
								<Icon name="calendarCheck" size="xs" tone="success" />
								<Typography
									className={classNames.reservationDate()}
									type="body-sm"
								>
									{item.dateLabel}
								</Typography>
							</HStack>
							<Chip color="warning" key="status" size="sm" variant="soft">
								<Icon name="badgeCheck" size="xs" tone="warning" />
								<Typography
									className={chipClassNames.label({
										color: "warning",
										size: "sm",
										variant: "soft",
									})}
									type="body-sm"
								>
									{item.statusLabel}
								</Typography>
							</Chip>
						</View>
						<Typography
							className={classNames.reservationTitle()}
							key="title"
							type="body-sm"
						>
							{item.title}
						</Typography>
						{item.metaLabel ? (
							<Typography
								className={classNames.reservationMeta()}
								key="meta"
								type="body-sm"
							>
								{item.metaLabel}
							</Typography>
						) : null}
						{item.memo ? (
							<Typography
								className={classNames.sectionDescription()}
								key="memo"
								type="body-sm"
							>
								{item.memo}
							</Typography>
						) : null}
					</VStack>,
				);
			}

			reservationsContent = reservationCards;
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
					<VStack gap="section">
						<VStack gap="dense" key="header">
							<Typography
								className={classNames.sectionTitle()}
								key="title"
								type="body-sm"
							>
								내 예약
							</Typography>
							<Typography
								className={classNames.sectionDescription()}
								key="description"
								type="body-sm"
							>
								예약 확정과 대기 상태를 실제 Reservation API 기준으로
								확인합니다.
							</Typography>
						</VStack>
						{reservationsContent}
					</VStack>
				</ScrollView>
			</ScreenFrame>
		);
	},
);
MyReservationsScreen.displayName = "MyReservationsScreen";
const myReservationsScreenClassNames = tv({
	slots: {
		contentContainer: "px-4 pb-8 pt-4",
		reservationCard: "rounded-lg border border-border bg-surface p-4",
		reservationDate: "text-[13px] font-extrabold leading-5 text-success",
		reservationHeader: "flex-row items-center justify-between",
		reservationMeta: "text-[13px] leading-5 text-surface-foreground",
		reservationTitle: "text-base font-extrabold leading-6 text-foreground",
		root: "flex-1 bg-background",
		screenFrame: "bg-background",
		sectionDescription: "text-[13px] leading-5 text-muted",
		sectionTitle: "text-xl font-extrabold leading-7 text-foreground",
	},
});
const classNames = myReservationsScreenClassNames();
