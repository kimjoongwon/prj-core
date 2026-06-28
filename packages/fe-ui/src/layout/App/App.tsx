import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface AppProps extends ComponentPropsWithoutRef<"div"> {
	children?: ReactNode;
}

type AppDivSlotProps = ComponentPropsWithoutRef<"div"> & {
	children?: ReactNode;
};

type AppHeaderProps = ComponentPropsWithoutRef<"header"> & {
	children?: ReactNode;
};

type AppAsideProps = ComponentPropsWithoutRef<"aside"> & {
	children?: ReactNode;
};

type AppMainProps = ComponentPropsWithoutRef<"main"> & {
	children?: ReactNode;
};

type AppFooterProps = ComponentPropsWithoutRef<"footer"> & {
	children?: ReactNode;
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
	classNames.filter(Boolean).join(" ");

/**
 * App 컴포넌트
 * Next.js 최상위 layout.tsx에서 사용하는 root app structure입니다.
 * Header, Body, Aside, Main, Footer 슬롯을 compound API로 조합합니다.
 */
const AppRoot = ({ children, className, ...props }: AppProps) => {
	return (
		<div
			{...props}
			className={joinClassNames(
				"flex h-screen w-full flex-col overflow-hidden bg-background text-foreground",
				className,
			)}
		>
			{children}
		</div>
	);
};

/**
 * AppHeader
 * root app header landmark slot입니다.
 */
export const AppHeader = ({
	children,
	className,
	...props
}: AppHeaderProps) => {
	return (
		<header {...props} className={joinClassNames("shrink-0", className)}>
			{children}
		</header>
	);
};

/**
 * AppBody
 * root app header 아래의 좌우 aside/main 구조를 담는 body slot입니다.
 */
export const AppBody = ({ children, className, ...props }: AppDivSlotProps) => {
	return (
		<div
			{...props}
			className={joinClassNames("flex min-h-0 w-full flex-1", className)}
		>
			{children}
		</div>
	);
};

/**
 * AppLeftAside
 * desktop left navigation slot입니다.
 */
export const AppLeftAside = ({
	children,
	className,
	...props
}: AppAsideProps) => {
	return (
		<aside
			{...props}
			className={joinClassNames(
				"hidden h-full w-64 flex-none md:block",
				className,
			)}
		>
			{children}
		</aside>
	);
};

/**
 * AppRightAside
 * desktop right supplementary panel slot입니다.
 */
export const AppRightAside = ({
	children,
	className,
	...props
}: AppAsideProps) => {
	return (
		<aside
			{...props}
			className={joinClassNames(
				"hidden h-full w-80 flex-none xl:block",
				className,
			)}
		>
			{children}
		</aside>
	);
};

/**
 * AppMain
 * route children이 렌더링되는 root app main landmark slot입니다.
 */
export const AppMain = ({ children, className, ...props }: AppMainProps) => {
	return (
		<main
			{...props}
			className={joinClassNames(
				"min-h-0 min-w-0 flex-1 overflow-y-auto bg-surface-secondary p-4 pb-20 md:p-6 md:pb-6",
				className,
			)}
		>
			{children}
		</main>
	);
};

/**
 * AppFooter
 * 모바일 navigation/action 요소를 담는 root app footer slot입니다.
 */
export const AppFooter = ({
	children,
	className,
	...props
}: AppFooterProps) => {
	return (
		<footer {...props} className={joinClassNames("shrink-0", className)}>
			{children}
		</footer>
	);
};

export const App = Object.assign(AppRoot, {
	Header: AppHeader,
	Body: AppBody,
	LeftAside: AppLeftAside,
	Main: AppMain,
	RightAside: AppRightAside,
	Footer: AppFooter,
});

AppHeader.displayName = "App.Header";
AppBody.displayName = "App.Body";
AppLeftAside.displayName = "App.LeftAside";
AppMain.displayName = "App.Main";
AppRightAside.displayName = "App.RightAside";
AppFooter.displayName = "App.Footer";
