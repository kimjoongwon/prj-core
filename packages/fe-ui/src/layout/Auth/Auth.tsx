"use client";

import { Card } from "@heroui/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { translateNode, useT } from "../../i18n";

export interface AuthProps extends ComponentPropsWithoutRef<"div"> {
	children?: ReactNode;
}

type AuthDivSlotProps = ComponentPropsWithoutRef<"div"> & {
	children?: ReactNode;
};

type AuthHeaderProps = ComponentPropsWithoutRef<"header"> & {
	children?: ReactNode;
};

type AuthAsideProps = ComponentPropsWithoutRef<"aside"> & {
	children?: ReactNode;
};

type AuthMainProps = ComponentPropsWithoutRef<"main"> & {
	children?: ReactNode;
};

type AuthFooterProps = ComponentPropsWithoutRef<"footer"> & {
	children?: ReactNode;
};

export interface AuthPanelProps {
	children: ReactNode;
	className?: string;
	variant?: "primary" | "danger";
}

export interface AuthPanelHeaderProps {
	icon?: ReactNode;
	title: ReactNode;
	titleClassName?: string;
	subtitle?: ReactNode;
	logoUri?: string;
	logoAlt?: string;
}

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
	classNames.filter(Boolean).join(" ");

/**
 * Auth
 * 인증 전 화면의 viewport와 auth content 구조를 소유합니다.
 */
const AuthRoot = ({ children, className, ...props }: AuthProps) => {
	return (
		<div
			{...props}
			className={joinClassNames(
				"flex min-h-screen w-full flex-col overflow-hidden bg-background text-foreground",
				className,
			)}
		>
			{children}
		</div>
	);
};

/**
 * AuthHeader
 * 인증 전 화면의 optional header slot입니다.
 */
export const AuthHeader = ({
	children,
	className,
	...props
}: AuthHeaderProps) => {
	return (
		<header {...props} className={joinClassNames("shrink-0", className)}>
			{children}
		</header>
	);
};

/**
 * AuthBody
 * centered auth 또는 split auth 구성을 담는 body slot입니다.
 */
export const AuthBody = ({
	children,
	className,
	...props
}: AuthDivSlotProps) => {
	return (
		<div
			{...props}
			className={joinClassNames(
				"flex min-h-0 w-full flex-1 flex-col overflow-hidden lg:flex-row",
				className,
			)}
		>
			{children}
		</div>
	);
};

/**
 * AuthAside
 * split auth 화면의 소개/브랜딩 보조 영역입니다.
 */
export const AuthAside = ({
	children,
	className,
	...props
}: AuthAsideProps) => {
	return (
		<aside
			{...props}
			className={joinClassNames(
				"hidden min-h-0 min-w-0 flex-1 overflow-y-auto lg:block",
				className,
			)}
		>
			{children}
		</aside>
	);
};

/**
 * AuthMain
 * 인증 전 route children이 렌더링되는 centered main landmark slot입니다.
 */
export const AuthMain = ({ children, className, ...props }: AuthMainProps) => {
	return (
		<main
			{...props}
			className={joinClassNames(
				"flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-y-auto bg-background px-4 py-10 sm:px-6",
				className,
			)}
		>
			<div className="w-full max-w-[520px]">{children}</div>
		</main>
	);
};

/**
 * AuthFooter
 * 인증 전 화면의 optional footer slot입니다.
 */
export const AuthFooter = ({
	children,
	className,
	...props
}: AuthFooterProps) => {
	return (
		<footer {...props} className={joinClassNames("shrink-0", className)}>
			{children}
		</footer>
	);
};

/**
 * AuthPanel
 * 인증 전 화면의 입력/상태 콘텐츠를 담는 패널입니다.
 */
export const AuthPanel = ({
	children,
	className,
	variant = "primary",
}: AuthPanelProps) => {
	const toneClass =
		variant === "danger"
			? "border-danger/35 bg-white/92 text-slate-950 ring-1 ring-danger/10 shadow-[0_20px_60px_-32px_rgba(220,38,38,0.20)] dark:border-danger/40 dark:bg-slate-950/92 dark:text-slate-50 dark:ring-danger/15 dark:shadow-[0_24px_72px_-36px_rgba(248,113,113,0.22)]"
			: "border-slate-200/80 bg-white/92 text-slate-950 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-slate-950/92 dark:text-slate-50 dark:shadow-[0_24px_72px_-40px_rgba(0,0,0,0.72)]";

	return (
		<Card
			className={joinClassNames(
				"w-full rounded-[28px] border p-6 backdrop-blur-xl sm:p-8",
				toneClass,
				className,
			)}
		>
			{children}
		</Card>
	);
};

/**
 * AuthPanelHeader
 * 인증 패널 상단의 아이콘/로고, 제목, 설명 영역입니다.
 */
export const AuthPanelHeader = ({
	icon,
	title,
	titleClassName,
	subtitle,
	logoUri,
	logoAlt,
}: AuthPanelHeaderProps) => {
	const t = useT();
	const translatedTitle = translateNode(title, t);
	const translatedSubtitle = subtitle ? translateNode(subtitle, t) : null;
	const titleToneClass = titleClassName ?? "text-slate-950 dark:text-slate-50";
	const visual = logoUri ? (
		<img
			src={logoUri}
			alt={logoAlt ?? String(translatedTitle)}
			className="h-12 w-12 rounded-2xl border border-slate-200/80 bg-white/70 object-cover shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
		/>
	) : icon ? (
		<div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
			{icon}
		</div>
	) : null;

	return (
		<div className="mb-8 flex items-start gap-4">
			{visual ? <div className="shrink-0">{visual}</div> : null}
			<div className="min-w-0">
				<h1
					className={`text-2xl font-semibold tracking-tight ${titleToneClass}`}
				>
					{translatedTitle}
				</h1>
				{translatedSubtitle ? (
					<p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
						{translatedSubtitle}
					</p>
				) : null}
			</div>
		</div>
	);
};

export const Auth = Object.assign(AuthRoot, {
	Header: AuthHeader,
	Body: AuthBody,
	Aside: AuthAside,
	Main: AuthMain,
	Footer: AuthFooter,
	Panel: AuthPanel,
	PanelHeader: AuthPanelHeader,
});

AuthHeader.displayName = "Auth.Header";
AuthBody.displayName = "Auth.Body";
AuthAside.displayName = "Auth.Aside";
AuthMain.displayName = "Auth.Main";
AuthFooter.displayName = "Auth.Footer";
AuthPanel.displayName = "Auth.Panel";
AuthPanelHeader.displayName = "Auth.PanelHeader";
