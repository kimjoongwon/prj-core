"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { CourseTableShell } from "../CourseTableShell";
import type { CourseEnrollmentRow } from "../Course.types";

export interface CourseEnrollmentTableProps {
	enrollments: CourseEnrollmentRow[];
}

export const CourseEnrollmentTable = observer(
	({ enrollments }: CourseEnrollmentTableProps) => {
		return (
			<CourseTableShell
				title="Enrollment"
				description="결제 이후 활성화되는 수강 신청 상태와 예약 사용 현황을 봅니다."
				minWidthClassName="min-w-[880px]"
				header={
					<tr>
						<th className="w-[14%] px-3 py-3 font-medium">수강자</th>
						<th className="w-[16%] px-3 py-3 font-medium">Course</th>
						<th className="w-[22%] px-3 py-3 font-medium">Offering</th>
						<th className="w-[14%] px-3 py-3 font-medium">Payment</th>
						<th className="w-[18%] px-3 py-3 font-medium">유효기간</th>
						<th className="w-[10%] px-3 py-3 font-medium">예약</th>
						<th className="w-[6%] px-3 py-3 font-medium">상태</th>
					</tr>
				}
			>
				{enrollments.map((enrollment) => (
					<tr key={enrollment.id} className="border-border/70 border-b">
						<td className="px-3 py-4 font-medium text-foreground">
							{enrollment.studentName}
						</td>
						<td className="px-3 py-4 text-muted">{enrollment.courseName}</td>
						<td className="px-3 py-4 text-foreground">
							{enrollment.offeringName}
						</td>
						<td className="px-3 py-4 text-foreground">
							{enrollment.paymentLabel}
						</td>
						<td className="px-3 py-4 text-muted">{enrollment.validityLabel}</td>
						<td className="px-3 py-4 text-muted">
							{enrollment.reservationSummary}
						</td>
						<td className="px-3 py-4">
							<Chip size="sm" variant="flat" color={enrollment.statusTone}>
								{enrollment.statusLabel}
							</Chip>
						</td>
					</tr>
				))}
			</CourseTableShell>
		);
	},
);

CourseEnrollmentTable.displayName = "CourseEnrollmentTable";
