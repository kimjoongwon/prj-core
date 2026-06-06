"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { useT } from "../../i18n";

export interface AuditResultBadgeProps {
	/** 감사 결과 (SUCCESS, FAILURE, LOCKED 등) */
	result: string;
}

/** 결과별 스타일 매핑 */
const RESULT_CONFIG: Record<
	string,
	{ label: string; color: "success" | "danger" | "warning" }
> = {
	SUCCESS: { label: "성공", color: "success" },
	FAILURE: { label: "실패", color: "danger" },
	LOCKED: { label: "잠금", color: "warning" },
};

/**
 * 감사 결과 뱃지
 *
 * 로그인 감사 로그의 결과(SUCCESS/FAILURE/LOCKED)를 색상 칩으로 표시합니다.
 */
export const AuditResultBadge = observer(
	({ result }: AuditResultBadgeProps) => {
		const t = useT();
		const { label, color } = RESULT_CONFIG[result] ?? {
			label: result,
			color: "danger" as const,
		};

		return (
			<Chip size="sm" color={color} variant="flat">
				{t(label)}
			</Chip>
		);
	},
);

AuditResultBadge.displayName = "AuditResultBadge";
