"use client";

import { Card } from "@heroui/react";
import { Construction } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

export interface UnderConstructionProps {
	/** 구현을 준비 중인 기능의 제목 */
	title: string;
	/** 사용자에게 보여줄 안내 문구 */
	description?: string;
}

/**
 * 아직 구현 중인 기능을 안내하는 공용 상태 UI입니다.
 *
 * @param props 표시할 기능 제목과 안내 문구
 * @returns 공사중 상태 카드
 */
export const UnderConstruction = observer(function UnderConstruction({
	title,
	description = "이 기능은 준비 중입니다.",
}: UnderConstructionProps) {
	const t = useT();

	return (
		<Card className="border border-border bg-surface/50">
			<Card.Content>
				<output
					aria-live="polite"
					className="flex min-h-64 flex-col items-center justify-center gap-4 px-6 py-16 text-center"
				>
					<Construction aria-hidden className="size-10 text-muted" />
					<div className="space-y-2">
						<h1 className="text-2xl font-bold">{t(title)}</h1>
						<p className="text-muted">{t(description)}</p>
					</div>
				</output>
			</Card.Content>
		</Card>
	);
});
