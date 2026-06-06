"use client";

import { HStack, SectionSurface, VStack } from "@cocrepo/ui";
import { Building2, CreditCard, Layers3, Link2 } from "lucide-react";
import { observer } from "mobx-react-lite";

const scopeSteps = [
	{
		label: "Space",
		description: "현재 선택 Space 권한 안에서만 결제 원장을 조회합니다.",
		icon: Building2,
	},
	{
		label: "Payment",
		description: "Course와 Product 결제를 공통 원장으로 기록합니다.",
		icon: CreditCard,
	},
	{
		label: "Subject",
		description: "결제 대상의 서비스 코드와 리소스 ID를 보존합니다.",
		icon: Layers3,
	},
	{
		label: "Reference",
		description: "Enrollment, 주문, 외부 결제 ID를 역추적합니다.",
		icon: Link2,
	},
];

export const PaymentScopeRail = observer(() => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
			{scopeSteps.map((step, index) => {
				const Icon = step.icon;

				return (
					<SectionSurface
						key={step.label}
						className="rounded-2xl border-border/80 bg-surface/70 p-5"
					>
						<VStack gap="block">
							<HStack alignItems="center" gap="inline">
								<span className="flex size-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
									<Icon className="size-4" />
								</span>
								<span className="text-xs font-semibold text-muted">
									{`${index + 1}`.padStart(2, "0")}
								</span>
							</HStack>
							<VStack gap="dense">
								<strong className="text-base font-semibold text-foreground">
									{step.label}
								</strong>
								<p className="text-sm text-muted">{step.description}</p>
							</VStack>
						</VStack>
					</SectionSurface>
				);
			})}
		</div>
	);
});

PaymentScopeRail.displayName = "PaymentScopeRail";
