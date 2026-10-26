"use client";

import { useInputStateInspection } from "@cocrepo/hook";
import { observer } from "mobx-react-lite";
import type { PropsWithChildren, ReactNode } from "react";

export type StorybookSerializableState =
	| string
	| number
	| boolean
	| null
	| StorybookSerializableState[]
	| { [key: string]: StorybookSerializableState };

export interface StorybookStatePreviewProps {
	children: ReactNode;
	readState?: () => StorybookSerializableState;
}

function formatState(value: unknown): string {
	try {
		return JSON.stringify(value, null, 2) ?? "null";
	} catch {
		return "상태를 표시할 수 없습니다.";
	}
}

export const StorybookStatePreview = observer(function StorybookStatePreview({
	children,
	readState,
}: PropsWithChildren<StorybookStatePreviewProps>) {
	const inspection = useInputStateInspection();
	const inputStates = inspection
		? inspection.entries().map((id) => ({ id, value: inspection.read(id) }))
		: [];

	return (
		<div>
			{children}
			<section
				aria-label="Story state"
				className="mt-4 overflow-hidden rounded-xl border border-border bg-surface-secondary text-foreground"
			>
				<details open>
					<summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
						현재 state
					</summary>
					<div className="grid gap-3 border-t border-border p-4">
						{readState ? (
							<pre className="overflow-auto rounded-lg bg-surface p-3 text-xs">
								{formatState(readState())}
							</pre>
						) : inputStates.length === 0 ? (
							<p className="text-sm text-muted">변경 가능한 상태 없음</p>
						) : null}
						{inputStates.length > 0 && (
							<div className="grid gap-2">
								<p className="text-xs font-semibold text-muted">입력 state</p>
								{inputStates.map(({ id, value }) => (
									<pre
										className="overflow-auto rounded-lg bg-surface p-3 text-xs"
										key={id}
									>
										{`${id}\n${formatState(value)}`}
									</pre>
								))}
							</div>
						)}
					</div>
				</details>
			</section>
		</div>
	);
});
