#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const PAGE_ROOT = path.join(ROOT, "packages/fe-ui/src/page");

function getPageDirectories() {
	return fs
		.readdirSync(PAGE_ROOT, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort((left, right) => left.localeCompare(right));
}

function ensureFile(filePath, contents) {
	if (fs.existsSync(filePath)) {
		return false;
	}

	fs.writeFileSync(filePath, contents, "utf8");
	return true;
}

function renderStory(pageName) {
	return `import type { Meta, StoryObj } from "@storybook/react";
import { PageStoryScaffold } from "../storybookFrame";

const meta = {
\tcomponent: PageStoryScaffold,
\tparameters: {
\t\tlayout: "fullscreen",
\t\tdocs: {
\t\t\tdescription: {
\t\t\t\tcomponent:
\t\t\t\t\t"Generated baseline page story for ${pageName}. Replace this scaffold with scenario-focused stories when page fixtures are available.",
\t\t\t},
\t\t},
\t},
\ttags: ["autodocs"],
\targs: {
\t\tcomponentName: "${pageName}",
\t\tcomponentPath: "page/${pageName}/${pageName}.tsx",
\t},
} satisfies Meta<typeof PageStoryScaffold>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
`;
}

function renderSpec(pageName) {
	return `# ${pageName}.stories.tsx Spec

## 목적
- \`page/${pageName}\` Storybook 엔트리를 제공해 페이지 컴포넌트를 사이드바에서 찾을 수 있게 합니다.
- 실제 fixture 기반 스토리가 준비되기 전까지 baseline scaffold를 통해 대상 컴포넌트 경로를 문서화합니다.

## 핵심 동작
- Storybook 사이드바 제목은 \`page/${pageName}\`입니다.
- 스토리 파일 기준 경로는 \`page/${pageName}/${pageName}.stories.tsx\`입니다.
- 기본 스토리는 공용 \`PageStoryScaffold\`를 렌더링합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-05 | 누락된 page Storybook scaffold 신규 생성 | Codex |
`;
}

function main() {
	const createdStories = [];
	const createdSpecs = [];

	for (const pageName of getPageDirectories()) {
		const dir = path.join(PAGE_ROOT, pageName);
		const storyPath = path.join(dir, `${pageName}.stories.tsx`);
		const specPath = path.join(dir, `${pageName}.stories.spec.md`);

		if (ensureFile(storyPath, renderStory(pageName))) {
			createdStories.push(path.relative(ROOT, storyPath));
		}

		if (ensureFile(specPath, renderSpec(pageName))) {
			createdSpecs.push(path.relative(ROOT, specPath));
		}
	}

	console.log(
		JSON.stringify(
			{
				createdStories,
				createdSpecs,
				createdStoryCount: createdStories.length,
				createdSpecCount: createdSpecs.length,
			},
			null,
			2,
		),
	);
}

main();
