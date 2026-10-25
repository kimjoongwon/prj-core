import storySources from "../../.rnstorybook/story-sources.json";

interface StorySourceEntry {
	filePath: string;
	source: string;
	title: string;
}

const catalog = storySources as StorySourceEntry[];

export function resolveMobileStorySource(title: string): string {
	const entry = catalog.find((candidate) => candidate.title === title);
	if (!entry) {
		throw new Error(`Mobile Storybook source is missing for story: ${title}`);
	}
	return entry.source;
}

export function getMobileStorySourceCatalogSize(): number {
	return catalog.length;
}
