"use client";

import { cn } from "@heroui/react";
import Link from "next/link";
import { IdpConsoleIcon } from "./IdpConsoleIcon";

interface IdpConsoleBrandProps {
	className?: string;
	compact?: boolean;
}

export function IdpConsoleBrand({
	className,
	compact = false,
}: IdpConsoleBrandProps) {
	return (
		<Link
			href="/dashboard"
			className={cn(
				"group inline-flex min-w-0 items-center gap-3 rounded-2xl transition-transform hover:-translate-y-0.5",
				className,
			)}
		>
			<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-slate-950 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.58)] ring-1 ring-white/60 dark:bg-white dark:text-slate-950 dark:ring-white/10">
				<IdpConsoleIcon name="brand" size={20} />
			</span>
			{!compact && (
				<span className="min-w-0">
					<span className="block truncate text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
						Identity Console
					</span>
					<span className="mt-0.5 block truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
						IDP 관리
					</span>
				</span>
			)}
		</Link>
	);
}
