import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType, ReactNode } from "react";

const surfaceVariants = cva("rounded-xl", {
	variants: {
		elevation: {
			flat: "bg-background shadow-none",
			raised: "bg-content1 shadow-sm",
			elevated: "bg-content1 shadow-md border border-divider",
			floating: "bg-content2 shadow-lg",
			overlay: "bg-content2 shadow-xl",
		},
		padding: {
			none: "p-0",
			sm: "p-3",
			md: "p-4",
			lg: "p-6",
		},
		radius: {
			none: "rounded-none",
			sm: "rounded-sm",
			md: "rounded-md",
			lg: "rounded-lg",
			xl: "rounded-xl",
		},
	},
	defaultVariants: {
		elevation: "elevated",
		padding: "md",
		radius: "xl",
	},
});

export type SurfaceProps = VariantProps<typeof surfaceVariants> & {
	children?: ReactNode;
	className?: string;
	as?: ElementType;
};

/**
 * Surface 컴포넌트
 * 엘리베이션(높이) 시스템을 통해 시각적 계층을 표현합니다.
 *
 * @example
 * ```tsx
 * <Surface elevation="elevated">콘텐츠</Surface>
 * <Surface elevation="raised" padding="lg">큰 패딩의 raised 영역</Surface>
 * ```
 */
export const Surface = (props: SurfaceProps) => {
	const {
		children,
		className,
		elevation,
		padding,
		radius,
		as: Component = "div",
	} = props;

	return (
		<Component
			className={surfaceVariants({
				elevation,
				padding,
				radius,
				className,
			})}
		>
			{children}
		</Component>
	);
};
