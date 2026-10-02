import { observer } from "mobx-react-lite";
import { type ReactNode } from "react";
import {
	Pressable,
	type PressableProps,
	TextInput,
	View,
	type ViewProps,
} from "react-native";
import { tv } from "tailwind-variants";
import { Text } from "../../data-display/Text";
import { Icon } from "../../icon";
import { HStack, VStack } from "../../rhythm";
import type { BookingClassFeedItem } from "../../widget/BookingClassCard";
export interface BookingPolicySheetProps extends Omit<ViewProps, "children"> {
	cancelLabel?: ReactNode;
	cancellationPolicy?: ReactNode;
	confirmLabel?: ReactNode;
	isLoading?: boolean;
	item?: BookingClassFeedItem | null;
	memoLabel?: string;
	memoPlaceholder?: string;
	memoValue?: string;
	onCancel?: () => void;
	onChangeMemo?: (value: string) => void;
	onConfirm?: (item: BookingClassFeedItem, memo: string) => void;
	title?: ReactNode;
}
const OptionalText = ({
	className,
	value,
}: {
	className: string;
	value: ReactNode;
}) => {
	if (value === undefined || value === null || value === false) {
		return null;
	}
	return <Text className={className}>{value}</Text>;
};
const ClassTitle = ({ item }: { item: BookingClassFeedItem }) => (
	<Text className={classNames.classTitle()}>
		{item.timeLabel} · {item.programName}
	</Text>
);
const createConfirmHandler = (props: BookingPolicySheetProps) => {
	if (!props.item || props.isLoading || !props.onConfirm) {
		return undefined;
	}
	return () => {
		props.onConfirm?.(
			props.item as BookingClassFeedItem,
			props.memoValue ?? "",
		);
	};
};
const SheetAction = ({
	disabled,
	label,
	onPress,
	variant,
}: {
	disabled: boolean;
	label: ReactNode;
	onPress?: () => void;
	variant: "cancel" | "confirm";
}) => {
	const actionClassNames = bookingPolicySheetClassNames({
		actionVariant: variant,
		disabled,
	});
	return (
		<Pressable
			accessibilityLabel={typeof label === "string" ? label : variant}
			accessibilityRole="button"
			accessibilityState={{
				disabled,
				busy: variant === "confirm" && disabled,
			}}
			disabled={disabled}
			onPress={onPress as PressableProps["onPress"]}
			className={actionClassNames.action()}
		>
			<HStack alignItems="center" justifyContent="center" gap="inline">
				{variant === "confirm" ? (
					<Icon
						name="shieldCheck"
						size="sm"
						tone={disabled ? "muted" : "accentForeground"}
					/>
				) : null}
				<Text className={actionClassNames.actionText()}>{label}</Text>
			</HStack>
		</Pressable>
	);
};
const BookingPolicySheetComponent = observer(
	(props: BookingPolicySheetProps) => {
		const {
			cancelLabel = "Cancel",
			cancellationPolicy,
			confirmLabel = "Confirm booking",
			isLoading = false,
			item,
			memoLabel = "Memo",
			memoPlaceholder = "Add a note for the coach",
			memoValue = "",
			onCancel,
			onChangeMemo,
			onConfirm,
			style,
			title = "Confirm reservation",
			...rest
		} = props;
		if (!item) {
			return null;
		}
		const confirmDisabled = isLoading || !onConfirm;
		return (
			<VStack
				{...rest}
				accessibilityRole="summary"
				accessibilityState={{
					busy: isLoading,
				}}
				className={classNames.root()}
				gap="section"
				style={style}
			>
				<View className={classNames.handle()} />
				<VStack gap="dense">
					<Text className={classNames.title()} key="title">
						{title}
					</Text>
					<ClassTitle item={item} />
					<OptionalText
						className={classNames.classMeta()}
						value={item.sessionName}
					/>
				</VStack>
				{cancellationPolicy ? (
					<VStack className={classNames.policy()} gap="dense">
						<HStack alignItems="center" key="policy-label">
							<Icon name="shieldCheck" size="xs" tone="accent" />
							<Text className={classNames.policyLabel()}>
								Cancellation policy
							</Text>
						</HStack>
						<Text className={classNames.policyText()} key="policy-value">
							{cancellationPolicy}
						</Text>
					</VStack>
				) : null}
				<VStack gap="block">
					<Text className={classNames.memoLabel()} key="memo-label">
						{memoLabel}
					</Text>
					<TextInput
						key="memo-input"
						accessibilityLabel={memoLabel}
						className={classNames.memoInput()}
						multiline
						onChangeText={onChangeMemo}
						placeholder={memoPlaceholder}
						placeholderTextColorClassName="text-muted"
						style={{
							textAlignVertical: "top",
						}}
						value={memoValue}
					/>
				</VStack>
				<HStack gap="inline">
					<SheetAction
						disabled={isLoading || !onCancel}
						label={cancelLabel}
						onPress={onCancel}
						variant="cancel"
					/>
					<SheetAction
						disabled={confirmDisabled}
						label={isLoading ? "Booking..." : confirmLabel}
						onPress={createConfirmHandler({
							isLoading,
							item,
							memoValue,
							onConfirm,
						})}
						variant="confirm"
					/>
				</HStack>
			</VStack>
		);
	},
);
BookingPolicySheetComponent.displayName = "BookingPolicySheet";
export const BookingPolicySheet = BookingPolicySheetComponent;
const bookingPolicySheetClassNames = tv({
	slots: {
		action: "min-h-11 flex-1 items-center rounded-lg px-3 py-2.5",
		actionText: "text-sm leading-[18px]",
		classMeta: "text-[13px] leading-[18px] text-muted",
		classTitle: "text-[15px] font-extrabold leading-5 text-surface-foreground",
		handle: "h-1 w-11 self-center rounded-full bg-surface-tertiary",
		memoInput:
			"min-h-20 rounded-lg border border-border bg-surface-secondary p-3 text-sm leading-5 text-foreground",
		memoLabel:
			"text-[13px] font-extrabold leading-[18px] text-surface-foreground",
		policy: "rounded-lg border border-border bg-surface-secondary p-3",
		policyLabel: "text-xs font-extrabold uppercase leading-4 text-accent",
		policyText: "text-[13px] leading-[18px] text-surface-foreground",
		root: "rounded-lg border border-border bg-surface p-4",
		title: "text-base font-black leading-6 text-foreground",
	},
	variants: {
		actionVariant: {
			cancel: {
				action: "border border-border bg-surface-secondary",
				actionText: "font-extrabold text-surface-secondary-foreground",
			},
			confirm: {
				action: "bg-accent",
				actionText: "font-black text-accent-foreground",
			},
		},
		disabled: {
			false: {},
			true: {
				action: "opacity-55",
			},
		},
	},
	defaultVariants: {
		actionVariant: "confirm",
		disabled: false,
	},
});
const classNames = bookingPolicySheetClassNames();
