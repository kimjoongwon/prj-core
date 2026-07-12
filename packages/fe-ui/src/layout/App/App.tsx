import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface AppProps extends ComponentPropsWithoutRef<"div"> {
	children?: ReactNode;
}

type AppSlotProps = ComponentPropsWithoutRef<"div"> & {
	children?: ReactNode;
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
	classNames.filter(Boolean).join(" ");

/**
 * App
 * 앱 전역 content boundary와 global layer를 소유하는 root primitive입니다.
 */
const AppRoot = ({ children, className, ...props }: AppProps) => {
	return (
		<div
			{...props}
			className={joinClassNames(
				"relative min-h-screen w-full bg-background text-foreground",
				className,
			)}
		>
			{children}
		</div>
	);
};

/**
 * AppContent
 * route branch layout이 마운트되는 전역 content boundary입니다.
 */
export const AppContent = ({ children, className, ...props }: AppSlotProps) => {
	return (
		<div
			{...props}
			className={joinClassNames("relative z-0 min-h-screen w-full", className)}
		>
			{children}
		</div>
	);
};

/**
 * AppGlobalLayer
 * toast, dialog manager 같은 전역 overlay host가 들어가는 layer입니다.
 */
export const AppGlobalLayer = ({
	children,
	className,
	...props
}: AppSlotProps) => {
	return (
		<div
			{...props}
			className={joinClassNames(
				"pointer-events-none fixed inset-0 z-50",
				className,
			)}
		>
			{children}
		</div>
	);
};

/**
 * AppPortalHost
 * portal target으로 사용할 수 있는 전역 host입니다.
 */
export const AppPortalHost = ({
	children,
	className,
	id = "app-portal-host",
	...props
}: AppSlotProps) => {
	return (
		<div
			{...props}
			id={id}
			className={joinClassNames("relative z-50", className)}
		>
			{children}
		</div>
	);
};

export const App = Object.assign(AppRoot, {
	Content: AppContent,
	GlobalLayer: AppGlobalLayer,
	PortalHost: AppPortalHost,
});

AppContent.displayName = "App.Content";
AppGlobalLayer.displayName = "App.GlobalLayer";
AppPortalHost.displayName = "App.PortalHost";
