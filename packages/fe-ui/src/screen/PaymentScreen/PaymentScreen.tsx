"use client";

import { RefreshCw } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import type {
	PaymentConsoleProps,
	PaymentQueryState,
	PaymentRow,
	PaymentSummary,
} from "../../feature/PaymentConsole";
import { PaymentConsole } from "../../feature/PaymentConsole";
import { Section } from "../../layout";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";
import { PageTitleBar } from "../../widget";
export interface PaymentScreenProps extends PaymentConsoleProps {
	onClickRefresh?: () => void;
}
export const PaymentScreen = observer(
	({ onClickRefresh, ...consoleProps }: PaymentScreenProps) => {
		return (
			<VStack fullWidth>
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
				<SectionSurface>
					<Section>
						<Section.Body>
							<PaymentConsole {...consoleProps} />
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
PaymentScreen.displayName = "PaymentScreen";
export type { PaymentRow, PaymentQueryState, PaymentSummary };
