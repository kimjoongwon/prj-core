import { cn, Button as HeroButton, Link as HeroLink } from "@heroui/react";
import type { ComponentProps, ElementType, ReactNode } from "react";
import { translateNode, useT } from "../../i18n";

type LegacyColor =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";

type LegacyButtonVariant =
	| ComponentProps<typeof HeroButton>["variant"]
	| "flat"
	| "light"
	| "bordered"
	| "solid"
	| "faded"
	| "shadow";

const mapButtonVariant = (
	color?: LegacyColor,
	variant?: LegacyButtonVariant,
): ComponentProps<typeof HeroButton>["variant"] => {
	if (color === "danger") {
		return variant === "flat" || variant === "light" ? "danger-soft" : "danger";
	}
	if (variant === "light") return "ghost";
	if (variant === "bordered") return "outline";
	if (variant === "flat" || variant === "faded") return "tertiary";
	if (variant === "solid" || variant === "shadow") {
		if (color === "secondary") return "secondary";
		if (color === "primary") return "primary";
		return "tertiary";
	}
	return variant;
};

export interface ButtonProps
	extends Omit<ComponentProps<typeof HeroButton>, "children" | "variant"> {
	children?: ReactNode;
	as?: ElementType;
	href?: string;
	title?: string;
	color?: LegacyColor;
	variant?: LegacyButtonVariant;
	startContent?: ReactNode;
	endContent?: ReactNode;
	isLoading?: boolean;
	spinner?: ReactNode;
	radius?: string;
}

/**
 * Button 컴포넌트
 * HeroUI Button의 래퍼 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * // 기본 버튼
 * <Button onPress={handleClick}>클릭</Button>
 *
 * // 색상 변형
 * <Button color="primary">Primary</Button>
 * <Button color="danger">Danger</Button>
 *
 * // 스타일 변형
 * <Button variant="flat">Flat</Button>
 * <Button variant="bordered">Bordered</Button>
 * <Button variant="light">Light</Button>
 *
 * // 크기
 * <Button size="sm">Small</Button>
 * <Button size="lg">Large</Button>
 *
 * // 아이콘 전용
 * <Button isIconOnly><Plus /></Button>
 * ```
 */
export const Button = (props: ButtonProps) => {
	const t = useT();
	const {
		as,
		children,
		className,
		color,
		endContent,
		fullWidth,
		href,
		isDisabled,
		isIconOnly,
		isLoading,
		onPress,
		radius: _radius,
		size,
		spinner,
		startContent,
		variant,
		...rest
	} = props;
	const ariaLabel =
		typeof rest["aria-label"] === "string"
			? t(rest["aria-label"])
			: rest["aria-label"];
	const mappedVariant = mapButtonVariant(color, variant);
	const content = (
		<>
			{isLoading ? (spinner ?? null) : null}
			{startContent}
			{translateNode(children, t)}
			{endContent}
		</>
	);

	if (href) {
		const LinkComponent = as ?? HeroLink;

		return (
			<LinkComponent
				href={isDisabled ? undefined : href}
				aria-disabled={isDisabled || undefined}
				aria-label={ariaLabel}
				className={cn(
					"inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
					size === "sm" ? "h-8 min-w-8 px-3 text-sm" : undefined,
					!size || size === "md" ? "h-10 min-w-10 px-4 text-sm" : undefined,
					size === "lg" ? "h-11 min-w-11 px-5 text-base" : undefined,
					isIconOnly ? "aspect-square px-0" : undefined,
					fullWidth ? "w-full" : undefined,
					mappedVariant === "primary"
						? "bg-primary text-primary-foreground hover:bg-primary/90"
						: undefined,
					mappedVariant === "secondary"
						? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
						: undefined,
					mappedVariant === "danger" || mappedVariant === "danger-soft"
						? "bg-danger/10 text-danger hover:bg-danger/15"
						: undefined,
					mappedVariant === "outline"
						? "border border-border bg-transparent hover:bg-default/10"
						: undefined,
					mappedVariant === "ghost"
						? "bg-transparent hover:bg-default/10"
						: undefined,
					!mappedVariant || mappedVariant === "tertiary"
						? "bg-default/10 text-foreground hover:bg-default/15"
						: undefined,
					isDisabled ? "pointer-events-none opacity-50" : undefined,
					className,
				)}
			>
				{content}
			</LinkComponent>
		);
	}

	return (
		<HeroButton
			className={className}
			fullWidth={fullWidth}
			isDisabled={isDisabled}
			isIconOnly={isIconOnly}
			onPress={onPress}
			size={size}
			{...rest}
			aria-label={ariaLabel}
			variant={mappedVariant}
		>
			{content}
		</HeroButton>
	);
};
