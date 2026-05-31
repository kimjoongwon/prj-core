"use client";

import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import {
	Card,
	CardBody,
	CardHeader,
	Chip,
} from "../../../design-system/primitives";
import { translateNode, useT } from "../../../i18n";

export interface EmptyStateProps {
	/** 제목 */
	title: string;
	/** 설명 */
	description: string;
	/** 상태 라벨 (기본: "준비 중") */
	statusLabel?: string;
	/** 아이콘 (옵션) */
	icon?: ReactNode;
	/** 액션 버튼 (옵션) */
	action?: ReactNode;
}

/**
 * EmptyState 컴포넌트
 * 데이터가 없거나 구현되지 않은 페이지에 표시합니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <EmptyState
 *   title="검색 결과 없음"
 *   description="검색 조건에 맞는 데이터가 없습니다."
 * />
 *
 * // 커스텀 아이콘과 액션 버튼
 * <EmptyState
 *   title="할 일이 없습니다"
 *   description="새로운 할 일을 추가해보세요."
 *   icon={<CheckCircle className="h-8 w-8" />}
 *   action={<Button onPress={handleAdd}>추가하기</Button>}
 * />
 * ```
 */
export const EmptyState = observer(
	({
		title,
		description,
		statusLabel = "준비 중",
		icon,
		action,
	}: EmptyStateProps) => {
		const t = useT();

		return (
			<Card className="bg-content1/50 border border-divider">
				<CardHeader className="pb-0">
					<h2 className="text-2xl font-bold">{t(title)}</h2>
				</CardHeader>
				<CardBody>
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<div className="w-16 h-16 rounded-full bg-default-100 flex items-center justify-center mb-4">
							{icon ?? (
								<Chip color="default" variant="flat" size="sm">
									{t(statusLabel)}
								</Chip>
							)}
						</div>
						<p className="text-default-500 mb-2">{t(description)}</p>
						<p className="text-default-400 text-sm">
							{t("이 영역은 기능 구현 전 빈 상태입니다.")}
						</p>
						{action && <div className="mt-4">{translateNode(action, t)}</div>}
					</div>
				</CardBody>
			</Card>
		);
	},
);
