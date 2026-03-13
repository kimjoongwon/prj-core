"use client";

import { observer } from "mobx-react-lite";

export interface GroupInfo {
	name: string;
	label?: string | null;
	type: string;
	createdAt: string;
	updatedAt: string;
}

export interface GroupInfoSectionProps {
	/** 그룹 정보 */
	group: GroupInfo;
}

/**
 * GroupInfoSection 컴포넌트
 * 그룹 상세 화면에서 기본 정보를 표시하는 섹션입니다.
 */
export const GroupInfoSection = observer(({ group }: GroupInfoSectionProps) => {
	const fields = [
		{ label: "이름", value: group.name },
		{ label: "라벨", value: group.label || "-" },
		{ label: "유형", value: group.type },
		{
			label: "생성일",
			value: new Date(group.createdAt).toLocaleString("ko-KR"),
		},
		{
			label: "수정일",
			value: new Date(group.updatedAt).toLocaleString("ko-KR"),
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{fields.map((field) => (
				<div key={field.label}>
					<dt className="text-sm text-default-500">{field.label}</dt>
					<dd className="mt-1 text-sm font-medium text-default-800">
						{field.value}
					</dd>
				</div>
			))}
		</div>
	);
});
