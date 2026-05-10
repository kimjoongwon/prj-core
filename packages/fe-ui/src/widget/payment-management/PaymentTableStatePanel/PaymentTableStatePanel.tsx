"use client";

import { SectionSurface, VStack } from "@cocrepo/ui";
import { AlertCircle, CreditCard, LoaderCircle, RefreshCw } from "lucide-react";
import { observer } from "mobx-react-lite";

export type PaymentTableStatePanelStatus =
	| "loading"
	| "refreshing"
	| "error"
	| "empty";

export interface PaymentTableStatePanelProps {
	status: PaymentTableStatePanelStatus;
}

const statusCopy: Record<
	PaymentTableStatePanelStatus,
	{ title: string; description: string }
> = {
	loading: {
		title: "결제 원장을 불러오는 중입니다",
		description: "현재 Space 권한 기준으로 결제 데이터를 조회하고 있습니다.",
	},
	refreshing: {
		title: "결제 원장을 갱신 중입니다",
		description: "이미 표시된 목록은 유지한 채 최신 결제 상태를 확인합니다.",
	},
	error: {
		title: "결제 원장을 불러오지 못했습니다",
		description: "잠시 후 다시 조회하거나 API 연결 상태를 확인해 주세요.",
	},
	empty: {
		title: "표시할 Payment 항목이 없습니다",
		description: "현재 Space 권한에서 조회 가능한 결제 기록이 없습니다.",
	},
};

const statusIcons = {
	loading: LoaderCircle,
	refreshing: RefreshCw,
	error: AlertCircle,
	empty: CreditCard,
};

export const PaymentTableStatePanel = observer(
	({ status }: PaymentTableStatePanelProps) => {
		const copy = statusCopy[status];
		const Icon = statusIcons[status];
		const animateClass =
			status === "loading" || status === "refreshing" ? " animate-spin" : "";

		return (
			<SectionSurface className="rounded-2xl border-divider/80 bg-content1/70 p-8">
				<VStack alignItems="center" gap="block" className="text-center">
					<span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
						<Icon className={`size-6${animateClass}`} />
					</span>
					<VStack gap="dense">
						<strong className="text-lg font-semibold text-foreground">
							{copy.title}
						</strong>
						<p className="text-sm text-default-600">{copy.description}</p>
					</VStack>
				</VStack>
			</SectionSurface>
		);
	},
);

PaymentTableStatePanel.displayName = "PaymentTableStatePanel";
