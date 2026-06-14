"use client";

import { Surface } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

export interface PaymentTableShellProps {
	title: string;
	description: string;
	minWidthClassName: string;
	header: ReactNode;
	children: ReactNode;
}

export const PaymentTableShell = observer(
	({
		title,
		description,
		minWidthClassName,
		header,
		children,
	}: PaymentTableShellProps) => {
		return (
			<Surface className="rounded-2xl border-border/80 bg-surface/70 p-5">
				<div className="flex flex-col gap-4">
					<div className="flex w-full flex-col items-start justify-between gap-3 md:flex-row">
						<div className="flex flex-col gap-1">
							<h2 className="text-xl font-semibold text-foreground">{title}</h2>
							<p className="text-sm text-muted">{description}</p>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table
							className={[
								"w-full table-fixed text-left text-sm",
								minWidthClassName,
							].join(" ")}
						>
							<thead className="border-border border-b text-muted">
								{header}
							</thead>
							<tbody>{children}</tbody>
						</table>
					</div>
				</div>
			</Surface>
		);
	},
);

PaymentTableShell.displayName = "PaymentTableShell";
