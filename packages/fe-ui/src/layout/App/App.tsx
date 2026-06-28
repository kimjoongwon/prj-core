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

const AppHeader = ({ children, className, ...props }: AppHeaderProps) => {
	return (
		<header {...props} className={joinClassNames("shrink-0", className)}>
			{children}
		</header>
	);
};

const AppBody = ({ children, className, ...props }: AppDivSlotProps) => {
	return (
		<div
			{...props}
			className={joinClassNames("flex min-h-0 w-full flex-1", className)}
		>
			{children}
		</div>
	);
};

const AppLeftAside = ({ children, className, ...props }: AppAsideProps) => {
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

const AppRightAside = ({ children, className, ...props }: AppAsideProps) => {
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

const AppMain = ({ children, className, ...props }: AppMainProps) => {
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

const AppFooter = ({ children, className, ...props }: AppFooterProps) => {
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
