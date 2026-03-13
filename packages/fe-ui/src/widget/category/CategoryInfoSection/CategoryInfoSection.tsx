"use client";

import { Link } from "@heroui/react";
import { observer } from "mobx-react-lite";

export interface CategoryInfo {
	name: string;
	type: string;
	parentId?: string | null;
	parent?: {
		id: string;
		name: string;
	} | null;
	createdAt: string;
	updatedAt: string;
}

export interface CategoryInfoSectionProps {
	/** 카테고리 정보 */
	category: CategoryInfo;
	/** 카테고리 상세 링크 기본 경로 */
	categoriesBasePath?: string;
}

/**
 * CategoryInfoSection 컴포넌트
 * 카테고리 상세 화면에서 기본 정보를 표시하는 섹션입니다.
 */
export const CategoryInfoSection = observer(
	({
		category,
		categoriesBasePath = "/roles/categories",
	}: CategoryInfoSectionProps) => {
		const fields = [
			{ label: "이름", value: category.name },
			{ label: "유형", value: category.type },
			{
				label: "상위 카테고리",
				value: category.parent ? (
					<Link href={`${categoriesBasePath}/${category.parent.id}`} size="sm">
						{category.parent.name}
					</Link>
				) : (
					"- (최상위)"
				),
			},
			{
				label: "생성일",
				value: new Date(category.createdAt).toLocaleString("ko-KR"),
			},
			{
				label: "수정일",
				value: new Date(category.updatedAt).toLocaleString("ko-KR"),
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
	},
);
