import { HStack } from "../../../layouts/HStack/HStack";
import { VStack } from "../../../layouts/VStack/VStack";
import { Text } from "../Text/Text";

export interface FeeItem {
	/** 요일 */
	day: string;
	/** 시간대 */
	time: string;
	/** 요금 */
	fee: number;
}

export interface FeeTableProps {
	/** 요금 항목 목록 */
	items: FeeItem[];
	/** 총 요금 (표시하려면 제공) */
	total?: number;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * FeeTable 컴포넌트
 * 요일/시간별 요금표를 표시합니다.
 *
 * @example
 * ```tsx
 * <FeeTable
 *   items={[
 *     { day: "월요일", time: "09:00-12:00", fee: 30000 },
 *     { day: "화요일", time: "14:00-17:00", fee: 35000 },
 *   ]}
 *   total={65000}
 * />
 * ```
 */
export const FeeTable = ({ items, total, className }: FeeTableProps) => {
	return (
		<VStack gap={2} className={className}>
			{items.map((item, index) => (
				<HStack key={index} justifyContent="between" fullWidth>
					<Text variant="body2">
						{item.day}: {item.time}
					</Text>
					<Text variant="body2">${item.fee}</Text>
				</HStack>
			))}

			{total !== undefined && (
				<>
					<div className="my-2 border-t border-default-200" />
					<HStack justifyContent="between" fullWidth>
						<Text variant="body2" className="font-bold">
							Total:
						</Text>
						<Text variant="body2" className="font-bold">
							${total}
						</Text>
					</HStack>
				</>
			)}
		</VStack>
	);
};
