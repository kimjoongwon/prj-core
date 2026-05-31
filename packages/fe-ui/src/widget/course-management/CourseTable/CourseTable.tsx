"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../../design-system/primitives";
import { CourseTableShell } from "../CourseTableShell";
import type { CourseManagementCourse } from "../types";

export interface CourseTableProps {
	courses: CourseManagementCourse[];
}

export const CourseTable = observer(({ courses }: CourseTableProps) => {
	return (
		<CourseTableShell
			title="Course"
			description="무엇을 배우는지와 기본 수강 상품 정책을 관리합니다."
			minWidthClassName="min-w-[760px]"
			header={
				<tr>
					<th className="w-[24%] px-3 py-3 font-medium">과정</th>
					<th className="w-[28%] px-3 py-3 font-medium">설명</th>
					<th className="w-[14%] px-3 py-3 font-medium">기간</th>
					<th className="w-[14%] px-3 py-3 font-medium">기본가</th>
					<th className="w-[12%] px-3 py-3 font-medium">운영</th>
					<th className="w-[8%] px-3 py-3 font-medium">상태</th>
				</tr>
			}
		>
			{courses.map((course) => (
				<tr key={course.id} className="border-divider/70 border-b">
					<td className="px-3 py-4 font-medium text-foreground">
						{course.name}
					</td>
					<td className="px-3 py-4 text-default-600">{course.description}</td>
					<td className="px-3 py-4 text-default-700">{course.durationLabel}</td>
					<td className="px-3 py-4 text-default-700">{course.priceLabel}</td>
					<td className="px-3 py-4 text-default-600">
						{course.activeOfferingCount}개 반 · {course.activeEnrollmentCount}명
					</td>
					<td className="px-3 py-4">
						<Chip size="sm" variant="flat" color={course.statusTone}>
							{course.statusLabel}
						</Chip>
					</td>
				</tr>
			))}
		</CourseTableShell>
	);
});

CourseTable.displayName = "CourseTable";
