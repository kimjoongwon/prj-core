"use client";

import { PageSurface, VStack } from "@cocrepo/ui";
import { Button } from "@cocrepo/ui/heroui";
import { RefreshCw } from "lucide-react";
import { observer } from "mobx-react-lite";
import type {
	PaymentManagementConsoleProps,
	PaymentManagementPayment,
	PaymentManagementQueryState,
	PaymentManagementSummary,
} from "../../feature/payment-management";
import { PaymentManagementConsole } from "../../feature/payment-management";
import { PageTitleBar } from "../../widget";

export interface PaymentManagementPageProps
	extends PaymentManagementConsoleProps {
	onClickRefresh?: () => void;
}

export const PaymentManagementPage = observer(
	({ onClickRefresh, ...consoleProps }: PaymentManagementPageProps) => {
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title="결제 관리"
					description="Space별 결제 원장을 Course와 앞으로 추가될 Product까지 같은 구조로 추적합니다."
					actions={
						onClickRefresh ? (
							<Button
								variant="flat"
								color="primary"
								startContent={<RefreshCw className="size-4" />}
								onPress={onClickRefresh}
							>
								새로고침
							</Button>
						) : null
					}
				/>
				<PageSurface className="rounded-2xl border-divider/80 bg-content1/50 p-5">
					<PaymentManagementConsole {...consoleProps} />
				</PageSurface>
			</VStack>
		);
	},
);

PaymentManagementPage.displayName = "PaymentManagementPage";

export type {
	PaymentManagementPayment,
	PaymentManagementQueryState,
	PaymentManagementSummary,
};
