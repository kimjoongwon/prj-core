import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Typography } from "../../data-display/Typography";

export interface ScreenProps extends ComponentPropsWithoutRef<"div"> {
	children?: ReactNode;
}

type ScreenSlotProps = ComponentPropsWithoutRef<"div"> & {
	children?: ReactNode;
};

export type ScreenHeaderProps = Omit<
	ComponentPropsWithoutRef<"div">,
	"title"
> & {
	children?: ReactNode;
	title?: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
	classNames.filter(Boolean).join(" ");

/**
 * Screen 컴포넌트
 * Admin.Main 안에서 screen-level max-width와 vertical rhythm을 제공하는 boundary입니다.
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

const ScreenHeader = ({
	children,
	className,
	title,
	description,
	actions,
	...props
}: ScreenHeaderProps) => {
	const hasHeaderContent = Boolean(title || description || actions);

	return (
		<div {...props} className={joinClassNames("min-w-0", className)}>
			{hasHeaderContent && (
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0 flex-1">
						{title && (
							<Typography.Heading level={1}>{title}</Typography.Heading>
						)}
						{description && (
							<Typography.Paragraph className="mt-1" color="muted" size="base">
								{description}
							</Typography.Paragraph>
						)}
					</div>
					{actions && <div className="shrink-0">{actions}</div>}
				</div>
			)}
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
