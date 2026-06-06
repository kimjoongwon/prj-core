"use client";

import { HStack, Surface, VStack } from "@cocrepo/ui";
import { CalendarDays, Clock3, Ticket, Users } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { CourseManagementMetric } from "../types";

export interface CourseMetricGridProps {
	metrics: CourseManagementMetric[];
}

const metricIcons = {
	course: Ticket,
	offering: CalendarDays,
	enrollment: Users,
	pass: Clock3,
};

export const CourseMetricGrid = observer(
	({ metrics }: CourseMetricGridProps) => {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
				{metrics.map((metric) => {
					const Icon = metricIcons[metric.icon];

					return (
						<Surface
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
								</VStack>
								<span className="flex size-10 items-center justify-center rounded-lg bg-default/15 text-accent">
									<Icon className="size-5" />
								</span>
							</HStack>
						</Surface>
					);
				})}
			</div>
		);
	},
);

CourseMetricGrid.displayName = "CourseMetricGrid";
