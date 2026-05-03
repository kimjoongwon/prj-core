"use client";

import { cva } from "class-variance-authority";
import { observer } from "mobx-react-lite";
import type React from "react";
import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { translateNode, useT } from "../../../i18n";

export interface TextProps extends HTMLAttributes<HTMLElement> {
	/** 텍스트 변형 (스타일 프리셋) @default "body1" */
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
	/** 렌더링할 HTML 태그 @default 시맨틱 태그 자동 선택 */
	as?: ElementType;
	/** 텍스트 콘텐츠 */
	children?: ReactNode;
	/** 텍스트 말줄임 처리 @default false */
	truncate?: boolean;
	/** 줄 수 제한 (line-clamp) @default "none" */
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

/**
 * Text 컴포넌트
 * 다양한 텍스트 스타일 프리셋을 제공하는 타이포그래피 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * // 제목
 * <Text variant="h1">대제목</Text>
 * <Text variant="h3">소제목</Text>
 *
 * // 본문
 * <Text variant="body1">일반 텍스트</Text>
 * <Text variant="caption">작은 설명</Text>
 *
 * // 말줄임
 * <Text truncate>긴 텍스트가 잘립니다...</Text>
 * <Text lineClamp={2}>2줄까지만 표시됩니다...</Text>
 *
 * // 커스텀 태그
 * <Text variant="body1" as="span">인라인 텍스트</Text>
 * ```
 */
export const Text = observer((props: TextProps) => {
	const t = useT();
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
			{translateNode(children, t)}
		</Tag>
	);
});

Text.displayName = "Text";
