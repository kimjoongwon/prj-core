import type { ReactElement } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { PlanningAcceptanceList } from "./PlanningAcceptanceList";
import { PlanningApiRequestList } from "./PlanningApiRequestList";
import { PlanningPreviewField } from "./PlanningPreviewField";
import {
	formatPlanningList,
	formatPlanningStatus,
} from "./planningPreviewFormat";
import type { PlanningPreviewFrameProps } from "./types";

type PlanningPreviewFrameComponent = {
	<THandler = unknown>(
		props: PlanningPreviewFrameProps<THandler>,
	): ReactElement;
	displayName?: string;
};

export const PlanningPreviewFrame = (<THandler = unknown,>({
	children,
	scenario,
}: PlanningPreviewFrameProps<THandler>) => {
	const { api, context } = scenario;

	return (
		<ScrollView className="flex-1 bg-background">
			<View className="gap-3 p-3">
				<View className="gap-2 rounded-xl border border-border bg-surface p-4">
					<Text className="text-xs font-bold uppercase text-primary">
						Planning Preview
					</Text>
					<Text className="text-xl font-extrabold text-foreground">
						{scenario.title}
					</Text>
					{scenario.description ? (
						<Text className="text-sm leading-5 text-muted">
							{scenario.description}
						</Text>
					) : null}
				</View>

				<View className="rounded-xl border border-border bg-surface-secondary p-3">
					<View className="rounded-lg border border-border bg-background p-3">
						{children}
					</View>
				</View>

				<View className="gap-2 rounded-xl border border-border bg-surface p-4">
					<Text className="text-sm font-bold text-foreground">Planning</Text>
					<PlanningPreviewField label="id" value={scenario.id} />
					<PlanningPreviewField label="route" value={scenario.routePath} />
					<PlanningPreviewField label="owner" value={scenario.owner} />
					<PlanningPreviewField
						label="status"
						value={formatPlanningStatus(scenario.status)}
					/>
				</View>

				<View className="gap-2 rounded-xl border border-border bg-surface p-4">
					<Text className="text-sm font-bold text-foreground">Context</Text>
					<PlanningPreviewField label="realm" value={context.realm} />
					<PlanningPreviewField label="role" value={context.role} />
					<PlanningPreviewField label="tenant" value={context.tenantId} />
					<PlanningPreviewField label="space" value={context.spaceId} />
					<PlanningPreviewField
						label="abilities"
						value={formatPlanningList(context.abilities)}
					/>
				</View>

				<View className="gap-2 rounded-xl border border-border bg-surface p-4">
					<Text className="text-sm font-bold text-foreground">
						API Scenario
					</Text>
					<PlanningPreviewField label="mode" value={api?.mode ?? "none"} />
					<PlanningPreviewField label="name" value={api?.name} />
					<PlanningApiRequestList requests={api?.requests} />
				</View>

				<View className="gap-2 rounded-xl border border-border bg-surface p-4">
					<Text className="text-sm font-bold text-foreground">Acceptance</Text>
					<PlanningAcceptanceList items={scenario.acceptance} />
				</View>
			</View>
		</ScrollView>
	);
}) as PlanningPreviewFrameComponent;

PlanningPreviewFrame.displayName = "PlanningPreviewFrame";
