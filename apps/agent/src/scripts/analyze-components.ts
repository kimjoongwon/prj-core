#!/usr/bin/env tsx

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { fileURLToPath } from "url";

interface ComponentProp {
	name: string;
	type: string;
	required: boolean;
	description?: string;
}

interface ComponentMetadata {
	name: string;
	path: string;
	category: string;
	props: ComponentProp[];
	description?: string;
	hasStories: boolean;
}

interface ComponentsMetadata {
	components: ComponentMetadata[];
	generatedAt: string;
	totalComponents: number;
}

// 프로젝트 루트 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../../../..");
const COMPONENTS_DIR = path.join(PROJECT_ROOT, "packages/ui/src/components");
const OUTPUT_FILE = path.join(PROJECT_ROOT, "packages/ui/components.json");

/**
 * 디렉토리를 재귀적으로 탐색하여 모든 .tsx 파일을 찾습니다
 */
function findComponentFiles(dir: string): string[] {
	const files: string[] = [];

	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			// 재귀적으로 탐색
			files.push(...findComponentFiles(fullPath));
		} else if (
			entry.isFile() &&
			entry.name.endsWith(".tsx") &&
			!entry.name.includes(".stories.")
		) {
			// .tsx 파일이면서 스토리 파일이 아닌 경우
			files.push(fullPath);
		}
	}

	return files;
}

/**
 * 파일 경로에서 카테고리를 추출합니다
 */
function extractCategory(filePath: string): string {
	const relativePath = path.relative(COMPONENTS_DIR, filePath);
	const parts = relativePath.split(path.sep);
	return parts[0] || "unknown";
}

/**
 * 파일에서 컴포넌트 이름을 추출합니다
 */
function extractComponentName(filePath: string): string {
	const fileName = path.basename(filePath, ".tsx");
	return fileName;
}

/**
 * 스토리 파일이 존재하는지 확인합니다
 */
function hasStoriesFile(filePath: string): boolean {
	const dir = path.dirname(filePath);
	const baseName = path.basename(filePath, ".tsx");
	const storiesPath = path.join(dir, `${baseName}.stories.tsx`);
	return fs.existsSync(storiesPath);
}

/**
 * JSDoc 주석에서 설명을 추출합니다
 */
function extractJsDocDescription(node: ts.Node): string | undefined {
	const jsDocComments = ts.getJSDocCommentsAndTags(node);

	for (const comment of jsDocComments) {
		if (ts.isJSDoc(comment) && comment.comment) {
			if (typeof comment.comment === "string") {
				return comment.comment;
			}
		}
	}

	return undefined;
}

/**
 * TypeScript 타입을 문자열로 변환합니다
 */
function typeToString(
	type: ts.TypeNode | undefined,
	sourceFile: ts.SourceFile,
): string {
	if (!type) return "unknown";
	return type.getText(sourceFile);
}

/**
 * Props 인터페이스를 파싱합니다
 */
function extractPropsFromInterface(
	interfaceDecl: ts.InterfaceDeclaration,
	sourceFile: ts.SourceFile,
): ComponentProp[] {
	const props: ComponentProp[] = [];

	for (const member of interfaceDecl.members) {
		if (ts.isPropertySignature(member) && member.name) {
			const propName = member.name.getText(sourceFile);
			const propType = typeToString(member.type, sourceFile);
			const isRequired = !member.questionToken;
			const description = extractJsDocDescription(member);

			props.push({
				name: propName,
				type: propType,
				required: isRequired,
				description,
			});
		}
	}

	return props;
}

/**
 * TypeScript 파일에서 컴포넌트 메타데이터를 추출합니다
 */
function analyzeComponent(filePath: string): ComponentMetadata | null {
	try {
		const sourceCode = fs.readFileSync(filePath, "utf-8");
		const sourceFile = ts.createSourceFile(
			filePath,
			sourceCode,
			ts.ScriptTarget.Latest,
			true,
		);

		const componentName = extractComponentName(filePath);
		const category = extractCategory(filePath);
		const relativePath = path.relative(PROJECT_ROOT, filePath);

		let props: ComponentProp[] = [];
		let description: string | undefined;

		// AST를 순회하면서 Props 인터페이스 찾기
		function visit(node: ts.Node) {
			// 인터페이스 찾기 (예: ButtonProps, InputProps 등)
			if (ts.isInterfaceDeclaration(node)) {
				const interfaceName = node.name.text;
				if (interfaceName.includes("Props")) {
					props = extractPropsFromInterface(node, sourceFile);
					description = extractJsDocDescription(node);
				}
			}

			// 함수 컴포넌트 찾기
			if (ts.isFunctionDeclaration(node) || ts.isVariableStatement(node)) {
				const nodeDescription = extractJsDocDescription(node);
				if (nodeDescription && !description) {
					description = nodeDescription;
				}
			}

			ts.forEachChild(node, visit);
		}

		visit(sourceFile);

		return {
			name: componentName,
			path: relativePath,
			category,
			props,
			description,
			hasStories: hasStoriesFile(filePath),
		};
	} catch (error) {
		console.error(`컴포넌트 분석 중 오류 발생: ${filePath}`, error);
		return null;
	}
}

/**
 * 모든 컴포넌트를 분석하고 메타데이터를 생성합니다
 */
function analyzeAllComponents(): ComponentsMetadata {
	console.log("컴포넌트 분석 시작...");
	console.log(`컴포넌트 디렉토리: ${COMPONENTS_DIR}`);

	const componentFiles = findComponentFiles(COMPONENTS_DIR);
	console.log(`총 ${componentFiles.length}개의 컴포넌트 파일 발견`);

	const components: ComponentMetadata[] = [];

	for (const filePath of componentFiles) {
		const metadata = analyzeComponent(filePath);
		if (metadata) {
			components.push(metadata);
			console.log(`✓ ${metadata.name} (${metadata.category})`);
		}
	}

	const result: ComponentsMetadata = {
		components: components.sort((a, b) => a.name.localeCompare(b.name)),
		generatedAt: new Date().toISOString(),
		totalComponents: components.length,
	};

	return result;
}

/**
 * 메타데이터를 JSON 파일로 저장합니다
 */
function saveMetadata(metadata: ComponentsMetadata): void {
	const json = JSON.stringify(metadata, null, 2);
	fs.writeFileSync(OUTPUT_FILE, json, "utf-8");
	console.log(`\n메타데이터가 저장되었습니다: ${OUTPUT_FILE}`);
}

/**
 * 통계를 출력합니다
 */
function printStats(metadata: ComponentsMetadata): void {
	console.log("\n=== 컴포넌트 분석 결과 ===");
	console.log(`총 컴포넌트 수: ${metadata.totalComponents}`);

	// 카테고리별 통계
	const categoryStats = metadata.components.reduce(
		(acc, component) => {
			acc[component.category] = (acc[component.category] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	console.log("\n카테고리별 통계:");
	Object.entries(categoryStats)
		.sort(([, a], [, b]) => b - a)
		.forEach(([category, count]) => {
			console.log(`  ${category}: ${count}개`);
		});

	// 스토리가 있는 컴포넌트
	const withStories = metadata.components.filter((c) => c.hasStories).length;
	console.log(
		`\n스토리가 있는 컴포넌트: ${withStories}/${metadata.totalComponents}`,
	);

	// Props가 정의된 컴포넌트
	const withProps = metadata.components.filter(
		(c) => c.props.length > 0,
	).length;
	console.log(
		`Props가 정의된 컴포넌트: ${withProps}/${metadata.totalComponents}`,
	);
}

/**
 * 메인 실행 함수
 */
function main() {
	console.log("컴포넌트 메타데이터 생성 도구\n");

	if (!fs.existsSync(COMPONENTS_DIR)) {
		console.error(`컴포넌트 디렉토리를 찾을 수 없습니다: ${COMPONENTS_DIR}`);
		process.exit(1);
	}

	const metadata = analyzeAllComponents();
	saveMetadata(metadata);
	printStats(metadata);

	console.log("\n완료!");
}

// 스크립트 실행
main();
