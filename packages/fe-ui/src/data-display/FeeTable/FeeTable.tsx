import { HStack } from "../../rhythm/HStack/HStack";
import { VStack } from "../../rhythm/VStack/VStack";
import { Typography } from "../Typography";

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
					<Typography.Paragraph size="sm">
						{item.day}: {item.time}
					</Typography.Paragraph>
					<Typography.Paragraph size="sm">${item.fee}</Typography.Paragraph>
				</HStack>
			))}

			{total !== undefined && (
				<>
					<div className="my-2 border-t border-border" />
					<HStack justifyContent="between" fullWidth>
						<Typography.Paragraph size="sm" className="font-bold">
							Total:
						</Typography.Paragraph>
						<Typography.Paragraph size="sm" className="font-bold">
							${total}
						</Typography.Paragraph>
					</HStack>
				</>
			)}
		</VStack>
	);
};
