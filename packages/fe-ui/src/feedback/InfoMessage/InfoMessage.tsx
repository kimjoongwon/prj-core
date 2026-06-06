import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { Typography } from "../../data-display/Typography";
import { HStack } from "../../rhythm/HStack/HStack";

export interface InfoMessageProps {
	/** 메시지 본문 */
	message: string;
	/** 메시지 유형 @default "info" */
	variant?: "info" | "warning" | "error" | "success";
	/** 커스텀 아이콘 */
	icon?: ReactNode;
	/** 추가 CSS 클래스 */
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

/**
 * InfoMessage 컴포넌트
 * 다양한 상태의 알림 메시지를 표시합니다.
 *
 * @example
 * ```tsx
 * <InfoMessage message="정보 메시지입니다." variant="info" />
 * <InfoMessage message="주의가 필요합니다." variant="warning" />
 * <InfoMessage message="오류가 발생했습니다." variant={errorVariant} />
 * <InfoMessage message="성공적으로 처리되었습니다." variant="success" />
 *
 * // 커스텀 아이콘
 * <InfoMessage
 *   message="파일이 업로드되었습니다."
 *   variant="success"
 *   icon={<Upload className="h-5 w-5" />}
 * />
 * ```
 */
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
				<Typography.Paragraph className={textVariants({ variant })} size="sm">
					{message}
				</Typography.Paragraph>
			</HStack>
		</div>
	);
};

InfoMessage.displayName = "InfoMessage";
