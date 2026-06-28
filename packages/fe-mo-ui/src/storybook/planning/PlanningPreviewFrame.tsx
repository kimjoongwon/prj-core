import type { PlanningAcceptance, PlanningScenario } from "@cocrepo/type";
import type { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";

export interface PlanningPreviewFrameProps<THandler = unknown>
	extends PropsWithChildren {
	scenario: PlanningScenario<THandler>;
}

function joinList(values?: readonly string[]) {
	return values && values.length > 0 ? values.join(", ") : "-";
}

function Field({ label, value }: { label: string; value?: string }) {
	return (
		<View className="rounded-lg border border-border bg-surface px-3 py-2">
			<Text className="text-[11px] font-bold uppercase text-muted">
				{label}
			</Text>
			<Text className="mt-1 text-sm text-foreground">{value || "-"}</Text>
		</View>
	);
}

function AcceptanceList({ items }: { items?: readonly PlanningAcceptance[] }) {
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

export function PlanningPreviewFrame<THandler = unknown>({
	children,
	scenario,
}: PlanningPreviewFrameProps<THandler>) {
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
					<Field label="id" value={scenario.id} />
					<Field label="route" value={scenario.routePath} />
					<Field label="owner" value={scenario.owner} />
					<Field label="status" value={scenario.status ?? "draft"} />
				</View>

				<View className="gap-2 rounded-xl border border-border bg-surface p-4">
					<Text className="text-sm font-bold text-foreground">Context</Text>
					<Field label="realm" value={context.realm} />
					<Field label="role" value={context.role} />
					<Field label="tenant" value={context.tenantId} />
					<Field label="space" value={context.spaceId} />
					<Field label="abilities" value={joinList(context.abilities)} />
				</View>

				<View className="gap-2 rounded-xl border border-border bg-surface p-4">
					<Text className="text-sm font-bold text-foreground">
						API Scenario
					</Text>
					<Field label="mode" value={api?.mode ?? "none"} />
					<Field label="name" value={api?.name} />
					{api?.requests?.map((request) => (
						<Field
							key={`${request.method}:${request.path}:${request.status}`}
							label={`${request.method} ${request.status}`}
							value={request.path}
						/>
					))}
				</View>

				<View className="gap-2 rounded-xl border border-border bg-surface p-4">
					<Text className="text-sm font-bold text-foreground">Acceptance</Text>
					<AcceptanceList items={scenario.acceptance} />
				</View>
			</View>
		</ScrollView>
	);
}
