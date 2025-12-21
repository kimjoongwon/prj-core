import { cva } from "class-variance-authority";
import type { ElementType, HTMLAttributes, ReactNode } from "react";
import React from "react";

export interface TextProps extends HTMLAttributes<HTMLElement> {
	variant?:
		| "h1"
		| "h2"
		| "h3"
		| "h4"
		| "h5"
		| "h6"
		| "caption"
		| "subtitle1"
		| "subtitle2"
		| "body1"
		| "body2"
		| "title"
		| "label"
		| "text"
		| "error";
	as?: ElementType;
	children?: ReactNode;
	truncate?: boolean;
	lineClamp?: 1 | 2 | 3 | 4 | 5 | 6 | "none";
}

const text = cva(["transition-colors duration-200"], {
	variants: {
		variant: {
			h1: ["text-4xl", "font-bold", "text-foreground", "dark:text-foreground"],
			h2: ["text-3xl", "font-bold", "text-foreground", "dark:text-foreground"],
			h3: ["text-2xl", "font-bold", "text-foreground", "dark:text-foreground"],
			h4: ["text-xl", "font-bold", "text-foreground", "dark:text-foreground"],
			h5: ["text-lg", "font-bold", "text-foreground", "dark:text-foreground"],
			h6: ["text-base", "font-bold", "text-foreground", "dark:text-foreground"],
			caption: [
				"text-sm",
				"font-normal",
				"text-default-500",
				"dark:text-default-400",
			],
			subtitle1: [
				"text-base",
				"font-normal",
				"text-default-600",
				"dark:text-default-300",
			],
			subtitle2: [
				"text-sm",
				"font-normal",
				"text-default-600",
				"dark:text-default-300",
			],
			body1: [
				"text-base",
				"font-normal",
				"text-foreground",
				"dark:text-foreground",
			],
			body2: [
				"text-sm",
				"font-normal",
				"text-foreground",
				"dark:text-foreground",
			],
			title: [
				"text-xl",
				"font-normal",
				"text-foreground",
				"dark:text-foreground",
			],
			label: [
				"text-sm",
				"font-semibold",
				"text-default-700",
				"dark:text-default-300",
			],
			text: [
				"text-base",
				"font-normal",
				"text-foreground",
				"dark:text-foreground",
			],
			error: ["text-sm", "font-medium", "text-danger", "dark:text-danger"],
		},
		truncate: {
			true: "truncate",
			false: "",
		},
		lineClamp: {
			1: ["line-clamp-1"],
			2: ["line-clamp-2"],
			3: ["line-clamp-3"],
			4: ["line-clamp-4"],
			5: ["line-clamp-5"],
			6: ["line-clamp-6"],
			none: [""],
		},
	},
});

// Semantic HTML tag mapping for better accessibility
const getSemanticTag = (
	variant: TextProps["variant"],
): keyof React.JSX.IntrinsicElements => {
	switch (variant) {
		case "h1":
			return "h1";
		case "h2":
			return "h2";
		case "h3":
			return "h3";
		case "h4":
			return "h4";
		case "h5":
			return "h5";
		case "h6":
			return "h6";
		case "caption":
		case "label":
			return "span";
		default:
			return "p";
	}
};

export const Text = (props: TextProps) => {
	const {
		children,
		className,
		variant = "body1",
		truncate = false,
		lineClamp = "none",
		as = "p",
		...rest
	} = props as TextProps;

	const Tag = (as || getSemanticTag(variant)) as React.ElementType;

	return (
		<Tag
			{...rest}
			className={
				text({ variant, truncate, lineClamp }) +
				(className ? ` ${className}` : "")
			}
		>
			{children}
		</Tag>
	);
};

Text.displayName = "Text";
