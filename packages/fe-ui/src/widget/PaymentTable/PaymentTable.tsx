"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { PaymentTableShell } from "../PaymentTableShell";
import type { PaymentRow } from "../Payment.types";

export interface PaymentTableProps {
	payments: PaymentRow[];
}

export const PaymentTable = observer(({ payments }: PaymentTableProps) => {
	return (
		<PaymentTableShell
			title="Payment"
			description="현재 Space 권한 안의 결제 원장과 Course/Product 대상 연결을 확인합니다."
			minWidthClassName="min-w-[1080px]"
			header={
				<tr>
					<th className="w-[18%] px-3 py-3 font-medium">결제</th>
					<th className="w-[12%] px-3 py-3 font-medium">Space</th>
					<th className="w-[13%] px-3 py-3 font-medium">결제자</th>
					<th className="w-[18%] px-3 py-3 font-medium">대상</th>
					<th className="w-[13%] px-3 py-3 font-medium">참조</th>
					<th className="w-[10%] px-3 py-3 font-medium">금액</th>
					<th className="w-[8%] px-3 py-3 font-medium">상태</th>
					<th className="w-[8%] px-3 py-3 font-medium">승인일</th>
				</tr>
			}
		>
			{payments.map((payment) => (
				<tr key={payment.id} className="border-border/70 border-b">
					<td className="px-3 py-4">
						<div className="min-w-0">
							<div className="truncate font-medium text-foreground">
								{payment.title}
							</div>
							<div className="truncate text-xs text-muted">
								{payment.providerLabel} · {payment.methodLabel}
							</div>
						</div>
					</td>
					<td className="px-3 py-4 text-foreground">{payment.spaceLabel}</td>
					<td className="px-3 py-4 text-foreground">{payment.payerLabel}</td>
					<td className="px-3 py-4 text-foreground">
						<div className="truncate">{payment.subjectLabel}</div>
					</td>
					<td className="px-3 py-4 text-muted">
						<div className="truncate">{payment.referenceLabel}</div>
					</td>
					<td className="px-3 py-4 font-medium text-foreground">
						{payment.amountLabel}
					</td>
					<td className="px-3 py-4">
						<Chip size="sm" variant="flat" color={payment.statusTone}>
							{payment.statusLabel}
						</Chip>
					</td>
					<td className="px-3 py-4 text-muted">{payment.approvedAtLabel}</td>
				</tr>
			))}
		</PaymentTableShell>
	);
});

PaymentTable.displayName = "PaymentTable";
