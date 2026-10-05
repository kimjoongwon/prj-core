"use client";

import { Alert as HeroAlert } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";
import { translateNode, useT } from "../../i18n";

export type AlertStatus =
	| "default"
	| "accent"
	| "success"
	| "warning"
	| "danger";

export interface AlertProps
	extends Omit<ComponentProps<typeof HeroAlert>, "children" | "status"> {
	status?: AlertStatus;
	title?: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
	children?: ReactNode;
}

/**
 * HeroUI Alert 래퍼입니다.
 *
 * 앱의 정적/동적 문구 번역만 보강하고, 시각 표현은 HeroUI Alert에 위임합니다.
 */
export function Alert({
	status = "default",
	title,
	description,
	actions,
	children,
	...rest
}: AlertProps) {
	const t = useT();
	const content = description ?? children;

	return (
		<HeroAlert status={status} {...rest}>
			<HeroAlert.Indicator />
			<HeroAlert.Content>
				{title ? (
					<HeroAlert.Title>{translateNode(title, t)}</HeroAlert.Title>
				) : null}
				{content ? (
					<HeroAlert.Description>
						{translateNode(content, t)}
					</HeroAlert.Description>
				) : null}
				{actions ? <div className="mt-2">{actions}</div> : null}
			</HeroAlert.Content>
		</HeroAlert>
	);
}
