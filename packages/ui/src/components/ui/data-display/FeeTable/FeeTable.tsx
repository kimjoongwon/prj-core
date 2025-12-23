import { HStack } from "../../surfaces/HStack/HStack";
import { VStack } from "../../surfaces/VStack/VStack";
import { Text } from "../Text/Text";

export interface FeeItem {
	day: string;
	time: string;
	fee: number;
}

export interface FeeTableProps {
	items: FeeItem[];
	total?: number;
	className?: string;
}

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
