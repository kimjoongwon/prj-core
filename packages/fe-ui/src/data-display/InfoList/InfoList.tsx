import type { ReactNode } from "react";

/** InfoList 항목의 표시 계약입니다. */
export interface InfoListItem {
	/** 항목을 구분하는 key입니다. 생략하면 배열 index로 대체합니다. */
	key?: string;
	/** 항목의 label(dt)입니다. */
	label: ReactNode;
	/** 항목의 값(dd)입니다. 문자열 대신 Chip 같은 표시 요소를 넘길 수 있습니다. */
	value: ReactNode;
}

/** InfoList의 반응형 최대 column 수입니다. */
export type InfoListColumns = 2 | 3;

const infoListGridClassNames: Record<InfoListColumns, string> = {
	2: "grid grid-cols-1 gap-4 md:grid-cols-2",
	3: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3",
};

export interface InfoListProps {
	/** label/value로 표시할 항목 목록입니다. */
	items: InfoListItem[];
	/** 반응형 최대 column 수입니다. 기본 2단이며 3단은 xl부터 적용합니다. */
	columns?: InfoListColumns;
}

/**
 * InfoList 컴포넌트
 * 상세 화면의 label/value 메타 정보를 정의 목록(dl)으로 표시합니다.
 * 항목 표면은 surface-secondary 한 단계 아래 면을 사용해 본문 표면과 구분합니다.
 *
 * @example
 * ```tsx
 * <InfoList
 *   items={[
 *     { key: "id", label: "Role ID", value: role.id },
 *     { key: "status", label: "상태", value: <Chip color="success">사용 중</Chip> },
 *   ]}
 * />
 * ```
 */
export function InfoList({ items, columns = 2 }: InfoListProps) {
	return (
		<dl className={infoListGridClassNames[columns]}>
			{items.map((item, index) => (
				<div
					key={item.key ?? index}
					className="rounded-lg border border-border bg-surface-secondary p-3"
				>
					<dt className="text-xs text-muted">{item.label}</dt>
					<dd className="mt-1 break-all text-sm font-medium">{item.value}</dd>
				</div>
			))}
		</dl>
	);
}
