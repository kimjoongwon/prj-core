"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { CourseTablePanel } from "../CourseTablePanel";
import type { CoursePassRow } from "../Course.types";

export interface CoursePassTableProps {
	passes: CoursePassRow[];
}

export const CoursePassTable = observer(({ passes }: CoursePassTableProps) => {
	return (
		<CourseTablePanel
			title="CoursePass"
			description="6개월 수강권의 발급일, 만료일, 잔여 예약 권리를 관리합니다."
			minWidthClassName="min-w-[820px]"
			header={
				<tr>
					<th className="w-[14%] px-3 py-3 font-medium">보유자</th>
					<th className="w-[18%] px-3 py-3 font-medium">Course</th>
					<th className="w-[18%] px-3 py-3 font-medium">Pass</th>
					<th className="w-[14%] px-3 py-3 font-medium">발급일</th>
					<th className="w-[14%] px-3 py-3 font-medium">만료일</th>
					<th className="w-[14%] px-3 py-3 font-medium">예약 권리</th>
					<th className="w-[8%] px-3 py-3 font-medium">상태</th>
				</tr>
			}
		>
			{passes.map((pass) => (
				<tr key={pass.id} className="border-border/70 border-b">
					<td className="px-3 py-4 font-medium text-foreground">
						{pass.holderName}
					</td>
					<td className="px-3 py-4 text-muted">{pass.courseName}</td>
					<td className="px-3 py-4 text-foreground">{pass.passLabel}</td>
					<td className="px-3 py-4 text-muted">{pass.issuedAtLabel}</td>
					<td className="px-3 py-4 text-muted">{pass.expiresAtLabel}</td>
					<td className="px-3 py-4 text-muted">
						{pass.remainingReservationLabel}
					</td>
					<td className="px-3 py-4">
						<Chip size="sm" variant="flat" color={pass.statusTone}>
							{pass.statusLabel}
						</Chip>
					</td>
				</tr>
			))}
		</CourseTablePanel>
	);
});

CoursePassTable.displayName = "CoursePassTable";
