const storySourceModules = import.meta.glob(
	"../../../../../packages/fe-ui/src/**/*.stories.tsx",
	{ eager: true, import: "default", query: "?raw" },
) as Record<string, string>;

export interface StorySourceContext {
	title?: string;
}

function normalizePath(value: string): string {
	return value.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
}

export function resolveStorySource(context: StorySourceContext): string {
	const title = normalizePath(context.title ?? "");
	if (!title) return "";

	const entries = Object.entries(storySourceModules);
	const match = entries.find(([filePath]) => {
		const normalizedFilePath = normalizePath(filePath);
		return (
			normalizedFilePath.includes(`/src/${title}/`) ||
			normalizedFilePath.endsWith(`/src/${title}.stories.tsx`)
		);
	});

	return match?.[1] ?? "";
}

export function getStorySourceCatalogSize(): number {
	return Object.keys(storySourceModules).length;
}
