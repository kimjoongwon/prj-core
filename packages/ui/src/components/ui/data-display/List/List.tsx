import type { ReactNode } from "react";
import { v4 } from "uuid";

export interface ListProps<T> {
	/** 렌더링할 데이터 배열 */
	data: T[];
	/** 각 아이템 렌더링 함수 */
	renderItem: (item: T, index: number) => ReactNode;
	/** 가로 배치 여부 @default false */
	horizontal?: boolean;
	/** 컨테이너 CSS 클래스 */
	className?: string;
	/** 빈 상태일 때 표시할 콘텐츠 */
	placeholder?: ReactNode;
	/** 아이템 간 간격 @default "0.5rem" */
	gap?: number | string;
	/** 각 아이템 래퍼 CSS 클래스 */
	itemClassName?: string;
}

/**
 * List 컴포넌트
 * 데이터 배열을 리스트로 렌더링하는 유틸리티 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * // 세로 리스트 (기본)
 * <List
 *   data={users}
 *   renderItem={(user) => <UserCard user={user} />}
 *   placeholder={<EmptyState message="사용자가 없습니다" />}
 * />
 *
 * // 가로 리스트
 * <List
 *   data={images}
 *   renderItem={(img) => <ImageCard src={img.url} />}
 *   horizontal
 *   gap="1rem"
 * />
 * ```
 */
export const List = <T extends object>(props: ListProps<T>) => {
	const {
		data,
		renderItem,
		horizontal = false,
		className = "",
		placeholder,
		gap = "0.5rem",
		itemClassName = "",
	} = props;

	if (data.length === 0) {
		return placeholder ? <div className={className}>{placeholder}</div> : null;
	}

	const containerStyle: React.CSSProperties = {
		display: "flex",
		flexDirection: horizontal ? "row" : "column",
		gap: gap,
		...(horizontal && {
			overflowX: "auto",
			alignItems: "flex-start",
		}),
	};

	const containerClasses = `list-container ${className}`.trim();

	return (
		<div className={containerClasses} style={containerStyle}>
			{data.map((item, index) => (
				<div key={v4()} className={itemClassName}>
					{renderItem(item, index)}
				</div>
			))}
		</div>
	);
};
