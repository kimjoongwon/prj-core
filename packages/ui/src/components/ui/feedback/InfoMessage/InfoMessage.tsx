import { cva } from "class-variance-authority";
import { ReactNode } from "react";
import { HStack } from "../../surfaces/HStack/HStack";
import { Text } from "../../data-display/Text/Text";

export interface InfoMessageProps {
	message: string;
	variant?: "info" | "warning" | "error" | "success";
	icon?: ReactNode;
	className?: string;
}

const infoMessageVariants = cva("rounded-lg p-4", {
	variants: {
		variant: {
			info: "bg-blue-50 dark:bg-blue-950",
			warning: "bg-yellow-50 dark:bg-yellow-950",
			error: "bg-red-50 dark:bg-red-950",
			success: "bg-green-50 dark:bg-green-950",
		},
	},
	defaultVariants: {
		variant: "info",
	},
});

const iconVariants = cva("text-xl", {
	variants: {
		variant: {
			info: "text-blue-600 dark:text-blue-400",
			warning: "text-yellow-600 dark:text-yellow-400",
			error: "text-red-600 dark:text-red-400",
			success: "text-green-600 dark:text-green-400",
		},
	},
	defaultVariants: {
		variant: "info",
	},
});

const textVariants = cva("", {
	variants: {
		variant: {
			info: "text-blue-900 dark:text-blue-100",
			warning: "text-yellow-900 dark:text-yellow-100",
			error: "text-red-900 dark:text-red-100",
			success: "text-green-900 dark:text-green-100",
		},
	},
	defaultVariants: {
		variant: "info",
	},
});

const defaultIcons = {
	info: "ℹ️",
	warning: "⚠️",
	error: "❌",
	success: "✅",
};

export const InfoMessage = ({
	message,
	variant = "info",
	icon,
	className,
}: InfoMessageProps) => {
	const displayIcon = icon ?? defaultIcons[variant];

	return (
		<div className={infoMessageVariants({ variant, className })}>
			<HStack gap={8} alignItems="center">
				<div className={iconVariants({ variant })}>{displayIcon}</div>
				<Text className={textVariants({ variant })} variant="body2">
					{message}
				</Text>
			</HStack>
		</div>
	);
};

InfoMessage.displayName = "InfoMessage";
