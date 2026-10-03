import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Typography } from "../../data-display/Typography";
import { translateNode, useT } from "../../i18n";

export type SectionInset = "section" | "compact" | "none";
export type SectionOverflow = "visible" | "hidden";
export type SectionLayout = "stack" | "left" | "right" | "both";
export type SectionAsideWidth = "sm" | "md" | "lg";

export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
	children?: ReactNode;
	inset?: SectionInset;
	overflow?: SectionOverflow;
	layout?: SectionLayout;
	leftAsideWidth?: SectionAsideWidth;
	rightAsideWidth?: SectionAsideWidth;
}

type SectionSlotProps = ComponentPropsWithoutRef<"div"> & {
	children?: ReactNode;
};

export type SectionHeaderProps = Omit<
	ComponentPropsWithoutRef<"div">,
	"title"
> & {
	children?: ReactNode;
	title?: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
};

const sectionInsetClassNames: Record<SectionInset, string> = {
	section: "gap-4 p-4 md:p-5",
	compact: "gap-3 p-3 md:p-4",
	none: "gap-0 p-0",
};

const sectionOverflowClassNames: Record<SectionOverflow, string> = {
	visible: "overflow-visible",
	hidden: "overflow-hidden",
};

const sectionLeftLayoutClassNames: Record<SectionAsideWidth, string> = {
	sm: "md:grid-cols-[240px_minmax(0,1fr)]",
	md: "md:grid-cols-[320px_minmax(0,1fr)]",
	lg: "md:grid-cols-[420px_minmax(0,1fr)]",
};

const sectionRightLayoutClassNames: Record<SectionAsideWidth, string> = {
	sm: "md:grid-cols-[minmax(0,1fr)_240px]",
	md: "md:grid-cols-[minmax(0,1fr)_320px]",
	lg: "md:grid-cols-[minmax(0,1fr)_420px]",
};

const sectionBothLayoutClassNames: Record<
	SectionAsideWidth,
	Record<SectionAsideWidth, string>
> = {
	sm: {
		sm: "md:grid-cols-[240px_minmax(0,1fr)_240px]",
		md: "md:grid-cols-[240px_minmax(0,1fr)_320px]",
		lg: "md:grid-cols-[240px_minmax(0,1fr)_420px]",
	},
	md: {
		sm: "md:grid-cols-[320px_minmax(0,1fr)_240px]",
		md: "md:grid-cols-[320px_minmax(0,1fr)_320px]",
		lg: "md:grid-cols-[320px_minmax(0,1fr)_420px]",
	},
	lg: {
		sm: "md:grid-cols-[420px_minmax(0,1fr)_240px]",
		md: "md:grid-cols-[420px_minmax(0,1fr)_320px]",
		lg: "md:grid-cols-[420px_minmax(0,1fr)_420px]",
	},
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
	classNames.filter(Boolean).join(" ");

function getSectionLayoutClassName(
	layout: SectionLayout,
	leftAsideWidth: SectionAsideWidth,
	rightAsideWidth: SectionAsideWidth,
) {
	if (layout === "left") {
		return sectionLeftLayoutClassNames[leftAsideWidth];
	}
	if (layout === "right") {
		return sectionRightLayoutClassNames[rightAsideWidth];
	}
	if (layout === "both") {
		return sectionBothLayoutClassNames[leftAsideWidth][rightAsideWidth];
	}
	return undefined;
}

/**
 * Section 컴포넌트
 * Screen 안의 의미 있는 section 구조를 compound API로 제공합니다.
 * header/body/footer, aside, inset, overflow 같은 layout 정책만 소유합니다.
 */
const SectionRoot = ({
	children,
	className,
	inset = "section",
	overflow = "visible",
	layout = "stack",
	leftAsideWidth = "md",
	rightAsideWidth = "md",
	...props
}: SectionProps) => {
	return (
		<section
			{...props}
			className={joinClassNames(
				"grid w-full min-w-0 grid-cols-1",
				sectionInsetClassNames[inset],
				sectionOverflowClassNames[overflow],
				layout !== "stack" && "md:items-start",
				getSectionLayoutClassName(layout, leftAsideWidth, rightAsideWidth),
				className,
			)}
		>
			{children}
		</section>
	);
};

const SectionHeader = ({
	children,
	className,
	title,
	description,
	actions,
	...props
}: SectionHeaderProps) => {
	const t = useT();
	const hasHeaderContent = Boolean(title || description || actions);

	return (
		<div
			{...props}
			data-section-slot="header"
			className={joinClassNames("min-w-0 md:col-span-full", className)}
		>
			{hasHeaderContent && (
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0 flex-1">
						{title && (
							<Typography.Heading className="font-semibold" level={2}>
								{translateNode(title, t)}
							</Typography.Heading>
						)}
						{description && (
							<Typography.Paragraph className="mt-1" color="muted" size="sm">
								{translateNode(description, t)}
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

const SectionBody = ({ children, className, ...props }: SectionSlotProps) => {
	return (
		<div
			{...props}
			data-section-slot="body"
			className={joinClassNames("min-w-0 flex-1", className)}
		>
			{children}
		</div>
	);
};

const SectionFooter = ({ children, className, ...props }: SectionSlotProps) => {
	return (
		<div
			{...props}
			data-section-slot="footer"
			className={joinClassNames("min-w-0 md:col-span-full", className)}
		>
			{children}
		</div>
	);
};

const SectionLeftAside = ({
	children,
	className,
	...props
}: SectionSlotProps) => {
	return (
		<div
			{...props}
			data-section-slot="left-aside"
			className={joinClassNames("min-w-0", className)}
		>
			{children}
		</div>
	);
};

const SectionRightAside = ({
	children,
	className,
	...props
}: SectionSlotProps) => {
	return (
		<div
			{...props}
			data-section-slot="right-aside"
			className={joinClassNames("min-w-0", className)}
		>
			{children}
		</div>
	);
};

export const Section = Object.assign(SectionRoot, {
	Header: SectionHeader,
	Body: SectionBody,
	Footer: SectionFooter,
	LeftAside: SectionLeftAside,
	RightAside: SectionRightAside,
});

SectionHeader.displayName = "Section.Header";
SectionBody.displayName = "Section.Body";
SectionFooter.displayName = "Section.Footer";
SectionLeftAside.displayName = "Section.LeftAside";
SectionRightAside.displayName = "Section.RightAside";
