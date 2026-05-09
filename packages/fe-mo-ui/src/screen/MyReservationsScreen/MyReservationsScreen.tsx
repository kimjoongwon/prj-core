import { createElement, type ReactNode } from "react";
import {
	ScrollView,
	Text,
	View,
	type ViewProps,
} from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
import { StatusFeedback } from "../../feedback/StatusFeedback";
import { ScreenFrame } from "../../layout/ScreenFrame";

export type MyReservationsScreenStatus = "loading" | "error" | "empty" | "ready";

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

const renderReservationCard = (item: MyReservationCardItem) =>
	createElement(View, { className: classNames.reservationCard(), key: item.id }, [
		createElement(View, { className: classNames.reservationHeader(), key: "header" }, [
			createElement(
				Text,
				{ className: classNames.reservationDate(), key: "date" },
				item.dateLabel,
			),
			createElement(
				Text,
				{ className: classNames.statusBadge(), key: "status" },
				item.statusLabel,
			),
		]),
		createElement(
			Text,
			{ className: classNames.reservationTitle(), key: "title" },
			item.title,
		),
		item.metaLabel
			? createElement(
					Text,
					{ className: classNames.reservationMeta(), key: "meta" },
					item.metaLabel,
				)
			: null,
		item.memo
			? createElement(
					Text,
					{ className: classNames.sectionDescription(), key: "memo" },
					item.memo,
				)
			: null,
	]);

const renderReservationCards = (items: readonly MyReservationCardItem[]) =>
	items.map(renderReservationCard);

const renderReservationsContent = (props: MyReservationsScreenProps) => {
	if (props.status === "loading") {
		return createElement(StatusFeedback, {
			description: "예약과 대기 목록을 확인하고 있습니다.",
			key: "reservations-loading",
			status: "loading",
			title: "내 예약을 불러오는 중",
		});
	}

	if (props.status === "error") {
		return createElement(StatusFeedback, {
			description: props.errorDescription,
			key: "reservations-error",
			onPressPrimaryAction: props.onPressRetry,
			primaryActionLabel: "다시 시도",
			status: "error",
			title: "내 예약을 확인할 수 없습니다",
		});
	}

	if (props.status === "empty") {
		return createElement(StatusFeedback, {
			description: "홈에서 수업을 선택하면 예약 또는 대기 항목이 이곳에 표시됩니다.",
			key: "reservations-empty",
			onPressPrimaryAction: props.onPressRetry,
			primaryActionLabel: "목록 새로고침",
			status: "empty",
			title: "아직 예약이 없습니다",
		});
	}

	return renderReservationCards(props.items);
};

export const MyReservationsScreen = observer(
	(props: MyReservationsScreenProps) => {
		const {
			errorDescription: _errorDescription,
			items: _items,
			onPressRetry: _onPressRetry,
			status: _status,
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
					createElement(View, { className: classNames.sectionHeader(), key: "header" }, [
						createElement(
							Text,
							{ className: classNames.sectionTitle(), key: "title" },
							"내 예약",
						),
						createElement(
							Text,
							{ className: classNames.sectionDescription(), key: "description" },
							"예약 확정과 대기 상태를 실제 Reservation API 기준으로 확인합니다.",
						),
					]),
					renderReservationsContent(props),
				]),
			),
		);
	},
);

MyReservationsScreen.displayName = "MyReservationsScreen";

const myReservationsScreenClassNames = tv({
	slots: {
		contentContainer: "px-5 pb-9 pt-5",
		reservationCard:
			"gap-2 rounded-2xl border border-[#2e382f] bg-[#151a16] p-4",
		reservationDate: "text-[13px] font-bold text-green-300",
		reservationHeader: "flex-row items-center justify-between",
		reservationMeta: "text-sm text-[#d6d3c7]",
		reservationTitle: "text-[17px] font-bold text-[#fffaf0]",
		root: "flex-1 bg-[#0c0f0b]",
		screenFrame: "bg-[#0c0f0b]",
		sectionDescription: "text-sm leading-[21px] text-stone-400",
		sectionHeader: "gap-1.5",
		sectionTitle: "text-[22px] font-extrabold text-[#fffaf0]",
		statusBadge:
			"overflow-hidden rounded-full bg-orange-900 px-2.5 py-1 text-xs font-bold text-orange-100",
		tabContent: "gap-[18px]",
	},
});

const classNames = myReservationsScreenClassNames();
