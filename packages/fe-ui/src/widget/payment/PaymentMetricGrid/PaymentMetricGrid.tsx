"use client";

import { Surface } from "@cocrepo/ui";
import { BadgeDollarSign, CheckCircle2, Clock3, Layers3 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { PaymentMetric } from "../types";

export interface PaymentMetricGridProps {
	metrics: PaymentMetric[];
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
						<Surface
							key={metric.label}
							className="rounded-2xl border-border/80 bg-surface/70 p-5"
						>
							<div className="flex w-full items-center justify-between gap-4">
								<div className="flex flex-col gap-1">
									<span className="text-sm text-muted">{metric.label}</span>
									<strong className="text-2xl font-semibold text-foreground">
										{metric.value}
									</strong>
									<span className="text-xs text-muted">
										{metric.description}
									</span>
								</div>
								<span className="flex size-10 items-center justify-center rounded-lg bg-default/15 text-accent">
									<Icon className="size-5" />
								</span>
							</div>
						</Surface>
					);
				})}
			</div>
		);
	},
);

PaymentMetricGrid.displayName = "PaymentMetricGrid";
