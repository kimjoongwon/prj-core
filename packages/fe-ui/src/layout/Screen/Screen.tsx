import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface ScreenProps extends ComponentPropsWithoutRef<"div"> {
	children?: ReactNode;
}

type ScreenSlotProps = ComponentPropsWithoutRef<"div"> & {
	children?: ReactNode;
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
	classNames.filter(Boolean).join(" ");

/**
 * Screen 컴포넌트
 * App.Main 안에서 screen-level max-width와 vertical rhythm을 제공하는 boundary입니다.
 */
const ScreenRoot = ({ children, className, ...props }: ScreenProps) => {
	return (
		<div
			{...props}
			className={joinClassNames(
				"mx-auto flex w-full max-w-[1440px] flex-col gap-6",
				className,
			)}
		>
			{children}
		</div>
	);
};

const ScreenHeader = ({ children, className, ...props }: ScreenSlotProps) => {
	return (
		<div {...props} className={joinClassNames("min-w-0", className)}>
			{children}
		</div>
	);
};

const ScreenBody = ({ children, className, ...props }: ScreenSlotProps) => {
	return (
		<div
			{...props}
			className={joinClassNames("flex min-w-0 flex-col gap-6", className)}
		>
			{children}
		</div>
	);
};

const ScreenFooter = ({ children, className, ...props }: ScreenSlotProps) => {
	return (
		<div {...props} className={joinClassNames("min-w-0", className)}>
			{children}
		</div>
	);
};

export const Screen = Object.assign(ScreenRoot, {
	Header: ScreenHeader,
	Body: ScreenBody,
	Footer: ScreenFooter,
});

ScreenHeader.displayName = "Screen.Header";
ScreenBody.displayName = "Screen.Body";
ScreenFooter.displayName = "Screen.Footer";
