"use client";

import { HStack, SectionSurface, VStack } from "@cocrepo/ui";
import { BadgeDollarSign, CheckCircle2, Clock3, Layers3 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { PaymentManagementMetric } from "../types";

export interface PaymentMetricGridProps {
	metrics: PaymentManagementMetric[];
}

const metricIcons = {
	payment: BadgeDollarSign,
	paid: CheckCircle2,
	pending: Clock3,
	service: Layers3,
};

export const PaymentMetricGrid = observer(
	({ metrics }: PaymentMetricGridProps) => {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
				{metrics.map((metric) => {
					const Icon = metricIcons[metric.icon];

					return (
						<SectionSurface
							key={metric.label}
							className="rounded-2xl border-border/80 bg-surface/70 p-5"
						>
							<HStack alignItems="center" justifyContent="between" fullWidth>
								<VStack gap="dense">
									<span className="text-sm text-muted">
										{metric.label}
									</span>
									<strong className="text-2xl font-semibold text-foreground">
										{metric.value}
									</strong>
									<span className="text-xs text-muted">
										{metric.description}
									</span>
								</VStack>
								<span className="flex size-10 items-center justify-center rounded-lg bg-default/15 text-accent">
									<Icon className="size-5" />
								</span>
							</HStack>
						</SectionSurface>
					);
				})}
			</div>
		);
	},
);

PaymentMetricGrid.displayName = "PaymentMetricGrid";
