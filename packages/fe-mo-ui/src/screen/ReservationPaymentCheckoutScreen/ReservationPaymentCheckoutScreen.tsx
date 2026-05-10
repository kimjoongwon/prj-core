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
	ReservationCheckoutSummary,
	type ReservationCheckoutSummaryItem,
} from "../../data-display/ReservationCheckoutSummary";
import { StatusFeedback } from "../../feedback/StatusFeedback";
import { ScreenFrame } from "../../layout/ScreenFrame";
import { SelectableCardList } from "../../selection/SelectableCardList";

export type ReservationPaymentCheckoutStatus =
	| "idle"
	| "loading"
	| "submitting"
	| "success"
	| "error";

export type ReservationCheckoutProgressStatus =
	| "COMPLETED"
	| "CURRENT"
	| "PENDING";

export interface ReservationPaymentCourseOption {
	description?: ReactNode;
	id: string;
	meta?: readonly ReactNode[];
	priceLabel?: ReactNode;
	title: ReactNode;
}

export interface ReservationPaymentMethodOption {
	description?: ReactNode;
	label: ReactNode;
	value: string;
}

export interface ReservationPaymentProgressStep {
	id: string;
	label: ReactNode;
	status: ReservationCheckoutProgressStatus;
}

export interface ReservationPaymentCheckoutScreenProps
	extends Omit<ViewProps, "children"> {
	amountLabel?: ReactNode;
	courseOptions: readonly ReservationPaymentCourseOption[];
	currencyLabel?: ReactNode;
	errorDescription?: ReactNode;
	isSubmitDisabled?: boolean;
	methodOptions: readonly ReservationPaymentMethodOption[];
	onPressBack?: () => void;
	onPressReservations?: () => void;
	onPressSubmit?: () => void;
	onSelectCourseOption?: (courseOfferingId: string) => void;
	onSelectPaymentMethod?: (paymentMethod: string) => void;
	progressSteps?: readonly ReservationPaymentProgressStep[];
	selectedCourseOfferingId?: string | null;
	selectedPaymentMethod?: string | null;
	status: ReservationPaymentCheckoutStatus;
	submitLabel?: string;
	summaryItems: readonly ReservationCheckoutSummaryItem[];
}

const renderBackAction = (
	onPressBack: ReservationPaymentCheckoutScreenProps["onPressBack"],
) => {
	if (!onPressBack) {
		return null;
	}

	return createElement(
		Pressable,
		{
			accessibilityLabel: "checkout-back",
			accessibilityRole: "button",
			className: classNames.backAction(),
			key: "back-action",
			onPress: onPressBack as PressableProps["onPress"],
		},
		createElement(Text, { className: classNames.backActionText() }, "뒤로"),
	);
};

const renderCheckoutStatus = (props: ReservationPaymentCheckoutScreenProps) => {
	if (props.status === "loading") {
		return createElement(StatusFeedback, {
			description: "예약 가능한 과정과 결제 방법을 확인하고 있습니다.",
			key: "checkout-loading",
			status: "loading",
			title: "결제 정보를 불러오는 중",
		});
	}

	if (props.status === "submitting") {
		return createElement(StatusFeedback, {
			description: "결제 승인, 수강권 활성화, 예약 확정을 순서대로 처리하고 있습니다.",
			key: "checkout-submitting",
			status: "submitting",
			title: "결제를 진행하는 중",
		});
	}

	if (props.status === "error") {
		return createElement(StatusFeedback, {
			description: props.errorDescription,
			key: "checkout-error",
			onPressPrimaryAction: props.onPressSubmit,
			primaryActionLabel: "다시 시도",
			status: "error",
			title: "결제를 진행할 수 없습니다",
		});
	}

	if (props.status === "success") {
		return createElement(StatusFeedback, {
			description:
				"수강권이 활성화되었고 선택한 수업 예약이 완료되었습니다.",
			key: "checkout-success",
			onPressPrimaryAction: props.onPressReservations,
			primaryActionLabel: "예약 내역 보기",
			status: "success",
			title: "결제와 예약이 완료되었습니다",
		});
	}

	return createElement(StatusFeedback, {
		description:
			"결제 제공자가 정해지기 전까지는 provider-neutral 방식으로 승인된 것처럼 처리합니다.",
		key: "checkout-idle",
		status: "idle",
		title: "예약 결제 전 확인",
	});
};

const renderProgressStep = (
	step: ReservationPaymentProgressStep,
	index: number,
) => {
	const slotClassNames = reservationPaymentCheckoutScreenClassNames({
		progressStatus: step.status,
	});

	return createElement(
		View,
		{
			className: slotClassNames.progressStep(),
			key: step.id || `progress-step-${index}`,
		},
		[
			createElement(
				Text,
				{ className: slotClassNames.progressMark(), key: "mark" },
				step.status === "COMPLETED" ? "✓" : step.status === "CURRENT" ? "…" : "○",
			),
			createElement(
				Text,
				{ className: slotClassNames.progressLabel(), key: "label" },
				step.label,
			),
		],
	);
};

const renderProgress = (
	steps: ReservationPaymentCheckoutScreenProps["progressSteps"],
) => {
	if (!steps?.length) {
		return null;
	}

	return createElement(View, { className: classNames.progressBox(), key: "progress" }, [
		createElement(
			Text,
			{ className: classNames.sectionTitle(), key: "title" },
			"진행 상태",
		),
		createElement(
			View,
			{ className: classNames.progressList(), key: "list" },
			steps.map(renderProgressStep),
		),
	]);
};

const renderSubmitAction = (props: ReservationPaymentCheckoutScreenProps) => {
	const disabled = props.isSubmitDisabled || props.status === "submitting";
	const actionClassNames = reservationPaymentCheckoutScreenClassNames({
		disabled,
	});

	return createElement(
		Pressable,
		{
			accessibilityLabel: "create-reservation-checkout",
			accessibilityRole: "button",
			accessibilityState: { disabled },
			className: actionClassNames.submitAction(),
			disabled,
			key: "submit-action",
			onPress: props.onPressSubmit as PressableProps["onPress"],
		},
		createElement(
			Text,
			{ className: actionClassNames.submitActionText() },
			props.submitLabel ?? "결제하고 예약하기",
		),
	);
};

const toCourseCardItems = (
	options: readonly ReservationPaymentCourseOption[],
) =>
	options.map((option) => ({
		description: option.description,
		eyebrow: option.priceLabel,
		meta: option.meta,
		title: option.title,
		value: option.id,
	}));

const toPaymentMethodCardItems = (
	options: readonly ReservationPaymentMethodOption[],
) =>
	options.map((option) => ({
		description: option.description,
		title: option.label,
		value: option.value,
	}));

export const ReservationPaymentCheckoutScreen = observer(
	(props: ReservationPaymentCheckoutScreenProps) => {
		const {
			amountLabel,
			courseOptions,
			currencyLabel,
			errorDescription: _errorDescription,
			isSubmitDisabled: _isSubmitDisabled,
			methodOptions,
			onPressBack,
			onPressReservations: _onPressReservations,
			onPressSubmit: _onPressSubmit,
			onSelectCourseOption,
			onSelectPaymentMethod,
			progressSteps,
			selectedCourseOfferingId,
			selectedPaymentMethod,
			status: _status,
			style,
			submitLabel: _submitLabel,
			summaryItems,
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
				createElement(View, { className: classNames.content() }, [
					createElement(View, { className: classNames.header(), key: "header" }, [
						renderBackAction(onPressBack),
						createElement(
							Text,
							{ className: classNames.eyebrow(), key: "eyebrow" },
							"RESERVATION CHECKOUT",
						),
						createElement(
							Text,
							{ className: classNames.title(), key: "title" },
							"결제 후 예약",
						),
						createElement(
							Text,
							{ className: classNames.description(), key: "description" },
							"선택한 수업에 필요한 과정을 결제하고 바로 예약을 확정합니다.",
						),
					]),
					createElement(ReservationCheckoutSummary, {
						amountLabel,
						currencyLabel,
						items: summaryItems,
						key: "summary",
						title: "예약하려는 수업",
					}),
					createElement(SelectableCardList, {
						description: "이 수업 예약에 사용할 수강권을 선택하세요.",
						items: toCourseCardItems(courseOptions),
						key: "course-options",
						onSelect: onSelectCourseOption,
						selectLabel: "선택",
						selectedLabel: "선택됨",
						selectedValue: selectedCourseOfferingId,
						title: "과정 선택",
					}),
					createElement(SelectableCardList, {
						description: "실제 PG가 연결되기 전까지 선택값은 placeholder 승인에 사용됩니다.",
						items: toPaymentMethodCardItems(methodOptions),
						key: "payment-methods",
						onSelect: onSelectPaymentMethod,
						selectLabel: "선택",
						selectedLabel: "선택됨",
						selectedValue: selectedPaymentMethod,
						title: "결제 방법",
					}),
					renderProgress(progressSteps),
					renderCheckoutStatus(props),
					renderSubmitAction(props),
				]),
			),
		);
	},
);

ReservationPaymentCheckoutScreen.displayName = "ReservationPaymentCheckoutScreen";

const reservationPaymentCheckoutScreenClassNames = tv({
	slots: {
		backAction:
			"mb-2 self-start rounded-full border border-[#354033] bg-[#182018] px-4 py-2",
		backActionText: "text-sm font-bold text-[#f5f8f1]",
		content: "gap-[18px]",
		contentContainer: "px-5 pb-9 pt-5",
		description: "text-sm leading-[21px] text-stone-400",
		eyebrow: "text-xs font-extrabold tracking-[0px] text-[#9ad66d]",
		header: "gap-2",
		progressBox: "gap-3 rounded-2xl border border-[#2e382f] bg-[#121711] p-4",
		progressLabel: "flex-1 text-sm font-bold leading-5 text-[#d6d3c7]",
		progressList: "gap-2",
		progressMark:
			"w-7 text-center text-base font-extrabold leading-6 text-[#aeb7ac]",
		progressStep: "flex-row items-center gap-2",
		root: "flex-1 bg-[#0c0f0b]",
		screenFrame: "bg-[#0c0f0b]",
		sectionTitle: "text-lg font-extrabold leading-6 text-[#fffaf0]",
		submitAction:
			"min-h-[50px] items-center justify-center rounded-xl bg-[#9ad66d] px-5 py-3",
		submitActionText: "text-[15px] font-extrabold text-[#10200d]",
		title: "text-[26px] font-extrabold leading-8 text-[#fffaf0]",
	},
	variants: {
		disabled: {
			false: {},
			true: {
				submitAction: "opacity-[0.45]",
			},
		},
		progressStatus: {
			COMPLETED: {
				progressMark: "text-[#9ad66d]",
				progressLabel: "text-[#f5f8f1]",
			},
			CURRENT: {
				progressMark: "text-[#f1c96b]",
				progressLabel: "text-[#f1c96b]",
			},
			PENDING: {},
		},
	},
	defaultVariants: {
		disabled: false,
		progressStatus: "PENDING",
	},
});

const classNames = reservationPaymentCheckoutScreenClassNames();
