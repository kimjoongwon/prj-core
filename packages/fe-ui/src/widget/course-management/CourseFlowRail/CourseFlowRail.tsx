"use client";

import { HStack, Surface, VStack } from "@cocrepo/ui";
import { Chip } from "@cocrepo/ui/heroui";
import { CalendarDays, CheckCircle2, CreditCard, Ticket } from "lucide-react";
import { observer } from "mobx-react-lite";

const courseFlowItems = [
	{
		title: "Course",
		body: "무엇을 배우는가",
		icon: Ticket,
	},
	{
		title: "CourseOffering",
		body: "실제 개설된 반/기수",
		icon: CalendarDays,
	},
	{
		title: "Enrollment / Pass",
		body: "결제 후 활성화되는 수강 권리",
		icon: CreditCard,
	},
	{
		title: "Timeline / Reservation",
		body: "운영 일정과 회차 좌석 확보",
		icon: CheckCircle2,
	},
] as const;

export const CourseFlowRail = observer(() => {
	return (
		<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
				{courseFlowItems.map((item, index) => {
					const Icon = item.icon;

					return (
						<div
							key={item.title}
							className="min-h-32 border-divider/70 border-b p-5 md:border-r xl:border-b-0"
						>
							<HStack alignItems="center" gap="inline">
								<span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
									<Icon className="size-4" />
								</span>
								<Chip size="sm" variant="flat" color="primary">
									{String(index + 1).padStart(2, "0")}
								</Chip>
							</HStack>
							<VStack className="mt-4" gap="dense">
								<h3 className="text-base font-semibold text-foreground">
									{item.title}
								</h3>
								<p className="text-sm text-default-600">{item.body}</p>
							</VStack>
						</div>
					);
				})}
			</div>
		</Surface>
	);
});

CourseFlowRail.displayName = "CourseFlowRail";
