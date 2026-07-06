import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface AdminProps extends ComponentPropsWithoutRef<"div"> {
	children?: ReactNode;
}

type AdminDivSlotProps = ComponentPropsWithoutRef<"div"> & {
	children?: ReactNode;
};

type AdminHeaderProps = ComponentPropsWithoutRef<"header"> & {
	children?: ReactNode;
};

type AdminAsideProps = ComponentPropsWithoutRef<"aside"> & {
	children?: ReactNode;
};

type AdminMainProps = ComponentPropsWithoutRef<"main"> & {
	children?: ReactNode;
};

type AdminFooterProps = ComponentPropsWithoutRef<"footer"> & {
	children?: ReactNode;
};

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
	classNames.filter(Boolean).join(" ");

/**
 * Admin
 * 인증 이후 관리자 콘솔의 header, aside, main, footer 구조를 소유합니다.
 */
const AdminRoot = ({ children, className, ...props }: AdminProps) => {
	return (
		<div
			{...props}
			className={joinClassNames(
				"flex h-screen w-full flex-col overflow-hidden bg-[#f6f9fd] text-foreground dark:bg-neutral-950",
				className,
			)}
		>
			{children}
		</div>
	);
};

/**
 * AdminHeader
 * 인증 이후 관리자 화면의 header landmark slot입니다.
 */
export const AdminHeader = ({
	children,
	className,
	...props
}: AdminHeaderProps) => {
	return (
		<header {...props} className={joinClassNames("shrink-0", className)}>
			{children}
		</header>
	);
};

/**
 * AdminBody
 * header 아래의 aside/main 구조를 담는 body slot입니다.
 */
export const AdminBody = ({
	children,
	className,
	...props
}: AdminDivSlotProps) => {
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
 * AdminLeftAside
 * desktop left navigation slot입니다.
 */
export const AdminLeftAside = ({
	children,
	className,
	...props
}: AdminAsideProps) => {
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
 * AdminRightAside
 * desktop supplementary panel slot입니다.
 */
export const AdminRightAside = ({
	children,
	className,
	...props
}: AdminAsideProps) => {
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
 * AdminMain
 * 인증 이후 route children이 렌더링되는 main landmark slot입니다.
 */
export const AdminMain = ({
	children,
	className,
	...props
}: AdminMainProps) => {
	return (
		<main
			{...props}
			className={joinClassNames(
				"min-h-0 min-w-0 flex-1 overflow-y-auto bg-[#f6f9fd] p-4 pb-20 md:p-6 md:pb-6 dark:bg-neutral-950",
				className,
			)}
		>
			{children}
		</main>
	);
};

/**
 * AdminFooter
 * mobile navigation/action 요소를 담는 footer slot입니다.
 */
export const AdminFooter = ({
	children,
	className,
	...props
}: AdminFooterProps) => {
	return (
		<footer {...props} className={joinClassNames("shrink-0", className)}>
			{children}
		</footer>
	);
};

export const Admin = Object.assign(AdminRoot, {
	Header: AdminHeader,
	Body: AdminBody,
	LeftAside: AdminLeftAside,
	Main: AdminMain,
	RightAside: AdminRightAside,
	Footer: AdminFooter,
});

AdminHeader.displayName = "Admin.Header";
AdminBody.displayName = "Admin.Body";
AdminLeftAside.displayName = "Admin.LeftAside";
AdminMain.displayName = "Admin.Main";
AdminRightAside.displayName = "Admin.RightAside";
AdminFooter.displayName = "Admin.Footer";
