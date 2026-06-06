"use client";

import { HStack, Surface, VStack } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

export interface CourseTableShellProps {
	title: string;
	description: string;
	minWidthClassName: string;
	header: ReactNode;
	children: ReactNode;
}

export const CourseTableShell = observer(
	({
		title,
		description,
		minWidthClassName,
		header,
		children,
	}: CourseTableShellProps) => {
		return (
			<Surface className="rounded-2xl border-border/80 bg-surface/70 p-5">
				<VStack gap="block">
					<HStack
						alignItems="start"
						justifyContent="between"
						fullWidth
						className="flex-col md:flex-row"
					>
						<VStack gap="dense">
							<h2 className="text-xl font-semibold text-foreground">{title}</h2>
							<p className="text-sm text-muted">{description}</p>
						</VStack>
					</HStack>
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
				</VStack>
			</Surface>
		);
	},
);

CourseTableShell.displayName = "CourseTableShell";
