import { View } from "react-native";
import { Text } from "../../data-display/Text";

export interface PlanningPreviewFieldProps {
	label: string;
	value?: string;
}

export function PlanningPreviewField({
	label,
	value,
}: PlanningPreviewFieldProps) {
	return (
		<View className="rounded-lg border border-border bg-surface px-3 py-2">
			<Text className="text-[11px] font-bold uppercase text-muted">
				{label}
			</Text>
			<Text className="mt-1 text-sm text-foreground">{value || "-"}</Text>
		</View>
	);
}
