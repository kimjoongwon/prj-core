import { useInputStateInspection } from "@cocrepo/hook";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type PropsWithChildren, type ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Typography } from "../data-display/Typography";

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
	source: string;
}

function formatState(value: unknown): string {
	try {
		return JSON.stringify(value, null, 2) ?? "null";
	} catch {
		return "상태를 표시할 수 없습니다.";
	}
}

export function createStorybookStatePreviewState() {
	return makeAutoObservable(
		{
			isSourceOpen: false,
			toggleSource() {
				this.isSourceOpen = !this.isSourceOpen;
			},
		},
		{},
		{ autoBind: true, name: "StorybookStatePreviewState" },
	);
}

export const StorybookStatePreview = observer(function StorybookStatePreview({
	children,
	readState,
	source,
}: PropsWithChildren<Omit<StorybookStatePreviewProps, "children">>) {
	const inspection = useInputStateInspection();
	const previewState = useLocalObservable(createStorybookStatePreviewState);
	const inputStates = inspection
		? inspection.entries().map((id) => ({ id, value: inspection.read(id) }))
		: [];

	return (
		<View className="gap-3">
			{children}
			<View className="rounded-xl border border-zinc-700 bg-zinc-900 p-3">
				<Typography className="mb-2 font-bold text-zinc-100" type="body-sm">
					현재 state
				</Typography>
				{readState ? (
					<ScrollView className="max-h-48 rounded-lg bg-zinc-950 p-2">
						<Typography
							className="font-mono text-xs text-zinc-200"
							type="body-sm"
						>
							{formatState(readState())}
						</Typography>
					</ScrollView>
				) : inputStates.length === 0 ? (
					<Typography color="muted" type="body-sm">
						변경 가능한 상태 없음
					</Typography>
				) : null}
				{inputStates.length > 0 && (
					<View className="mt-3 gap-2">
						<Typography color="muted" type="body-sm">
							입력 state
						</Typography>
						{inputStates.map(({ id, value }) => (
							<Typography
								className="rounded-lg bg-zinc-950 p-2 font-mono text-xs text-zinc-200"
								key={id}
								type="body-sm"
							>
								{`${id}\n${formatState(value)}`}
							</Typography>
						))}
					</View>
				)}
				<Pressable className="mt-3" onPress={previewState.toggleSource}>
					<Typography className="font-bold text-zinc-100" type="body-sm">
						{previewState.isSourceOpen ? "사용 코드 접기" : "사용 코드 보기"}
					</Typography>
				</Pressable>
				{previewState.isSourceOpen && (
					<ScrollView className="mt-2 max-h-48 rounded-lg bg-zinc-950 p-2">
						<Typography
							className="font-mono text-xs text-zinc-200"
							type="body-sm"
						>
							{source}
						</Typography>
					</ScrollView>
				)}
			</View>
		</View>
	);
});
