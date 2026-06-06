"use client";

import { HStack, Surface, VStack } from "@cocrepo/ui";
import { AlertCircle, Database, RefreshCw } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Spinner } from "@heroui/react";

export type CourseTableStatePanelStatus =
	| "loading"
	| "refreshing"
	| "error"
	| "empty";

export interface CourseTableStatePanelProps {
	status: CourseTableStatePanelStatus;
	sectionLabel: string;
}

const getCourseTableStateText = (
	status: CourseTableStatePanelStatus,
	sectionLabel: string,
) => {
	if (status === "loading") {
		return {
			title: "데이터를 불러오는 중입니다",
			description: `${sectionLabel} 목록을 준비하고 있습니다.`,
		};
	}

	if (status === "refreshing") {
		return {
			title: "업데이트 중",
			description: `${sectionLabel} 목록을 최신 상태로 맞추고 있습니다.`,
		};
	}

	if (status === "error") {
		return {
			title: "데이터를 불러오지 못했습니다",
			description: "잠시 후 다시 시도해 주세요.",
		};
	}

	return {
		title: `표시할 ${sectionLabel} 항목이 없습니다`,
		description: "조건에 맞는 항목이 생기면 여기에 표시됩니다.",
	};
};

export const CourseTableStatePanel = observer(
	({ status, sectionLabel }: CourseTableStatePanelProps) => {
		const stateText = getCourseTableStateText(status, sectionLabel);
		const isLoading = status === "loading";
		const isRefreshing = status === "refreshing";
		const isError = status === "error";

		return (
			<Surface className="rounded-2xl border-border/80 bg-surface/70 p-5">
				<HStack gap="block" alignItems="center">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-default text-muted">
						{isLoading ? <Spinner size="sm" /> : null}
						{isRefreshing ? <RefreshCw className="size-4" /> : null}
						{isError ? <AlertCircle className="size-4 text-danger" /> : null}
						{!isLoading && !isRefreshing && !isError ? (
							<Database className="size-4" />
						) : null}
					</div>
					<VStack gap="dense">
						<p className="font-medium text-foreground">{stateText.title}</p>
						<p className="text-muted text-sm">{stateText.description}</p>
					</VStack>
				</HStack>
			</Surface>
		);
	},
);

CourseTableStatePanel.displayName = "CourseTableStatePanel";
