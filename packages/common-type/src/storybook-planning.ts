import type { DecimalId } from "./database-id";

/**
 * Storybook planning runtime target.
 */
export type PlanningRuntime =
	| "web-storybook"
	| "expo-web-storybook"
	| "native-storybook";

/**
 * Product area or shell that owns a planning scenario.
 */
export type PlanningRealm = "admin" | "idp" | "mobile" | "none";

/**
 * Review status for a planning scenario shown in Storybook.
 */
export type PlanningStatus =
	| "draft"
	| "ready-for-review"
	| "approved"
	| "needs-update";

/**
 * Mock authentication state displayed inside planning Storybook frames.
 */
export type PlanningAuthState = "authenticated" | "anonymous";

/**
 * Mock account shown in a planning review session.
 */
export interface PlanningAccount {
	id?: DecimalId;
	name: string;
	email?: string;
	role?: string;
}

/**
 * Selectable tenant and space shown in a planning review session.
 */
export interface PlanningSpaceOption {
	tenantId: DecimalId;
	spaceId: DecimalId;
	fitnessCenterName: string;
	tenantName?: string;
	contentLanguageCode?: string | null;
}

/**
 * Runtime context that explains who is viewing the story and under what scope.
 */
export interface PlanningContext {
	realm: PlanningRealm;
	authState?: PlanningAuthState;
	account?: PlanningAccount;
	role?: string;
	tenantId?: DecimalId;
	tenantName?: string;
	spaceId?: DecimalId;
	fitnessCenterName?: string;
	spaces?: readonly PlanningSpaceOption[];
	abilities?: readonly string[];
	locale?: string;
	viewport?: "desktop" | "tablet" | "mobile";
}

/**
 * Acceptance item shown next to the rendered screen.
 */
export interface PlanningAcceptance {
	label: string;
	required?: boolean;
}

/**
 * Planning metadata for one executable Storybook scenario.
 */
export interface PlanningScenario {
	id: string;
	title: string;
	description?: string;
	routePath?: string;
	owner?: string;
	status?: PlanningStatus;
	context: PlanningContext;
	acceptance?: readonly PlanningAcceptance[];
}
