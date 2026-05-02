"use client";

import { Switch } from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";
import { useState } from "react";

interface TemplateActiveToggleCellProps {
	/** 활성 여부 */
	isActive: boolean;
	/** 템플릿 ID */
	templateId: string;
	/** 토글 콜백 (API 호출) */
	onToggle: (id: string) => Promise<void>;
}

/**
 * 템플릿 활성/비활성을 인라인 Switch로 토글하는 Cell 컴포넌트
 *
 * - Optimistic UI: 클릭 즉시 상태 변경
 * - 실패 시 롤백 처리
 * - 토글 진행 중 Switch 비활성화
 */
export const TemplateActiveToggleCell = observer(
	function TemplateActiveToggleCell({
		isActive,
		templateId,
		onToggle,
	}: TemplateActiveToggleCellProps) {
		const [optimisticActive, setOptimisticActive] = useState(isActive);
		const [isLoading, setIsLoading] = useState(false);

		const handleToggle = async () => {
			if (isLoading) return;

			const previousValue = optimisticActive;
			setOptimisticActive(!previousValue);
			setIsLoading(true);

			try {
				await onToggle(templateId);
			} catch {
				// 실패 시 롤백
				setOptimisticActive(previousValue);
			} finally {
				setIsLoading(false);
			}
		};

		return (
			<div className="flex w-full justify-center">
				<Switch
					size="sm"
					isSelected={optimisticActive}
					isDisabled={isLoading}
					onValueChange={handleToggle}
					aria-label={optimisticActive ? "비활성화" : "활성화"}
				/>
			</div>
		);
	},
);

export type { TemplateActiveToggleCellProps };
