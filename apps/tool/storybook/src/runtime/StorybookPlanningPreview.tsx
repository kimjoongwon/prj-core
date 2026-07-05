import type { PlanningPreviewFrameProps } from "@cocrepo/ui";
import { PlanningPreviewFrame } from "@cocrepo/ui";
import type { ReactNode } from "react";

type StoryRender = () => ReactNode;
type PlanningScenario = PlanningPreviewFrameProps["scenario"];
type StorybookRealm = "none" | "admin" | "idp";

interface StorybookPlanningContextLike {
	id: string;
	name?: string;
	title?: string;
	parameters?: {
		planning?: PlanningScenario | false;
		planningPreview?: {
			disabled?: boolean;
		};
		storybookRuntime?: {
			realm?: StorybookRealm;
			currentPath?: string;
		};
	};
}

const SELF_MANAGED_PLANNING_TITLES = new Set(["feature/PlanningPreviewFrame"]);

function isPlanningScenario(value: unknown): value is PlanningScenario {
	if (!value || typeof value !== "object") {
		return false;
	}

	const candidate = value as Partial<PlanningScenario>;
	return (
		typeof candidate.id === "string" &&
		typeof candidate.title === "string" &&
		!!candidate.context &&
		typeof candidate.context === "object"
	);
}

function resolveRealm(context: StorybookPlanningContextLike): StorybookRealm {
	const runtimeRealm = context.parameters?.storybookRuntime?.realm;

	if (runtimeRealm) {
		return runtimeRealm;
	}

	return "none";
}

function resolveTitle(context: StorybookPlanningContextLike): string {
	const groupTitle = context.title ?? "Storybook";
	const storyName = context.name ?? context.id;
	return `${groupTitle} / ${storyName}`;
}

function createDefaultScenario(
	context: StorybookPlanningContextLike,
): PlanningScenario {
	const realm = resolveRealm(context);
	const currentPath = context.parameters?.storybookRuntime?.currentPath;

	return {
		id: `storybook.${context.id}`,
		title: resolveTitle(context),
		description: "Storybook 컴포넌트 기획 검수용 기본 시나리오입니다.",
		routePath: currentPath,
		owner: "fe-storybook-agent",
		status: "draft",
		context: {
			realm,
			authState: "authenticated",
			locale: "ko-KR",
			viewport: "desktop",
		},
		api: {
			name: "none",
			mode: "none",
		},
		acceptance: [],
		notes: [],
	};
}

function shouldSkipPlanningPreview(
	context: StorybookPlanningContextLike,
): boolean {
	return (
		context.parameters?.planningPreview?.disabled === true ||
		(context.title ? SELF_MANAGED_PLANNING_TITLES.has(context.title) : false)
	);
}

function resolveScenario(
	context: StorybookPlanningContextLike,
): PlanningScenario | null {
	if (shouldSkipPlanningPreview(context)) {
		return null;
	}

	if (isPlanningScenario(context.parameters?.planning)) {
		return context.parameters.planning;
	}

	return createDefaultScenario(context);
}

export function withStorybookPlanningPreview(
	Story: StoryRender,
	context: StorybookPlanningContextLike,
) {
	const scenario = resolveScenario(context);

	if (!scenario) {
		return <Story />;
	}

	return (
		<PlanningPreviewFrame scenario={scenario}>
			<Story />
		</PlanningPreviewFrame>
	);
}
