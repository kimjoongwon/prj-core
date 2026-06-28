import {
	type ComponentPropsWithoutRef,
	type CSSProperties,
	forwardRef,
	type ReactNode,
} from "react";

export type ResponsiveFrameSize = "fo" | "mo" | "pc";
export type ResponsiveFrameWidth = CSSProperties["width"];

export interface ResponsiveFrameProps extends ComponentPropsWithoutRef<"div"> {
	children?: ReactNode;
	size?: ResponsiveFrameSize;
	width?: ResponsiveFrameWidth;
}

export const RESPONSIVE_FRAME_WIDTHS = {
	fo: 1200,
	mo: 375,
	pc: 1200,
} as const satisfies Record<ResponsiveFrameSize, ResponsiveFrameWidth>;

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
	classNames.filter(Boolean).join(" ");

function getResponsiveFrameWidth(
	size: ResponsiveFrameSize,
	width?: ResponsiveFrameWidth,
) {
	return width ?? RESPONSIVE_FRAME_WIDTHS[size];
}

/**
 * ResponsiveFrame 컴포넌트
 * 자식 반응형 컴포넌트가 판정할 부모 너비를 고정하는 layout wrapper입니다.
 */
export const ResponsiveFrame = forwardRef<HTMLDivElement, ResponsiveFrameProps>(
	(
		{
			children,
			className,
			size = "fo",
			style,
			width,
			...props
		}: ResponsiveFrameProps,
		ref,
	) => {
		const frameWidth = getResponsiveFrameWidth(size, width);

		return (
			<div
				{...props}
				className={joinClassNames("min-w-0 shrink-0", className)}
				ref={ref}
				style={{
					...style,
					width: frameWidth,
				}}
			>
				{children}
			</div>
		);
	},
);

ResponsiveFrame.displayName = "ResponsiveFrame";
