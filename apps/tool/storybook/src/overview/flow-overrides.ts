export interface FlowOverrideEdge {
	laneId: string;
	fromPath: string;
	toPath: string;
	label: string;
}

export interface FlowOverride {
	edges?: FlowOverrideEdge[];
}

export const FLOW_OVERRIDES: FlowOverride[] = [];
