import type { ComponentPropsWithoutRef, ReactNode } from "react";

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

export const Auth = Object.assign(AuthRoot, {
	Header: AuthHeader,
	Body: AuthBody,
	Aside: AuthAside,
	Main: AuthMain,
	Footer: AuthFooter,
});

AuthHeader.displayName = "Auth.Header";
AuthBody.displayName = "Auth.Body";
AuthAside.displayName = "Auth.Aside";
AuthMain.displayName = "Auth.Main";
AuthFooter.displayName = "Auth.Footer";
