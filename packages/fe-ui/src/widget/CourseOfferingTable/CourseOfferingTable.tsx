"use client";

import { Tooltip } from "@heroui/react";
import { ExternalLink } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";
import type { CourseOfferingRow } from "../Course.types";
import { CourseTablePanel } from "../CourseTablePanel";

export interface CourseOfferingTableProps {
	offerings: CourseOfferingRow[];
	onClickTimeline: (href: string) => void;
}

interface CourseOfferingTimelineButtonProps {
	offering: CourseOfferingRow;
	onClickTimeline: (href: string) => void;
}

const getCapacityLabel = (enrolledCount: number, capacity: number) => {
	return `${enrolledCount}/${capacity}명`;
};

const CourseOfferingTimelineButton = observer(
	({ offering, onClickTimeline }: CourseOfferingTimelineButtonProps) => {
		const onClickCourseOfferingTimelineButton = () => {
			onClickTimeline(offering.timelineHref);
		};

		return (
			<Tooltip>
				<Tooltip.Trigger>
					<Button
						size="sm"
						variant="flat"
						endContent={<ExternalLink className="size-3.5" />}
						onPress={onClickCourseOfferingTimelineButton}
					>
						{offering.timelineName}
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>타임라인 관리로 이동</Tooltip.Content>
			</Tooltip>
		);
	},
);

export const CourseOfferingTable = observer(
	({ offerings, onClickTimeline }: CourseOfferingTableProps) => {
		return (
			<CourseTablePanel
				title="CourseOffering"
				description="지점, 기수, 모집 정원, 연결된 Timeline을 확인합니다."
				minWidthClassName="min-w-[900px]"
				header={
					<tr>
						<th className="w-[18%] px-3 py-3 font-medium">개설 반</th>
						<th className="w-[16%] px-3 py-3 font-medium">Course</th>
						<th className="w-[12%] px-3 py-3 font-medium">Space</th>
						<th className="w-[16%] px-3 py-3 font-medium">기간</th>
						<th className="w-[18%] px-3 py-3 font-medium">Timeline</th>
						<th className="w-[10%] px-3 py-3 font-medium">정원</th>
						<th className="w-[10%] px-3 py-3 font-medium">상태</th>
					</tr>
				}
			>
				{offerings.map((offering) => (
					<tr key={offering.id} className="border-border/70 border-b">
						<td className="px-3 py-4 font-medium text-foreground">
							{offering.name}
						</td>
						<td className="px-3 py-4 text-muted">{offering.courseName}</td>
						<td className="px-3 py-4 text-foreground">{offering.spaceLabel}</td>
						<td className="px-3 py-4 text-foreground">
							{offering.periodLabel}
						</td>
						<td className="px-3 py-4">
							<CourseOfferingTimelineButton
								offering={offering}
								onClickTimeline={onClickTimeline}
							/>
						</td>
						<td className="px-3 py-4 text-muted">
							{getCapacityLabel(offering.enrolledCount, offering.capacity)}
						</td>
						<td className="px-3 py-4">
							<Chip size="sm" variant="flat" color={offering.statusTone}>
								{offering.statusLabel}
							</Chip>
						</td>
					</tr>
				))}
			</CourseTablePanel>
		);
	},
);

CourseOfferingTable.displayName = "CourseOfferingTable";
