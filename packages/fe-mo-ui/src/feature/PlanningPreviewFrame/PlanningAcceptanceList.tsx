import type { PlanningAcceptance } from "@cocrepo/type";
import { View } from "react-native";
import { Text } from "../../data-display/Text";

export interface PlanningAcceptanceListProps {
	items?: readonly PlanningAcceptance[];
}

export function PlanningAcceptanceList({ items }: PlanningAcceptanceListProps) {
	if (!items || items.length === 0) {
		return (
			<Text className="rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted">
				acceptance 항목 없음
			</Text>
		);
	}

	return (
		<View className="gap-2">
			{items.map((item) => (
				<View
					className="flex-row gap-2 rounded-lg border border-border bg-background px-3 py-2"
					key={item.label}
				>
					<Text className="font-bold text-success">✓</Text>
					<Text className="flex-1 text-sm text-foreground">{item.label}</Text>
				</View>
			))}
		</View>
	);
}
