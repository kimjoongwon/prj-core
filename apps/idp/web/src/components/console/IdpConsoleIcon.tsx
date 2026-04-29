"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type IdpConsoleIconName =
	| "brand"
	| "dashboard"
	| "oidc-clients"
	| "accounts"
	| "oidc-sessions"
	| "auth-audit-logs"
	| "security-policy";

export interface IdpConsoleIconProps
	extends Omit<ComponentPropsWithoutRef<"svg">, "children"> {
	name: IdpConsoleIconName;
	size?: number;
}

function IdpConsoleIconFrame({
	children,
	size,
	...props
}: Omit<IdpConsoleIconProps, "name"> & { children: ReactNode }) {
	return (
		<svg
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			{children}
		</svg>
	);
}

export function getIdpConsoleIconName(
	navItemId?: string | null,
): IdpConsoleIconName {
	switch (navItemId) {
		case "dashboard":
			return "dashboard";
		case "oidc-clients":
			return "oidc-clients";
		case "accounts":
			return "accounts";
		case "oidc-sessions":
			return "oidc-sessions";
		case "auth-audit-logs":
			return "auth-audit-logs";
		case "security-policy":
			return "security-policy";
		default:
			return "brand";
	}
}

export function IdpConsoleIcon({
	name,
	size = 20,
	...props
}: IdpConsoleIconProps) {
	switch (name) {
		case "brand":
			return (
				<IdpConsoleIconFrame size={size} {...props}>
					<path d="M12 3.75 18.5 6.6v4.83c0 4.05-2.55 7.76-6.5 9.32-3.95-1.56-6.5-5.27-6.5-9.32V6.6L12 3.75Z" />
					<circle cx="12" cy="10.25" r="1.75" />
					<path d="M12 12v3.25" />
				</IdpConsoleIconFrame>
			);
		case "dashboard":
			return (
				<IdpConsoleIconFrame size={size} {...props}>
					<rect x="3.75" y="4.25" width="7.25" height="6.25" rx="2" />
					<rect x="13" y="4.25" width="7.25" height="9.25" rx="2" />
					<rect x="3.75" y="12.5" width="7.25" height="7.25" rx="2" />
					<path d="M13 16.25h7.25" />
					<path d="M16.625 13.5v5.75" />
				</IdpConsoleIconFrame>
			);
		case "oidc-clients":
			return (
				<IdpConsoleIconFrame size={size} {...props}>
					<rect x="4.25" y="6.5" width="7.25" height="7.25" rx="2.25" />
					<rect x="14.75" y="4.25" width="5" height="5" rx="1.75" />
					<rect x="14.75" y="14.75" width="5" height="5" rx="1.75" />
					<path d="M11.5 10.125h3.25" />
					<path d="M13.125 10.125c1.55 0 2.5-.95 2.5-2.5" />
					<path d="M13.125 10.125c1.55 0 2.5.95 2.5 2.5" />
				</IdpConsoleIconFrame>
			);
		case "accounts":
			return (
				<IdpConsoleIconFrame size={size} {...props}>
					<circle cx="9" cy="8.75" r="3" />
					<path d="M4.5 18c1.1-2.95 7.9-2.95 9 0" />
					<circle cx="17.25" cy="9.75" r="2.25" />
					<path d="M14.5 17.25c.65-1.85 4.85-1.85 5.5 0" />
				</IdpConsoleIconFrame>
			);
		case "oidc-sessions":
			return (
				<IdpConsoleIconFrame size={size} {...props}>
					<rect x="4" y="6.25" width="16" height="11.5" rx="3" />
					<path d="M8 10.5h8" />
					<path d="M8 13.75h5" />
					<circle cx="17" cy="13.75" r="1" />
				</IdpConsoleIconFrame>
			);
		case "auth-audit-logs":
			return (
				<IdpConsoleIconFrame size={size} {...props}>
					<path d="M8 4.25h6l4 4v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2Z" />
					<path d="M14 4.25v4h4" />
					<circle cx="11" cy="13" r="2.25" />
					<path d="m12.75 14.75 2.75 2.75" />
				</IdpConsoleIconFrame>
			);
		case "security-policy":
			return (
				<IdpConsoleIconFrame size={size} {...props}>
					<path d="M12 3.5 19 6.65v4.95c0 4.1-2.75 7.82-7 9.4-4.25-1.58-7-5.3-7-9.4V6.65L12 3.5Z" />
					<path d="m8.8 12.3 2.15 2.15 4.5-4.9" />
				</IdpConsoleIconFrame>
			);
		default:
			return null;
	}
}
