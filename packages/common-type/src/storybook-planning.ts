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
 * Transport mode used by a Storybook planning API scenario.
 */
export type PlanningApiMode = "msw" | "native-mock" | "none";

/**
 * Stable API request description for planning review.
 */
export interface PlanningApiRequest {
	id?: string;
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	path: string;
	status: number;
	description?: string;
	delayMs?: number;
}

/**
 * API scenario attached to a planning story.
 *
 * `handlers` is intentionally generic so web Storybook can pass MSW handlers
 * while native Storybook can pass its own mock transport handlers.
 */
export interface PlanningApiScenario<THandler = unknown> {
	name: string;
	mode: PlanningApiMode;
	description?: string;
	requests?: readonly PlanningApiRequest[];
	handlers?: readonly THandler[];
}

/**
 * Runtime context that explains who is viewing the story and under what scope.
 */
export interface PlanningContext {
	realm: PlanningRealm;
	role?: string;
	tenantId?: string;
	spaceId?: string;
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
export interface PlanningScenario<THandler = unknown> {
	id: string;
	title: string;
	description?: string;
	routePath?: string;
	owner?: string;
	status?: PlanningStatus;
	context: PlanningContext;
	api?: PlanningApiScenario<THandler>;
	acceptance?: readonly PlanningAcceptance[];
	notes?: readonly string[];
}
